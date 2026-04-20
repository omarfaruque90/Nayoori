import crypto from 'crypto';

/**
 * Generate MD5 hash for SSLCommerz
 * SSLCommerz uses MD5 for signature generation
 */
export function generateMD5Hash(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Generate signature for SSLCommerz payment initialization
 * Format: store_password + transaction_id + total_amount + product_category + product_name
 */
export function generateSignature(
  storePassword: string,
  transactionId: string,
  totalAmount: number,
  productCategory: string = 'fashion',
  productName: string = 'Nayoori Products'
): string {
  const signatureString = `${storePassword}${transactionId}${totalAmount}${productCategory}${productName}`;
  return generateMD5Hash(signatureString);
}

/**
 * Validate IPN signature from SSLCommerz callback
 */
export function validateIPNSignature(
  storePassword: string,
  data: Record<string, any>
): boolean {
  const {
    amount,
    currency,
    tran_date,
    tran_id,
    value_a,
    value_d,
    verify_sign,
  } = data;

  // Build validation string in correct order
  const validationString = `${value_a}${value_d}${verify_sign}${storePassword}${tran_id}${tran_date}${amount}${currency}`;
  const calculatedHash = generateMD5Hash(validationString);

  // SSLCommerz provides verify_key in response, we compare hashes
  return calculatedHash === verify_sign;
}

/**
 * Prepare payment initialization request for SSLCommerz
 */
export interface PaymentInitRequest {
  store_id: string;
  store_password: string;
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_country: string;
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_amount: number;
  shipping_cost?: number;
  discount_amount?: number;
  value_a: string; // order_id for tracking
  value_d: string; // user_id for tracking
}

/**
 * Build SSLCommerz payment initialization payload
 */
export function buildPaymentPayload(
  storeId: string,
  storePassword: string,
  orderId: string,
  userId: string | null,
  totalAmount: number,
  deliveryCharge: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  customerAddress: string,
  deliveryArea: string,
  callbackUrls: {
    success: string;
    fail: string;
    cancel: string;
    ipn: string;
  }
): PaymentInitRequest {
  // Generate unique transaction ID
  const timestamp = Date.now();
  const transactionId = `${orderId}-${timestamp}`;

  // Product amount (without delivery)
  const productAmount = totalAmount - deliveryCharge;

  // Generate signature
  const signature = generateSignature(
    storePassword,
    transactionId,
    totalAmount,
    'fashion',
    'Nayoori Fashion'
  );

  return {
    store_id: storeId,
    store_password: storePassword,
    total_amount: totalAmount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: callbackUrls.success,
    fail_url: callbackUrls.fail,
    cancel_url: callbackUrls.cancel,
    ipn_url: callbackUrls.ipn,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    customer_address: customerAddress,
    customer_city: deliveryArea === 'Dhaka' ? 'Dhaka' : 'Other',
    customer_country: 'Bangladesh',
    shipping_method: 'Home Delivery',
    product_name: 'Nayoori Fashion Collection',
    product_category: 'fashion',
    product_amount: productAmount,
    shipping_cost: deliveryCharge,
    discount_amount: 0,
    value_a: orderId, // Store order ID
    value_d: userId || 'guest', // Store user ID or 'guest'
  };
}

/**
 * SSLCommerz Sandbox URLs
 */
export const SSLCOMMERZ_URLS = {
  sandbox: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
  production: 'https://securepay.sslcommerz.com/gwprocess/v4/api.php',
  validateIpn: 'https://sandbox.sslcommerz.com/validator/api/validationapi.php',
};

export function getSslcommerzUrl(sandbox: boolean = true): string {
  return sandbox ? SSLCOMMERZ_URLS.sandbox : SSLCOMMERZ_URLS.production;
}
