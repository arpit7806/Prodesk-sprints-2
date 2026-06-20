# 💸 Spendly — Personal Budget Tracker

> **"Your money, your rules."**
> A real-time personal budget tracker built with Vanilla JavaScript, Chart.js and localStorage. No frameworks, no fluff.

🔗 **Live Demo:** [prodesk-sprints-2.vercel.app](https://prodesk-sprints-2.vercel.app/)

---

## 📸 Preview

<img width="1887" height="1085" alt="Screenshot 2026-06-20 145109" src="https://github.com/user-attachments/assets/1ff0f76c-bf8a-4513-936f-dba1cdda1c92" />


---

## 📌 Overview

**Spendly** is a browser-based budget tracking app where users set their monthly salary, log expenses, and instantly see their remaining balance. All data persists across browser sessions via `localStorage` — close the tab, come back later, everything's still there.

Built across **2 sprint phases** as part of a frontend internship program.

---

## 🚀 Features

- 💰 Set total salary and track remaining balance in real-time
- ➕ Add named expenses dynamically — no page reloads
- 🗑️ Delete any expense instantly — updates balance and chart on the fly
- 📊 Live **doughnut chart** (Chart.js) showing Spent vs Remaining
- 💾 **localStorage** persistence — data survives browser refresh
- ⚠️ Full input validation — blocks empty fields, negatives, and zero values
- 📈 Progress bar that turns red at 90%+ spending
- 🎨 Glassmorphism UI with animated flying money notes background

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure, typed form inputs |
| CSS3 | Modular class-based styling, glassmorphism, animations |
| Vanilla JavaScript (ES6+) | App logic, DOM manipulation, validation, localStorage |
| [Chart.js](https://www.chartjs.org/) | Live doughnut chart (CDN) |
| Canvas API | Animated flying money background |
| Google Fonts | Righteous · Fredoka · Courier Prime |

---

## 🧠 localStorage Flow

```
User action (set salary / add / delete)
        ↓
  Update in-memory state
        ↓
  JSON.stringify → localStorage.setItem()
        ↓
  Re-render DOM + recalculate balance + update chart
```

On page load, `init()` reads from localStorage and rebuilds the full UI from saved state.

---

## 🎨 Design Highlights

- Deep money-green dark theme (`#0a1a0e`)
- Glassmorphism cards with `backdrop-filter: blur(20px)`
- 38 currency symbols floating upward via Canvas API
- Pill-shaped buttons with bubble ripple on click

---

## 👨‍💻 Author

**Arpit** — [github.com/arpit7806](https://github.com/arpit7806)

Built during a frontend internship sprint.
