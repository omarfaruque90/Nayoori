import { ReactPDF } from '@react-pdf/renderer';
import React from 'react';
import InvoicePDF from './generateInvoice';
import { createClient } from '@supabase/supabase-js';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryArea: string;
  deliveryAddress: string;
  createdAt: string;
  transactionId?: string;
}

/**
 * Generate PDF invoice and save to Supabase Storage
 */
export async function generateAndSaveInvoice(invoiceData: InvoiceData): Promise<string | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Generate PDF blob using React.createElement
    const pdfBlob = await ReactPDF.pdf(React.createElement(InvoicePDF, { data: invoiceData })).toBlob();

    // Create unique filename
    const timestamp = new Date().getTime();
    const fileName = `${invoiceData.orderId}_${timestamp}.pdf`;
    const filePath = `invoices/${invoiceData.orderId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading invoice to Supabase Storage:', uploadError);
      return null;
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('invoices')
      .getPublicUrl(filePath);

    if (!publicUrl.publicUrl) {
      console.error('Failed to get public URL for invoice');
      return null;
    }

    console.log('Invoice saved to Supabase Storage:', publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error generating and saving invoice:', error);
    return null;
  }
}

/**
 * Generate invoice PDF as Buffer (for email attachments)
 */
export async function generateInvoiceBuffer(invoiceData: InvoiceData): Promise<Buffer | null> {
  try {
    const pdfBlob = await ReactPDF.pdf(<InvoicePDF data={invoiceData} />).toBlob();
    
    // Convert Blob to Buffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
  } catch (error) {
    console.error('Error generating invoice buffer:', error);
    return null;
  }
}

export default { generateAndSaveInvoice, generateInvoiceBuffer };
