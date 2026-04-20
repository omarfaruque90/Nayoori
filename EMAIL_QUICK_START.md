# Email Notifications & PDF Invoices - Quick Start (10 Minutes)

## ✅ What You Got

✅ Automatic order confirmation emails
✅ Professional PDF invoices
✅ Invoices saved to Supabase Storage
✅ Beautiful responsive email templates
✅ Nayoori branding throughout

---

## 🚀 Setup in 4 Steps

### Step 1: Get Resend API Key (2 min)
```
1. Go to resend.com
2. Sign up or log in
3. Copy your API key
4. Add to .env.local:
   RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Step 2: Create Supabase Storage Bucket (2 min)
```
1. Go to Supabase Dashboard
2. Storage → Create new bucket
3. Name: "invoices"
4. Uncheck "Public bucket"
5. Click Create
```

### Step 3: Run Database Migration (1 min)
```
1. Supabase → SQL Editor
2. Copy from: scripts/migration-email-notifications.sql
3. Paste and Run
4. Done!
```

### Step 4: Test (5 min)
```bash
npm run dev
# Add items → Checkout → Pay Now
# Use card: 4111111111111111
# ✅ Check your email!
```

---

## 📧 Email Features

When payment succeeds, customer gets:

✅ **Order Confirmation Email**
- Professional template with Nayoori branding
- Order ID and date
- Itemized product list with prices
- Delivery address
- "Track Your Order" button
- "Download Invoice" button

✅ **PDF Invoice Attachment**
- Professional formatting
- Company branding
- All order details
- Ready to print

✅ **Invoice Saved to Cloud**
- Stored in Supabase Storage
- Public URL in database
- Accessible for re-download

---

## 🧪 Test Email Flow

1. **Add items** to cart
2. **Go to checkout**
3. **Fill form** with test data
4. **Click "Pay Now"** button
5. **Use test card**: `4111111111111111`
6. **Complete payment** on SSLCommerz
7. **✅ Redirected to success page**
8. **✅ Check email** (usually within 30 seconds)
9. **✅ Download PDF invoice** from email

---

## 🔧 Environment Variables

Add to `.env.local`:

```env
# Required for email sending
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional (for custom domain emails)
# RESEND_FROM_EMAIL=orders@nayoori.com
```

---

## 📁 Files Created

**Email Template**
- `src/components/email/OrderConfirmationEmail.tsx`

**PDF Invoice**
- `src/lib/invoices/generateInvoice.tsx`
- `src/lib/invoices/utils.ts`

**Notification Service**
- `src/lib/notifications.ts`

**Database Migration**
- `scripts/migration-email-notifications.sql`

**Documentation**
- `EMAIL_NOTIFICATIONS_SETUP.md` (full guide)

---

## ✨ Key Features

✅ Automatic email on successful payment
✅ PDF attachment with invoice
✅ Invoice saved to Supabase Storage
✅ Beautiful responsive design
✅ Professional branding
✅ Error handling & logging
✅ Non-blocking operations
✅ Customizable templates

---

## 🚀 Next Steps

**Immediate**:
1. Get Resend API key
2. Add to `.env.local`
3. Create `invoices` bucket
4. Run database migration
5. Test payment flow

**Later**:
1. Customize email template
2. Add order tracking page
3. Setup custom domain emails
4. Add more email types (shipping, refund, etc.)

---

## 💡 Tips

- **Test emails work in sandbox** - Any email works in Resend sandbox
- **Check spam folder** - Sometimes goes there
- **PDFs take time** - First invoice generation might take a few seconds
- **Resend dashboard** - Monitor all emails sent
- **Database tracking** - Check `orders` table for `invoice_url`

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not received | Check spam, verify API key in .env.local |
| PDF not in email | Check Supabase Storage bucket created |
| Wrong branding | Edit `OrderConfirmationEmail.tsx` |
| Email formatting off | Works differently in each client |

---

## 📊 Check It Worked

**In Supabase SQL Editor**:
```sql
SELECT
  id, email, payment_status,
  invoice_url, paid_at
FROM orders
WHERE payment_status = 'paid'
ORDER BY paid_at DESC
LIMIT 1;
```

You should see `invoice_url` populated with the PDF link!

---

## 🎉 You're All Set!

Email notifications are now live. Every order will automatically:

1. ✅ Send order confirmation email
2. ✅ Generate PDF invoice
3. ✅ Save invoice to cloud
4. ✅ Include download link

**Read** `EMAIL_NOTIFICATIONS_SETUP.md` for customization options.

Happy sending! 📧✨
