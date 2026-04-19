<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-API-4285F4?style=for-the-badge&logo=google&logoColor=white" />
</p>

# 🚀 Creatdiv — AI-Powered Content & Image Platform

A production-grade, full-stack SaaS application that leverages **Google Gemini AI** and **Hugging Face** to provide AI content rewriting, article generation, SEO optimization, image generation, and resume analysis — wrapped in a premium dark editorial UI with cinematic GSAP animations.

> **Built to demonstrate full-stack product thinking** — not just "making it work," but shipping a polished, scalable, and delightful user experience.

---

## ✨ Key Features

### 🤖 AI Content Engine
- **Rewrite** — Transform text into Professional, Casual, Enthusiastic, Concise, or Expanded tones
- **Expand / Shorten** — Intelligently lengthen or condense content
- **Article Generator** — Generate full articles from topic prompts
- **SEO Content** — Auto-generate meta titles, descriptions, and keywords

### 🖼️ AI Image Studio
- Text-to-image generation via Hugging Face Inference API
- Multiple resolution options (512×512 to 1024×1024)
- "Surprise Me" random prompt generator
- Image download with blob conversion
- Full generation history with gallery view

### 📄 Resume Rater
- PDF upload and AI-powered resume analysis
- Radar chart skill breakdown (Structure, Impact, Keywords, Technical)
- Radial gauge score visualization
- Strengths, improvements, and ATS tips
- LaTeX code export for optimized resumes

### 🔐 Authentication
- JWT-based auth with httpOnly best practices
- Protected routes with automatic redirect
- Persistent sessions via localStorage
- Registration with password strength meter

---

## 🎨 Design & UX

The frontend uses a **dark editorial design system** inspired by premium SaaS platforms:

| Token | Value |
|---|---|
| Background | `#060a13` (deep navy) |
| Cards | Glassmorphism (`bg-white/[0.04]` + `backdrop-blur`) |
| Borders | `border-white/10` — translucent |
| Accent | Purple → Blue gradient |
| Typography | System font stack, tracking-tight headings |

### Motion Design (GSAP)
- **Page entrances** — Fade-up with stagger via reusable `usePageEntrance` hook
- **ScrollTrigger** — Feature cards, video parallax, CTA sections
- **Micro-interactions** — Magnetic card tilt, dice spin, button scale
- **State transitions** — Blur-reveal for AI results, skeleton loaders

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework with React Compiler |
| **Vite 7** | Build tool with `@/` path aliases |
| **Tailwind CSS 4** | Utility-first styling |
| **GSAP 3** | Animation engine (ScrollTrigger, timelines) |
| **React Hook Form + Zod** | Form management & validation |
| **Recharts** | Data visualization (radar/radial charts) |
| **Framer Motion** | Layout animations |
| **Axios** | HTTP client with interceptors |
| **Lucide React** | Icon system |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **Google Gemini AI** | Content generation & resume analysis |
| **Hugging Face** | Image generation |
| **Cloudinary** | Image hosting & CDN |
| **JWT + bcrypt** | Authentication |
| **Multer** | File upload handling (resume PDFs) |
| **Zod** | Server-side request validation |

---

## 📁 Project Architecture

```
cms-generator/
├── frontend/
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── ui/             # GlassCard, PageShell, GradientButton, etc.
│       │   ├── auth/           # LoginForm, SignUpForm, ProtectedRoute
│       │   ├── home/           # Hero, RewriteSection, WorkFlowDemo
│       │   ├── content/        # RewriteHistory
│       │   ├── nav/            # Nav
│       │   └── preloader/      # Preloader
│       ├── pages/              # Route-level page components
│       ├── hooks/              # Custom hooks (usePageEntrance, useFormAnimation)
│       ├── services/           # API service layer with centralized endpoints
│       ├── constants/          # App configuration (content pages, image resolutions)
│       ├── context/            # React Context (AuthProvider)
│       ├── utils/              # Utility functions (downloadImage, handleCopy)
│       ├── App.jsx             # Route definitions + ErrorBoundary + lazy loading
│       ├── api.js              # Axios instance with auth interceptor
│       └── main.jsx            # Entry point
│
├── backend/
│   ├── controllers/            # Route handlers (auth, content, image, resume)
│   ├── models/                 # Mongoose schemas (User, Content, Image)
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # Auth middleware (JWT verification)
│   ├── db.js                  # MongoDB connection
│   ├── constant.js            # AI prompts & configuration
│   └── index.js               # Server entry point
│
└── README.md
```

---

## 🏗️ Architecture Decisions

| Decision | Why |
|---|---|
| **Lazy-loaded routes** | Code splitting — each page loads on demand, reducing initial bundle |
| **Centralized API endpoints** | Single source of truth prevents URL string drift across services |
| **Reusable UI primitives** (`GlassCard`, `PageShell`, `GradientButton`) | DRY principle — eliminates 500+ lines of repeated Tailwind classes |
| **Custom GSAP hooks** (`usePageEntrance`, `useFormAnimation`) | Encapsulates animation logic, prevents duplication across 6+ pages |
| **Derived auth state** | `isAuthenticated` is computed from `token` — not a separate `useState` that can desync |
| **Vite `@/` alias** | Clean imports (`@/services/auth`) instead of fragile relative paths (`../../../services/auth`) |
| **ErrorBoundary** | Catches render crashes and shows a dark-themed fallback instead of white-screening |
| **`services/` inside `src/`** | Prevents reverse-direction imports (`../src/api`) that break in production |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key
- Hugging Face API token
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/saketgoswami09/cms-genrator.git
cd cms-genrator
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
HF_TOKEN=your_huggingface_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔄 Application Flow

```
User lands on Home → Sees animated hero + feature cards
        ↓
Signs Up / Logs In → JWT token stored
        ↓
Selects a Tool (Content / Image / Resume)
        ↓
Frontend validates input (Zod) → Sends to Express API
        ↓
Backend processes via Gemini AI / Hugging Face
        ↓
Result animated into view (GSAP blur-reveal)
        ↓
User can Copy / Download / Regenerate
        ↓
History saved to MongoDB for future reference
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/auth/sign-up` | User registration |
| `POST` | `/v1/auth/sign-in` | User login |
| `POST` | `/v1/content/rewrite` | Rewrite content with tone |
| `POST` | `/v1/content/expand` | Expand content |
| `POST` | `/v1/content/shorten` | Shorten content |
| `POST` | `/v1/content/article` | Generate article |
| `POST` | `/v1/content/seo-content` | Generate SEO metadata |
| `GET` | `/v1/content/history` | Get content history |
| `DELETE` | `/v1/content/history/:id` | Delete history item |
| `POST` | `/v1/image/generate` | Generate image from prompt |
| `GET` | `/v1/image/history` | Get image history |
| `POST` | `/v1/resume/analyze` | Analyze resume PDF |

---

## 🧪 Error Handling

- **Client-side** — Zod schema validation on all forms
- **API errors** — Graceful toast notifications with error context
- **Render crashes** — ErrorBoundary catches exceptions, shows recovery UI
- **Loading states** — Skeleton loaders and spinners reduce perceived wait time
- **Empty states** — Custom illustrations with clear CTAs

---

## 🙌 Author

**Saket Goswami**
Full-Stack Developer — focused on building calm, high-quality user experiences with strong product thinking.