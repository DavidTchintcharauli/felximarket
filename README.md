# 🛒 FlexiMarket - E-Commerce Platform

FelxiMarket is a modern e-commerce platform built with **Next.js + Supabase + Stripe**, featuring:  

- 🛍 **Product Management** (Add, Edit, Delete)
- 📝 **Blog System** (Create & Edit Blog Posts)
- 🛒 **Shopping Cart & Order Management**
- 💳 **Premium Subscriptions via Stripe**
- 🔐 **User Authentication (Supabase)**
- 🌍 **Multi-language Support (English/Georgian)**
- 🌙 **Dark/Light Mode Theme Toggle**
- 📦 **Image Upload with Validation (Max 2MB)**
- ✅ **Secure Checkout & Payment System**

---

## Table of Contents
- [Overview](#overview)
- [Features](#Features)
- [FileStructure](#File Structure)
- [Installationandlaunch](#Installation and launch)
- [Cloningaproject](#Cloning a project)
- [MainFeatures](#Main Features)
- [Note](#Note)
- [LiveDemo](#Live Demo)
- [Installation](#Installation)
- [DevelopmentServer](#Development Server)

## 🌟 Overview  
A full-stack e-commerce solution with:  
- **Supabase Authentication** 🔐  
- **Stripe Checkout & Subscriptions** 💳  
- **Multi-language Support** (English/Georgian) 🌐  
- **Reactive UI** with Tailwind CSS  

---

## 🚀 Features  
- **Product Management**: Add/edit/delete products  
- **Blog System**: Create/edit blog posts with images  
- **Shopping Cart & Orders** 🛒  
- **Premium Subscriptions** via Stripe  
- **User Authentication** (Login/Register) 🔑  
- **Dark/Light Theme Toggle** 🌙/☀️  
- **Image Upload** with validation (max 2MB)  
- **Form Validation** & error feedback  

---

## File Structure

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

## 📥 **Installation and launch (Setup Guide)**

**To get started with the project locally, follow these steps:**

### **1️⃣. Cloning a project**

```sh

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_APP_URL=your-app-url

```

** This project requires the following tables to be created in Supabase. Follow the instructions below to set up the database. **

** Run the following SQL queries in the Supabase SQL Editor or your preferred PostgreSQL client:  **
```sh

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

## 🛠 Main Features
- 🔐 **✅ Auth & Authentication: Supabase Authentication**
- 🛍 **✅ Product Management: Add, Edit, Delete**
- 🛒 **✅ Ordering System: Cart & Payment with Stripe**
- 💳 **✅ Premium Subscriptions: Stripe Subscriptions**
- 📝 **✅ Blog Creation & Editing**
- 🌍 **✅ Multilingual Support (i18n)**
- 🧑‍💼 **✅ User Profile & Theme Change**

##✅ **Note:**
- You can change the **GitHub link** to your project.
- **The variables in the **`.env.local`** file **must** be filled in correctly.
- **Supabase** tables **SQL scripts** are required** to **create** the tables**.

## 🚀 Live Demo

You can see the demo version of the project here: 
🔗 **[FlexiMarket Live](https://felximarket-pxln.vercel.app)**

## Installation

**To get started with the project locally, follow these steps:**

1. **Clone the repository:**

  ```bash
  git clone https://github.com/DavidTchintcharauli/felximarket.git
  ```
   
2. **Navigate into the project directory:**

  ```bash
  cd felximarket
  ```

3. **Install the project dependencies:**
  ```bash
  npm install
  ```
## Development Server
  1. **Run the development server using the following command:**
  
  ```bash
  npm run dev
  ```
  2. **Navigate to http://localhost:3000 in your browser.**