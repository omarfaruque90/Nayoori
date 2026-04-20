-- ============================================
-- SSLCommerz Payment Integration - Database Migration
-- ============================================

-- Add payment-related columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'sslcommerz';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Add index on payment_status for faster queries
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders(payment_status);

-- Add index on transaction_id for quick lookup
CREATE INDEX IF NOT EXISTS orders_transaction_id_idx ON orders(transaction_id);

-- ============================================
-- Verify the schema (run this to check)
-- ============================================

/*
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
*/

-- ============================================
-- Update RLS Policy to allow payment status updates
-- ============================================

-- Drop existing policy if it exists and create new one that allows status updates
DROP POLICY IF EXISTS "authenticated_users_can_insert_orders" ON orders;

CREATE POLICY "authenticated_users_can_manage_orders" ON orders
  FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow service role to update payment status (for webhook/callback)
-- Note: This is typically done server-side with service key
