-- ============================================
-- Nayoori Database Schema - Orders Table
-- For Google OAuth & Smart Checkout System
-- ============================================

-- Run this SQL in Supabase SQL Editor

-- Add user_id and email columns if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;

-- Update RLS policies to support both authenticated and guest users

-- Policy 1: Allow guests (no user_id) to insert their own orders
CREATE POLICY IF NOT EXISTS "guests_can_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Policy 2: Allow authenticated users to insert their own orders
CREATE POLICY IF NOT EXISTS "authenticated_users_can_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow users to view their own orders
CREATE POLICY IF NOT EXISTS "users_can_view_own_orders" ON orders
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Enable RLS if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

-- Create index for faster queries by status
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

-- ============================================
-- Alternative: Full Table Creation Script
-- (Use this if creating orders table from scratch)
-- ============================================

/*
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT NOT NULL,
  delivery_area TEXT NOT NULL CHECK (delivery_area IN ('Dhaka', 'Outside Dhaka')),
  full_address TEXT NOT NULL,
  cart_items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "guests_can_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (user_id IS NULL);

CREATE POLICY "authenticated_users_can_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_view_own_orders" ON orders
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Indexes
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);
*/

-- ============================================
-- Verify Setup
-- ============================================

-- Check orders table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'orders';

-- Check policies
SELECT schemaname, tablename, policyname, permissive
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;
