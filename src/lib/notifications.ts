import { Resend } from 'resend';
import { generateAndSaveInvoice, generateInvoiceBuffer } from './invoices/utils';
import { OrderConfirmationEmail } from '@/components/email/OrderConfirmationEmail';
import { createClient } from '@supabase/supabase-js';
import { render } from 'react-email';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface OrderData {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  items: OrderItem[];
  total_amount: number;
  delivery_area: string;
  full_address: string;
  created_at: string;
  transaction_id?: string;
}

/**
 * Send order confirmation email with invoice PDF
 */
export async function sendOrderConfirmationEmail(orderData: OrderData): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    const resend = new Resend(resendApiKey);

    // Prepare invoice data
    const invoiceData = {
      orderId: orderData.id,
      customerName: orderData.full_name,
      customerEmail: orderData.email,
      customerPhone: orderData.phone_number,
      items: orderData.items,
      totalAmount: orderData.total_amount,
      deliveryArea: orderData.delivery_area,
      deliveryAddress: orderData.full_address,
      createdAt: orderData.created_at,
      transactionId: orderData.transaction_id,
    };

    // Generate invoice PDF as buffer for attachment
    const invoicePdf = await generateInvoiceBuffer(invoiceData);

    // Generate and save invoice to Supabase Storage
    const invoiceUrl = await generateAndSaveInvoice(invoiceData);

    // Prepare email HTML from React component
    const emailHtml = render(
      OrderConfirmationEmail({
        orderId: orderData.id,
        customerName: orderData.full_name,
        customerEmail: orderData.email,
        items: orderData.items,
        totalAmount: orderData.total_amount,
        deliveryArea: orderData.delivery_area,
        deliveryAddress: orderData.full_address,
        createdAt: orderData.created_at,
        invoiceUrl: invoiceUrl || undefined,
      })
    );

    // Send email with Resend
    const emailPayload: any = {
      from: 'orders@nayoori.com',
      to: orderData.email,
      subject: `Order Confirmation - Order #${orderData.id}`,
      html: emailHtml,
    };

    // Attach PDF if generated
    if (invoicePdf) {
      emailPayload.attachments = [
        {
          filename: `invoice_${orderData.id}.pdf`,
          content: invoicePdf,
          contentType: 'application/pdf',
        },
      ];
    }

    const response = await resend.emails.send(emailPayload);

    if (response.error) {
      console.error('Error sending email via Resend:', response.error);
      return false;
    }

    // Update order with invoice URL in Supabase
    if (invoiceUrl) {
      await updateOrderInvoiceUrl(orderData.id, invoiceUrl);
    }

    console.log('Order confirmation email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
    return false;
  }
}

/**
 * Update order with invoice URL
 */
export async function updateOrderInvoiceUrl(
  orderId: string,
  invoiceUrl: string
): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase
      .from('orders')
      .update({ invoice_url: invoiceUrl })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating invoice URL:', error);
      return false;
    }

    console.log('Invoice URL updated for order:', orderId);
    return true;
  } catch (error) {
    console.error('Error in updateOrderInvoiceUrl:', error);
    return false;
  }
}

/**
 * Send password reset email (optional, for future use)
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    const resend = new Resend(resendApiKey);

    const response = await resend.emails.send({
      from: 'support@nayoori.com',
      to: email,
      subject: 'Password Reset - Nayoori',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #8b6f47; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    if (response.error) {
      console.error('Error sending password reset email:', response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    return false;
  }
}

/**
 * Send refund notification email
 */
export async function sendRefundNotificationEmail(
  email: string,
  orderData: {
    orderId: string;
    amount: number;
    reason: string;
  }
): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    const resend = new Resend(resendApiKey);

    const response = await resend.emails.send({
      from: 'support@nayoori.com',
      to: email,
      subject: `Refund Processed - Order #${orderData.orderId}`,
      html: `
        <h2>Refund Processed</h2>
        <p>We have processed a refund for your order.</p>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Refund Amount:</strong> ৳${orderData.amount.toFixed(2)}</p>
        <p><strong>Reason:</strong> ${orderData.reason}</p>
        <p>The refund should appear in your account within 3-5 business days.</p>
        <p>If you have any questions, please contact our support team.</p>
      `,
    });

    if (response.error) {
      console.error('Error sending refund notification email:', response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendRefundNotificationEmail:', error);
    return false;
  }
}

/**
 * Send support reply email
 */
export async function sendSupportReplyEmail(
  email: string,
  ticketId: string,
  message: string
): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    const resend = new Resend(resendApiKey);

    const response = await resend.emails.send({
      from: 'support@nayoori.com',
      to: email,
      subject: `Support Reply - Ticket #${ticketId}`,
      html: `
        <h2>Support Reply</h2>
        <p>Thank you for contacting Nayoori support.</p>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <div style="background-color: #fdfbf7; padding: 20px; border-radius: 4px; margin: 20px 0;">
          ${message}
        </div>
        <p>If you need further assistance, please reply to this email.</p>
      `,
    });

    if (response.error) {
      console.error('Error sending support reply email:', response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendSupportReplyEmail:', error);
    return false;
  }
}

export default {
  sendOrderConfirmationEmail,
  updateOrderInvoiceUrl,
  sendPasswordResetEmail,
  sendRefundNotificationEmail,
  sendSupportReplyEmail,
};
