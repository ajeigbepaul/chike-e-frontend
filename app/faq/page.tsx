"use client";
import { useState, Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export default function FaqPage() {
  const [openSection, setOpenSection] = useState<string | null>("general");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const faqSections = [
    {
      id: "general",
      title: "General Questions",
      questions: [
        {
          question: "What is DecorBM?",
          answer:
            "DecorBM is an e-commerce platform specializing in building materials, home decor, and construction supplies. We connect customers with quality products from trusted vendors and manufacturers.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to many international destinations. Shipping costs and delivery times vary by location. You can check shipping availability and costs during checkout.",
        },
        {
          question: "How do I create an account?",
          answer:
            "You can create an account by clicking the 'Sign Up' button in the top right corner of our website. Follow the prompts to enter your information and create your account.",
        },
        {
          question: "Can I shop without creating an account?",
          answer:
            "Yes, you can browse products and make purchases as a guest. However, creating an account allows you to track orders, save favorites, and enjoy a faster checkout experience.",
        },
      ],
    },
    {
      id: "orders",
      title: "Orders & Shipping",
      questions: [
        {
          question: "How do I track my order?",
          answer:
            "You can track your order by logging into your account and visiting the 'Orders' section. If you checked out as a guest, you can use the order tracking link sent to your email.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for certain orders. All payments are processed securely.",
        },
        {
          question: "How long will it take to receive my order?",
          answer:
            "Delivery times vary depending on your location and the products ordered. Standard shipping typically takes 3-7 business days for domestic orders. Expedited shipping options are available at checkout.",
        },
        {
          question: "Can I change or cancel my order?",
          answer:
            "You can request changes or cancellation within 1 hour of placing your order by contacting our customer service team. After this window, we may not be able to modify orders that have entered processing.",
        },
      ],
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for most items in new, unused condition with original packaging. Custom orders, clearance items, and certain building materials may have different return policies.",
        },
        {
          question: "How do I initiate a return?",
          answer:
            "To initiate a return, log into your account, go to 'Orders', select the order containing the item you wish to return, and click 'Return Items'. Follow the prompts to complete the return request.",
        },
        {
          question: "How long do refunds take to process?",
          answer:
            "Once we receive and inspect your return, refunds are typically processed within 3-5 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution.",
        },
        {
          question: "Do I have to pay for return shipping?",
          answer:
            "For returns due to our error (wrong item, defective product), we cover return shipping costs. For other returns, customers are responsible for return shipping unless otherwise specified.",
        },
      ],
    },
    {
      id: "products",
      title: "Products & Services",
      questions: [
        {
          question: "Do you offer product installation services?",
          answer:
            "We partner with licensed contractors who can provide installation services for many of our products. You can request installation quotes during checkout or by contacting our customer service team.",
        },
        {
          question: "Are your products covered by warranty?",
          answer:
            "Most products come with manufacturer warranties. Warranty details are listed on product pages and included with your purchase. We're happy to assist with warranty claims for eligible products.",
        },
        {
          question: "Can I request custom products or bulk orders?",
          answer:
            "Yes, we handle custom orders and bulk purchases. Please contact our sales team with your requirements for a custom quote and lead time estimate.",
        },
        {
          question: "How do I know if a product is in stock?",
          answer:
            "Product availability is displayed on each product page. If an item is out of stock, you can sign up for email notifications to be alerted when it's back in stock.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Privacy",
      questions: [
        {
          question: "How do I reset my password?",
          answer:
            "To reset your password, click 'Sign In', then 'Forgot Password'. Enter your email address, and we'll send you instructions to create a new password.",
        },
        {
          question: "How is my personal information protected?",
          answer:
            "We use industry-standard encryption and security measures to protect your personal information. For details, please review our Privacy Policy.",
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes, you can request account deletion by contacting our customer service team. Please note that we may retain certain information as required by law or for legitimate business purposes.",
        },
        {
          question: "How do I update my account information?",
          answer:
            "You can update your account information by logging in, clicking on your profile, and selecting 'Account Settings'. From there, you can edit your personal information, addresses, and payment methods.",
        },
      ],
    },
  ];

  // Filter FAQs based on search query
  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqSections
      : faqSections
          .map((section) => ({
            ...section,
            questions: section.questions.filter(
              (q) =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter((section) => section.questions.length > 0);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Suspense
          fallback={
            <div className="h-5 w-40 bg-gray-100 animate-pulse rounded" />
          }
        >
          <Breadcrumb />
        </Suspense>
      </div>

      {/* Hero Section */}
      <section className="text-center py-12 px-4 bg-white">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Frequently Asked Questions
          <span className="text-brand-yellow">.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 mb-8">
          Find answers to common questions about our products, services,
          ordering, shipping, and more. If you can't find what you're looking
          for, please contact our support team.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full py-3 px-4 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-8 px-4 max-w-3xl mx-auto mb-16">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-500">
              Try different keywords or browse our FAQ categories below.
            </p>
          </div>
        ) : (
          filteredFAQs.map((section) => (
            <div key={section.id} className="mb-8">
              <button
                className="flex justify-between items-center w-full py-4 px-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {section.title}
                </h2>
                {openSection === section.id ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </button>

              {openSection === section.id && (
                <div className="mt-4 space-y-4">
                  {section.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Contact Section */}
        <div className="mt-12 text-center p-8 bg-gray-100 rounded-xl">
          <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer you were looking for, please contact
            our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
