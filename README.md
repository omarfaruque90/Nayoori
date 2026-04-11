Nayoori - Premium E-commerce Platform
Project Overview
Nayoori is a luxury fashion e-commerce platform built with Next.js and Supabase.

Recent Updates & Features
• Dynamic Branding System: Fully integrated favicon and logo management via Admin Dashboard.

• Client-Side Favicon Guard: Implemented a custom injector to bypass aggressive browser caching.

• Legal Infrastructure: Added professional Privacy Policy and Terms & Conditions pages compliant with Bangladesh e-commerce regulations.

• Refined UI: Clean, minimalist footer with professional developer credit ("Architected by Omar The Bhaijan") linked to portfolio.

Tech Stack & Installations
• Framework: Next.js 14+ (App Router)

• Database & Auth: Supabase

• Styling: Tailwind CSS, Lucide React

• Icons: Custom dynamic icons with cache-busting logic.

Getting Started
1. Clone the repository: `git clone <repo-url>`

2. Install dependencies: `npm install`

3. Environment Variables: Setup `.env.local` with Supabase URL and Anon Key.

4. Run development server: `npm run dev`

Key Files
• `src/app/layout.tsx`: Root layout with dynamic metadata and FaviconInjector.

• `src/components/layout/Footer.tsx`: Updated minimalist footer.

• `src/app/privacy-policy/page.tsx`: Legal documentation.

• `src/app/terms-and-conditions/page.tsx`: Legal documentation.
