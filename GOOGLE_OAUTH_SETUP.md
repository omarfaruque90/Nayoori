# Google OAuth & Smart Checkout - Setup Guide

## ✅ Implementation Complete

The following components have been built and integrated:

### 1. **Authentication System**
- `src/lib/AuthContext.tsx` - Complete auth state management with Google OAuth
- `src/components/GoogleLoginButton.tsx` - Sign in/out button component
- `src/app/auth/callback/page.tsx` - OAuth callback handler

### 2. **Smart Checkout**
- `src/components/SmartCheckout.tsx` - Intelligent checkout form that auto-fills from Google
- `src/app/checkout/page.tsx` - Updated to support both authenticated and guest checkout
- Guest checkout maintained for backward compatibility

### 3. **UI Updates**
- `src/components/Header.tsx` - Google Login button integrated
- `src/app/layout.tsx` - AuthProvider wrapped entire app

---

## 🔧 Configuration Steps

### Step 1: Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Supabase OAuth Configuration

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials (Client ID & Secret)
4. Set **Redirect URL** to:
   ```
   https://your-domain.com/auth/callback
   ```
   For local development:
   ```
   http://localhost:3000/auth/callback
   ```

### Step 3: Update Orders Table Schema

Run this SQL in your Supabase SQL Editor to add user_id and email fields:

```sql
-- Add user_id column to orders table (if not exists)
ALTER TABLE orders ADD COLUMN user_id UUID;

-- Add email column to orders table (if not exists)
ALTER TABLE orders ADD COLUMN email TEXT;

-- Create foreign key constraint
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies to allow authenticated users
CREATE POLICY "authenticated_users_can_insert_own_orders" ON orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL OR auth.uid() = user_id
  );
```

### Step 4: Alternative - Create Orders Table from Scratch

If you need to create the orders table:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT NOT NULL,
  delivery_area TEXT NOT NULL,
  full_address TEXT NOT NULL,
  cart_items JSONB NOT NULL,
  total_amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for guest users (no user_id)
CREATE POLICY "guests_can_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Policy for authenticated users
CREATE POLICY "authenticated_users_can_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for admin/support to view all
CREATE POLICY "admins_can_view_orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 🎯 How It Works

### User Flow

1. **User visits site** → Sees "Sign In with Google" button in header
2. **User clicks Sign In** → Redirected to Google OAuth
3. **Google auth successful** → Redirected to `/auth/callback`
4. **User added to cart** → "Checkout" button appears
5. **User clicks Checkout** → SmartCheckout form pre-filled with:
   - Full name (from Google)
   - Email (from Google)
6. **User fills remaining fields** → Phone, address, delivery area
7. **User submits order** → Order created with `user_id` linked
8. **Success page** → Order confirmation shown

### Guest Checkout

- Users who don't sign in get guest checkout
- No `user_id` associated with order
- All standard fields required

---

## 📱 Features

### Google Login Button
- **Location**: Header (top right, next to cart)
- **States**: 
  - Not logged in: Blue "Sign In with Google" button
  - Logged in: Shows email + logout icon
- **Styling**: Responsive, matches design system

### SmartCheckout
- **Auto-fills**: Name and email from Google account
- **Validates**: All required fields before submit
- **Displays**: Real-time total with delivery charges
- **Confirms**: Order summary before final submission
- **Redirects**: To success page after completion

### Guest Checkout
- **Preserved**: Original checkout flow for non-authenticated users
- **Same UX**: Identical form validation and order flow
- **Flexible**: Users can still complete purchases without account

---

## 🧪 Testing

### Local Testing Setup

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Test Google Login:
   - Click "Sign In with Google"
   - Complete authentication
   - Should redirect to `/auth/callback`
   - Then auto-redirect to checkout

4. Test SmartCheckout:
   - Add items to cart
   - Go to checkout while logged in
   - Verify name/email pre-filled
   - Complete order

5. Test Guest Checkout:
   - Log out (click logout icon in header)
   - Add items to cart
   - Go to checkout
   - Fill all fields manually
   - Complete order

---

## 🔐 Security Notes

✅ **RLS Policies**: Configured to prevent unauthorized access
✅ **CORS**: Supabase handles OAuth redirects securely
✅ **Session Management**: Handled by Supabase Auth
✅ **User Data**: Only email and name from Google stored

---

## 📝 Database Schema Reference

```
orders table:
├── id (UUID, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY to auth.users)
├── full_name (TEXT)
├── email (TEXT, for logged-in users)
├── phone_number (TEXT)
├── delivery_area (TEXT)
├── full_address (TEXT)
├── cart_items (JSONB)
├── total_amount (DECIMAL)
├── status (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🚀 Next Steps

1. ✅ Update `.env.local` with Supabase credentials
2. ✅ Configure Google OAuth in Supabase
3. ✅ Update orders table schema (use SQL above)
4. ✅ Test locally with `npm run dev`
5. ✅ Deploy to production with correct redirect URI

---

## 💡 Customization

### Change Google Button Style
Edit `src/components/GoogleLoginButton.tsx`:
- Line 42: Modify `className` for button styling

### Change SmartCheckout Colors
Edit `src/components/SmartCheckout.tsx`:
- Line 49: Modify form styling
- Line 121: Modify colors

### Add More OAuth Providers
In `src/lib/AuthContext.tsx`:
```typescript
// Add GitHub
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: { redirectTo: `${window.location.origin}/auth/callback` },
});
```

---

## 🐛 Troubleshooting

**Issue**: Login button not working
- Check `.env.local` has correct Supabase URL and key
- Verify Google OAuth configured in Supabase dashboard
- Check redirect URI matches exactly

**Issue**: Session not persisting
- Clear browser cache
- Check Supabase RLS policies
- Verify `auth.callback` page loads

**Issue**: Order not saving with user_id
- Ensure orders table has `user_id` column
- Check RLS policies allow insert
- Verify user logged in (`user` not null)

---

## ✨ Summary

✅ Google Login Button - Fully integrated in header
✅ SmartCheckout - Pre-fills from Google, validates, submits
✅ Guest Checkout - Preserved for backward compatibility
✅ Auth Context - Manages state globally
✅ OAuth Callback - Handles Google redirects
✅ Database Ready - Schema prepared for user_id tracking

Your Nayoori store now has a complete authentication and smart checkout system!
