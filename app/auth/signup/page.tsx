"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import CustomModal from "@/components/ui/CustomModal";
import { authService } from "@/services/auth";

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match");
        setIsLoading(false);
        return;
      }
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        phone: formData.phone,
      });
      if (response.success) {
        setShowSuccessModal(true);
      } else {
        let msg = response?.error || "Registration failed";
        if (msg.includes("already exists")) {
          msg = "A user with that email already exists.";
        }
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      let msg = "An error occurred during registration";
      console.log(error, "error in signup page");
      if (
        error?.response?.data?.message &&
        error.response.data.message.includes("already exists")
      ) {
        msg = "A user with that email already exists.";
      } else if (error?.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error?.message) {
        msg = error.message;
      }
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomModal
        open={showSuccessModal}
        title="Registration Successful"
        message="Your account has been created! Please check your email to verify your account."
        okText="Go to Home"
        cancelText="Cancel"
        onOk={() => {
          setShowSuccessModal(false);
          router.push("/");
        }}
        onCancel={() => setShowSuccessModal(false)}
      />
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-brand-yellow">
            Sign Up
          </h2>
          {/* {errorMessage && (
            <div className="mb-4 text-center text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded p-2">
              {errorMessage}
            </div>
          )} */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                required
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                required
                placeholder="08034567890"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-yellow text-gray-900 py-2 rounded hover:bg-yellow-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
