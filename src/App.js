import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminDashboard from "./admin/Dashboard";
import ShowProject from "./admin/ShowProject";
import NewProject from "./admin/NewProject";
import SignIn from "./auth/SignIn";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/admin" element={<AdminDashboard />} />
          <Route exact path="/showProject" element={<ShowProject />} />
          <Route exact path="/newProject" element={<NewProject />} />
          <Route exact path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;