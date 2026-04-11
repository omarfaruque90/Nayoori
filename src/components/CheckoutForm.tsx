'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export default function CheckoutForm({ cartItems, totalAmount }: { cartItems: CartItem[], totalAmount: number }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryArea: 'Dhaka',
    fullAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            delivery_area: formData.deliveryArea,
            full_address: formData.fullAddress,
            cart_items: cartItems,
            total_amount: totalAmount,
          }
        ]);

      if (error) throw error;
      
      setMessage('Order placed successfully!');
      // Clear cart or redirect users here
    } catch (error: any) {
      setMessage(`Checkout failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 bg-warm-beige/30 p-8 rounded-xl shadow-md border border-warm-beige">
      <h2 className="font-serif text-3xl text-gray-900 mb-6 text-center">Guest Checkout</h2>
      
      <div>
        <label className="block text-sm font-sans font-medium text-gray-700">Full Name</label>
        <input required type="text" name="fullName" onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blush-pink focus:border-blush-pink outline-none transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-sans font-medium text-gray-700">Phone Number</label>
        <input required type="tel" name="phoneNumber" onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blush-pink focus:border-blush-pink outline-none transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-sans font-medium text-gray-700">Delivery Area</label>
        <select name="deliveryArea" onChange={handleChange} value={formData.deliveryArea} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blush-pink focus:border-blush-pink outline-none transition-colors">
          <option value="Dhaka">Dhaka (Inside)</option>
          <option value="Outside Dhaka">Outside Dhaka</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-sans font-medium text-gray-700">Full Address</label>
        <textarea required name="fullAddress" rows={4} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blush-pink focus:border-blush-pink outline-none transition-colors"></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-4 px-6 bg-gray-900 text-white font-sans font-semibold rounded-md hover:bg-gray-800 transition duration-300 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Processing...' : `Place Order (৳${totalAmount})`}
      </button>

      {message && <p className="mt-4 text-center text-sm text-gray-800 font-medium">{message}</p>}
    </form>
  );
}
