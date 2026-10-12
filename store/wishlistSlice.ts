import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  /** Product ids the shopper has favourited. */
  ids: string[];
  /** True once the server wishlist has been loaded for a signed-in user. */
  isSynced: boolean;
}

const initialState: WishlistState = {
  ids: [],
  isSynced: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /** Rehydrate from localStorage, mirroring cartSlice's setCart. */
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.ids = Array.from(new Set(action.payload));
    },

    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((existing) => existing !== id)
        : [...state.ids, id];
    },

    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.ids.includes(action.payload)) state.ids.push(action.payload);
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },

    /** Union of guest favourites and whatever the account already had. */
    mergeWishlist: (state, action: PayloadAction<string[]>) => {
      state.ids = Array.from(new Set([...state.ids, ...action.payload]));
    },

    setSynced: (state, action: PayloadAction<boolean>) => {
      state.isSynced = action.payload;
    },

    clearWishlist: (state) => {
      state.ids = [];
      state.isSynced = false;
    },
  },
});

export const {
  setWishlist,
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  mergeWishlist,
  setSynced,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
