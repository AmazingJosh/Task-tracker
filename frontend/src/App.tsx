import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import TaskListPage from './pages/TasklistPage.tsx';
import ProtectedRoute from './components/ProtectRoute.tsx';
import TaskDetailsPage from './pages/TaskDetailsPage.tsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskListPage />
              </ProtectedRoute>
            }
          />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
        </Routes>
      </ErrorBoundary>
      <ToastContainer/>
    </Router>
  );
};

export default App;

