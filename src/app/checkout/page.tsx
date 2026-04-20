"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SmartCheckout from "@/components/SmartCheckout";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [useSmartCheckout, setUseSmartCheckout] = useState(false);

  // Ensure hydration matches properly
  useEffect(() => {
    setIsClient(true);
    // If user is logged in, default to SmartCheckout
    if (user && !isLoading) {
      setUseSmartCheckout(true);
    }
  }, [user, isLoading]);

  if (!isClient) return null;

  // EMPTY CART GUARD
  if (cartItems.length === 0) {
    return (
      <div className="flex-grow container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="font-serif text-3xl text-gray-900 mb-4">Checkout unavailable</h2>
        <p className="font-sans text-gray-600 mb-8">Your cart is currently empty.</p>
        <Link href="/">
          <button className="px-8 py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
            Shop Our Collection
          </button>
        </Link>
      </div>
    );
  }

  // If logged in, show SmartCheckout
  if (user && useSmartCheckout) {
    return (
      <div className="flex-grow container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-sans text-sm tracking-widest uppercase mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-24"
        >
          {/* Left: SmartCheckout Form */}
          <div className="flex-1">
            <SmartCheckout />
          </div>

          {/* Right: Order Summary */}
          <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
        </motion.div>
      </div>
    );
  }

  // Show Guest Checkout (original form)
  return <GuestCheckout cartItems={cartItems} cartTotal={cartTotal} />;
}

// Guest Checkout Component
function GuestCheckout({
  cartItems,
  cartTotal
}: {
  cartItems: any[];
  cartTotal: number;
}) {
  const { clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    deliveryArea: "Dhaka",
    fullAddress: "",
  });

  const deliveryCharge = formData.deliveryArea === "Dhaka" ? 80 : 150;
  const finalTotal = cartTotal + deliveryCharge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Step 1: Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            delivery_area: formData.deliveryArea,
            full_address: formData.fullAddress,
            cart_items: cartItems,
            total_amount: finalTotal,
            status: "Pending",
            payment_status: "pending",
          }
        ])
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      const orderId = orderData?.id;

      // Step 2: Initialize payment with SSLCommerz
      setIsInitializingPayment(true);

      const paymentResponse = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          userId: null,
          totalAmount: finalTotal,
          deliveryCharge,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phoneNumber,
          customerAddress: formData.fullAddress,
          deliveryArea: formData.deliveryArea,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(paymentData.error || 'Failed to initialize payment');
      }

      // Step 3: Clear cart and redirect to SSLCommerz
      clearCart();

      setTimeout(() => {
        if (paymentData.redirectUrl) {
          window.location.href = paymentData.redirectUrl;
        } else {
          throw new Error('No redirect URL from payment gateway');
        }
      }, 1000);
    } catch (error: any) {
      console.error("Checkout error:", error);
      setErrorMessage(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsInitializingPayment(false);
    }
  };

  return (
    <div className="flex-grow container mx-auto px-6 py-12">
      {/* Loading Spinner - Payment Initialization */}
      <AnimatePresence>
        {isInitializingPayment && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 flex flex-col items-center gap-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
              </motion.div>
              <p className="text-gray-900 font-medium">Initializing payment...</p>
              <p className="text-sm text-gray-600">Redirecting to payment gateway</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-red-700 font-medium">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-sans text-sm tracking-widest uppercase mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-12 lg:gap-24"
      >
        {/* Left: Shipping Form */}
        <div className="flex-1">
          <h2 className="font-serif text-3xl text-gray-900 mb-8 border-b border-warm-beige pb-4">Guest Checkout</h2>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-sans tracking-widest uppercase text-gray-500">Full Name</label>
              <input
                required
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans disabled:bg-gray-100"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-sans tracking-widest uppercase text-gray-500">Email</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans disabled:bg-gray-100"
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-sans tracking-widest uppercase text-gray-500">Mobile Number</label>
              <input
                required
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans disabled:bg-gray-100"
                placeholder="e.g. 017XXXXXXXX"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-sans tracking-widest uppercase text-gray-500">Delivery Area</label>
              <select
                name="deliveryArea"
                onChange={handleChange}
                value={formData.deliveryArea}
                disabled={isSubmitting}
                className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans appearance-none disabled:bg-gray-100"
              >
                <option value="Dhaka">Inside Dhaka - ৳80</option>
                <option value="Outside Dhaka">Outside Dhaka - ৳150</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-sans tracking-widest uppercase text-gray-500">Full Delivery Address</label>
              <textarea
                required
                name="fullAddress"
                rows={4}
                value={formData.fullAddress}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans resize-none disabled:bg-gray-100"
                placeholder="Enter your apartment, street, and area details"
              ></textarea>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <OrderSummary cartItems={cartItems} cartTotal={cartTotal} showSubmit isSubmitting={isSubmitting} />
      </motion.div>
    </div>
  );
}

// Order Summary Component (shared)
interface OrderSummaryProps {
  cartItems: any[];
  cartTotal: number;
  showSubmit?: boolean;
  isSubmitting?: boolean;
}

function OrderSummary({
  cartItems,
  cartTotal,
  showSubmit = true,
  isSubmitting = false
}: OrderSummaryProps) {
  const deliveryCharge = 80; // Default for Dhaka
  const finalTotal = cartTotal + deliveryCharge;

  return (
    <div className="w-full lg:w-[450px]">
      <div className="bg-warm-beige/10 p-8 border border-warm-beige rounded-2xl sticky top-32">
        <h2 className="font-serif text-2xl text-gray-900 mb-6">Order Summary</h2>

        {/* Cart Items */}
        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="flex gap-4 items-center">
              <div className="relative w-16 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                <Image src={item.mainImageUrl} alt={item.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="flex-1">
                <p className="font-serif text-gray-900 leading-tight">{item.title}</p>
                <p className="font-sans text-xs text-gray-500 capitalize">{item.color} | {item.size}</p>
                <p className="font-sans text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-sm text-gray-900 font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-warm-beige/50 pt-6 space-y-4 font-sans text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>৳{deliveryCharge.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-warm-beige text-gray-900 text-xl font-medium">
            <span>Total Amount</span>
            <span>৳{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {showSubmit && (
          <>
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full mt-8 py-5 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-xl shadow-gray-900/10"
            >
              {isSubmitting ? "Processing Payment..." : "Pay Now"}
            </button>
            <p className="text-center font-sans text-xs text-gray-400 mt-4 leading-relaxed">
              By confirming, you agree to Nayoori's Terms of Service and Privacy Policy.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
