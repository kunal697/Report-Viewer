# Report Viewer System

A full-stack web application to view, filter, and provide feedback on reports. It includes a modern React frontend and a secure Express backend with a role-based feedback workflow.

---

## Features

### Frontend

* Dark/Light theme toggle
* Report browser with filters (type, industry, confidence score)
* Report detail view with summary, insights, sources, and confidence meter
* Feedback form to submit responses
* Fully responsive design
* Built with reusable, component-based architecture

### Backend

* RESTful API using Express.js
* Role-based authentication with JWT (Viewer/Reviewer roles)
* Report APIs: list, filter, paginate, and fetch stats
* Feedback APIs: submit and manage feedback
* Request logging with UUID trace headers
* Security setup with Helmet, CORS, and environment-aware error handling
* Uses in-memory mock data for reports and users

---

## Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Backend

* Node.js
* Express 5
* JSON Web Token (JWT)
* Helmet, CORS, Morgan
* uuid, dotenv

---

## Getting Started

### Prerequisites

* Node.js (v18 or later)

### 1. Clone the Repository

```bash
git clone https://github.com/kunal697/Report-Viewer
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Run the Applications

#### Backend ([http://localhost:5000](http://localhost:5000))

```bash
npm run dev
```

#### Frontend ([http://localhost:5173](http://localhost:5173))

```bash
npm run dev
```

---

## Available Scripts

### Backend

* `npm run dev` — Start backend with nodemon
* `npm start` — Start backend with Node.js

### Frontend

* `npm run dev` — Start development server
* `npm run build` — Build for production
* `npm run preview` — Preview production build
* `npm run lint` — Lint codebase

---

## Folder Structure

```
Report-Viewer/
├── backend/      # Express backend (routes, controllers, middleware)
└── frontend/     # React frontend (components, pages, context)
```
