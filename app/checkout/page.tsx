"use client";
import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import orderService from '@/services/api/order';
import { clearCart } from '@/store/cartSlice';
import { clearCheckout, setCustomerAddress, setDeliveryDetails, setPaymentMethod } from '@/store/checkoutSlice';
import toast from 'react-hot-toast';
import { RootState } from '@/store/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state: RootState) => state.cart);
  const { customerAddress, deliveryDetails, paymentMethod } = useSelector((state: RootState) => state.checkout);
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);

  const vat = 5000;
  const Delivery = 20000;
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = itemsTotal + vat + Delivery;

  const openModal = (type: string) => setIsModalOpen(type);
  const closeModal = () => setIsModalOpen(null);

  const [customerForm, setCustomerForm] = useState({
    name: customerAddress?.name || "",
    address: customerAddress?.address || "",
    phone: customerAddress?.phone || "",
  });

  const [deliveryForm, setDeliveryForm] = useState({
    pickupStation: deliveryDetails?.pickupStation || "",
    deliveryDate: deliveryDetails?.deliveryDate || "",
  });

  const [paymentForm, setPaymentForm] = useState(paymentMethod || "");

  const handleSaveCustomerAddress = () => {
    if (!customerForm.name || !customerForm.address || !customerForm.phone) {
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

  const handleConfirmOrder = async () => {
    if (!customerAddress || !deliveryDetails || !paymentMethod) return;
    try {
      const orderItems = items.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        // Add color/size if needed
      }));
      const orderPayload = {
        orderItems,
        shippingAddress: {
          street: customerAddress.address,
          // Add more fields as needed
        },
        paymentMethod,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: total,
      };
      await orderService.createOrder(orderPayload);
      dispatch(clearCart());
      dispatch(clearCheckout());
      toast.success('Order placed successfully!');
      router.push('/checkout/success');
      // Optionally redirect to a success page
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Order failed');
    }
  };

  const handleOpenPaymentModal = () => {
    setPaymentForm(paymentMethod || "");
    setIsModalOpen("payment");
  };

  // Helper to display payment method label
  const getPaymentMethodLabel = (value: string) => {
    switch (value) {
      case 'card':
        return 'Card Payment';
      case 'bank_transfer':
        return 'Pay on delivery via bank transfer (Just Like Cash!)';
      case 'cash':
        return 'Cash Payment';
      default:
        return value;
    }
  };

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
                  <CheckCircle className={`w-5 h-5 ${customerAddress ? 'text-green-500' : 'text-gray-400'}`} />
                </span>
                <h2 className="text-lg font-medium text-foreground">1. Customer Information</h2>
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
              <p className="text-muted-foreground mt-2">No customer information provided</p>
            )}
          </div>
          {/* Delivery Details */}
          <div className="border-b border-border pb-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  <CheckCircle className={`w-5 h-5 ${deliveryDetails ? 'text-green-500' : 'text-gray-400'}`} />
                </span>
                <h2 className="text-lg font-medium text-foreground">2. Delivery Details</h2>
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
                  <p className="text-sm text-muted-foreground">Fulfilled by Sowit Courier</p>
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
                  <Link href="/cart" className="inline-block mt-3 text-secondary hover:underline">
                    Modify cart
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground mt-2">No delivery details provided</p>
            )}
          </div>
          {/* Payment Method */}
          <div className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  <CheckCircle className={`w-5 h-5 ${paymentMethod ? 'text-green-500' : 'text-gray-400'}`} />
                </span>
                <h2 className="text-lg font-medium text-foreground">3. Payment Method</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenPaymentModal}
                className="flex items-center gap-1"
              >
                {paymentMethod ? "Edit" : "Add"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {paymentMethod ? (
              <div className="mt-4">
                <p className="text-foreground">{getPaymentMethodLabel(paymentMethod)}</p>
              </div>
            ) : (
              <p className="text-muted-foreground mt-2">No payment method selected</p>
            )}
          </div>
          <Link href="/products" className="inline-block mt-6 text-secondary hover:underline">
            Continue shopping
          </Link>
        </div>
        {/* Order Summary */}
        <div className="w-full md:w-[350px] bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Cart Details</h3>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Items ({items.length})</span>
              <span>₦{itemsTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
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
              <span className="text-brand-yellow">₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Notes (Optional)</label>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={2}
              placeholder="Write a note"
              // value={note}
              // onChange={e => setNote(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full border rounded p-2 mb-2"
              placeholder="Enter coupon code"
              // value={coupon}
              // onChange={e => setCoupon(e.target.value)}
            />
            <Button variant="outline" className="w-full border border-yellow-400 text-yellow-600 py-2 rounded font-semibold hover:bg-yellow-50 mb-2">APPLY COUPON</Button>
          </div>
          {/* <Button disabled className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold text-lg opacity-60 cursor-not-allowed mb-2">Checkout</Button> */}
          <Button 
            className="w-full py-3 rounded-md font-medium bg-brand-yellow text-gray-900 hover:bg-yellow-400 transition-colors duration-200"
            disabled={!customerAddress || !deliveryDetails || !paymentMethod}
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            By proceeding, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
      {/* Customer Address Modal */}
      <Dialog open={isModalOpen === "customer"} onOpenChange={open => setIsModalOpen(open ? "customer" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{customerAddress ? "Edit Customer Information" : "Add Customer Information"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <input
              type="text"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              placeholder="Full Name"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
            <input
              type="text"
              value={customerForm.address}
              onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
              placeholder="Delivery Address"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
            <input
              type="tel"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              placeholder="Phone Number"
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
      <Dialog open={isModalOpen === "delivery"} onOpenChange={open => setIsModalOpen(open ? "delivery" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{deliveryDetails ? "Edit Delivery Details" : "Add Delivery Details"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <input
              type="text"
              value={deliveryForm.pickupStation}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, pickupStation: e.target.value })}
              placeholder="Pickup Station"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
            <input
              type="text"
              value={deliveryForm.deliveryDate}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryDate: e.target.value })}
              placeholder="Estimated Delivery Date"
              className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveDeliveryDetails}>
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Payment Method Modal */}
      <Dialog open={isModalOpen === "payment"} onOpenChange={open => setIsModalOpen(open ? "payment" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{paymentMethod ? "Edit Payment Method" : "Select Payment Method"}</DialogTitle>
          </DialogHeader>
          <select
            value={paymentForm}
            onChange={(e) => setPaymentForm(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-input-background text-foreground mt-4"
          >
            <option value="" disabled>Select payment method</option>
            <option value="card">Card Payment</option>
            <option value="bank_transfer">Pay on delivery via bank transfer (Just Like Cash!)</option>
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
};

export default Checkout;
