# Flashchic Photobooth — Vercel Deployment Guide

## Structure
```
flashchic/
├── backend/    → Deploy as separate Vercel project
└── frontend/   → Deploy as separate Vercel project
```

---

## STEP 1 — Push to GitHub

Create 2 separate GitHub repos (or use one with 2 folders):

**Option A — 2 repos (recommended):**
- `flashchic-backend` → upload `backend/` folder contents
- `flashchic-frontend` → upload `frontend/` folder contents

**Option B — 1 repo:**
- Push entire `flashchic/` folder
- On Vercel, set Root Directory to `backend` or `frontend`

---

## STEP 2 — Deploy Backend on Vercel

1. Go to vercel.com → New Project
2. Import your `flashchic-backend` repo
3. **Root Directory:** `./` (or `backend/` if using single repo)
4. **Framework:** Other
5. **Build Command:** `npm install`
6. **Output Directory:** leave empty
7. **Install Command:** `npm install`

### Backend Environment Variables (add in Vercel Settings):
```
NODE_ENV=production
MONGO_URI=mongodb+srv://bizzone:bizzone@cluster0.bwpdzae.mongodb.net/flashbooth?retryWrites=true&w=majority
JWT_SECRET=flashchic_super_secret_jwt_2024_change_this
JWT_EXPIRE=7d
ADMIN_EMAIL=flashchic84@gmail.com
ADMIN_PASSWORD=Admin@Flashchic2024
CLOUDINARY_CLOUD_NAME=difmil8wj
CLOUDINARY_API_KEY=811689931119213
CLOUDINARY_API_SECRET=7RKM-2JD7yRkq-czw_VYuF5TFww
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
EMAIL_FROM=flashchic84@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
EMAIL_TO=flashchic84@gmail.com
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
```

8. Deploy → note your backend URL e.g. `https://flashchic-backend.vercel.app`

---

## STEP 3 — Deploy Frontend on Vercel

1. Go to vercel.com → New Project
2. Import your `flashchic-frontend` repo
3. **Root Directory:** `./` (or `frontend/` if using single repo)
4. **Framework:** Next.js (auto-detected)

### Frontend Environment Variables (add in Vercel Settings):
```
NEXT_PUBLIC_API_URL=https://flashchic-backend.vercel.app/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

5. Deploy

---

## STEP 4 — Update Backend FRONTEND_URL

After frontend deploys:
1. Go to Backend Vercel project → Settings → Environment Variables
2. Update `FRONTEND_URL` to your actual frontend URL
3. Redeploy backend

---

## STEP 5 — Seed Database (one time)

After both are deployed, open browser or Postman:

```
POST https://flashchic-backend.vercel.app/api/auth/seed
```
This creates your admin account.

Then login at: `https://YOUR-FRONTEND.vercel.app/admin/login`
- Email: flashchic84@gmail.com
- Password: Admin@Flashchic2024

Then in admin → Settings → click:
- "Seed Default Pricing"
- "Seed Default Add-Ons"

---

## STEP 6 — Stripe Webhook (for payment confirmation)

1. Go to stripe.com → Dashboard → Developers → Webhooks
2. Add endpoint: `https://flashchic-backend.vercel.app/api/payments/webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` in backend Vercel env
5. Redeploy backend

---

## Common Issues

**CORS error:** Make sure `FRONTEND_URL` in backend env exactly matches your frontend Vercel URL (no trailing slash)

**Images not loading:** Add your backend domain to `next.config.js` remotePatterns if needed

**Build fails:** Check that all env variables are set in Vercel dashboard

**Admin login not working:** Make sure backend is deployed and `NEXT_PUBLIC_API_URL` points to correct backend URL
