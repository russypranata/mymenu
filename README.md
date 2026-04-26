# 🍽️ MyMenu - Digital Menu SaaS Platform

Platform SaaS untuk UMKM membuat dan mengelola menu digital yang bisa dibagikan via link & QR code.

## ✨ Features

### 👤 Owner Features
- 🏪 **Multi-Store Management** - Kelola beberapa toko dalam satu akun
- 📋 **Menu Management** - CRUD menu dengan foto, harga, deskripsi
- 🏷️ **Category Management** - Organisasi menu berdasarkan kategori
- 🎨 **Theme Customization** - Kustomisasi warna, font, logo, banner
- 📍 **Multi-Location Support** - Kelola beberapa lokasi/cabang per toko
- 📊 **Analytics** - Track page views dan engagement
- 🔗 **QR Code Generator** - Generate QR code untuk setiap toko
- 📱 **Responsive Public Menu** - Menu publik yang mobile-friendly

### 👨‍💼 Admin Features
- 👥 **User Management** - Kelola semua users
- 💳 **Subscription Management** - Kelola trial, active, expired subscriptions
- 🏪 **Store Oversight** - View dan manage semua stores
- 📊 **Platform Analytics** - Overview platform statistics

### 🔒 Security Features
- 🛡️ **Row Level Security (RLS)** - Database-level security
- 🔐 **Multi-layer Auth** - Middleware + Layout guards + Server Actions
- 👤 **Role-based Access Control** - User vs Admin roles
- 🚫 **Suspended User Handling** - Automatic suspension enforcement
- 📝 **Audit Logging** - Track important actions

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 20+ 
- npm/yarn/pnpm
- Supabase account
- Git

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd mymenu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_WHATSAPP=62895338170582

# Fonnte WhatsApp API (Optional)
FONNTE_TOKEN=your-fonnte-token
```

### 4. Setup Supabase

#### A. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy project URL and anon key to `.env.local`

#### B. Run Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run all migrations
supabase db push
```

Or manually run migrations in Supabase SQL Editor:
- Execute files in `supabase/migrations/` in order (001, 002, 003, etc.)

#### C. Setup Storage Buckets

Migrations will automatically create:
- `avatars` - User profile pictures
- `menu-images` - Menu item photos
- `store-assets` - Store logos and banners

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Create Admin User

1. Register a new account
2. In Supabase SQL Editor, run:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 📁 Project Structure

```
mymenu/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register, etc.)
│   │   ├── (dashboard)/       # Owner dashboard
│   │   ├── (admin)/           # Admin panel
│   │   ├── [slug]/            # Public menu pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities & helpers
│   │   ├── actions/          # Server Actions
│   │   ├── queries/          # Database queries
│   │   └── supabase/         # Supabase clients
│   └── types/                # TypeScript types
├── supabase/
│   └── migrations/           # Database migrations
├── middleware.ts             # Next.js middleware
└── src/proxy.ts             # Session refresh logic
```

## 🗄️ Database Schema

### Core Tables
- `profiles` - User profiles (extends auth.users)
- `stores` - Store/restaurant information
- `menus` - Menu items
- `categories` - Menu categories
- `subscriptions` - User subscriptions
- `store_settings` - Store customization settings
- `store_locations` - Store locations/branches
- `analytics` - Analytics events

### Key Features
- ✅ Row Level Security (RLS) on all tables
- ✅ Automatic profile creation on signup
- ✅ Cascade deletes for data integrity
- ✅ Indexes for performance
- ✅ Triggers for business logic

## 🔐 Authentication Flow

1. **Middleware** (`middleware.ts`)
   - Session refresh for protected routes
   - Security headers

2. **Layout Guards** (`(dashboard)/layout.tsx`, `(admin)/layout.tsx`)
   - Auth verification
   - Role checks
   - Suspended user handling
   - Onboarding enforcement

3. **Server Actions** (`lib/actions/*.ts`)
   - Per-action auth checks
   - Ownership verification

4. **Database RLS**
   - Row-level security policies
   - Final security layer

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

Vercel will automatically:
- Build the project
- Deploy to production
- Setup preview deployments for PRs

### Environment Variables in Vercel

Add all variables from `.env.local` to Vercel project settings.

## 🔧 Configuration

### Supabase RLS Policies

All tables have RLS enabled with policies for:
- Users can CRUD their own data
- Admins can manage all data
- Public can read active/published data

### Storage Policies

- `avatars/` - User can upload to own folder
- `menu-images/` - User can upload to own folder
- `store-assets/` - User can upload to own folder
- All buckets are public-readable

## 📊 Subscription System

- **Trial:** 3 days free trial for new users
- **Active:** Paid subscription (Rp 20,000/month)
- **Expired:** Subscription ended (read-only access)
- **Cancelled:** User cancelled subscription

Auto-expiration runs daily via Supabase cron job.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email support@mymenu.id or contact via WhatsApp.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Vercel for hosting platform
- Tailwind CSS for styling system

---

Made with ❤️ for Indonesian UMKM
