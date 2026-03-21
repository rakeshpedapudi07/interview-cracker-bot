#  Interview Cracker Bot

AI-powered real-time technical interview simulator built with React and Vite.
This platform mimics a real interviewer by asking questions, evaluating responses, and adapting dynamically based on user performance.

---

## 🔍 Project Overview

Interview Cracker Bot is designed to simulate a **real-world technical interview experience**.
It generates domain-specific questions, evaluates answers using structured grading, and provides feedback to help users improve.

The system behaves like a **strict but fair senior interviewer**, guiding users through multiple questions in a session.

---

##  Technologies Used

* React (Vite) ⚛️
* JavaScript 🟨
* CSS 🎨
* OpenRouter API 🤖
* Vercel ☁️

---

## 🧩 Core Features

* 🎯 Dynamic interview question generation
* 📊 Real-time evaluation (Strong / Average / Weak)
* 💬 Instant feedback after each response
* 🔁 Adaptive question flow
* 💡 Hint system (limited guided hints)
* 🔓 Solution reveal option
* ⏱️ Question timer
* 📈 Session summary with performance insights

---

## ⚙️ System Flow

```
┌────────────────────┐
│   User selects     │
│   interview topic  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  AI generates      │
│  question          │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  User submits      │
│  answer            │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  AI evaluates      │
│  response          │
│ (Strong/Avg/Weak)  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Feedback +        │
│  improvement hint  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Next Question OR   │
│ Retry current      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Session Summary    │
│ & Performance      │
└────────────────────┘
```

---

## 📁 Project Structure

```
interview-cracker-bot/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── ChatScreen.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── TypingIndicator.jsx
│   │   ├── QuestionTimer.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── SessionSummary.jsx
│   │   └── SolutionConfirmModal.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
```

---

## 🚀 System Workflow

### 1️⃣ Start Session

User selects a topic and begins the interview

### 2️⃣ Question Generation

AI generates one question at a time based on the topic

### 3️⃣ Answer Submission

User submits their response

### 4️⃣ Evaluation

AI evaluates the answer:
```
* Strong
* Average
* Weak
```
### 5️⃣ Adaptive Flow

* Strong → Move to next question
* Weak → Ask follow-up or hint

### 6️⃣ Session Completion

Final summary with performance insights

---

## ▶️ How to Run

### Install dependencies
bash
``` 
npm install
```

### Run locally

```bash
npm run dev
```

---

## 🔐 Environment Setup

Create a `.env` file in the root directory:

```bash
VITE_OPENROUTER_KEY=your_api_key_here
```

⚠️ Do not commit `.env` to GitHub

---

## 🌐 Deployment

The project is deployed on Vercel:
```
https://interview-cracker-bot.vercel.app/
```
---

## ⚠️ Notes

* API key must be configured properly
* Ensure environment variables are set in Vercel
* Frontend API usage is not fully secure for production

---

## 🔮 Future Enhancements

* Backend integration for secure API handling
* Advanced analytics dashboard
* Company-specific interview modes (Amazon, Google)
* Personalized learning recommendations
* Voice-based interview simulation

---

## 👨‍💻 Author

Rakesh Pedapudi

B.Tech (Artificial Intelligence)
Focused on Software Engineering, AI Systems, and Full Stack Development

---

## 📄 License

This project is licensed under the MIT License.
