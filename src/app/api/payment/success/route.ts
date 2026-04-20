import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail } from '@/lib/notifications';

// Initialize Supabase server client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * SSLCommerz redirects here after successful payment
 * This is a GET request with query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract SSLCommerz response parameters
    const transactionId = searchParams.get('tran_id');
    const status = searchParams.get('status');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    const orderId = searchParams.get('value_a'); // value_a = order_id (from init)

    // Validate essential parameters
    if (!transactionId || status !== 'VALID' || !orderId) {
      console.error('Invalid SSLCommerz response', {
        transactionId,
        status,
        orderId,
      });

      // Redirect to failed payment page
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(
        new URL(
          `/payment/failed?reason=invalid_response&tran_id=${transactionId}`,
          baseUrl
        )
      );
    }

    // Update order status to 'paid'
    const { data: orderData, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
        status: 'Confirmed', // Change order status to Confirmed
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to update order payment status:', updateError);

      // Even if update fails, redirect to success to show user confirmation
      // The admin can manually verify later
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(
        new URL(
          `/success?orderId=${orderId}&transaction=${transactionId}&amount=${amount}`,
          baseUrl
        )
      );
    }

    // Send order confirmation email with invoice
    // This runs in the background and doesn't block the redirect
    if (orderData) {
      try {
        await sendOrderConfirmationEmail({
          id: orderData.id,
          full_name: orderData.full_name,
          email: orderData.email,
          phone_number: orderData.phone_number,
          items: orderData.items || [],
          total_amount: orderData.total_amount,
          delivery_area: orderData.delivery_area,
          full_address: orderData.full_address,
          created_at: orderData.created_at,
          transaction_id: transactionId,
        });
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't block the redirect even if email fails
      }
    }

    // Log successful payment
    console.log('Payment successful for order:', orderId, {
      transactionId,
      amount,
      currency,
    });

    // Redirect to success page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(
        `/success?orderId=${orderId}&transaction=${transactionId}&amount=${amount}`,
        baseUrl
      )
    );
  } catch (error: any) {
    console.error('Payment success callback error:', error);

    // Redirect to error page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(
        `/payment/failed?reason=callback_error&error=${encodeURIComponent(error.message)}`,
        baseUrl
      )
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
    const amount = formData.get('amount') as string;
    const currency = formData.get('currency') as string;
    const orderId = formData.get('value_a') as string;

    if (!transactionId || status !== 'VALID' || !orderId) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(
        new URL(
          `/payment/failed?reason=invalid_response&tran_id=${transactionId}`,
          baseUrl
        )
      );
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
        status: 'Confirmed',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Failed to update order:', updateError);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(
        `/success?orderId=${orderId}&transaction=${transactionId}&amount=${amount}`,
        baseUrl
      )
    );
  } catch (error: any) {
    console.error('Payment success POST error:', error);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(`/payment/failed?reason=callback_error`, baseUrl)
    );
  }
}
