import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import DepartmentAdmin from './pages/DepartmentAdmin';
import MainAdmin from './pages/MainAdmin';
import ClearanceDashboard from './pages/ClearanceDashboard'; // ✅ Added
import logo from './assets/logo.png';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(storedUser);
    }
  }, []);

  // 🔥 General Protected Route
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
      // 🛑 If user's role is not allowed, redirect to their own dashboard
      if (currentUser.role === 'student') return <Navigate to="/clearance-dashboard" replace />;
      if (currentUser.role === 'department_official') return <Navigate to="/department-admin" replace />;
      if (currentUser.role === 'admin') return <Navigate to="/main-admin" replace />;
    }

    return children;
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {isAuthenticated && <Header currentUser={currentUser} />}
        <div className="d-flex flex-grow-1">
          {isAuthenticated && <Sidebar currentUser={currentUser} />}
          <Container className="py-4 flex-grow-1" fluid>
            <Routes>
              {/* Login Route */}
              <Route
                path="/login"
                element={
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setCurrentUser={setCurrentUser}
                  />
                }
              />

              {/* Student Dashboard */}
              <Route
                path="/clearance-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <ClearanceDashboard currentUser={currentUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard currentUser={currentUser} />
                  </ProtectedRoute>
                }
              />

              {/* Department Admin Dashboard */}
              <Route
                path="/department-admin"
                element={
                  <ProtectedRoute allowedRoles={['department_official']}>
                    <DepartmentAdmin currentUser={currentUser} />
                  </ProtectedRoute>
                }
              />

              {/* Main Admin Dashboard */}
              <Route
                path="/main-admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainAdmin currentUser={currentUser} />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Container>
        </div>

        {isAuthenticated && (
          <footer className="text-center py-3 text-muted" style={{ backgroundColor: '#f8f9fa' }}>
            <small>© {new Date().getFullYear()} Bahir Dar University. All rights reserved.</small>
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;
