"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import orderService from "@/services/api/order";
import { clearCart } from "@/store/cartSlice";
import {
  clearCheckout,
  setCustomerAddress,
  setDeliveryDetails,
  setPaymentMethod,
} from "@/store/checkoutSlice";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { validateCoupon } from "@/services/api/promotion";

// Dynamically import PaystackPayment to avoid SSR issues
const PaystackPayment = dynamic(
  () =>
    import("@/components/PaystackPayment").then((mod) => ({
      default: mod.PaystackPayment,
    })),
  {
    ssr: false,
    loading: () => (
      <button className="w-full py-3 rounded-md font-medium bg-gray-400 text-gray-700 cursor-not-allowed">
        Loading Payment...
      </button>
    ),
  }
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state: RootState) => state.cart);
  const { customerAddress, deliveryDetails, paymentMethod } = useSelector(
    (state: RootState) => state.checkout
  );
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const vat = 5000;
  const Delivery = 20000;
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = itemsTotal + vat + Delivery - discount;

  // Debug: Let's verify the calculation step by step
  console.log("=== CART CALCULATION DEBUG ===");
  console.log("Items in cart:", items);
  console.log("Items total calculation:", itemsTotal);
  console.log("VAT:", vat);
  console.log("Delivery:", Delivery);
  console.log("Final total:", total);
  console.log("Expected total should be:", itemsTotal + 5000 + 20000);
  console.log("=== END DEBUG ===");

  const openModal = (type: string) => setIsModalOpen(type);
  const closeModal = () => setIsModalOpen(null);

  const [customerForm, setCustomerForm] = useState({
    name: customerAddress?.name || "",
    address: customerAddress?.address || "",
    phone: customerAddress?.phone || "",
    email: customerAddress?.email || "",
  });

  const [deliveryForm, setDeliveryForm] = useState({
    pickupStation: deliveryDetails?.pickupStation || "",
    deliveryDate: deliveryDetails?.deliveryDate || "",
  });

  const [paymentForm, setPaymentForm] = useState(paymentMethod || "");

  const handleSaveCustomerAddress = () => {
    if (
      !customerForm.name ||
      !customerForm.address ||
      !customerForm.phone ||
      !customerForm.email
    ) {
      alert("Please fill all fields.");
      return;
    }
    dispatch(setCustomerAddress(customerForm));
    closeModal();
  };

  const handleSaveDeliveryDetails = () => {
    if (!deliveryForm.pickupStation || !deliveryForm.deliveryDate) {
      alert("Please fill all fields.");
      return;
    }
    dispatch(setDeliveryDetails(deliveryForm));
    closeModal();
  };

  const handleSavePaymentMethod = () => {
    if (!paymentForm) {
      alert("Please select a payment method.");
      return;
    }
    dispatch(setPaymentMethod(paymentForm));
    closeModal();
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!coupon) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (discount > 0) {
      setCouponError("A coupon has already been applied.");
      return;
    }
    try {
      const cartItems = items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        category: item.category, // ensure category is available
      }));
      const res = await validateCoupon({ code: coupon, cartItems });
      setDiscount(res.discount);
      toast.success(res.promotion.message || "Coupon applied!");
    } catch (err: any) {
      setDiscount(0);
      setCouponError(err.message || "Invalid coupon code");
      toast.error(err.message || "Invalid coupon code");
    }
  };

  const handleConfirmOrder = async () => {
    if (!customerAddress || !deliveryDetails || !paymentMethod) {
      toast.error("Please complete all checkout steps");
      return;
    }

    setIsLoading(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderPayload = {
        orderItems,
        shippingAddress: {
          street: customerAddress.address,
        },
        paymentMethod,
        taxPrice: vat,
        shippingPrice: Delivery,
        totalPrice: total,
      };

      // Create order first
      console.log("Creating order with payload:", orderPayload);
      const orderRes = await orderService.createOrder(orderPayload);
      console.log("Order creation response:", orderRes);
      const orderId = orderRes.data?.order?._id || orderRes.data?.order?.id;
      console.log("Extracted Order ID:", orderId);
      setPendingOrderId(orderId);
      setIsLoading(false);

      console.log("=== ORDER CREATION COMPLETE ===");
      console.log("Pending Order ID:", orderId);
      console.log("Payment Method:", paymentMethod);
      console.log("Should show PaystackPayment:", paymentMethod === "card");
      console.log("=== END ORDER DEBUG ===");

      // Show order confirmation modal
      setShowOrderConfirmation(true);
    } catch (err: any) {
      setIsLoading(false);
      console.error("Order creation failed:", err);
      toast.error(err?.response?.data?.message || "Order creation failed");
    }
  };

  const handleCancelOrder = async () => {
    if (!pendingOrderId) return;

    try {
      setIsLoading(true);
      // Delete the order
      await orderService.deleteOrder(pendingOrderId);
      setPendingOrderId(null);
      setShowOrderConfirmation(false);
      toast.success("Order cancelled successfully");
    } catch (error: any) {
      console.error("Failed to cancel order:", error);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setShowOrderConfirmation(false);
    setIsProcessingPayment(true);
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCart());
    dispatch(clearCheckout());
    setPendingOrderId(null);
    setShowOrderConfirmation(false);
    setIsProcessingPayment(false);
    router.push("/checkout/success");
  };

  const handlePaymentClose = () => {
    setIsProcessingPayment(false);
  };

  // Helper to display payment method label
  const getPaymentMethodLabel = (value: string) => {
    switch (value) {
      case "card":
        return "Card Payment";
      case "bank_transfer":
        return "Pay on delivery via bank transfer (Just Like Cash!)";
      case "cash":
        return "Cash Payment";
      default:
        return value;
    }
  };

  // Prefill from localStorage or API on mount
  useEffect(() => {
    const saved = localStorage.getItem("checkoutInfo");
    if (saved) {
      const { customerAddress, deliveryDetails, paymentMethod } =
        JSON.parse(saved);
      if (customerAddress) dispatch(setCustomerAddress(customerAddress));
      if (deliveryDetails) dispatch(setDeliveryDetails(deliveryDetails));
      if (paymentMethod) dispatch(setPaymentMethod(paymentMethod));
    } else {
      // Fetch from API if not in localStorage
      import("@/services/api/user").then(({ default: userService }) => {
        userService
          .getCheckoutInfo()
          .then((data) => {
            console.log("InfoData from API:", data?.data);
            const { checkoutInfo, user } = data.data || {};
            if (checkoutInfo) {
              if (checkoutInfo.customerAddress)
                dispatch(setCustomerAddress(checkoutInfo.customerAddress));
              if (checkoutInfo.deliveryDetails)
                dispatch(setDeliveryDetails(checkoutInfo.deliveryDetails));
              if (checkoutInfo.paymentMethod)
                dispatch(setPaymentMethod(checkoutInfo.paymentMethod));
              // Save to localStorage for next time
              localStorage.setItem(
                "checkoutInfo",
                JSON.stringify(checkoutInfo)
              );
            } else if (user) {
              // Optionally prefill with user info if no checkoutInfo
              dispatch(
                setCustomerAddress({
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  address: user.addresses?.[0]?.street || "",
                })
              );
            }
          })
          .catch((err) => {
            // Optionally handle error
            console.error("Failed to fetch checkout info:", err);
          });
      });
    }
  }, [dispatch]);

  // Save to localStorage whenever info changes
  useEffect(() => {
    if (customerAddress && deliveryDetails && paymentMethod) {
      localStorage.setItem(
        "checkoutInfo",
        JSON.stringify({
          customerAddress,
          deliveryDetails,
          paymentMethod,
        })
      );
    }
  }, [customerAddress, deliveryDetails, paymentMethod]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-background min-h-screen theme-transition">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1 bg-card rounded-lg shadow-sm border border-border p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>
          {/* Customer Address */}
          <div className="border-b border-border pb-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  <CheckCircle
                    className={`w-5 h-5 ${
                      customerAddress ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                </span>
                <h2 className="text-lg font-medium text-foreground">
                  1. Customer Information
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal("customer")}
                className="flex items-center gap-1"
              >
                {customerAddress ? "Edit" : "Add"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {customerAddress ? (
              <div className="mt-4 space-y-2 text-foreground">
                <p>{customerAddress.name}</p>
                <p>{customerAddress.address}</p>
                <p>{customerAddress.phone}</p>
              </div>
            ) : (
              <p className="text-muted-foreground mt-2">
                No customer information provided
              </p>
            )}
          </div>
          {/* Delivery Details */}
          <div className="border-b border-border pb-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  <CheckCircle
                    className={`w-5 h-5 ${
                      deliveryDetails ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                </span>
                <h2 className="text-lg font-medium text-foreground">
                  2. Delivery Details
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal("delivery")}
                className="flex items-center gap-1"
              >
                {deliveryDetails ? "Edit" : "Add"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {deliveryDetails ? (
              <div className="mt-4 space-y-2 text-foreground">
                <p>Pick-up Station: {deliveryDetails.pickupStation}</p>
                <p>Estimated Delivery: {deliveryDetails.deliveryDate}</p>
                <div className="mt-4 p-4 border border-border rounded-lg">
                  <p className="font-medium">Shipment Details</p>
                  <p className="text-sm text-muted-foreground">
                    Fulfilled by Sowit Courier
                  </p>
                  <div className="mt-3 space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="w-14 h-14 object-cover rounded border border-border"
                        />
                        <div>
                          <p className="text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/cart"
                    className="inline-block mt-3 text-secondary hover:underline"
                  >
                    Modify cart
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground mt-2">
                No delivery details provided
              </p>
            )}
          </div>
          {/* Payment Method */}
          <div className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  <CheckCircle
                    className={`w-5 h-5 ${
                      paymentMethod ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                </span>
                <h2 className="text-lg font-medium text-foreground">
                  3. Payment Method
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal("payment")}
                className="flex items-center gap-1"
              >
                {paymentMethod ? "Edit" : "Add"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {paymentMethod ? (
              <div className="mt-4">
                <p className="text-foreground">
                  {getPaymentMethodLabel(paymentMethod)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground mt-2">
                No payment method selected
              </p>
            )}
          </div>
          <Link
            href="/products"
            className="inline-block text-gray-700 mt-6  hover:underline"
          >
            Continue shopping
          </Link>
        </div>
        {/* Order Summary */}
        <div className="w-full md:w-[350px] bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Cart Details</h3>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Items ({items.length})</span>
              <span>
                ₦
                {itemsTotal.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Door delivery</span>
              <span>₦{Delivery.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>VAT</span>
              <span>₦{vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>SubTotal</span>
              <span className="text-brand-yellow">
                ₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          {/* <div>
            <label className="block text-sm font-semibold mb-1">Notes (Optional)</label>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={2}
              placeholder="Write a note"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div> */}
          <div>
            <input
              type="text"
              className="w-full border rounded p-2 mb-2"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              disabled={discount > 0}
            />
            <Button
              variant="outline"
              className="w-full border border-yellow-400 text-yellow-600 py-2 rounded font-semibold hover:bg-yellow-50 mb-2"
              onClick={handleApplyCoupon}
              disabled={discount > 0}
            >
              APPLY COUPON
            </Button>
            {couponError && (
              <div className="text-red-500 text-sm mt-1">{couponError}</div>
            )}
            {discount > 0 && (
              <div className="text-green-600 text-sm mt-1">
                Discount applied: -₦{discount.toLocaleString()}
              </div>
            )}
          </div>
          {/* Show different buttons based on payment method and order status */}
          {!pendingOrderId ? (
            <Button
              className="w-full py-3 rounded-md font-medium bg-brand-yellow text-gray-900 hover:bg-yellow-400 transition-colors duration-200"
              disabled={
                !customerAddress ||
                !deliveryDetails ||
                !paymentMethod ||
                isLoading
              }
              onClick={handleConfirmOrder}
            >
              {isLoading ? "Creating Order..." : "Confirm Order"}
            </Button>
          ) : isProcessingPayment && paymentMethod === "card" ? (
            <PaystackPayment
              email={
                customerAddress?.email ||
                customerForm.email ||
                "user@example.com"
              }
              amount={total}
              orderId={pendingOrderId}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
            </PaystackPayment>
          ) : (
            <div className="text-center text-green-600">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <p>Order created successfully!</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3 text-center">
            By proceeding, you agree to our Terms & Conditions
          </p>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Dialog
        open={showOrderConfirmation}
        onOpenChange={setShowOrderConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Order Confirmed Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Order #{pendingOrderId}
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your order has been created successfully. You can now
                    proceed with payment or cancel the order.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Amount:</span>
                <span className="font-semibold">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Method:</span>
                <span>{getPaymentMethodLabel(paymentMethod)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancelOrder}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Canceling..." : "Cancel Order"}
            </Button>
            <Button
              onClick={handleProceedToPayment}
              className="flex-1 bg-brand-yellow text-gray-900 hover:bg-yellow-400"
            >
              {paymentMethod === "card"
                ? "Proceed to Payment"
                : "Complete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Address Modal */}
      <Dialog
        open={isModalOpen === "customer"}
        onOpenChange={(open) => setIsModalOpen(open ? "customer" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {customerAddress
                ? "Edit Customer Information"
                : "Add Customer Information"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <input
              type="text"
              value={customerForm.name}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, name: e.target.value })
              }
              placeholder="Full Name"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
            <input
              type="text"
              value={customerForm.address}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, address: e.target.value })
              }
              placeholder="Delivery Address"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
            <input
              type="tel"
              value={customerForm.phone}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, phone: e.target.value })
              }
              placeholder="Phone Number"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
            <input
              type="email"
              value={customerForm.email}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, email: e.target.value })
              }
              placeholder="Email Address"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveCustomerAddress}>
              Save Information
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delivery Details Modal */}
      <Dialog
        open={isModalOpen === "delivery"}
        onOpenChange={(open) => setIsModalOpen(open ? "delivery" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deliveryDetails
                ? "Edit Delivery Details"
                : "Add Delivery Details"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <input
              type="text"
              value={deliveryForm.pickupStation}
              onChange={(e) =>
                setDeliveryForm({
                  ...deliveryForm,
                  pickupStation: e.target.value,
                })
              }
              placeholder="Pickup Station"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
            <input
              type="text"
              value={deliveryForm.deliveryDate}
              onChange={(e) =>
                setDeliveryForm({
                  ...deliveryForm,
                  deliveryDate: e.target.value,
                })
              }
              placeholder="Estimated Delivery Date"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveDeliveryDetails}>Save Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Payment Method Modal */}
      <Dialog
        open={isModalOpen === "payment"}
        onOpenChange={(open) => setIsModalOpen(open ? "payment" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {paymentMethod ? "Edit Payment Method" : "Select Payment Method"}
            </DialogTitle>
          </DialogHeader>
          <select
            value={paymentForm}
            onChange={(e) => setPaymentForm(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground mt-4"
          >
            <option value="" disabled>
              Select payment method
            </option>
            <option value="card">Card Payment</option>
            <option value="bank_transfer">
              Pay on delivery via bank transfer (Just Like Cash!)
            </option>
            <option value="cash">Cash Payment</option>
            {/* Add more payment options as needed */}
          </select>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSavePaymentMethod}>
              Save Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session, "Session");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace(
        `/auth/signin?callbackUrl=${encodeURIComponent("/checkout")}`
      );
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded mb-2 w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-80 animate-pulse"></div>
          <div className="flex flex-col gap-3 w-full">
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    // Optionally show nothing or a spinner while redirecting
    return null;
  }

  return <CheckoutContent />;
}
