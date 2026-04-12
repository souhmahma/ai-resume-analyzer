# AI Resume Analyzer

An intelligent resume analysis platform powered by Google Gemini AI. Upload your CV and get a detailed score, actionable suggestions, a personalized cover letter, and interview preparation all in seconds.

> **Stack** : Django · DRF · React · PostgreSQL · Redis · Celery · Google Gemini AI

---
[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--resume--analyzer-brightgreen?style=for-the-badge&logo=vercel)](https://ai-resume-analyzer-souhail3.vercel.app)

---

## 📸 Screenshots

### Landing page
![Landing](screenshots/Landing.png)
![Landing](screenshots/Landing-2.png)
![Landing](screenshots/Landing3.png)
![Landing](screenshots/Landing-4.png)
![Landing](screenshots/Landing-5.png)

### Resume upload
![Upload](screenshots/upload.png)

### Analysis results
![Results](screenshots/overwiew.png)
![Results](screenshots/overwiew2.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Cover letter generation
![Cover Letter](screenshots/cover-letter.png)
![Cover Letter](screenshots/cover-letter2.png)

### Interview preparation
<!-- Replace with your production URL -->
![Interview](screenshots/interwiew.png)
![Interview](screenshots/interwiew2.png)

### Profile page
<!-- Replace with your production URL -->
![Profile](screenshots/profile.png)
![Profile](screenshots/profile2.png)


---

## ✨ Features

### 🎯 AI Resume Analysis
- Upload PDF or DOCX resume (up to 10MB)
- Google Gemini AI analyzes every section
- Detailed score across 6 dimensions with animated radar chart
- Strengths and weaknesses breakdown
- Actionable suggestions sorted by priority (high / medium / low)

### 📊 Scoring System
```
Content     → Quality and relevance of content
Structure   → Organization and formatting
Skills      → Technical and soft skills presence
Experience  → Work experience quality
Language    → Grammar, clarity, professional tone
Overall     → Weighted average of all sections
```

### ✍️ Cover Letter Generator
- AI-generated personalized cover letter
- Tailored to specific company and position
- Copy to clipboard in one click
- Regenerate as many times as needed

### 🎤 Interview Preparation
- 10 personalized interview questions based on your resume
- 4 categories: Technical, Behavioral, Experience, Situational
- Difficulty levels: Easy / Medium / Hard
- Answer textarea to practice responses
- Hints for each question


## 📡 API Endpoints

### Auth — `/api/auth/`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register/` | Create account | Public |
| `POST` | `/login/` | Login → JWT tokens | Public |
| `POST` | `/token/refresh/` | Refresh access token | Public |
| `GET` | `/me/` | Get current user | Authenticated |
| `PATCH` | `/profile/` | Update profile | Authenticated |
| `POST` | `/change-password/` | Change password | Authenticated |
| `DELETE` | `/avatar/delete/` | Remove avatar | Authenticated |
| `DELETE` | `/delete/` | Delete account | Authenticated |

### Resumes — `/api/resumes/`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/resumes/` | List my resumes | Authenticated |
| `POST` | `/resumes/upload/` | Upload resume | Authenticated |
| `GET` | `/resumes/<id>/` | Resume detail | Authenticated |
| `DELETE` | `/resumes/<id>/` | Delete resume | Authenticated |
| `GET` | `/resumes/<id>/status/` | Poll analysis status | Authenticated |

### Analysis — `/api/resumes/<id>/`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/analysis/` | Get full analysis | Authenticated |
| `POST` | `/analysis/regenerate/` | Re-run AI analysis | Authenticated |
| `POST` | `/cover-letter/` | Generate cover letter | Authenticated |
| `GET` | `/cover-letter/status/` | Poll cover letter status | Authenticated |
| `POST` | `/interview/` | Generate interview questions | Authenticated |
| `GET` | `/interview/status/` | Poll interview questions status | Authenticated |

---

## 🔄 How it works

```
1. User uploads PDF or DOCX
        ↓
2. Django extracts text (pdfplumber / python-docx)
        ↓
3. Celery sends task to Redis queue
        ↓
4. Gemini AI analyzes the text
        ↓
5. Scores + suggestions saved to PostgreSQL
        ↓
6. Email notification sent to user
        ↓
7. React polls status → redirects to results page
```


---

## 🧪 Test the app

```
1. Register
2. Upload a PDF or DOCX resume 
3. Wait 10-30 seconds for analysis
4. View results
5. Generate cover letter and interview questions
```

---

## ⚙️ Local installation

```bash
# Backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev

# Celery
celery -A config worker --loglevel=info --pool=solo
```

---

## 🚀 Production Architecture

The application is deployed across multiple cloud services for reliability and scalability.

---

### Infrastructure overview

![Production Architecture](screenshots/schemaprod.png)

---

### Services

#### Railway
![Production Architecture](screenshots/railway.png)

#### 🐘 PostgreSQL — Railway
The main database hosted directly on Railway. 

#### 🧠 Django App — Railway
The Django + DRF backend deployed as a Railway service connected to the GitHub repository. Every push to `main` triggers an automatic redeploy.

#### ⚡ Celery Worker — Railway
A separate Railway service running the Celery worker on the same codebase. 

#### Redis
![Production Architecture](screenshots/redis.png)

#### 🔴 Redis — Redis Cloud
The message broker and task queue hosted on Redis Cloud (external).

#### Vercel
![Production Architecture](screenshots/vercel.png)

#### ⚛️ React Frontend — Vercel
The React frontend deployed on Vercel, connected to the Django API via environment variable.

---
## 👤 Author

**Souhail HMAHMA** — Python Developer

🌐 [souhail3.vercel.app](https://souhail3.vercel.app) · 💼 [LinkedIn](https://linkedin.com/in/souhail-hmahma) · 🐙 [GitHub](https://github.com/souhmahma)
