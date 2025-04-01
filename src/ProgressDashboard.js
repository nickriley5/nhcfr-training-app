import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase/firebaseConfig";
import { useAuth } from "./hooks/useAuth";

function ProgressDashboard() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const totalSkills = 3; // Update if you have more in the future

  useEffect(() => {
    if (role !== "officer" && role !== "admin") return;

    const fetchUsers = async () => {
      const userSnap = await getDocs(collection(db, "users"));
      const fireUsers = [];

      for (let userDoc of userSnap.docs) {
        const userData = userDoc.data();
        if (userData.role === "firefighter") {
          const progressSnap = await getDocs(collection(db, "users", userDoc.id, "probation_progress"));
          let completed = 0;

          progressSnap.forEach((docSnap) => {
            if (docSnap.data().status === "signed_off") {
              completed++;
            }
          });

          fireUsers.push({
            id: userDoc.id,
            name: userData.name || userData.email,
            completed
          });
        }
      }

      setUsers(fireUsers);
    };

    fetchUsers();
  }, [role]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Department Progress Dashboard</h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No firefighter progress found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const percent = Math.round((user.completed / totalSkills) * 100);

            return (
              <div
                key={user.id}
                className="bg-slate-800 p-4 rounded-lg flex justify-between items-center hover:bg-slate-700 cursor-pointer"
                onClick={() => navigate(`/officer-signoffs/${user.id}`)}
              >
                <div>
                  <h2 className="font-bold text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-400">
                    {user.completed} of {totalSkills} skills signed off
                  </p>
                </div>
                <div className="flex items-center gap-3">
  <div className="w-40 h-3 bg-slate-600 rounded">
    <div
      className="h-3 bg-green-500 rounded"
      style={{ width: `${percent}%` }}
    ></div>
  </div>
  <span className="text-sm text-gray-300">{percent}%</span>
</div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProgressDashboard;
