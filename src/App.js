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
  
  onAuthStateChanged(auth, (user) => {
    if (loading) { 
      // if auth state is loading
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("user is signed in  ", uid);
    } else {
      // User is signed out
      console.log("user is signed out");
    }
  });

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route exact path="/home" element={<Dashboard />} />
            <Route exact path="/admin" element={<AdminDashboard />} />
            <Route exact path="/showProject" element={<ShowProject />} />
            <Route exact path="/newProject" element={<NewProject />} />
            
          </Route>
          <Route path="/auth" element={<AuthLayout />}> {/* Wrap nested routes inside a Route component */}
            <Route exact path="/auth/login" element={<Login />} />
              <Route exact path="/auth/fitbit_callback" element={<OAuthCallback />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
sd