# CS Student OS (Pro) 🚀

> **A complete productivity and learning operating system for Computer Science students**

Built with React, Vite, Tailwind CSS, and modern web technologies.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

---

## 🎯 Purpose

**Don't just graduate — get hired.**

CS Student OS is designed to help CS students, developers, and self-learners:
- Crush LeetCode and ace technical interviews
- Build a strong project portfolio
- Maintain consistent study habits
- Track job applications through the pipeline
- Prepare for behavioral interviews
- Analyze progress with beautiful visualizations

Instead of juggling multiple apps and scattered notes, this is your **one command center** for everything.

---

## ✨ Features

### 📊 Dashboard
- Real-time statistics (tasks, DSA progress, active projects, habit streaks)
- Quick actions to all major sections
- Today's task agenda
- Weekly goal tracking with progress bars

### ✅ Task Management
- Add, edit, delete tasks
- Priority levels (High, Medium, Low)
- Deadline tracking
- Filter by status (Today, Week, All, Completed)

### 💻 DSA Tracker
- **Pre-loaded with Striver's A2Z Sheet (160+ problems!)**
- Organized by 15 topics (Arrays, DP, Graphs, etc.)
- Status tracking: Planned → Active → Mastered
- Add notes for each problem
- Filter by topic, difficulty, status
- Direct LeetCode links

### 🛠 Project Management
- Kanban board (Planned → Active → Completed)
- Tech stack tagging
- GitHub & demo links
- Portfolio-ready project showcase

### 🎯 Habit Tracker
- Daily habit checklist
- Streak counter with fire emoji 🔥
- Automatic streak calculation
- Statistics dashboard

### ⚡ Skills Tracker
- Progress bars (0-100%)
- Stage tracking (Beginner → Intermediate → Advanced)
- Categorized by technology (Web Dev, AI/ML, Databases, etc.)
- Learning resources management

### 💼 Application Tracker
- Full pipeline Kanban (Applied → OA → Interview → Offer → Rejected)
- Company & role tracking
- Interview date management
- Notes for each application

### 🎤 Interview Prep
- Technical & behavioral question bank
- Pre-loaded sample questions with STAR method templates
- Company-specific tracking
- Full-text answer editor

### 📝 Weekly Review
- Structured reflection (Wins, Challenges, Learnings, Next Steps)
- Auto-calculated weekly stats
- Archive of past reviews

### 📈 Analytics
- Interactive charts (Bar, Pie, Progress bars)
- DSA progress by topic
- Application pipeline visualization
- Task completion rates
- Project status distribution

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

Already set up! The project is ready to run.

### Running the App

```bash
# Start development server
npm run dev
```

**The app will open at:** http://localhost:5173/

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 🛠 Tech Stack

- **React 18** - Modern UI library
- **Vite** - Blazing fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Modern icon library
- **Local Storage** - Browser-based data persistence

---

## 📂 Project Structure

```
cs os/
├── src/
│   ├── components/       # Reusable components (Sidebar, Modal, StatCard)
│   ├── pages/            # Main application pages (10 pages)
│   ├── services/         # Data service layer (storage.js)
│   ├── data/             # Static data (Striver's A2Z sheet)
│   ├── App.jsx           # Main app component & routing
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles & Tailwind
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

---

## 🎨 Design Features

- **Dark Mode** - Eye-friendly for long coding sessions
- **Glassmorphism** - Modern, premium aesthetic
- **Smooth Animations** - Fade-in, slide-up transitions
- **Custom Color Palette** - Carefully chosen accent colors
- **Inter Font** - Professional typography from Google Fonts
- **Responsive Design** - Works on desktop and mobile

---

## 💾 Data Management

All data is stored in **browser local storage**:
- Survives page refreshes
- **Export/Import** functionality for backups
- Click "Export Data" in sidebar to download JSON backup

**Data Models:**
- Tasks, DSA Problems, Projects, Habits
- Skills, Applications, Interview Questions, Weekly Reviews

---

## 🎯 How to Use

### First Time Setup
1. Open the app at http://localhost:5173/
2. Navigate through the sidebar to explore all features
3. **DSA Problems auto-load** on first visit to `/dsa`
4. **Sample interview questions** auto-load on first visit to `/interview-prep`

### Daily Workflow
1. **Morning:** Check Dashboard → Review today's tasks and habits
2. **Afternoon:** Solve DSA problems → Update tracker
3. **Evening:** Work on projects → Log progress
4. **Weekend:** Create weekly review → Adjust goals

### Key Actions
- **Add a Task:** Click "Add Task" button, fill form, submit
- **Mark DSA Problem:** Go to DSA page, change status dropdown
- **Create Project:** Navigate to Projects, add with tech stack and links
- **Check Habit:** Click checkbox on habit card to mark complete
- **Track Application:** Add company/role, move through pipeline
- **Export Data:** Click "Export Data" in sidebar for JSON backup

---

## 🌟 What Makes This Special

1. **Actually Practical** - Built for real CS students by developers
2. **Beautiful Design** - Modern dark theme with glassmorphism
3. **Data Pre-loaded** - 160+ DSA problems ready to use
4. **System-First** - Focus on building habits, not motivation
5. **Fully Offline** - Everything works in your browser
6. **Portfolio-Worthy** - This project itself is impressive!

---

## 🔮 Future Enhancements

Want to extend the app? Consider adding:
- 🔄 Backend integration (Firebase/Supabase) for cross-device sync
- 🔒 User authentication
- 📅 Contest calendar (Codeforces, LeetCode)
- ⏱ Pomodoro timer integration
- 📱 Progressive Web App (PWA) support
- 🌐 Deploy to Vercel/Netlify
- 📊 More advanced analytics

---

## 📜 License

This project is open source and available for personal use.

---

## 🤝 Contributing

Built with ❤️ for CS students everywhere.

---

## 📧 Support

Having issues? Check:
1. Node.js version is 18+
2. All dependencies installed (`npm install`)
3. Dev server is running (`npm run dev`)
4. Browser local storage is enabled

---

## 🎓 Built For

This system is designed for:
- CS students preparing for placements
- Developers building interview skills
- Self-learners organizing their journey
- Anyone serious about getting hired at top companies

---

**🚀 The system is built. Now it's time to execute.**

**💼 Don't just graduate — get hired.**
