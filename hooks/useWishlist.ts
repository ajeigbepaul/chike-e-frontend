"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import type { RootState } from "@/store/store";
import {
  toggleWishlist,
  mergeWishlist,
  setSynced,
} from "@/store/wishlistSlice";
import wishlistService from "@/services/api/wishlist";

/**
 * Pull the product id out of a wishlist row. The API has returned a few
 * shapes over time (populated productId, bare id, nested product), so
 * normalise here rather than in every page.
 */
export const extractProductId = (item: any): string | undefined => {
  if (!item) return undefined;
  if (typeof item === "string") return item;
  return (
    item.productId?._id ??
    (typeof item.productId === "string" ? item.productId : undefined) ??
    item.product?._id ??
    item.product
  );
};

/**
 * One source of truth for favourites.
 *
 * Guests favourite freely - state lives in Redux and is persisted to
 * localStorage by WishlistPersistenceWatcher. On sign-in the guest list is
 * merged into the account, so nothing is lost by favouriting before signing up.
 */
export function useWishlist() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const ids = useSelector((state: RootState) => state.wishlist.ids);
  const isSynced = useSelector((state: RootState) => state.wishlist.isSynced);

  // Treat "loading" as not-yet-known rather than logged out. Reading
  // `!!session` while the session request is still in flight is what used to
  // bounce signed-in users to the login page.
  const isLoggedIn = status === "authenticated" && Boolean(session);
  const isAuthResolved = status !== "loading";

  const mergingRef = useRef(false);

  // On sign-in: pull the server list, union it with anything favourited as a
  // guest, and push the difference back up.
  useEffect(() => {
    if (!isLoggedIn || isSynced || mergingRef.current) return;

    mergingRef.current = true;
    (async () => {
      try {
        const response = await wishlistService.getWishlist();
        const serverIds: string[] = (response?.data ?? [])
          .map(extractProductId)
          .filter(Boolean);

        // Anything favourited as a guest that the account doesn't have yet.
        const pendingUploads = ids.filter((id) => !serverIds.includes(id));

        dispatch(mergeWishlist(serverIds));

        await Promise.allSettled(
          pendingUploads.map((id) => wishlistService.addToWishlist(id))
        );

        dispatch(setSynced(true));
      } catch {
        // Leave isSynced false so a later render can retry.
      } finally {
        mergingRef.current = false;
      }
    })();
  }, [isLoggedIn, isSynced, ids, dispatch]);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!productId) return;
      const wasFavorite = ids.includes(productId);

      // Optimistic: the heart responds instantly whether or not signed in.
      dispatch(toggleWishlist(productId));

      if (!isLoggedIn) return;

      try {
        if (wasFavorite) {
          await wishlistService.removeFromWishlist(productId);
        } else {
          await wishlistService.addToWishlist(productId);
        }
      } catch (error: any) {
        // Revert and explain, rather than leaving the UI lying.
        dispatch(toggleWishlist(productId));
        toast.error(
          error?.response?.data?.message || "Could not update your favourites"
        );
      }
    },
    [ids, isLoggedIn, dispatch]
  );

  return { ids, isFavorite, toggle, isLoggedIn, isAuthResolved };
}

export default useWishlist;

/**
 * Push guest favourites up to the freshly signed-in account.
 *
 * Deliberately a plain function, not a hook: the sign-in flow can finish with
 * a hard `window.location.href` redirect, which tears down React before an
 * effect would get the chance to run.
 */
export async function mergeGuestWishlist(): Promise<void> {
  if (typeof window === "undefined") return;

  let guestIds: string[] = [];
  try {
    const raw = localStorage.getItem("wishlist");
    if (raw) guestIds = JSON.parse(raw);
  } catch {
    return;
  }
  if (!Array.isArray(guestIds) || guestIds.length === 0) return;

  try {
    const response = await wishlistService.getWishlist();
    const serverIds: string[] = (response?.data ?? [])
      .map(extractProductId)
      .filter(Boolean);

    const pending = guestIds.filter((id) => id && !serverIds.includes(id));

    // addToWishlist is idempotent server-side, so a partial failure is safe
    // to retry on the next sign-in.
    await Promise.allSettled(
      pending.map((id) => wishlistService.addToWishlist(id))
    );

    // Keep the union locally so the UI stays correct through the redirect.
    localStorage.setItem(
      "wishlist",
      JSON.stringify(Array.from(new Set([...guestIds, ...serverIds])))
    );
  } catch {
    // Non-fatal: the user is signed in either way, and useWishlist retries.
  }
}
