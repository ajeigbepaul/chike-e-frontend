import Image from "next/image";
import { Lightbulb, Headphones, Store } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import vendorService, { VendorInviteRequest } from "@/services/api/vendor";

const features = [
  {
    icon: Lightbulb,
    title: "Easy onboarding",
    desc: "Sagittis eu volutpat odio facilisis mauris sit amet massa. Urna et pharetra pharetra massa. Viverra accumsan in nisl nisi scelerisque.",
  },
  {
    icon: Headphones,
    title: "Dedicated vendor support",
    desc: "Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Nec nam aliquam sem et tortor consequat id porta nibh.",
  },
  {
    icon: Store,
    title: "Access to a large marketplace",
    desc: "Suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Cras fermentum odio eu feugiat pretium nibh ipsum.",
  },
];

export default function PartnerWithUs() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const sessionRoles = session?.user?.roles || [session?.user?.role || ""];
  const hasVendorRole = sessionRoles.includes("vendor");
  const {
    mutate: submitInvite,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: async (
      applicant: Pick<VendorInviteRequest, "name" | "email"> | undefined
    ) => {
      const response = await vendorService.requestVendorInvite(applicant);
      if (!response.success) throw new Error(response.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user) {
      submitInvite(undefined);
    } else {
      submitInvite({ name: applicantName, email: applicantEmail });
    }
  };

  // Reset mutation state when modal is closed
  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) reset();
  };

  return (
    <section className="relative bg-[#232323] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden w-full mt-10">
      {/* Absolute images */}
      <div className="hidden md:block">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full border-4 border-white overflow-hidden z-10">
          <Image src="/hero.jpg" alt="Vendor 1" fill className="object-cover" />
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-white overflow-hidden z-10">
          <Image
            src="/hero3.jpg"
            alt="Vendor 2"
            fill
            className="object-cover"
          />
        </div>
      </div>
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-yellow mb-2">
          Partner With Us — Become a Vendor
        </h2>
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
          Showcase your products. Reach more customers. Grow your business.
        </h3>
        <p className="text-gray-200 text-base md:text-lg mb-8">
          Join our network of trusted suppliers and get your building materials
          in front of thousands of contractors, developers, and homeowners.
        </p>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <button className="bg-brand-yellow text-gray-900 font-semibold px-10 py-3 rounded-full w-[50%] text-lg mb-10 hover:bg-yellow-500 transition cursor-pointer">
              Start Selling Today
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Vendor Access</DialogTitle>
            </DialogHeader>
            {isSuccess && !isError ? (
              <div className="text-green-600 text-center py-4">
                Thank you! We’ve received your request. The admin team will
                review it and email you when a decision is made.
              </div>
            ) : hasVendorRole ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-600">
                  This account already has vendor access.
                </p>
                <DialogFooter className="sm:justify-center">
                  <Link
                    href="/vendor/dashboard"
                    className="rounded bg-brand-yellow px-6 py-2 font-semibold text-gray-900 hover:bg-yellow-500"
                    onClick={() => setOpen(false)}
                  >
                    Go to Vendor Dashboard
                  </Link>
                </DialogFooter>
              </div>
            ) : session?.user?.role === "admin" ? (
              <p className="text-center text-sm text-gray-600">
                Vendor requests are available to customer accounts.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {session?.user ? (
                  <>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        Requesting with your account
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-gray-600">{session.user.email}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Vendor access will be added to this account after admin
                      approval. You can continue using your customer account as
                      usual.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Not registered yet? Submit your name and email. If
                      approved, the admin team will send an invitation to this
                      address so you can create your account.
                      {" "}Already registered?{" "}
                      <Link
                        href="/auth/signin"
                        className="font-semibold text-brand-yellow hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        Sign in
                      </Link>
                      {" "}to request access with your account.
                    </p>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-900" htmlFor="applicant-name">
                        Name
                      </label>
                      <Input
                        id="applicant-name"
                        type="text"
                        autoComplete="name"
                        value={applicantName}
                        onChange={(event) => setApplicantName(event.target.value)}
                        required
                        minLength={2}
                        maxLength={100}
                        className="text-gray-900"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-900" htmlFor="applicant-email">
                        Email
                      </label>
                      <Input
                        id="applicant-email"
                        type="email"
                        autoComplete="email"
                        value={applicantEmail}
                        onChange={(event) => setApplicantEmail(event.target.value)}
                        required
                        maxLength={254}
                        className="text-gray-900"
                        placeholder="you@example.com"
                      />
                    </div>
                  </>
                )}
                {isError && (
                  <div className="text-red-500 text-sm">
                    {error instanceof Error
                      ? error.message
                      : "Failed to submit request. Please try again."}
                  </div>
                )}
                <DialogFooter>
                  <button
                    type="submit"
                    className="bg-brand-yellow text-gray-900 font-semibold px-6 py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
                    disabled={isPending}
                  >
                    {isPending ? "Submitting..." : "Submit Request"}
                  </button>
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="ml-2 px-6 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </DialogClose>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {/* Features */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto mt-4">
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center px-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-brand-yellow mb-6">
              <feature.icon className="w-8 h-8 text-brand-yellow" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-base">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
