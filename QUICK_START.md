# Quick Start Guide - Google OAuth & Smart Checkout

## 🎯 What You Get

### Before
- Guest-only checkout
- Manual form entry required
- No user authentication
- No order tracking by user

### After
- **Google Login** in header
- **Smart Checkout** with auto-filled data
- **User Authentication** with Supabase
- **Order Tracking** linked to user accounts
- **Guest Checkout** still available

---

## ⚡ 30-Second Setup

### 1. Set Environment Variables
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://qxrdqkacaingrppxawvf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_49XHNcAwCu_RQF1qziAxow_XhT8J4cf
```

### 2. Configure Supabase Google OAuth
- Dashboard → Authentication → Providers
- Enable Google
- Add Client ID & Secret (you already did this ✅)
- Set Redirect URI: `http://localhost:3000/auth/callback`

### 3. Update Database
Run in Supabase SQL Editor:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;
```

### 4. Test It
```bash
npm run dev
# Visit http://localhost:3000
# Click "Sign In with Google" button in header
```

---

## 📍 Where to Find Everything

| Feature | Location | What It Does |
|---------|----------|-------------|
| Login Button | Header (top-right) | Sign in with Google |
| Smart Checkout | `/checkout` (logged in) | Auto-filled order form |
| Guest Checkout | `/checkout` (not logged in) | Manual form entry |
| OAuth Callback | `/auth/callback` | Handles Google redirect |
| Auth Context | `src/lib/AuthContext.tsx` | Global auth state |

---

## 🧪 Test These Scenarios

### Scenario 1: New User Login
1. Visit home page
2. Click "Sign In with Google" (top-right header)
3. Complete Google authentication
4. Should redirect to `/auth/callback` then `/checkout`
5. Form should be pre-filled with name & email ✓

### Scenario 2: Guest Checkout
1. Visit home page
2. Add items to cart
3. Go to `/checkout` WITHOUT logging in
4. See guest checkout form (all fields required)
5. Complete purchase ✓

### Scenario 3: Returning Logged-In User
1. Already logged in (email shows in header)
2. Add items to cart
3. Go to checkout
4. Form pre-filled, just add phone & address
5. Complete purchase ✓

### Scenario 4: Logout
1. Click email + logout icon in header
2. Should be logged out
3. "Sign In with Google" button should appear ✓

---

## 📦 Files Created/Modified

### New Files
```
src/lib/AuthContext.tsx
src/components/GoogleLoginButton.tsx
src/components/SmartCheckout.tsx
src/app/auth/callback/page.tsx
scripts/migration-google-oauth.sql
GOOGLE_OAUTH_SETUP.md
IMPLEMENTATION_COMPLETE.md
```

### Modified Files
```
src/app/layout.tsx          (Added AuthProvider)
src/components/Header.tsx   (Added GoogleLoginButton)
src/app/checkout/page.tsx   (Added SmartCheckout support)
```

---

## 🎨 Component Breakdown

### GoogleLoginButton
```
Not Logged In          vs        Logged In
┌──────────────────────────────────────────┐
│ [Sign In with Google]                    │
│                                    │ user@email.com [🚪] │
└──────────────────────────────────────────┘
```

### SmartCheckout
```
┌─────────────────────────────────────────┐
│ Smart Checkout ✓ Signed In              │
├─────────────────────────────────────────┤
│ Full Name: [Pre-filled from Google]     │
│ Email:     [Pre-filled from Google]     │
│ Phone:     [Enter phone number]         │
│ Area:      [Dhaka / Outside Dhaka]      │
│ Address:   [Enter address]              │
│                                          │
│ Subtotal: ৳2500                         │
│ Delivery: ৳80                           │
│ Total:    ৳2580                         │
│                                          │
│ [Place Order - ৳2580]                   │
└─────────────────────────────────────────┘
```

---

## 🔗 Integration Points

### Header (src/components/Header.tsx)
```typescript
import GoogleLoginButton from "./GoogleLoginButton";

// In return statement:
<GoogleLoginButton />  {/* Renders login button */}
```

### Layout (src/app/layout.tsx)
```typescript
import { AuthProvider } from "@/lib/AuthContext";

// In return statement:
<AuthProvider>
  <CartProvider>
    {/* App content */}
  </CartProvider>
</AuthProvider>
```

### Checkout (src/app/checkout/page.tsx)
```typescript
if (user && useSmartCheckout) {
  return <SmartCheckout />;  // Pre-filled form
} else {
  return <GuestCheckout />;  // Manual form
}
```

---

## 🚨 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Login button not working | Check .env.local has Supabase credentials |
| Redirect loop | Verify `/auth/callback` page exists |
| Form not pre-filled | Check user logged in + `useAuth()` hook |
| Order not saving | Verify orders table has `user_id` column |
| Google OAuth error | Check redirect URI in Supabase matches exactly |

---

## 📚 Full Documentation

For detailed information, see:
- `GOOGLE_OAUTH_SETUP.md` - Complete setup guide
- `IMPLEMENTATION_COMPLETE.md` - Full feature overview
- `scripts/migration-google-oauth.sql` - Database schema

---

## ✅ Verification Checklist

- [ ] `.env.local` has Supabase URL and key
- [ ] Google OAuth configured in Supabase
- [ ] Redirect URI set to `http://localhost:3000/auth/callback`
- [ ] Database schema updated (user_id & email columns)
- [ ] `npm run dev` runs without errors
- [ ] "Sign In with Google" button visible in header
- [ ] Login flow completes successfully
- [ ] SmartCheckout pre-fills name & email
- [ ] Guest checkout still works
- [ ] Orders saved to database with correct user_id

---

## 🎉 That's It!

Your Nayoori store now has:
✅ Google OAuth authentication
✅ Smart auto-filling checkout
✅ Guest checkout option
✅ User order tracking

**Next**: Configure your Supabase settings, then test locally!
