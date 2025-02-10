# 🛒 FlexiMarket - Modern E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3.0+-blue?style=flat&logo=supabase)](https://supabase.io)
[![Stripe](https://img.shields.io/badge/Stripe-6.0+-purple?style=flat&logo=stripe)](https://stripe.com)

FlexiMarket is a full-stack e-commerce platform featuring:

- 🛍️ **Modern product management system**
- 📝 **Integrated blog platform**
- 🌍 **Multi-language support (EN/GE)**
- 💳 **Secure Stripe payments & subscriptions**
- 🔐 **Supabase authentication**
- 🌙 **Dark/Light theme toggle**

---

## 🌟 Table of Contents
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [File Structure](#file-structure)
- [Development](#development)
- [Important Notes](#important-notes)

## 🚀 Live Demo
Experience FlexiMarket live:  
🔗 [FlexiMarket Live Demo](https://felximarket-5wb9.vercel.app)

## 🔥 Key Features
| Feature Category       | Details                                                                 |
|------------------------|-------------------------------------------------------------------------|
| **Core Commerce**       | Product CRUD, Shopping Cart, Order Management                          |
| **Payments**            | Stripe Checkout, Premium Subscriptions                                 |
| **Content Management**  | Blog System with Image Support                                         |
| **User Management**     | Authentication (Login/Register), Profile Management                    |
| **UI/UX**               | Dark/Light Mode, Multi-language Support, Responsive Design             |
| **Security**            | Image Validation (2MB max), Form Validation, Secure Payment Processing |

## 🛠 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: Supabase (Auth, Database)
- **Payment**: Stripe Integration
- **Localization**: i18n (English/Georgian)
- **State Management**: React Context API

## 🛠 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe & Supabase accounts

### 1. Clone Repository
```bash
git clone https://github.com/DavidTchintcharauli/felximarket.git
cd felximarket

```
### 2. Environment Setup

**Create .env.local with these values:**

```sh

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_APP_URL=your-app-url

```

### 3. Database Setup

**Run these SQL commands in Supabase:**

```sql

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    birth_date DATE,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT[],
    created_at TIMESTAMP DEFAULT now(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL NOT NULL,
    images TEXT[],
    description TEXT NOT NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    total_price DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    status TEXT DEFAULT 'pending'
);

CREATE TABLE premium_users (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE
);

  ```
### 4. Install Dependencies

  ```bash
  npm install
  ```

### 🖥️ Development

  1. **Run the development server using the following command:**
  
  ```bash
  npm run dev
  ```

  2. **Navigate to http://localhost:3000 in your browser.**

---

### File Structure

```plaintext
FlexiMarket/
├── src/
    ├──  app/
         ├── addProduct/
             └── page.tsx
         ├── api/
             ├── auth/
                 └── get-user.ts
             ├── create-checkout-session/
                 └── route.ts
             ├── create-premium-session/
                 └── route.ts
             ├── products/
                 ├── delete/
                     └── route.ts
                 └── route.ts
             ├── stripe/
                 └── webhook.ts
             └── stripe-webhook.ts   
         ├── auth/
            ├── login/
                └── page.tsx
            └── register/
                └── page.tsx
         ├── blogs/
            ├── [id]/
                └── page.tsx
            ├── create/
                └── page.tsx
            ├── edit/
                └── page.tsx
            └── page.tsx        
         ├── cancel/
             ├── page.tsx
             └── profile.ts
         ├── cart/
             └── page.tsx    
         ├── checkout/
             └── page.tsx
         ├── components/
             ├── common/    
                 ├── Header.tsx
                 ├── LanguageButton.tsx
                 └── Loading.tsx
             └── ThemeToggleButton.tsx
         ├── config/
             └── languages.ts
         ├── context/
             ├── AuthContext.tsx
             ├── CartContext.tsx
             └── ThemeContext.tsx
         ├── editProduct/
             └──[id]/
                 └── page.tsx
         ├── locales
             ├── en.json
             └── ka.json
         ├── orders
             └── page.tsx
         ├── premium-success
             └── page.tsx
         ├── products/
             ├── [id]/
                  └── page.tsx
             └── page.tsx
         ├── profile/
             └── page.tsx
         ├── services/
             └── auth.ts
         ├── subscribe/
             └── page.tsx
         ├── success/
             └── page.tsx
         ├── utils/
             ├── supabase/
                 ├── client.ts
                 ├── middleware.ts
                 └── servers.ts
             ├── stripe.js
             └── supabaseClient.js
         ├── global.css
         ├── layout.tsx
         └── page.tsx
    └── i18.ts
```

### ⚠️ **Important Notes**

1. **Environment Variables**
    All .env values must be properly configured with valid API keys

2. **Database Requirements**
    Ensure all required SQL tables are created before running

3. **Stripe Webhooks**
    Configure webhook endpoints in Stripe dashboard

3. **Image Uploads**
    Maximum image size enforced at 2MB