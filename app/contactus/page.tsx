"use client";
import { useState, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import contactService from "@/services/api/contact";

export default function ContactPage() {
  // Local form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // React Query mutation for sending contact message
  const { mutate, isPending } = useMutation({
    mutationFn: contactService.sendMessage,
    onSuccess: (data) => {
      toast.success(data?.message || "Message sent successfully");
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setTopic("");
      setSubject("");
      setMessage("");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to send message";
      toast.error(msg);
    },
  });

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
          Get in Touch
          <span className="text-brand-yellow">.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 mb-8">
          We're here to help with any questions about our products, services, or
          your account. Our team is ready to assist you with whatever you need.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="py-8 px-4 max-w-4xl mx-auto mb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Form */}
            <div className="w-full md:w-3/5 p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate({
                    firstName,
                    lastName,
                    email,
                    phone,
                    topic,
                    subject,
                    message,
                  });
                }}
              >
                <div className="flex gap-4 flex-col sm:flex-row">
                  <input
                    type="text"
                    placeholder="First name"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <select
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="" disabled>
                    What can we help you with?
                  </option>
                  <option value="product">Product Inquiry</option>
                  <option value="order">Order Status</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Subject (optional)"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <textarea
                  placeholder="Your message"
                  rows={5}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Right side - Info */}
            <div className="w-full md:w-2/5 bg-gray-100 p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-yellow p-2 rounded-full mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"
                          fill="white"
                        />
                        <path
                          d="M12 2C7.6 2 4 5.4 4 9.5C4 14.27 11.4 21.82 11.67 22.09C11.77 22.19 11.89 22.24 12 22.24C12.11 22.24 12.23 22.19 12.33 22.09C12.6 21.82 20 14.27 20 9.5C20 5.4 16.4 2 12 2ZM12 15C9.79 15 8 13.21 8 11C8 8.79 9.79 7 12 7C14.21 7 16 8.79 16 11C16 13.21 14.21 15 12 15Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Our Location</h4>
                      <p className="text-gray-600">
                        123 Business Avenue, Suite 500
                        <br />
                        London, UK EC1A 1BB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-brand-yellow p-2 rounded-full mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Email Us</h4>
                      <p className="text-gray-600">
                        support@decorbm.com
                        <br />
                        sales@decorbm.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-brand-yellow p-2 rounded-full mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 15.5C18.8 15.5 17.5 15.3 16.4 14.9C16.3 14.9 16.2 14.9 16.1 14.9C15.8 14.9 15.6 15 15.4 15.2L13.2 17.4C10.4 15.9 8 13.6 6.6 10.8L8.8 8.6C9.1 8.3 9.2 7.9 9 7.6C8.7 6.5 8.5 5.2 8.5 4C8.5 3.5 8 3 7.5 3H4C3.5 3 3 3.5 3 4C3 13.4 10.6 21 20 21C20.5 21 21 20.5 21 20V16.5C21 16 20.5 15.5 20 15.5ZM19 12H21C21 7 17 3 12 3V5C15.9 5 19 8.1 19 12ZM15 12H17C17 9.2 14.8 7 12 7V9C13.7 9 15 10.3 15 12Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Call Us</h4>
                      <p className="text-gray-600">
                        +44 (0) 20 1234 5678
                        <br />
                        Mon-Fri, 9am-6pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="mt-8">
                <h4 className="font-semibold mb-3">Follow Us</h4>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-gray-200 p-2 rounded-full hover:bg-brand-yellow transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.4 19.6 18.64C21.16 16.88 22.04 14.64 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-gray-200 p-2 rounded-full hover:bg-brand-yellow transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.19 14.41 4.53 14.44 3.89 14.31C4.16 15.14 4.69 15.86 5.41 16.38C6.13 16.89 6.99 17.17 7.89 17.17C6.37 18.38 4.49 19.03 2.56 19C2.22 19 1.88 18.98 1.54 18.93C3.44 20.15 5.7 20.85 8 20.85C16 20.85 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-gray-200 p-2 rounded-full hover:bg-brand-yellow transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 17.7383 21.3889 19.2135 20.3012 20.3012C19.2135 21.3889 17.7383 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 6.26174 2.61107 4.78649 3.69878 3.69878C4.78649 2.61107 6.26174 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-gray-200 p-2 rounded-full hover:bg-brand-yellow transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" />
                    </svg>
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
