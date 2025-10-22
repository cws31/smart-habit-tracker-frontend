// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Navigate } from "react-router-dom";
import DashboardPage from './pages/DashboardPage';

// import LandingPage from "./pages/LandingPage";
// import Login from "./pages/Auth/Login";
// import Signup from "./pages/Auth/Signup";
// import Dashboard from "./pages/Dashboard";
// import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
           <Route path="/dashboard" element={<DashboardPage />} />
        {/* <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}

         {/* Protect dashboard */}
        {/* <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        /> */}

      </Routes>
    </Router>
  );
}

export default App;