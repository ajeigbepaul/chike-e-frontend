import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Chike",
  description:
    "Learn how Chike collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mb-10 text-sm text-gray-500">Last updated: 2025-01-01</p>

      <p className="mb-6 text-gray-700">
        Your privacy is important to us. This Privacy Policy explains how Chike
        collects, uses, and safeguards your information when you use our
        website, products, and services (the "Service").
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        1. Information We Collect
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-gray-700">
        <li>Account information (name, email, phone number).</li>
        <li>Order and payment details processed via secure providers.</li>
        <li>Usage data, device information, and cookies for analytics.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        2. How We Use Information
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-gray-700">
        <li>To provide and improve the Service.</li>
        <li>To process orders and payments.</li>
        <li>To communicate updates, support, and marketing (with consent).</li>
        <li>To enhance security and prevent fraud.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        3. Sharing of Information
      </h2>
      <p className="text-gray-700">
        We do not sell your personal information. We may share data with trusted
        third-party service providers (e.g., payment processors) to operate the
        Service, subject to appropriate safeguards.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        4. Cookies and Tracking
      </h2>
      <p className="text-gray-700">
        We use cookies and similar technologies to remember preferences and
        analyze usage. You can control cookies through your browser settings.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">5. Data Security</h2>
      <p className="text-gray-700">
        We implement reasonable administrative, technical, and physical
        safeguards designed to protect your data. However, no method of
        transmission over the internet is 100% secure.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">6. Your Rights</h2>
      <ul className="list-disc space-y-2 pl-6 text-gray-700">
        <li>Access, update, or delete your personal information.</li>
        <li>Opt-out of marketing communications.</li>
        <li>Request data portability where applicable.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">7. Children’s Privacy</h2>
      <p className="text-gray-700">
        Our Service is not intended for children under 13. We do not knowingly
        collect personal information from children.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        8. International Transfers
      </h2>
      <p className="text-gray-700">
        Your information may be transferred to and processed in countries other
        than your own. We take steps to ensure appropriate protections are in
        place.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        9. Changes to This Policy
      </h2>
      <p className="text-gray-700">
        We may update this policy periodically. The updated version will be
        indicated by an updated “Last updated” date.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">10. Contact Us</h2>
      <p className="text-gray-700">
        For questions about this Privacy Policy, contact us at
        <span className="ml-1 underline">privacy@chike.com</span>.
      </p>
    </section>
  );
}
