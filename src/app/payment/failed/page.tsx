'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const transaction = searchParams.get('transaction');
  const reason = searchParams.get('reason');

  const reasonTexts: Record<string, string> = {
    'invalid_response': 'Payment gateway returned invalid response',
    'callback_error': 'Error processing payment callback',
    'unknown': 'Payment processing failed',
  };

  const reasonText = reasonTexts[reason as string] || 'Payment failed for an unknown reason';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-beige to-white px-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Icon */}
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 className="font-serif text-4xl text-gray-900 mb-4">Payment Failed</h1>

        {/* Description */}
        <p className="text-gray-600 font-sans mb-6">
          {reasonText}
        </p>

        {/* Details */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
          {orderId && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Order ID:</span> {orderId}
            </p>
          )}
          {transaction && (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Transaction:</span> {transaction}
            </p>
          )}
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-600 font-sans mb-8">
          Don't worry! Your order has been saved. You can try the payment again.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/checkout">
            <button className="w-full py-3 px-6 bg-gray-900 text-white font-sans font-semibold rounded-md hover:bg-gray-800 transition-colors uppercase tracking-wide">
              Try Again
            </button>
          </Link>

          <Link href="/">
            <button className="w-full py-3 px-6 bg-warm-beige text-gray-900 font-sans font-semibold rounded-md hover:bg-warm-beige/80 transition-colors uppercase tracking-wide flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </button>
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500 font-sans mt-8">
          If you need help, please contact our support team
        </p>
      </motion.div>
    </div>
  );
}
