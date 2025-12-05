# Blood Management System - Project Structure

## 📁 Project Structure Map

```
hospitalProfile/
│
├── 📂 app/                          # Next.js App Router (Main Application)
│   ├── globals.css                  # ⭐ TAILWIND STYLES - Main CSS file with Tailwind directives
│   ├── layout.tsx                   # Root layout (wraps all pages)
│   ├── page.tsx                     # Home page (redirects to /hospital/stock)
│   │
│   └── 📂 hospital/                 # Hospital routes
│       ├── 📂 stock/
│       │   └── page.tsx            # Stock management page
│       ├── 📂 doctors/
│       │   └── page.tsx            # Doctors management page
│       ├── 📂 requests/
│       │   └── page.tsx            # Blood requests page
│       ├── 📂 settings/
│       │   └── page.tsx            # Settings page
│       └── 📂 logout/
│           └── page.tsx            # Logout page
│
│   └── 📂 api/                      # 🔌 API ROUTES (Create this for backend integration)
│       ├── 📂 stock/
│       │   └── route.ts            # API: /api/stock
│       ├── 📂 doctors/
│       │   └── route.ts            # API: /api/doctors
│       └── 📂 requests/
│           └── route.ts            # API: /api/requests
│
├── 📂 components/                   # Reusable React Components
│   ├── Header.tsx                   # Top header component (search, profile)
│   ├── Sidebar.tsx                  # Left sidebar navigation
│   └── HospitalLayout.tsx           # Main layout wrapper
│
├── 📂 public/                       # Static assets (images, icons, etc.)
│   └── (add your static files here)
│
├── 📂 styles/                       # ❌ NOT USED - Tailwind handles all styles
│   └── (No separate styles folder needed)
│
├── ⚙️ Configuration Files
│   ├── tailwind.config.js           # ⭐ TAILWIND CONFIG - Custom colors & settings
│   ├── postcss.config.js            # PostCSS config (processes Tailwind)
│   ├── next.config.js               # Next.js configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── package.json                 # Dependencies & scripts
│
└── 📄 Other Files
    ├── README.md
    └── .gitignore
```

---

## 🎨 **STYLES LOCATION** (Important for Backend Team)

### **Where Styles Are:**

1. **Main Styles File:**
   - 📄 `app/globals.css` - Contains Tailwind directives and custom component styles
   - This is imported in `app/layout.tsx`

2. **Tailwind Configuration:**
   - 📄 `tailwind.config.js` - Custom colors, theme extensions
   - Defines: primary-red, light-grey, border-grey, text-dark, text-grey, etc.

3. **PostCSS Configuration:**
   - 📄 `postcss.config.js` - Processes Tailwind CSS

4. **Component Styles:**
   - ✅ **NO separate CSS files** - All styles are inline Tailwind classes in `.tsx` files
   - Example: `<div className="bg-[#dc2626] text-white p-5">`

### **Style System:**
- **Framework:** Tailwind CSS v4
- **Method:** Utility-first CSS classes directly in components
- **Custom Colors:** Defined in `tailwind.config.js`

---

## 🔌 **BACKEND INTEGRATION POINTS**

### **Where to Add API Calls:**

1. **API Routes (Recommended):**
   ```
   app/api/
   ├── stock/route.ts          # GET, POST, PUT, DELETE /api/stock
   ├── doctors/route.ts        # GET, POST, PUT, DELETE /api/doctors
   └── requests/route.ts       # GET, POST, PUT, DELETE /api/requests
   ```

2. **Page Components (Current Mock Data):**
   - `app/hospital/stock/page.tsx` - Replace `mockStock` with API calls
   - `app/hospital/doctors/page.tsx` - Replace `mockDoctors` with API calls
   - `app/hospital/requests/page.tsx` - Replace `mockRequests` with API calls

3. **API Client Setup (Recommended):**
   ```
   lib/
   └── api.ts                  # Create API client/axios instance
   ```

---

## 📍 **ROUTES & PAGES**

| Route | File Location | Description |
|-------|--------------|-------------|
| `/` | `app/page.tsx` | Home (redirects to `/hospital/stock`) |
| `/hospital/stock` | `app/hospital/stock/page.tsx` | Blood stock management |
| `/hospital/doctors` | `app/hospital/doctors/page.tsx` | Doctors management |
| `/hospital/requests` | `app/hospital/requests/page.tsx` | Blood requests |
| `/hospital/settings` | `app/hospital/settings/page.tsx` | Settings |
| `/hospital/logout` | `app/hospital/logout/page.tsx` | Logout |

---

## 🛠️ **TECHNOLOGY STACK**

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Custom React components
- **State Management:** React useState (can add Redux/Zustand if needed)

---

## 📦 **KEY DEPENDENCIES**

```json
{
  "next": "14.0.4",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^4.1.17",
  "@tailwindcss/postcss": "^4.x",
  "typescript": "^5"
}
```

---

## 🚀 **HOW TO RUN**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Development URL:** `http://localhost:3000`

---

## 📝 **NOTES FOR BACKEND TEAM**

1. **API Endpoints Needed:**
   - Stock management (CRUD operations)
   - Doctors management (CRUD operations)
   - Blood requests (CRUD operations)
   - Authentication (if needed)

2. **Data Models (Current Mock Structure):**
   - See interfaces in page components for expected data structure
   - All components use TypeScript interfaces

3. **CORS Configuration:**
   - Backend should allow requests from `http://localhost:3000` (dev)
   - Configure CORS for production domain

4. **API Response Format:**
   - Use JSON format
   - Follow RESTful conventions
   - Include proper error handling

5. **Environment Variables:**
   - Create `.env.local` for API base URL
   - Example: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

---

## 📧 **CONTACT & INTEGRATION**

For backend integration:
- API base URL should be configurable via environment variables
- All API calls should be in `app/api/` routes or a separate `lib/api.ts` file
- Current pages use mock data - replace with actual API calls

---

**Last Updated:** December 2024
**Project:** Blood Management System
**Frontend:** Next.js + Tailwind CSS

