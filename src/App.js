import { BrowserRouter as Router, Route, Routes, Outlet, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminDashboard from "./admin/Dashboard";
import ShowProject from "./admin/ShowProject";
import NewProject from "./admin/NewProject";
import SignIn from "./auth/SignIn";
import FitbitSignIn from "./auth/FitbitSignIn";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout"; // Add missing import statement

export default function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route exact path="/home" element={<Dashboard />} />
            <Route exact path="/admin" element={<AdminDashboard />} />
            <Route exact path="/showProject" element={<ShowProject />} />
            <Route exact path="/newProject" element={<NewProject />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}> {/* Wrap nested routes inside a Route component */}
              <Route exact path="/auth/signin" element={<SignIn />} />
              <Route exact path="/auth/fitbitSignin" element={<FitbitSignIn />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
