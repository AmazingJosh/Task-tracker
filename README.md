Task Manager App

A full-stack Task-Tracker application built with React, Redux Toolkit, TypeScript, React Hook Form, Zod validation, Toastify for notifications, and a custom Node.js/Express API backend, and mongodb for database.


---

Features

User registration and login

Authentication with JWT

Create, view, update, and delete tasks

Form validation with react-hook-form and zod

Redux Toolkit for global state management

Axios for API requests

Toast notifications for success/error messages

Loading spinners during async operations

Responsive UI

---

Technologies Used

Frontend: React, TypeScript, TailwindCSS, Redux Toolkit, React Hook Form, Zod, React Toastify, Axios

Backend: Node.js, Express, MongoDB (You can customize based on your own backend)

---

Installation and Setup Instructions

1. Clone the repository

https://github.com/AmazingJosh/Task-tracker.git

there are two directories on this application, the frontend and the server.

cd frontend 

2. Install frontend dependencies

3. Start the development server

npm run dev

or

yarn dev

The app will run locally at:

http://localhost:3000


---

Folder Structure

src/
├── components/       # Reusable UI components
├── pages/            # Page components (Register, Login, Tasks)
├── redux/            # Redux slices and store
├── services/         # API calls (axios instance)
├── types/            # TypeScript types
├── utils/            # Utility functions (optional)
├── App.tsx           # App routes and layout
├── main.tsx          # App entry point
└── index.css         # Global styles (TailwindCSS)


---

Important Scripts

npm run dev — Runs the app in development mode

npm run build — Builds the app for production

npm run preview — Previews the production build locally



---

Backend Setup

cd server

npm or yarn install

npm start

Make sure your backend server (Node.js/Express API) is running.
It should expose endpoints like:

POST /auth/register

POST /auth/login

GET /tasks

POST /tasks

etc.


---

Author

Joshua Patrick 

GitHub: AmazingJosh 

---

Feedback 

If you have any feedback or suggestions, feel free to open an issue or contact me!
