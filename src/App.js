import { BrowserRouter as Router, Route, Routes, Outlet, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminDashboard from "./admin/Dashboard";
import ShowProject from "./admin/ShowProject";
import NewProject from "./admin/NewProject";
import { auth } from "./firebase";
import SignIn from "./auth/SignIn";
import FitbitSignIn from "./auth/FitbitSignIn";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout"; // Add missing import statement
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Login from "./auth/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from "firebase/auth";


export default function App() {

  const [user, loading] = useAuthState(auth);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("user is signed in  ", uid);
    } else {
      // User is signed out
      console.log("user is signed out", user.uid);
    }
  });

  return (
    <div className="app">
      <Router>
        <Routes>
        <Route element={<ProtectedRoute user={user} />}>
            <Route exact path="/home" element={<Dashboard />} />
            <Route exact path="/admin" element={<AdminDashboard />} />
            <Route exact path="/showProject" element={<ShowProject />} />
            <Route exact path="/newProject" element={<NewProject />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}> {/* Wrap nested routes inside a Route component */}
              <Route exact path="/auth/login" element={<Login />} />
              <Route exact path="/auth/signin" element={<SignIn />} />
              <Route exact path="/auth/fitbitSignin" element={<FitbitSignIn />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
