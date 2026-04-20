import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase server client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * SSLCommerz sends IPN (Instant Payment Notification) here
 * This is a server-to-server POST request for transaction validation
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }

    const transactionId = data.tran_id;
    const status = data.status;
    const amount = data.amount;
    const currency = data.currency;
    const orderId = data.value_a;
    const paymentMethod = data.card_brand || 'sslcommerz';

    console.log('IPN Webhook received:', {
      transactionId,
      status,
      orderId,
      amount,
    });

    // Validate transaction status
    if (status === 'VALID' || status === 'VALIDATED') {
      // Update order with payment details
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          transaction_id: transactionId,
          payment_method: paymentMethod,
          paid_at: new Date().toISOString(),
          status: 'Confirmed',
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update order from IPN:', updateError);
        return NextResponse.json(
          { valid: true, message: 'Payment received, verification will be manual' },
          { status: 200 }
        );
      }

      console.log('Order updated from IPN:', orderId);

      return NextResponse.json(
        { valid: true, message: 'Payment verified successfully' },
        { status: 200 }
      );
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      // Update order status to failed
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          transaction_id: transactionId,
          status: 'Payment Failed',
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update failed order:', updateError);
      }

      console.log('Order marked as failed from IPN:', orderId);

      return NextResponse.json(
        { valid: false, message: 'Payment failed' },
        { status: 200 }
      );
    } else {
      console.warn('Unknown payment status from IPN:', status);
      return NextResponse.json(
        { valid: false, message: 'Unknown status' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('IPN webhook error:', error);

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET for health check
 */
export async function GET() {
  return NextResponse.json(
    { message: 'IPN endpoint is ready' },
    { status: 200 }
  );
}
