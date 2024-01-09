import { onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminDashboard from "./admin/Dashboard";
import NewProject from "./admin/NewProject";
import ShowProject from "./admin/ShowProject";
import Login from "./auth/Login";
import OAuthCallback from "./auth/OAuthCallback";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { auth } from "./firebase";
import AuthLayout from "./layout/AuthLayout"; // Add missing import statement


export default function App() {
  const [user, loading] = useAuthState(auth);
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute user={user} />}>
            {/* <Route exact path="/" element={<Navigate to="/home" />} /> */}
            <Route exact path="/admin" element={<AdminDashboard />} />
            <Route exact path="/home" element={<Dashboard />} />
            <Route exact path="/showProject" element={<ShowProject />} />
            <Route exact path="/newProject" element={<NewProject />} />
            
          </Route>
          <Route path="/auth" element={<AuthLayout />}> {/* Wrap nested routes inside a Route component */}
            <Route exact path="/auth/login" element={<Login />} />
            <Route exact path="/auth/fitbit_callback" element={<OAuthCallback />} />
            {/* <Route exact path="/auth/signout" element={logout()} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}