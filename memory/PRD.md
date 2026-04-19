# CircleSite — Premium Redesign PRD

## Original Problem
User: "https://www.circlesite.uk/ That is my current website, take this and make it better"

## User Preferences (verbatim)
- Look PREMIUM but also SIMPLE (user sells websites, so site must look premium)
- Add more sections (portfolio, testimonials, FAQ, process)
- Contact form: email hello@circlesite.uk via Resend
- Keep logo, contact details, WhatsApp number (+44 7494 852204)
- Want a better floating WhatsApp button

## Personas
- UK small business owners (cafés, trades, shops, services)
- Looking for an affordable, no-nonsense professional website

## Tech Stack
- Frontend: React 19 + Tailwind + Framer Motion + Phosphor Icons
- Backend: FastAPI + MongoDB (Motor)
- Email: Resend (API key not yet supplied — DB fallback in place)

## Design System (Warm Editorial Luxury)
- Palette: Ivory #FDFBF7, Sand #F4EFE6, Ink #0A1128, Gold #C49A45
- Typography: Playfair Display (serif headings) + Outfit (body)
- Motion: scroll-triggered reveals, marquee, tracing beam on featured pricing, floating WhatsApp with ping

## Implemented (Jan 2026)
- Sticky glass nav with mobile toggle
- Hero with parallax image, italic serif accent word, marquee brand row
- Bento-grid Features section (TrendUp / ChatCircleDots / Lightning + stat card)
- 4-step Process timeline with large gold numerals
- Portfolio grid (3 case-study cards with zoom-on-hover)
- Testimonials (3-card staggered masonry with star ratings)
- Pricing (3 tiers on dark ink bg, Standard has animated tracing-beam border)
- FAQ accordion (6 questions)
- Contact form (Name/Email/Message) → POST /api/contact
  - Saves to MongoDB `contact_submissions`
  - Sends email via Resend when RESEND_API_KEY is set
  - Uses reply_to header so user can just Reply in inbox
- Footer with logo, nav, email, WhatsApp
- Floating WhatsApp button with animated ping, popup card, CTA link

## Backend APIs
- GET /api/ — health ping
- GET /api/health — { status, resend_configured, recipient }
- POST /api/contact — submit enquiry (stores + emails)
- GET /api/contact/submissions — admin listing

## Test Results (iteration_1)
- Backend: 10/10 passed
- Frontend: 15/15 features working
- Design note: one portfolio mockup image shows a blank laptop — could swap for a richer mockup later

## Backlog / Next
- P1: Add RESEND_API_KEY to .env to activate email delivery
- P1: Verify sender domain at resend.com (currently using onboarding@resend.dev default)
- P2: Swap first portfolio image for a richer mockup
- P2: Add real client logos / trust badges row
- P2: Blog / case study detail pages
- P3: Cookie banner + privacy policy page (GDPR for UK)
