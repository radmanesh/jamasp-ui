import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminDashboard from "./admin/AdminDashboard";
import NewProject from "./admin/NewProject";
import ShowProject from "./admin/ShowProject";
import { AuthContext } from './auth/AuthContext';
import Login from "./auth/Login";
import OAuthCallback from "./auth/OAuthCallback";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { auth, logout } from "./firebase";
import AuthLayout from "./layout/AuthLayout";
import BlankLayout from "./layout/BlankLayout";
import NotFound from "./pages/NotFound";
import Users from "./admin/pages/Users";
import About from "./pages/About";
import ShowUser from "./admin/pages/ShowUser";
import UserProfile from "./pages/UserProfile";

// eslint-disable-next-line import/no-anonymous-default-export

export default function App() {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="app">
      <AuthContext.Provider value={{ user, loading }}>
        <Router future={{ v7_startTransition: true }}>
          <Routes>
            <Route path="/" element={<ProtectedRoute user={user} loading={loading} />}>
              <Route exact path="/" element={<Navigate to="/home" replace />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/home" element={<Dashboard />} />
              <Route exact path="/profile" element={<UserProfile />} />
              <Route exact path="/admin" element={<AdminDashboard />} />
              <Route exact path="/admin/showProject/:projectId" element={<ShowProject />} />
              <Route exact path="/admin/newProject" element={<NewProject />} />
              <Route exact path="/admin/users" element={<Users />} />
              <Route path="/admin/users/:userId" element={<ShowUser />} />
              {/* I don't know why the logout route makes the user to logout immediately. */}
              {/* Also after figuring that out, where to place it here or under /auth route */}
              {/* <Route exact path="/auth/signout" element={logout()} /> */}
            </Route>
            <Route path="/auth" element={<AuthLayout />} > {/* Wrap nested routes inside a Route component */}
              <Route exact path="/auth/login" element={<Login />} />
              <Route exact path="/auth/fitbit_callback" element={<OAuthCallback />} />
              <Route path="*" element={<Navigate to="/notFound" />} />
            </Route>
            <Route path="/" element={<BlankLayout />} >
              <Route exact path="/notFound" element={<NotFound />} /> {/* Add a route for the 404 page */}
              <Route path="*" element={<Navigate to="/notFound" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}