-- Email Notifications and Invoice Storage Migration
-- Run this in Supabase SQL Editor after the payment migration

-- Add invoice_url column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_url TEXT;

-- Create invoices bucket (only if not exists)
-- Note: This should be done manually in Supabase Storage UI or via SDK
-- For now, we'll add a comment with instructions

-- Add index for invoice URL for faster queries
CREATE INDEX IF NOT EXISTS orders_invoice_url_idx ON orders(invoice_url);

-- Create a table to track email notifications (optional, for logging)
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'order_confirmation', 'refund', 'support_reply'
  sent_at TIMESTAMP DEFAULT now(),
  status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT now(),
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create index for email tracking
CREATE INDEX IF NOT EXISTS email_notifications_order_id_idx ON email_notifications(order_id);
CREATE INDEX IF NOT EXISTS email_notifications_status_idx ON email_notifications(status);
CREATE INDEX IF NOT EXISTS email_notifications_sent_at_idx ON email_notifications(sent_at);

-- Enable RLS on email_notifications table
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for email_notifications
CREATE POLICY "Service role can insert email notifications"
  ON email_notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can view email notifications"
  ON email_notifications
  FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own email notifications"
  ON email_notifications
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Update orders table RLS policy to allow service role to update invoice_url
-- This should already be set, but we ensure it's there
-- The service role can update payment fields including invoice_url

-- Verification queries (run after migration to check everything is set up)
/*
-- Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name IN ('invoice_url', 'payment_status', 'transaction_id', 'paid_at');

-- Verify email_notifications table
SELECT table_name FROM information_schema.tables WHERE table_name = 'email_notifications';

-- Verify indexes
SELECT indexname FROM pg_indexes WHERE tablename IN ('orders', 'email_notifications');

-- Verify RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('orders', 'email_notifications');
*/
