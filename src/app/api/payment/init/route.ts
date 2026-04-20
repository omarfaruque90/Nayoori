import { NextRequest, NextResponse } from 'next/server';
import { buildPaymentPayload, getSslcommerzUrl } from '@/lib/payment/sslcommerz';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase server client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

interface PaymentInitRequest {
  orderId: string;
  userId: string | null;
  totalAmount: number;
  deliveryCharge: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentInitRequest = await request.json();

    // Validate required fields
    if (
      !body.orderId ||
      !body.totalAmount ||
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone ||
      !body.customerAddress
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get environment variables
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!storeId || !storePassword) {
      console.error('SSLCommerz credentials not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Update order with pending payment status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: 'pending' })
      .eq('id', body.orderId);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return NextResponse.json(
        { error: 'Failed to process order' },
        { status: 500 }
      );
    }

    // Build payment payload
    const paymentPayload = buildPaymentPayload(
      storeId,
      storePassword,
      body.orderId,
      body.userId,
      body.totalAmount,
      body.deliveryCharge,
      body.customerName,
      body.customerEmail,
      body.customerPhone,
      body.customerAddress,
      body.deliveryArea,
      {
        success: `${baseUrl}/api/payment/success`,
        fail: `${baseUrl}/api/payment/fail`,
        cancel: `${baseUrl}/api/payment/cancel`,
        ipn: `${baseUrl}/api/payment/ipn`,
      }
    );

    // Make request to SSLCommerz
    const sslcommerzUrl = getSslcommerzUrl(true); // Use sandbox
    const formData = new URLSearchParams();

    // Add all fields to form data
    Object.entries(paymentPayload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const response = await fetch(sslcommerzUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      console.error('SSLCommerz API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Payment gateway error' },
        { status: 500 }
      );
    }

    const data = await response.text();

    // SSLCommerz returns a redirect URL or HTML form
    // We need to extract the redirect URL from the response
    let redirectUrl = null;

    // Check if response contains a redirect URL
    const urlMatch = data.match(/GatewayPageURL":"([^"]+)"/);
    if (urlMatch) {
      redirectUrl = urlMatch[1];
    }

    // If no redirect URL, try to parse as JSON
    if (!redirectUrl) {
      try {
        const jsonData = JSON.parse(data);
        if (jsonData.GatewayPageURL) {
          redirectUrl = jsonData.GatewayPageURL;
        }
      } catch (e) {
        // Not JSON, check if response is HTML or direct URL
        console.log('SSLCommerz response:', data.substring(0, 200));
      }
    }

    if (!redirectUrl) {
      return NextResponse.json(
        { error: 'Invalid payment gateway response' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        redirectUrl,
        transactionId: paymentPayload.tran_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
