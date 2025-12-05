# Blood Management System - Hospital Profile

A comprehensive blood management system built with Next.js and CSS, designed for hospital administrators to manage blood stock, doctors, requests, and donators.

## Features

### Hospital Profile Pages

1. **Doctors Page** (`/hospital/doctors`)
   - View all doctors in the hospital
   - View doctor profiles with contact information
   - Message doctors directly
   - Add new doctors to the hospital

2. **Requests Page** (`/hospital/requests`)
   - **Doctor Requests Tab**: View and manage blood requests from doctors
   - **Other Hospitals Requests Tab**: View and respond to requests from other hospitals
   - **Forever Donators Tab**: View forever donators and request blood from them
   - Request blood from other hospitals
   - Approve/reject requests
   - Contact forever donators via phone or SMS

3. **Stock Page** (`/hospital/stock`)
   - **Stock Tab**: View current blood stock by type with quantities and differences
   - **Donators Tab**: View regular donators and schedule donations
   - **Forever Donators Tab**: View forever donators and request blood immediately
   - Schedule donators by date and time
   - Contact donators (call/SMS for forever donators)

## Getting Started

### Prerequisites

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** package manager

### Installation & Running

1. **Open Terminal/Command Prompt** in the project directory:
   ```bash
   cd "C:\Users\asus\Desktop\ensia\New folder"
   ```

2. **Install dependencies** (this will install all required packages):
   ```bash
   npm install
   ```
   
   This may take a few minutes. Wait for it to complete.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

   The application will automatically redirect to `/hospital/stock` page.

### Troubleshooting

**If you get errors about missing modules:**
- Make sure you ran `npm install` first
- Delete `node_modules` folder and `package-lock.json` (if exists), then run `npm install` again

**If port 3000 is already in use:**
- The terminal will show you a different port (like 3001)
- Use that port instead in your browser

**If TypeScript errors appear:**
- These are usually just warnings and won't prevent the app from running
- The app should still work fine in the browser

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (redirects to stock)
│   └── hospital/
│       ├── doctors/
│       │   └── page.tsx     # Doctors management page
│       ├── requests/
│       │   └── page.tsx     # Requests management page
│       └── stock/
│           └── page.tsx     # Stock and donator management page
├── components/
│   ├── Header.tsx           # Top header component
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── HospitalLayout.tsx   # Layout wrapper for hospital pages
└── package.json
```

## Design Features

- Clean, modern UI matching the provided design
- Red color scheme for primary actions and active states
- Responsive sidebar navigation
- Modal dialogs for forms and actions
- Status badges for request states
- Card-based layout for doctors
- Table-based layout for requests and stock

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **CSS** - Custom styling matching the design
- **React Hooks** - State management

## Future Enhancements

- Backend API integration
- Authentication and authorization
- Real-time notifications
- Database integration
- Email/SMS service integration
- Advanced filtering and search
- Analytics and reporting

## License

This project is created for educational purposes.

