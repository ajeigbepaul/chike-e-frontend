import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Chike",
  description: "Read the terms and conditions for using the Chike platform.",
};

export default function TermsOfUsePage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Terms of Use
      </h1>
      <p className="mb-10 text-sm text-gray-500">Last updated: 2025-01-01</p>

      <p className="mb-6 text-gray-700">
        Welcome to Chike. By accessing or using our website and services (the
        "Service"), you agree to be bound by these Terms of Use. If you do not
        agree with these terms, please do not use the Service.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        1. Acceptance of Terms
      </h2>
      <p className="text-gray-700">
        By using the Service, you confirm that you accept these terms and agree
        to comply with them. You also agree to our Privacy Policy.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">2. Use of the Service</h2>
      <ul className="list-disc space-y-2 pl-6 text-gray-700">
        <li>You must be at least 18 years old or have parental consent.</li>
        <li>Provide accurate information and keep your account secure.</li>
        <li>Comply with all applicable laws and regulations.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        3. Prohibited Activities
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-gray-700">
        <li>No unlawful, fraudulent, or harmful activities.</li>
        <li>
          No attempts to disrupt, circumvent, or reverse engineer the Service.
        </li>
        <li>No infringement of intellectual property or privacy rights.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">4. User Content</h2>
      <p className="text-gray-700">
        You retain ownership of the content you submit. However, by submitting
        content, you grant Chike a non-exclusive, worldwide, royalty-free
        license to use, reproduce, and display that content solely for operating
        and improving the Service.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        5. Intellectual Property
      </h2>
      <p className="text-gray-700">
        All trademarks, logos, and content on the Service are the property of
        Chike or their respective owners. You may not use them without prior
        written permission.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">6. Disclaimers</h2>
      <p className="text-gray-700">
        The Service is provided on an "as is" and "as available" basis without
        warranties of any kind, express or implied. Your use of the Service is
        at your sole risk.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        7. Limitation of Liability
      </h2>
      <p className="text-gray-700">
        To the maximum extent permitted by law, Chike shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages,
        or any loss of profits or revenues.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">8. Termination</h2>
      <p className="text-gray-700">
        We may suspend or terminate access to the Service immediately, without
        prior notice or liability, for any reason including if you breach these
        terms.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        9. Changes to These Terms
      </h2>
      <p className="text-gray-700">
        We may update these terms from time to time. When we do, we will revise
        the "Last updated" date above. Your continued use of the Service after
        changes become effective constitutes acceptance of the revised terms.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">10. Contact Us</h2>
      <p className="text-gray-700">
        If you have questions about these Terms, please contact us at
        <span className="ml-1 underline">support@chike.com</span>.
      </p>
    </section>
  );
}
