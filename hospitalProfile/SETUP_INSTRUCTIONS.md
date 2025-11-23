# Quick Setup Instructions

## Step-by-Step Guide to Run the Project

### 1. Install Node.js (if not already installed)
- Download from: https://nodejs.org/
- Install the LTS version
- Verify installation by opening terminal and typing: `node --version`

### 2. Open Terminal in Project Folder
- Navigate to: `C:\Users\asus\Desktop\ensia\New folder`
- Or right-click in the folder and select "Open in Terminal" / "Open PowerShell here"

### 3. Install Dependencies
Run this command:
```bash
npm install
```
Wait for it to finish (may take 2-5 minutes)

### 4. Start the Development Server
Run this command:
```bash
npm run dev
```

### 5. Open in Browser
- Look for a message like: "Ready on http://localhost:3000"
- Open your browser and go to: http://localhost:3000
- The website should load!

### 6. Navigate the Application
- **Doctors**: Click "Doctors" in the sidebar
- **Requests**: Click "Requests" in the sidebar  
- **Stock**: Click "Stock" in the sidebar (default page)

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Need Help?

If you encounter any errors:
1. Make sure Node.js is installed: `node --version`
2. Make sure you're in the correct folder
3. Try deleting `node_modules` folder and running `npm install` again
4. Check that port 3000 is not being used by another application

