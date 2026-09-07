# 🚦 CivicFix AI

### AI-Powered Civic Issue Reporting & Management Platform

CivicFix AI is a modern web application that helps citizens report local civic problems and enables administrators to track, prioritize, and manage those issues through a centralized dashboard.

The project is built using **HTML, CSS, and JavaScript**, making it lightweight, easy to run, and suitable for hackathons, demonstrations, and future expansion.

---

## 🌍 Problem

Citizens face many everyday civic problems such as:

* Potholes
* Garbage
* Broken streetlights
* Water leakage
* Damaged roads
* Drainage problems
* Traffic signal issues
* Illegal dumping

Reporting these problems can be difficult, and citizens often don't know whether their complaint has been received or resolved.

---

## 💡 Solution

CivicFix AI provides a simple digital workflow:

```text
Citizen
   ↓
Report Issue
   ↓
Add Description
   ↓
Upload Evidence
   ↓
AI Analysis
   ↓
Priority Detection
   ↓
Department Assignment
   ↓
Issue Tracking
   ↓
Resolution
```

---

# ✨ Features

## 👤 Citizen

Citizens can:

* Report civic issues
* Select an issue category
* Add a description
* Upload an image
* Provide location
* Get AI-style issue analysis
* View issue priority
* Track complaint status
* View reported issues

---

## 🤖 AI Issue Analysis

CivicFix AI analyzes the submitted issue and provides:

* Detected category
* Severity
* Priority
* Recommended department
* Suggested action
* Confidence score

Example:

```text
Detected Issue: Pothole

Severity: HIGH
Priority: P1

Recommended Department:
Roads Department

Suggested Action:
Inspect and repair the damaged road.
```

> The current static version can use demo/fallback AI logic. A real AI API can be connected later.

---

# 🏛️ Admin Dashboard

The admin dashboard provides:

* Total issues
* Pending issues
* High-priority issues
* Resolved issues
* Issue categories
* Issue status
* Search
* Filters
* Issue management
* Department assignment
* Status updates

---

# 📊 Dashboard Analytics

The dashboard can display:

```text
Total Reports
     124

Pending
      32

In Progress
      41

Resolved
      51
```

It can also visualize:

* Issues by category
* Issues by priority
* Issues by status
* Recent reports

---

# 🗺️ Civic Issue Map

Reported issues can be displayed geographically.

Users can see:

* Issue location
* Issue category
* Priority
* Status

Clicking an issue marker can display its details.

---

# 🔔 Issue Status Tracking

Every complaint follows a simple workflow:

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

The citizen can track the progress of the issue.

---

# 🛠️ Technology

This version uses a lightweight frontend stack:

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| HTML5                 | Application structure    |
| CSS3                  | UI and responsive design |
| JavaScript            | Application logic        |
| LocalStorage          | Demo data persistence    |
| Leaflet/OpenStreetMap | Maps, if enabled         |

No backend is required for the basic demo version.

---

# 📁 Project Structure

```text
civicfix-ai/
│
├── index.html
├── index.css
├── index.js
└── README.md
```

---

# 🚀 How to Run

## Option 1 — Open Directly

Simply double-click:

```text
index.html
```

The application will open in your browser.

---

## Option 2 — VS Code Live Server

Install the **Live Server** extension in VS Code.

Then:

1. Open the CivicFix AI folder.
2. Right-click `index.html`.
3. Select **Open with Live Server**.

The website will open in your browser.

---

# 🧪 Demo Workflow

### 1. Open CivicFix AI

Start at the homepage.

### 2. Click

```text
Report an Issue
```

### 3. Enter

```text
Title:
Large pothole near main road

Category:
Pothole

Description:
A deep pothole is creating a safety risk for vehicles.
```

### 4. Upload an image

Add a photo of the civic issue.

### 5. Add location

Select or enter the issue location.

### 6. Analyze

Click:

```text
Analyze with AI
```

The application displays:

```text
Pothole
HIGH Severity
P1 Priority
Roads Department
```

### 7. Submit

Click:

```text
Submit Report
```

### 8. Track

The complaint receives an issue ID and can be tracked through the dashboard.

---

# 🧠 Demo AI Logic

The current frontend version can simulate AI analysis using JavaScript.

Example:

```text
Pothole
→ HIGH
→ P1
→ Roads

Garbage
→ LOW/MEDIUM
→ P2/P3
→ Sanitation

Broken Streetlight
→ MEDIUM
→ P2
→ Electricity

Major Water Leakage
→ CRITICAL
→ P0
→ Water Supply
```

This allows the complete product workflow to work without requiring an API key.

---

# 💾 Data Persistence

For the frontend-only version, browser **LocalStorage** can be used to preserve demo reports.

This means reports can remain available after refreshing the page.

For a production version, LocalStorage should be replaced with a proper backend/database.

---

# 🔮 Future Development

The project can later be upgraded with:

### AI

* Real Gemini/OpenAI integration
* Image classification
* Computer vision
* Duplicate issue detection
* Automatic severity detection

### Backend

* Node.js / Express
* Supabase
* Firebase
* PostgreSQL

### Authentication

* Citizen login
* Admin login
* Officer login

### Communication

* Email notifications
* SMS notifications
* WhatsApp reporting

### Localization

* English
* Hindi
* Marathi
* Voice-based reporting

### Smart City Features

* Issue heatmaps
* Automatic department routing
* SLA tracking
* Predictive maintenance
* Municipal analytics
* Emergency escalation

---

# 🏆 Hackathon Value

CivicFix AI demonstrates a complete real-world workflow:

```text
Real Problem
     ↓
Digital Reporting
     ↓
AI Analysis
     ↓
Smart Prioritization
     ↓
Department Assignment
     ↓
Issue Tracking
     ↓
Resolution
```

The project focuses on **real civic problems, AI-assisted decision making, transparency, and measurable impact**.

---

# 🎯 Vision

CivicFix AI aims to make civic issue reporting:

**Simple for citizens.**

**Smart for authorities.**

**Transparent for everyone.**

### 🚦 Report smarter. Respond faster. Build better cities.

---

## 📜 License

This project is currently intended for educational, hackathon, and prototype purposes.
