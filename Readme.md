# Job Portal

A full-stack Job Portal web application built using the MERN stack that enables students to search and apply for jobs while allowing recruiters to post and manage job listings.

## Features

### Student
- User Registration & Login
- JWT Authentication
- Update Profile
- Upload Resume/Profile Photo
- Browse Available Jobs
- Search & Filter Jobs
- Apply for Jobs
- View Applied Jobs

### Recruiter
- Recruiter Registration & Login
- Company Management
- Create Job Listings
- Update/Delete Jobs
- View Applicants
- Manage Applications

## Tech Stack

### Frontend
- React.js
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Shadcn UI
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Cookie Parser
- CORS

## Folder Structure

```
Job-Portal/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/AbhayPatange/Job-Portal.git
```

Move into the project

```bash
cd Job-Portal
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file.

```
PORT=8000

MONGO_URL=your_mongodb_connection_string

SECRET_KEY=your_secret_key

CLOUD_NAME=your_cloudinary_cloud_name

API_KEY=your_cloudinary_api_key

API_SECRET=your_cloudinary_api_secret
```

Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file.

```
VITE_API_URL=http://localhost:8000
```

Run Frontend

```bash
npm run dev
```

Application runs on

```
http://localhost:5173
```

---

## Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- MongoDB Atlas

### Image Storage
- Cloudinary

---

## Future Improvements

- Email Verification
- Password Reset
- Google Authentication
- Resume Parsing
- Job Recommendations
- Notifications
- Interview Scheduling
- Admin Dashboard Analytics

---

## Author

**Abhay Patange**

GitHub: https://github.com/Abhaypatange

LinkedIn: https://linkedin.com/in/abhaypatange

---

## License

This project is developed for educational and learning purposes.# Job-Portal
