# 🚦 CivicFix AI

### AI-Powered Civic Issue Reporting & Resolution Platform

CivicFix AI is a modern AI-powered platform that helps citizens report civic problems and enables authorities to intelligently prioritize, assign, track, and resolve them.

From **potholes and garbage** to **broken streetlights and water leaks**, CivicFix AI turns a simple citizen report into a structured, prioritized workflow.

---

## 🌍 The Problem

Civic issues are often reported through fragmented channels such as:

* Phone calls
* WhatsApp messages
* Social media
* Paper complaints
* Unstructured web forms

This makes it difficult for authorities to:

* Identify urgent issues
* Prioritize complaints
* Assign them to the correct department
* Track progress
* Measure resolution performance

Citizens also have limited visibility into what happens after submitting a complaint.

---

## 💡 Our Solution

**CivicFix AI** creates a complete digital workflow:

```text
Citizen
   ↓
Report Civic Issue
   ↓
Upload Photo + Location
   ↓
AI Analysis
   ↓
Severity & Priority Detection
   ↓
Department Assignment
   ↓
Officer Action
   ↓
Resolution Proof
   ↓
Citizen Notification
```

---

# ✨ Key Features

## 👤 Citizen Portal

Citizens can:

* Create an account
* Report civic issues
* Upload images
* Select their location
* View AI analysis
* Track complaints
* View status timeline
* Receive notifications
* View resolution proof

---

## 🤖 AI-Powered Issue Analysis

CivicFix AI analyzes reported problems and determines:

* Issue category
* Severity
* Priority
* AI confidence
* Recommended department
* Suggested action

Example:

```text
Detected Issue: Pothole

Severity: HIGH
Priority: P1
AI Confidence: 94%

Recommended Department:
Roads Department

Suggested Action:
Inspect and repair the damaged road section.
```

---

## 🏛️ Admin Dashboard

Administrators can:

* View all reported issues
* Search complaints
* Filter by category
* Filter by priority
* Filter by status
* Assign departments
* Assign officers
* Change priorities
* Update statuses
* Send notifications
* Monitor analytics

---

## 👷 Department Officer Portal

Officers can:

* View assigned issues
* Start work
* Add progress updates
* Upload resolution proof
* Mark issues as resolved

Workflow:

```text
Reported
   ↓
Verified
   ↓
Assigned
   ↓
In Progress
   ↓
Resolved
```

---

# 🗺️ Interactive Civic Map

CivicFix AI provides an interactive map showing reported issues.

Each issue can be viewed based on:

* Location
* Category
* Priority
* Status

Users can click a map marker to view the issue.

Map technology:

**Leaflet + OpenStreetMap**

No paid map API is required.

---

# 📊 Analytics Dashboard

Administrators can monitor:

* Total reports
* Reports today
* Reports this week
* Reports this month
* Resolution rate
* Average resolution time
* Issues by category
* Issues by department
* Issues by priority
* Issues by status

Charts are generated using real database data.

---

# 🔔 Notification System

Citizens receive updates when their complaint changes.

Examples:

```text
Your report has been received.

Your issue has been assigned to the Roads Department.

Your issue is now in progress.

Your issue has been resolved.
```

Notifications are connected to the relevant issue.

---

# 🧩 Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

### Backend

* Next.js API Routes
* Supabase

### Database

* PostgreSQL through Supabase

### Authentication

* Supabase Auth

### AI

* Google Gemini API

### Maps

* Leaflet
* OpenStreetMap

### Charts

* Recharts

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/civicfix-ai.git
```

```bash
cd civicfix-ai
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit `.env.local`.

---

# 🗄️ Supabase Setup

Create a Supabase project and configure:

* Authentication
* PostgreSQL database
* Storage
* Row Level Security

Required tables:

```text
profiles
departments
issues
issue_updates
notifications
```

Required departments:

```text
Roads
Sanitation
Water Supply
Electricity
Public Safety
Parks
Other
```

Run the SQL schema provided in the project's database setup.

---

# 🤖 Gemini Setup

CivicFix AI uses Gemini for issue analysis.

The AI endpoint:

```text
/api/analyze-issue
```

Expected response:

```json
{
  "detected_category": "Pothole",
  "severity": "HIGH",
  "priority": "P1",
  "confidence": 94,
  "recommended_department": "Roads",
  "suggested_action": "Inspect and repair the damaged road section.",
  "reasoning": "The reported road damage presents a significant safety risk."
}
```

---

# 🧪 Demo / Fallback Mode

CivicFix AI is designed to remain functional even when an AI API key is unavailable.

The application can use deterministic fallback analysis based on the issue description and category.

Example:

```text
Pothole
→ HIGH
→ P1
→ Roads

Broken Streetlight
→ MEDIUM
→ P2
→ Electricity

Minor Garbage
→ LOW
→ P3
→ Sanitation

Major Water Leakage
→ CRITICAL
→ P0
→ Water Supply
```

This allows the complete workflow to be demonstrated during development or hackathons.

---

# ▶️ Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Build the application:

```bash
npm run build
```

Start production:

```bash
npm start
```

---

# 🔐 Security

CivicFix AI follows basic security best practices:

* API keys stored in environment variables
* Gemini API called server-side
* Supabase Row Level Security
* Protected dashboard routes
* Role-based access
* Input validation
* File validation
* No secret credentials committed to Git

Never expose:

```text
GEMINI_API_KEY
```

in client-side code.

---

# 👥 User Roles

## Citizen

Can:

* Report issues
* View own reports
* Track status
* Receive notifications
* View resolution proof

## Department Officer

Can:

* View assigned issues
* Update progress
* Upload proof
* Resolve assigned issues

## Administrator

Can:

* View all issues
* Assign departments
* Assign officers
* Change priorities
* Manage statuses
* View analytics
* Manage departments

---

# 🏆 Hackathon Demo Flow

The recommended live demo:

### Step 1

Open the Citizen Dashboard.

### Step 2

Click:

```text
Report an Issue
```

### Step 3

Upload a pothole image.

### Step 4

Select location.

### Step 5

Click:

```text
Analyze with AI
```

### Step 6

Show:

```text
Pothole
HIGH Severity
P1 Priority
94% Confidence
Roads Department
```

### Step 7

Submit the complaint.

### Step 8

Open Admin Dashboard.

The new complaint appears in the issue table.

### Step 9

Admin assigns:

```text
Department → Roads
Officer → Assigned Officer
```

### Step 10

Officer opens the issue.

Changes:

```text
Assigned
↓
In Progress
```

### Step 11

Officer uploads repair proof.

### Step 12

Mark:

```text
Resolved
```

### Step 13

Citizen receives:

```text
Your issue has been resolved.
```

This demonstrates the complete platform from **citizen → AI → administration → field officer → resolution**.

---

# 📈 Future Improvements

Potential future versions could include:

* Computer vision-based image classification
* Duplicate complaint detection
* Automatic geospatial clustering
* Predictive civic issue detection
* AI-generated municipal reports
* WhatsApp reporting
* Voice-based reporting
* Multilingual support
* Marathi/Hindi/English support
* IoT sensor integration
* Emergency issue escalation
* Government API integrations
* SLA monitoring
* Heatmaps
* Department performance scoring

---

# 🌟 Vision

CivicFix AI aims to create a more transparent and intelligent civic-management ecosystem.

Instead of:

```text
Problem
↓
Complaint
↓
Unknown Status
```

CivicFix AI creates:

```text
Problem
↓
AI Detection
↓
Priority
↓
Correct Department
↓
Assigned Officer
↓
Progress Tracking
↓
Resolution Proof
↓
Citizen Confirmation
```

### **Report smarter. Respond faster. Build better cities.**

---

## 📜 License

This project is intended for educational, hackathon, and prototype purposes.

Choose an appropriate open-source license before public production deployment.
