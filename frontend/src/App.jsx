import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import Apply from "./pages/Apply";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // In a real app, this would come from authentication context

  const handleLogin = (userData) => {
    setUser(userData);
    console.log(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  // AdminRoute component
  const AdminRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />; // Not logged in
    if (!user.isAdmin) return <Navigate to="/dashboard" />; // Not admin
    return children;
  };

  // Public Route component (redirect to dashboard if already logged in)
  const PublicRoute = ({ children }) => {
    if(user && user.isAdmin) return <Navigate to="/admin" />;
    return !user ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup onSignup={handleLogin} />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <Dashboard user={user}/>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <Jobs user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <JobDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <Applications user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <SavedJobs user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <Apply user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Layout user={user || {}} onLogout={handleLogout}>
                  <Admin user={user}/>
                </Layout>
              </AdminRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/home"
            element={<Navigate to={user ? "/dashboard" : "/"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
