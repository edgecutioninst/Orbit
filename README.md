# 🪐 Orbit Editor

**Code with Intelligence.** A high-performance, browser-based Integrated Development Environment (IDE) featuring multi-language compilation, real-time AI assistance, and seamless GitHub integration. 

[**🚀 View Live Deployment**](https://orbit-code-editor.vercel.app)

### 📸 Previews

![Dashboard](https://github.com/user-attachments/assets/c7072080-66de-4687-99d8-b8109e4cb4df)

![Orbit Editor IDE](https://github.com/user-attachments/assets/e3de85e7-c37a-4afb-a078-de967dfac97c)
---

## ✨ Key Features

* **Multi-Language Compilation:** Write and execute code instantly in C++, Java, Python, Rust, Ruby, JavaScript, and TypeScript, powered by the JDoodle Execution API.
* **Integrated AI Assistant:** Features an inline AI code helper (Copilot-style) and a conversational chatbot powered by Groq and the Vercel AI SDK to help debug and optimize code on the fly.
* **GitHub Integration:** Seamlessly import and explore existing GitHub repositories directly within the browser environment.
* **Workspace Management:** Create, update, delete, and organize multiple coding playgrounds with a robust file explorer and tabbed editor.
* **Secure Authentication:** End-to-end secure login using GitHub and Google OAuth via NextAuth.js.

---

## 🛠️ Tech Stack

**Frontend**
* **Framework:** Next.js 16 (App Router) & React 19
* **Styling:** Tailwind CSS v4 & Radix UI (Shadcn)
* **Editor:** Monaco Editor (`@monaco-editor/react`)
* **State Management:** Zustand

**Backend & Database**
* **Database:** MongoDB
* **ORM:** Prisma
* **Authentication:** NextAuth.js (v5 Beta)
* **Execution Engine:** JDoodle API

**AI Integration**
* **Provider:** Groq API
* **Library:** Vercel AI SDK

---

## 🚀 Local Installation

To run Orbit Editor locally on your machine, follow these steps:

**1. Clone the repository**
```bash
git clone https://github.com/edgecutioninst/Orbit.git
cd Orbit
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
Create a `.env` file in the root directory and add the necessary credentials:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Your MongoDB connection string |
| `AUTH_SECRET` | NextAuth secret key |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `CLIENT_ID` | JDoodle API Client ID |
| `CLIENT_SECRET` | JDoodle API Client Secret |
| `GROQ_API_KEY` | Groq API Key for AI features |

**4. Initialize the database**
```bash
npx prisma generate
npx prisma db push
```

**5. Start the development server**
```bash
npm run dev
```



