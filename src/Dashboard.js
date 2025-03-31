import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

function Dashboard() {
    const { user, role, name: displayName, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!user) return <div className="text-red-500 p-10">Not logged in</div>;

  return (
    <div className="min-h-screen bg-green-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
      Welcome, {displayName || user.email} — Role: <span className="capitalize">{role}</span>
      </h1>

      {(role === "firefighter" || role === "admin") && (
        <div
          onClick={() => navigate("/probation-book")}
          className="cursor-pointer bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-bold">📘 View Probation Book</h2>
          <p className="text-sm text-gray-300">Track your progress and signoffs.</p>
        </div>
      )}

      {/* You can add officer/admin views here later */}
    </div>
  );
}

export default Dashboard;
