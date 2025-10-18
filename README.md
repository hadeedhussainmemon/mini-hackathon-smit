# PitchCraft — Tumhara AI Startup Partner

PitchCraft is a small demo app that helps students and founders turn a simple startup idea into a polished pitch using React, Firebase (or Supabase), and Google Gemini (Generative Language API).

This README is bilingual (English + Roman Urdu) and focuses on setup, Gemini integration, debugging, and local development on Windows.

---

## Quick summary — kya hai? (English + Roman Urdu)

- PitchCraft ek AI-powered tool hai jo startup ideas se name, tagline, elevator pitch, problem/solution, target audience, aur landing page content generate karta hai.
- Built with React (Vite), Tailwind, Firebase (Auth + Firestore) and Google Gemini for generation.

---

## What you'll find in the repo

- `server/` — small Node/Express proxy that calls Google's Generative Language API (safe place for server-side API key)
- `src/` — React frontend (CreatePitch, Generated, Dashboard, etc.)
- `lib/` — helpers for Azure/Firebase and server-side Gemini wrapper
- `functions/` — (optional) Firebase Functions implementation

---

## Prerequisites

- Node.js 18+ and npm on your machine
- A Google Cloud project with the Generative Language API enabled and a valid API key
- Optional: Firebase project for Auth + Firestore (or Supabase)

---

## Environment variables (.env)

Create a `.env` file in the project root (do NOT commit it). Example keys the project expects:

```env
# Frontend (Vite) - public keys only
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE=http://localhost:4000

# Server-side Gemini key (keep this secret!)
GEMINI_API_KEY=YOUR_SERVER_SIDE_GEMINI_API_KEY
# Optionally override model name returned by the API list
# Example: models/gemini-2.5-flash
GEMINI_MODEL=models/gemini-2.5-flash
```

Roman Urdu: `.env` file banao aur apni keys wahan dal do. Server key kabhi client mein expose mat karo.

---

## Local development (Windows cmd.exe)

1) Install dependencies:

```bat
npm install
```

2) Start the server proxy (it will load `.env`):

```bat
npm run start:server
# or directly
node server/index.js
```

You should see a masked key log and model info:
```
GEMINI_API_KEY loaded (masked): ********1234
Using Gemini model: models/gemini-2.5-flash (override with GEMINI_MODEL env var)
Gemini proxy server listening on port 4000
```

3) Start the frontend (Vite):

```bat
npm run dev
```

Open `http://localhost:3000` (or the port Vite prints).

---

## Gemini troubleshooting and model issues

If the server returns a 404 mentioning `models/gemini-1.5-flash is not found`, it means the model your code tried isn't available to your API key. To debug:

1) Call the models list endpoint we added:

```bat
# from a second terminal while server is running
node -e "fetch('http://localhost:4000/api/models').then(r=>r.json()).then(j=>console.log(JSON.stringify(j,null,2))).catch(e=>console.error(e))"
```

2) Look for `models/<name>` entries like `models/gemini-2.5-flash` and set `GEMINI_MODEL` to one of those exact names.

3) Restart the server and retry generation.

If you get `API_KEY_INVALID`:
- Rotate the API key in Google Cloud Console
- Ensure Generative Language API is enabled for your project
- Check API key restrictions (temporarily remove restrictions during local testing)
- Ensure billing is enabled for the Google project

Security note: If a key has been posted publicly, rotate/delete it immediately and never commit `.env`.

---

## Why we use a server proxy

- Generative Language API keys must be kept secret. The server proxy calls Google and returns a cleaned JSON payload that the frontend can consume.
- The server also cleans fences (```json) when parsing Gemini responses and offers a `/api/models` debug endpoint.

---

## Frontend debug tips

- If `/generated` is blank, we added debug helpers:
  - After generation, the client sets `window.__lastGeneratedPitch` (open Console and inspect)
  - The Generated page exposes `window.__currentPitch` when rendered
  - We also persist the last pitch to `localStorage.lastPitch` so the Generated page recovers if the in-memory state is lost (for hot-reload/dev)

To inspect in browser console:

```js
console.log(window.__lastGeneratedPitch)
console.log(window.__currentPitch)
localStorage.getItem('lastPitch')
```

---

## Production notes

- Use Cloud Secret Manager or Firebase Functions secrets to store `GEMINI_API_KEY` in production — do not use `.env` in hosted environments.
- Restrict API keys properly (IP or service restriction) once deployed.
- Consider migrating the server proxy to a serverless function (Vercel serverless, Firebase Functions) and read the secret from secure storage.

---

## Example flow (developer)

1) Start server: `npm run start:server`
2) Start frontend: `npm run dev`
3) Open `http://localhost:3000`
4) Create pitch and inspect devtools for logs

---

## License & Contributing

Open source — MIT. Contributions welcome.

---

If you want, I can also:
- Add a small CLI script to rotate/search for a valid `GEMINI_MODEL` automatically
- Make the server fallback to the first supported `generateContent` model it finds (safe but should be explicit)

If you want the README translated into full Roman Urdu sections I can expand the translations.

# 💼 PitchCraft – Tumhara AI Startup Partner

[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5-blue?logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

**PitchCraft** is an AI-powered startup pitch generator that helps students and aspiring founders create professional pitches in minutes. Built with React, Firebase, and Google's Gemini AI.

**Roman Urdu:** PitchCraft ek AI-powered tool hai jo students aur founders ko unke startup ideas ke liye professional pitches banane mein madad karta hai — sirf kuch minutes mein! 🚀

Note: This workspace has been converted to JavaScript (no TypeScript). Files under `pages/`, `lib/`, and `store/` are implemented in JS/JSX.

---

## 🎯 Features | خصوصیات

### ✨ Core Features
- 🤖 **AI-Powered Generation**: Gemini 1.5 Flash integration for instant pitch creation
- 🎨 **Complete Pitch Package**: Names, taglines, elevator pitches, problem/solution statements
- 👥 **Target Audience Analysis**: AI-generated customer personas
- 💬 **Landing Page Content**: Ready-to-use website copy
- 🎨 **Branding Suggestions**: Color palettes and logo ideas
- 📄 **PDF Export**: Download your pitches as professional PDFs
- 🔄 **Regenerate Content**: Refine any section with one click
- 🌐 **Bilingual Interface**: English + Roman Urdu support

### 🔐 Security & Auth
- 🔒 Firebase Authentication (Email/Password)
- 👤 User-specific pitch storage
- 🛡️ Protected routes and secure API keys

---

## 🧩 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Firebase (Auth + Firestore) |
| **AI Engine** | Google Gemini 1.5 Flash |
| **State Management** | Zustand |
| **PDF Generation** | jsPDF |
| **Icons** | React Icons |

---

## 🚀 Quick Start | Jaldi Shuru Karein

### Prerequisites | Zaroori Cheezein

```bash
# Node.js 18+ aur npm installed hona chahiye
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/pitchcraft.git
cd pitchcraft
```

**Roman Urdu:** Repository ko clone karo aur folder mein jao.

### 2️⃣ Install Dependencies

```bash
npm install
```

**Roman Urdu:** Sab packages install karo — thoda time lag sakta hai ☕

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```cmd
copy .env.example .env
```

Then fill in your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Roman Urdu:** `.env.local` file banao aur apne Firebase aur Gemini API keys dalo.

---

## 🔑 Getting API Keys | API Keys Kaise Hasil Karein

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Authentication** → Email/Password
4. Create **Firestore Database** (Start in production mode)
5. Go to **Project Settings** → Copy your config values

**Roman Urdu:**
1. Firebase Console par jao
2. Naya project banao
3. Authentication aur Firestore Database enable karo
4. Project Settings se config copy karo

### Gemini AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Get API Key**
3. Create or select a project
4. Copy your API key

**Roman Urdu:**
1. Google AI Studio par jao
2. API Key banao
3. Key copy karke `.env.local` mein paste karo

---

## 🎨 Firebase Firestore Rules

Add these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Pitches collection
    match /pitches/{pitchId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 💻 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Roman Urdu:** Development server chalayen aur browser mein `localhost:3000` kholen.

---

## 📁 Project Structure

```
pitchcraft/
├── pages/
│   ├── index.tsx          # Landing page
│   ├── login.tsx          # Login page
│   ├── register.tsx       # Registration page
│   ├── dashboard.tsx      # User dashboard
│   ├── create.tsx         # Create pitch form
│   ├── generated.tsx      # Generated pitch display
│   ├── pitch/[id].tsx     # Individual pitch view
│   ├── _app.tsx           # App wrapper
│   └── _document.tsx      # HTML document
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── auth.ts            # Authentication logic
│   ├── gemini.ts          # Gemini AI integration
│   └── database.ts        # Firestore operations
├── store/
│   └── useStore.ts        # Zustand global state
├── styles/
│   └── globals.css        # Global styles
├── public/                # Static assets
├── .env.example           # Environment template
└── package.json           # Dependencies
```

---

## 🎯 How to Use | Kaise Use Karein

### Step 1: Register | Sign Up Karein
1. Open the app
2. Click **Sign Up**
3. Enter your name, email, and password
4. Click **Create Account**

**Roman Urdu:** App kholo → Sign Up karo → Apna naam, email aur password dalo → Account banao

### Step 2: Create a Pitch | Pitch Banao
1. Go to **Dashboard**
2. Click **Create New Pitch**
3. Enter your startup idea (2-5 sentences)
4. Select your industry
5. Choose a tone (Formal/Professional/Fun)
6. Click **Generate Pitch**

**Roman Urdu:** Dashboard par jao → Create New Pitch button dabao → Apna idea likho → Industry aur tone select karo → Generate Pitch dabao

### Step 3: Review & Edit | Dekho Aur Edit Karo
- View your generated pitch
- Copy any section with one click
- Regenerate individual sections if needed
- Export as PDF

**Roman Urdu:** Generated pitch dekho → Koi bhi section copy karo → Agar pasand nahi aya to regenerate karo → PDF export karo

---

## 🚀 Deployment | Deploy Kaise Karein

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables from `.env.local`
5. Click **Deploy**

```bash
# Install Vercel CLI (Optional)
npm i -g vercel

# Deploy
vercel
```

**Roman Urdu:**
1. Code ko GitHub par push karo
2. Vercel par jao aur repository import karo
3. Environment variables add karo
4. Deploy button dabao

### Firebase Hosting (Alternative)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can register with email/password
- [ ] User can login
- [ ] User can create a pitch
- [ ] AI generates complete pitch data
- [ ] User can view saved pitches
- [ ] User can delete pitches
- [ ] PDF export works correctly
- [ ] Regenerate feature works

---

## 📊 Database Models

### User Model
```typescript
{
  uid: string;
  email: string;
  name: string;
  createdAt: string;
}
```

### Pitch Model
```typescript
{
  id: string;
  userId: string;
  ideaData: {
    idea: string;
    industry: string;
    tone: 'formal' | 'fun' | 'professional';
  };
  pitchData: {
    startupName: string;
    tagline: string;
    elevatorPitch: string;
    problemStatement: string;
    solutionStatement: string;
    targetAudience: string;
    uniqueValueProposition: string;
    landingPageHero: string;
    colorPalette: string[];
    logoIdeas: string;
  };
  createdAt: string;
}
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: Firebase errors
**Solution:** Make sure all Firebase config values are correct in `.env.local`

**Roman Urdu:** Firebase errors aye to `.env.local` file check karo — sab keys sahi honi chahiye

### Issue 2: Gemini API errors
**Solution:** Check if your API key is valid and has billing enabled

**Roman Urdu:** Gemini API nahi chal rahi? API key check karo aur billing enable karo

### Issue 3: Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## 🎨 Customization | Customize Karein

### Change Theme Colors
Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      },
    },
  },
}
```

### Add More Industries
Edit `pages/create.tsx` and add options to the industry dropdown.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Support | Madad Chahiye?

**Roman Urdu:** Koi problem hai? GitHub issues mein pooch sakte ho!

**English:** Have questions? Feel free to open an issue on GitHub!

---

## 🌟 Features Coming Soon

- [ ] Google/Facebook OAuth
- [ ] Pitch comparison tool
- [ ] Team collaboration
- [ ] Presentation slides generator
- [ ] Video pitch script generator
- [ ] Investor contact suggestions

---

## 📞 Contact

- **Email:** your-email@example.com
- **GitHub:** [@hadeedhussainmemon](https://github.com/hadeedhussainmemon)
- **LinkedIn:** [Hadeed Hussain](https://linkedin.com/in/hadeedhussainmemon)

---

<div align="center">

### Made with ❤️ for aspiring founders and students

**"PitchCraft sirf ek app nahi — yeh ek startup accelerator hai 💫"**

**"AI ke zariye students apne ideas ko shape de sakte hain aur professional founders jaisa feel le sakte hain."**

</div>
