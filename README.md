
# AI Interview Agent 🤖

A production-ready, modern, scalable, responsive AI-powered web application designed to help college students, placement aspirants, and developers prepare for job interviews using Generative AI. 

The application reads and parses candidate resumes, dynamically conducts adaptive interviews (adjusting difficulty and asking follow-ups based on answer quality), evaluates responses on multiple parameters (correctness, completeness, technical terminology depth), and produces visual performance scorecards and tailored learning roadmaps.

---

## 🚀 Key Features

*   **Secure Authentication**: Cookie-based JWT authentication, password hashing with bcrypt, protected router locks, and a mock password reset utility.
*   **Resume parsing (AI-extracted)**: Upload resume PDFs. Extracts skills, programming languages, framework stacks, education, and projects via Gemini AI.
*   **Adaptive Mock Interviews**: Generates personalized role-based interview queries (Frontend, Backend, Java stacks). The AI scales query difficulty up or down dynamically and requests deep conceptual breakdowns of projects extracted from the candidate's resume.
*   **Granular Grading System**: Scores answers out of 10. Assesses response correctness, communication tone, technical vocabulary depth, and completeness. Recommends full perfect model answers.
*   **Analytical Dashboards**: Score progress graphs using Recharts. Summarizes technical, communication, and problem-solving averages.
*   **Skill Gap Analytics**: Pinpoints missing role-specific technologies, generates step-by-step career learning paths, and details 2 tailored portfolio projects to build.
*   **System Admin Portal**: Monitor user counts, total completed interviews, top candidate capabilities, and recurring skill gaps.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios, Framer Motion, React Hook Form, Recharts, Lucide Icons
*   **Backend**: Node.js, Express.js, Mysql, JWT Authentication, bcryptjs, Multer, PDF-Parse, Cookie-Parser, Dotenv
*   **Generative AI**: Google Gemini AI API SDK (`@google/generative-ai`)

---

## 📂 Project Structure

```text
AI Interview Agent/
├── backend/
│   ├── config/              # Mysql connection setups
│   ├── controllers/         # Logic for auth, resume, interview, and admin operations
│   ├── middleware/          # JWT protection, Multer upload filters
│   ├── models/              # User, Resume, and Interview Mongoose Schemas
│   ├── routes/              # Express endpoint maps
│   ├── services/            # Gemini API prompt engineering configs
│   ├── .env                 # Backend keys template
│   ├── package.json
│   └── server.js            # Entry server app
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, route guards, button controls
│   │   ├── contexts/        # Theme toggles and Auth session providers
│   │   ├── pages/           # Landing page, dashboard, room, reports, admin portals
│   │   ├── services/        # Axios API client setups
│   │   ├── App.jsx          # Route trees
│   │   ├── index.css        # Tailwind directives and custom scrollbars
│   │   └── main.jsx         # Render root
│   ├── package.json
│   ├── tailwind.config.js   # Dark mode classes and violet palette extension
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
*   Node.js (v18+ recommended)
*   Mysql
*   Google Gemini API Key (Obtain free from [Google AI Studio](https://aistudio.google.com/))

### 1. Configure the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   *   For development (reloads on changes):
       ```bash
       npm run dev
       ```
   *   For production start:
       ```bash
       npm start
       ```

### 2. Configure the Frontend

1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server port displayed in your terminal (typically `http://localhost:5173`).

---

## 🧪 Testing local AI integrations

You can verify that the Gemini API integration and response formatting functions are working correctly by executing our local diagnostic test script:

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Run the test script:
   ```bash
   node test-gemini.js
   ```
3. The script will output confirmation details showing parsed resume mock entities and a graded sample question response.

# AI-Interview-Agent
AI-Powered Full Stack Web Application | Frontend | Backend | Generative AI

