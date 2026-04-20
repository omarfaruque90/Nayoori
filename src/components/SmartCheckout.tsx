'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/lib/CartContext';
import { ArrowLeft, Check, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PaymentInitResponse {
  success: boolean;
  redirectUrl?: string;
  transactionId?: string;
  error?: string;
}

export default function SmartCheckout() {
  const { user, userFullName, userEmail } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    deliveryArea: 'Dhaka',
    fullAddress: '',
  });

  // Pre-fill form with Google data when user logs in
  useEffect(() => {
    if (user && userFullName && userEmail) {
      setFormData((prev) => ({
        ...prev,
        fullName: userFullName || prev.fullName,
        email: userEmail || prev.email,
      }));
    }
  }, [user, userFullName, userEmail]);

  const deliveryCharge = formData.deliveryArea === 'Dhaka' ? 80 : 150;
  const finalTotal = cartTotal + deliveryCharge;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
            user_id: user?.id || null,
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            delivery_area: formData.deliveryArea,
            full_address: formData.fullAddress,
            cart_items: cartItems,
            total_amount: finalTotal,
            status: 'Pending',
            payment_status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const newOrderId = orderData?.id;
      setOrderId(newOrderId);

      // Step 2: Initialize payment with SSLCommerz
      setIsInitializingPayment(true);

      const paymentResponse = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrderId,
          userId: user?.id || null,
          totalAmount: finalTotal,
          deliveryCharge,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phoneNumber,
          customerAddress: formData.fullAddress,
          deliveryArea: formData.deliveryArea,
        }),
      });

      const paymentData: PaymentInitResponse = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(paymentData.error || 'Failed to initialize payment');
      }

      // Step 3: Clear cart and redirect to SSLCommerz
      clearCart();
      setShowSuccess(true);

      // Redirect to SSLCommerz after short delay
      setTimeout(() => {
        if (paymentData.redirectUrl) {
          window.location.href = paymentData.redirectUrl;
        } else {
          throw new Error('No redirect URL from payment gateway');
        }
      }, 1000);
    } catch (error: any) {
      console.error('Checkout error:', error);
      setErrorMessage(
        error.message || 'Checkout failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setIsInitializingPayment(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
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
                <Loader className="w-8 h-8 text-blue-600" />
              </motion.div>
              <p className="text-gray-900 font-medium">Initializing payment...</p>
              <p className="text-sm text-gray-600">Redirecting to payment gateway</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">Order created! Redirecting to payment...</p>
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

      <form onSubmit={handleSubmit} className="space-y-6 bg-warm-beige/30 p-8 rounded-xl shadow-md border border-warm-beige">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-3xl text-gray-900">Smart Checkout</h2>
          {user && (
            <span className="text-sm font-sans text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              ✓ Signed In
            </span>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            required
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            required
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Delivery Area */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
            Delivery Area *
          </label>
          <select
            name="deliveryArea"
            value={formData.deliveryArea}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
          >
            <option value="Dhaka">Dhaka (Inside) - ৳80</option>
            <option value="Outside Dhaka">Outside Dhaka - ৳150</option>
          </select>
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
            Full Address *
          </label>
          <textarea
            required
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
            placeholder="Enter your complete delivery address"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">৳{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charge:</span>
              <span className="font-medium">৳{deliveryCharge}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-lg text-blue-600">৳{finalTotal}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || cartItems.length === 0}
          className="w-full py-4 px-6 bg-gray-900 text-white font-sans font-semibold rounded-md hover:bg-gray-800 transition duration-300 disabled:bg-gray-400 uppercase tracking-wide flex items-center justify-center gap-2"
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader className="w-4 h-4" />
              </motion.div>
              Proceed to Payment...
            </>
          ) : (
            `Pay Now (৳${finalTotal})`
          )}
        </motion.button>

        {/* Continue Shopping Link */}
        <div className="text-center pt-4 border-t">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
