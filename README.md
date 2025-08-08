## 🍴 Welcome to **Spoon**

**Spoon** is your one-stop solution to understand any public GitHub repository — in a **clear**, **fun**, and **visual** way.

We believe that even someone who's never written a line of code should be able to **grasp what a repository does** — and that's the experience Spoon delivers.

---

### ✨ What is Spoon?

Spoon is a developer tool and an educational assistant built with **simplicity first, functionality second**. With just a **GitHub repository URL**, Spoon analyzes the codebase and provides AI-generated insights to help users:

* Understand the **purpose and structure** of the repo
* View **commit activity**, **language breakdown**, and more
* Explore AI-summarized overviews of the codebase
* Revisit past insights with a **personal search history**

Whether you're a seasoned developer reviewing open-source libraries or a student exploring GitHub for the first time — Spoon simplifies the discovery process.

---

### 🔍 Key Features

* ✅ **GitHub Repo Cloning & Analysis** – Just paste a repo URL, and Spoon does the rest.
* ✨ **AI-Powered Insights** – Uses Gemini to summarize repo structure and logic.
* 📊 **Commit Count, Languages & other metadata** – Fetches details via the GitHub API.
* 🧠 **Search History (User-based)** – Every logged-in user sees their past analyses.
* 🌐 **OAuth Login** – Google login with PKCE ensures secure sign-in.
* 💾 **SQLite-backed History** – Persistent user-specific search logs.
* ⚡ **Blazing Fast Frontend** – Built with **React** and **TailwindCSS** for minimal cognitive load and clean design.
* 🔒 **Secure Backend** – JWT session handling, API rate-limiting, and environment-based secrets.
* 📜 **Downloadable reports** – Download your generated insights for future use cases as PDF or HTML.

---

### 🧪 Tech Stack

| Layer     | Technology           |
| --------- | -------------------- |
| Frontend  | React, Tailwind CSS  |
| Backend   | Node.js, Express     |
| Auth      | Google OAuth + JWT   |
| Database  | SQLite               |
| AI Engine | Gemini (via API key) |

---

### 🛠️ Requirements

To run Spoon, you'll need to set up the following environment variables:

| Variable                     | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `VITE_GEMINI_API_KEY`        | Gemini API key for generating insights |
| `VITE_GOOGLE_CLIENT_ID`      | Google OAuth Client ID (PKCE flow)     |
| `VITE_GITHUB_PERSONAL_TOKEN` | GitHub API token for repo metadata     |
| `JWT_SECRET`                 | Secret for JWT token signing           |
| `SESSION_SECRET`             | Express session security key           |

> 💡 Don’t have these yet? Use your fav GPT to know how to find it ;).

---

### 🧱 Folder Structure

```
spoon/
├── client/              # React Frontend (GitHub input, insights UI)
├── server/              # Node.js Backend (API, GitHub cloning, DB, env)
    ├── spoon.db             # SQLite file (auto-created)
├── README.md            # This file!
```

---

### 🔮 What's Coming Next?

* Visual graphs of commit activity and contributors
* Switchable **AI model support** (GPT, Claude)

---

### 💡 Why We Built Spoon

Most repo explorers are **too technical** or **lack clarity**. We wanted to make something:

* **User-first**: No friction, minimal UI, works fast
* **Insightful**: Summarize big codebases in one click
* **Persistent**: Your insights are always with you
* **Friendly**: For students, product folks, non-tech stakeholders

---
