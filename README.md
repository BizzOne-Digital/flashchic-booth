# Flashchic Photobooth — Full Stack App (MERN)

```
flashchic/
├── backend/    → Node.js + Express + MongoDB API
└── frontend/   → Next.js 14 Client Website + Admin Panel
```

---

## Quick Start (Local)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env     # Fill in all values
npm run dev              # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local    # Fill in values
npm run dev                    # Runs on http://localhost:3000
```

### 3. Seed the database (first time only)
```
POST http://localhost:5000/api/auth/seed    → Creates admin account
POST http://localhost:5000/api/pricing/seed → Creates default packages (login required)
```
Or use the **Settings** page in the admin panel.

---

## Admin Panel
- URL: `http://localhost:3000/admin/login`
- Login with your `.env` credentials (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

### Admin Features
| Page | What you can do |
|------|-----------------|
| Dashboard | Stats, revenue, upcoming events, recent leads |
| Bookings | View all, update status, copy Stripe payment links |
| Leads | View contact form submissions, update status, add notes |
| Gallery | Upload photos/videos to Cloudinary, feature/delete |
| Pricing | Create/edit/hide packages (live on site) |
| Promotions | Create discount codes (% or fixed $), set expiry |
| Settings | Seed defaults, view config checklist |

---

## Deployment (Vercel)

### Backend
1. Create a new Vercel project → import `backend/` folder
2. Add all `.env` variables in Vercel dashboard
3. Add `vercel.json` in backend root:
```json
{ "version": 2, "builds": [{ "src": "src/server.js", "use": "@vercel/node" }], "routes": [{ "src": "/(.*)", "dest": "src/server.js" }] }
```

### Frontend
1. Create another Vercel project → import `frontend/` folder
2. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
3. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `CLOUDINARY_CLOUD_NAME` | From cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | From Stripe dashboard (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook settings |
| `EMAIL_FROM` | Gmail address |
| `EMAIL_PASS` | Gmail App Password (16 chars) |
| `EMAIL_TO` | Where to receive notifications |
| `FRONTEND_URL` | Your frontend URL |

### Frontend `.env.local`
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key (pk_test_...) |

---

## Stripe Setup
1. Create account at stripe.com
2. Get keys from Dashboard → Developers → API Keys
3. For webhooks: Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://your-backend.vercel.app/api/payments/webhook`
   - Events: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Cloudinary Setup
1. Create account at cloudinary.com (free tier = 25GB)
2. Dashboard → Settings → API Keys
3. Copy Cloud Name, API Key, API Secret

## MongoDB Setup
1. Create cluster at mongodb.com/atlas (free M0)
2. Database Access → Add user
3. Network Access → Allow `0.0.0.0/0`
4. Connect → Copy connection string
