'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/lib/CartContext';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SmartCheckout() {
  const { user, userFullName, userEmail } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
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
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setOrderId(data?.id || 'unknown');
      setShowSuccess(true);
      clearCart();

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/success?orderId=${data?.id}&total=${finalTotal}`);
      }, 2000);
    } catch (error: any) {
      console.error('Order submission failed:', error);
      alert('Order submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
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
            <p className="text-green-700 font-medium">Order placed successfully!</p>
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
          className="w-full py-4 px-6 bg-gray-900 text-white font-sans font-semibold rounded-md hover:bg-gray-800 transition duration-300 disabled:bg-gray-400 uppercase tracking-wide"
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? 'Processing Order...' : `Place Order (৳${finalTotal})`}
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
