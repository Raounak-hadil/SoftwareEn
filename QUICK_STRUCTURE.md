# 🗺️ Quick Project Structure Map

## 📍 **STYLES LOCATION** ⭐
```
✅ app/globals.css          → Main Tailwind CSS file
✅ tailwind.config.js       → Tailwind configuration (custom colors)
✅ postcss.config.js         → PostCSS configuration
❌ NO separate styles/ folder (Tailwind uses inline classes)
```

## 📂 **FOLDER STRUCTURE**

```
hospitalProfile/
│
├── app/                    # Next.js pages & routes
│   ├── globals.css        ⭐ STYLES HERE
│   ├── layout.tsx
│   ├── page.tsx
│   └── hospital/
│       ├── stock/page.tsx
│       ├── doctors/page.tsx
│       ├── requests/page.tsx
│       ├── settings/page.tsx
│       └── logout/page.tsx
│
├── components/            # React components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── HospitalLayout.tsx
│
├── tailwind.config.js      ⭐ STYLES CONFIG
├── postcss.config.js      ⭐ STYLES PROCESSOR
├── package.json
└── tsconfig.json
```

## 🔌 **BACKEND INTEGRATION**

**Create API routes here:**
```
app/api/
├── stock/route.ts      → /api/stock
├── doctors/route.ts    → /api/doctors
└── requests/route.ts   → /api/requests
```

**Or create API client:**
```
lib/api.ts              → Centralized API calls
```

## 🎨 **STYLING SYSTEM**

- **Framework:** Tailwind CSS v4
- **Main File:** `app/globals.css`
- **Config:** `tailwind.config.js`
- **Method:** Utility classes in components (no separate CSS files)

## 🚀 **RUN PROJECT**

```bash
npm install
npm run dev
# → http://localhost:3000
```

---
**For detailed info, see:** `PROJECT_STRUCTURE.md`

