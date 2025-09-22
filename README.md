# Kridacara — AI-Powered Sports Talent Assessment Platform

Kridacara is an **AI-powered sports talent assessment platform** designed under **SIH 2025 PS73**.  
It evaluates **physical performance** (strength, agility, endurance), produces a **Sports Performance Index (SPI)**, allows users to maintain **public LinkedIn-style sports profiles**, and provides **leaderboards and rankings** for scouts, coaches, and institutions.

---

## 🌟 Why Kridacara?
- India has **40+ crore youth under 25**, but only **2–3% get structured sports scouting opportunities**.  
- Existing apps (Strava, Fitbit, LinkedIn) do not scientifically assess **sports performance**.  
- Government schemes like **Khelo India** aim to reach **20 crore youth by 2030**, but lack **AI-driven scalable evaluation**.  
- Kridacara bridges this gap by offering **data-driven, scalable, AI-based performance assessment** accessible to **anyone with a smartphone**.

---

## 🚀 Features
- **User onboarding with prerequisites** (height, weight, age → baseline fitness score).  
- **Multiple category assessments** per user (e.g., 70% in Basic Fitness, 60% in Badminton, 50% in Karate).  
- **AI-driven scoring engine**: calculates category-wise scores + global SPI (0–100).  
- **Public sports profiles** (like LinkedIn, but for fitness & sports).  
- **Leaderboards & rankings** (global + category-wise).  
- **Gamification & progress tracking**.  
- **MVP scope**: 2–3 categories fully functional for SIH prototype (e.g., push-ups, shuttle run, badminton kick).  

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (React + Tailwind), MediaPipe / TensorFlow.js (client-side pose).  
- **Backend**: FastAPI (Python) or Django / Node.js (alternative).  
- **Database**: Supabase (Postgres + Auth).  
- **AI Engine**: MoveNet / MediaPipe Pose for video-based scoring.  
- **Deployment**: Vercel (frontend), Render/Railway (backend), Supabase (DB).  

---

## 📂 Project Structure
kridacara/  
├─ frontend/ # Next.js + Tailwind app  
├─ backend/ # FastAPI backend + AI wrappers  
│ ├─ ai_engine/ # AI analysis scripts  
│ ├─ models/ # Pre-trained pose models  
│ ├─ requirements.txt  
│ └─ main.py  
├─ infra/ # docker-compose, migrations  
└─ docs/  

yaml  
Copy code

---

## ⚡ Quick Start

### 1️⃣ Clone Repo
```bash
git clone https://github.com/<your-org>/kridacara.git
cd kridacara
2️⃣ Backend Setup (Python)
bash
Copy code
cd backend
python -m venv .venv
source .venv/bin/activate   # (Linux/Mac)
pip install -r requirements.txt
cp .env.example .env        # fill in your keys
uvicorn main:app --reload --host 0.0.0.0 --port 8000
Backend runs at: http://localhost:8000/docs

3️⃣ Frontend Setup (React)
bash
Copy code
cd ../frontend
npm install
cp .env.local.example .env.local   # fill with NEXT_PUBLIC_ vars
npm run dev
Frontend runs at: http://localhost:3000

🔑 Environment Variables
Backend .env.example
env
Copy code
DATABASE_URL=postgres://user:pass@localhost:5432/kridacara
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=public-anon-key
SUPABASE_SERVICE_ROLE=service-role-key
AI_MODEL_PATH=./models/movenet_singlepose.tflite
JWT_SECRET=verysecretvalue
ADMIN_EMAILS=admin@kridacara.test
Frontend .env.local.example
env
Copy code
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Kridacara
🗄️ Database Schema (Supabase / Postgres)
sql
Copy code
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  created_at timestamptz default now()
);

create table profiles (
  user_id uuid references users(id),
  age int,
  gender text,
  height_cm int,
  weight_kg int,
  basic_index numeric,
  bio text,
  public boolean default false,
  primary key (user_id)
);

create table assessments (
  id serial primary key,
  slug text,
  name text,
  description text
);

create table results (
  id serial primary key,
  user_id uuid references users(id),
  assessment_id int references assessments(id),
  score numeric,
  metrics jsonb,
  spi numeric,
  created_at timestamptz default now()
);
🤖 AI Module
Uses MoveNet or MediaPipe Pose for keypoint extraction.

Rule-based scoring converts:

Form

Performance

Consistency

Effort
into a category score (0–100).

SPI is a weighted average of category scores normalized by user baseline.

Run sample analysis:

bash
Copy code
cd backend
python ai_engine/analyze.py --video ../samples/pushup_demo.mp4 --model models/movenet.tflite --out result.json

📊 Roadmap
SIH Prototype (2–3 categories): pushups, shuttle run, badminton kick.

Future Expansion (10+ sports): football, cricket, karate, athletics.

Advanced AI: video coaching, wearable integration.

Scalability: blockchain certificates, federation + Khelo India integration.

🔐 Security
Explicit consent before video uploads.

Public/private toggle for profiles.

Data privacy aligned with India’s DPDP Act 2023.

🧪 Testing
bash
Copy code
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
🎮 Demo Accounts
Admin: admin@kridacara.test / AdminDemo123!

User: demo@kridacara.test / DemoUser123!

📈 Impact & Alignment
With 1 lakh users in Year 1, generates 10M+ data points.

Helps thousands of athletes gain visibility.

Directly aligns with Khelo India & Fit India schemes.

👥 Team
Visionaries United — SIH 2025
Lead: Nandu — nandu@kridacara.example
