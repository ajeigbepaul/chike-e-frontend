export type FAQ = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

// Sensible defaults for a storefront + vendor marketplace
export const defaultFAQs: FAQ[] = [
  {
    id: "order-status",
    question: "How can I check my order status?",
    answer:
      "Sign in, go to Account > Orders to view real-time status and tracking (if available). You’ll also receive email updates.",
    tags: ["order", "status", "tracking"],
  },
  {
    id: "delivery-times",
    question: "What are the delivery times?",
    answer:
      "Delivery typically takes 2–7 business days depending on your location and the vendor. Exact estimates show at checkout.",
    tags: ["shipping", "delivery", "time"],
  },
  {
    id: "shipping-fees",
    question: "How much is shipping?",
    answer:
      "Shipping fees vary by destination, weight, and vendor. You’ll see the final fee before confirming your order.",
    tags: ["shipping", "fees", "cost"],
  },
  {
    id: "returns-refunds",
    question: "What is your return and refund policy?",
    answer:
      "Most items can be returned within 7–14 days in original condition. Refunds are processed after inspection. Check the product page for specific policies.",
    tags: ["returns", "refunds", "policy"],
  },
  {
    id: "payments",
    question: "Which payment methods are accepted?",
    answer:
      "We accept major cards and secure online payments. All transactions are encrypted for your safety.",
    tags: ["payment", "cards", "pay"],
  },
  {
    id: "availability",
    question: "Is a product in stock?",
    answer:
      "Product pages show the latest availability. If an item is out of stock, you may be able to subscribe for restock alerts.",
    tags: ["stock", "availability", "inventory"],
  },
  {
    id: "vendor-onboarding",
    question: "How can I sell as a vendor?",
    answer:
      "Click Vendor in the navigation to start onboarding. You’ll provide business details and product info for review.",
    tags: ["vendor", "onboarding", "sell"],
  },
  {
    id: "cancel-order",
    question: "Can I cancel or change my order?",
    answer:
      "Orders can be changed or canceled only before they’re processed. Visit Account > Orders and contact support if needed.",
    tags: ["cancel", "change", "order"],
  },
  {
    id: "warranty",
    question: "Do products have a warranty?",
    answer:
      "Many items include a manufacturer warranty. Check the product description for details and coverage.",
    tags: ["warranty", "guarantee"],
  },
];
