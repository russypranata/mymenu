# My Menu - Technical Architecture Plan

## 1. System Overview

```mermaid
graph TB
    subgraph Client
        A[User Browser] --> B[Next.js App]
        C[Admin Browser] --> B
    end
    
    subgraph Hosting
        B --> D[Cloudflare Pages]
    end
    
    subgraph Backend
        D --> E[Supabase Auth]
        D --> F[Supabase Database]
        D --> G[Supabase Storage]
    end
    
    subgraph External
        H[WhatsApp API] --> B
    end
```

## 2. Application Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Next.js Frontend
    participant SB as Supabase
    participant WA as WhatsApp
    
    U->>FE: Visit mymenu.pages.dev/toko-name
    FE->>SB: Query store by slug
    SB-->>FE: Return store + menu data
    FE->>U: Display menu page
    U->>FE: Click Order via WhatsApp
    FE->>WA: Open WhatsApp with pre-filled message
```

## 3. Database Schema

```mermaid
erDiagram
    profiles {
        uuid id PK
        uuid user_id FK
        text email
        text role
        text status
        timestamp created_at
    }
    
    stores {
        uuid id PK
        uuid user_id FK
        text name
        text slug UK
        text description
        text whatsapp
        text address
        timestamp created_at
    }
    
    categories {
        uuid id PK
        uuid store_id FK
        text name
        integer order
        timestamp created_at
    }
    
    menus {
        uuid id PK
        uuid store_id FK
        uuid category_id FK
        text name
        text description
        integer price
        text image_url
        boolean is_active
        integer order
        timestamp created_at
    }
    
    subscriptions {
        uuid id PK
        uuid user_id FK
        text status
        date started_at
        date expires_at
        timestamp created_at
    }
    
    store_settings {
        uuid id PK
        uuid store_id FK
        text logo_url
        text banner_url
        text primary_color
        text theme
        timestamp created_at
    }
    
    analytics {
        uuid id PK
        uuid store_id FK
        text event_type
        json metadata
        timestamp created_at
    }
    
    profiles ||--o| stores : owns
    stores ||--o{ categories : has
    stores ||--o{ menus : has
    categories ||--o{ menus : contains
    profiles ||--o| subscriptions : has
    stores ||--o| store_settings : has
    stores ||--o{ analytics : generates
```

## 4. Authentication Flow

```mermaid
flowchart TD
    A[User visits site] --> B{Authenticated?}
    B -->|No| C[Show login/register]
    B -->|Yes| D{Has store?}
    C --> E[Login/Register]
    E --> F[Create profile]
    F --> D
    D -->|No| G[Create store wizard]
    D -->|Yes| H[Dashboard]
    G --> H
```

## 5. Route Structure

```
app/
├── (public)/
│   ├── page.tsx              # Landing page
│   └── [slug]/
│       └── page.tsx          # Public menu page
│
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx          # User dashboard home
│   ├── store/
│   │   ├── new/
│   │   │   └── page.tsx      # Create store
│   │   └── [id]/
│   │       └── page.tsx      # Edit store
│   ├── menu/
│   │   ├── page.tsx          # Menu list
│   │   ├── new/
│   │   │   └── page.tsx      # Create menu
│   │   └── [id]/
│   │       └── page.tsx      # Edit menu
│   └── settings/
│       └── page.tsx          # Account settings
│
├── (admin)/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Admin dashboard
│   │   ├── users/
│   │   │   ├── page.tsx      # User list
│   │   │   └── [id]/
│   │   │       └── page.tsx  # User detail
│   │   ├── stores/
│   │   │   └── page.tsx      # Store list
│   │   └── subscriptions/
│   │       └── page.tsx      # Subscription mgmt
│   └── layout.tsx            # Admin layout with guard
│
└── api/
    ├── upload/
    │   └── route.ts          # Image upload endpoint
    └── webhook/
        └── payment/
            └── route.ts      # Payment webhook (future)
```

## 6. Component Architecture

```mermaid
graph TD
    subgraph Layout
        A[RootLayout]
        B[DashboardLayout]
        C[AdminLayout]
        D[PublicLayout]
    end
    
    subgraph Auth Components
        E[LoginForm]
        F[RegisterForm]
        G[AuthProvider]
    end
    
    subgraph Dashboard Components
        H[StoreCard]
        I[MenuList]
        J[MenuForm]
        K[CategorySelector]
        L[ImageUploader]
    end
    
    subgraph Public Components
        M[MenuPage]
        N[CategoryFilter]
        O[MenuItem]
        P[WhatsAppButton]
    end
    
    subgraph Admin Components
        Q[UserTable]
        R[StoreTable]
        S[SubscriptionForm]
        T[StatsCard]
    end
    
    A --> B
    A --> C
    A --> D
    B --> H
    B --> I
    B --> J
    C --> Q
    C --> R
    C --> S
    D --> M
    D --> N
    D --> O
    D --> P
```

## 7. Security Model

### Row Level Security (RLS) Policies

```mermaid
flowchart TD
    subgraph profiles
        A[SELECT: User owns OR Admin]
        B[INSERT: Auth user]
        C[UPDATE: User owns OR Admin]
        D[DELETE: Admin only]
    end
    
    subgraph stores
        E[SELECT: Owner OR Admin OR Public by slug]
        F[INSERT: Auth user]
        G[UPDATE: Owner OR Admin]
        H[DELETE: Owner OR Admin]
    end
    
    subgraph menus
        I[SELECT: Store owner OR Admin OR Public]
        J[INSERT: Store owner OR Admin]
        K[UPDATE: Store owner OR Admin]
        L[DELETE: Store owner OR Admin]
    end
```

## 8. API Integration Points

### Supabase Client Setup
- Browser client for client components
- Server client for server components and API routes
- Middleware client for auth guards

### Storage Configuration
- Bucket: `store-images` for logos/banners
- Bucket: `menu-images` for menu item photos
- Public access for read, authenticated for write

## 9. Performance Optimization Strategy

### Database
- Index on `stores.slug` for fast lookup
- Index on `menus.store_id` for menu queries
- Index on `menus.category_id` for filtering
- Index on `menus.is_active` for active items

### Frontend
- Server-side rendering for public pages
- Static generation for landing page
- Client-side caching with React Query
- Image optimization with Next.js Image

### Caching Strategy
```mermaid
graph LR
    A[User Request] --> B{Page Type?}
    B -->|Landing| C[Static/ISR]
    B -->|Public Menu| D[SSR with cache]
    B -->|Dashboard| E[CSR with React Query]
    B -->|Admin| E
```

## 10. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=https://mymenu.pages.dev

# Optional (future features)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 11. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 | Full-stack React |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | shadcn/ui | Accessible components |
| Auth | Supabase Auth | Email/password auth |
| Database | Supabase (PostgreSQL) | Data storage |
| Storage | Supabase Storage | Image hosting |
| Hosting | Cloudflare Pages | Edge deployment |
| Forms | React Hook Form + Zod | Form handling & validation |
| State | React Query | Server state management |

## 12. Development Phases

### Phase 1: MVP (Weeks 1-2)
- Project setup
- Database schema
- Authentication
- Store CRUD
- Menu CRUD
- Public menu page

### Phase 2: Enhanced UX (Week 3)
- Dashboard improvements
- Image upload
- Category management
- WhatsApp integration

### Phase 3: Admin Panel (Week 4)
- Admin dashboard
- User management
- Subscription management
- Store monitoring

### Phase 4: Premium Features (Future)
- Custom branding
- Theme system
- QR Code generator
- Analytics
- Payment gateway

## 13. Success Metrics Tracking

```mermaid
graph TD
    A[User Signup] --> B[Create Store]
    B --> C[Add Menu Items]
    C --> D[Share QR/Link]
    D --> E[Visitor Views]
    E --> F[WhatsApp Clicks]
    F --> G[Conversion to Paid]
    
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#e1f5fe
    style D fill:#fff3e0
    style E fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#c8e6c9
```

## 14. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slug collision | High | Database unique constraint + real-time validation |
| Image abuse | Medium | File size limits, type validation, moderation |
| Performance | Medium | Indexing, caching, CDN |
| Security | High | RLS policies, input validation, sanitization |
| Payment (future) | High | Use established gateway (Midtrans/Xendit) |
