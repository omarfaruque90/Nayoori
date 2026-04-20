import { NextRequest, NextResponse } from 'next/server';

/**
 * User cancels payment on SSLCommerz checkout page
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const transactionId = searchParams.get('tran_id');
    const orderId = searchParams.get('value_a');

    console.log('Payment cancelled by user:', orderId, { transactionId });

    // Redirect back to checkout
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(
        `/checkout?cancelled=true&orderId=${orderId}&transaction=${transactionId}`,
        baseUrl
      )
    );
  } catch (error) {
    console.error('Payment cancel error:', error);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/checkout', baseUrl));
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('value_a') as string;
    const transactionId = formData.get('tran_id') as string;

    console.log('Payment cancelled (POST):', orderId, { transactionId });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(
        `/checkout?cancelled=true&orderId=${orderId}&transaction=${transactionId}`,
        baseUrl
      )
    );
  } catch (error) {
    console.error('Payment cancel POST error:', error);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/checkout', baseUrl));
  }
}
