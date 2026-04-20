import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase server client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * SSLCommerz redirects here after failed payment
 * This is a GET request with query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract SSLCommerz response parameters
    const transactionId = searchParams.get('tran_id');
    const status = searchParams.get('status');
    const orderId = searchParams.get('value_a');
    const failureMessage = searchParams.get('error_code');

    console.log('Payment failed for order:', orderId, {
      transactionId,
      status,
      failureMessage,
    });

    // Update order status to 'failed'
    if (orderId && transactionId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          transaction_id: transactionId,
          status: 'Payment Failed', // Change order status
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update order status:', updateError);
      }
    }

    // Redirect to failed payment page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(
        `/payment/failed?orderId=${orderId}&transaction=${transactionId}&reason=${failureMessage || 'unknown'}`,
        baseUrl
      )
    );
  } catch (error: any) {
    console.error('Payment failure callback error:', error);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(`/payment/failed?reason=callback_error`, baseUrl)
    );
  }
}

/**
 * POST method for form submissions (fallback)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const transactionId = formData.get('tran_id') as string;
    const status = formData.get('status') as string;
    const orderId = formData.get('value_a') as string;
    const failureMessage = formData.get('error_code') as string;

    console.log('Payment failed (POST) for order:', orderId, {
      transactionId,
      status,
      failureMessage,
    });

    if (orderId && transactionId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          transaction_id: transactionId,
          status: 'Payment Failed',
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update order:', updateError);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(
        `/payment/failed?orderId=${orderId}&transaction=${transactionId}&reason=${failureMessage || 'unknown'}`,
        baseUrl
      )
    );
  } catch (error: any) {
    console.error('Payment failure POST error:', error);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(`/payment/failed?reason=callback_error`, baseUrl)
    );
  }
}
