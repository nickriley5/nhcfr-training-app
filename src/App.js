import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProbationBook from "./ProbationBook";
import OfficerSignoffs from "./OfficerSignoffs";
import OfficerUserDetails from "./OfficerUserDetails";
import ProgressDashboard from "./ProgressDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/probation-book" element={<ProbationBook />} />
        <Route path="/officer-signoffs" element={<OfficerSignoffs />} />
        <Route path="/officer-signoffs/:uid" element={<OfficerUserDetails />} />
        <Route path="/progress-dashboard" element={<ProgressDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
