import { useEffect, useState } from "react";
import { collectionGroup, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

function OfficerSignoffs() {
  const [userSkillCounts, setUserSkillCounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingSkills = async () => {
      const snapshot = await getDocs(collectionGroup(db, "probation_progress"));
      const userMap = {};

      for (let docSnap of snapshot.docs) {
        const pathParts = docSnap.ref.path.split("/");
        const userId = pathParts[1]; // users/{userId}/probation_progress/{skillId}
        const data = docSnap.data();

        if (data.status === "awaiting_signoff") {
          if (!userMap[userId]) {
            userMap[userId] = { count: 0 };
          }
          userMap[userId].count++;
        }
      }

      // Add names from users collection
      const usersWithNames = await Promise.all(
        Object.entries(userMap).map(async ([uid, info]) => {
          const userDoc = await getDoc(doc(db, "users", uid));
          return {
            uid,
            name: userDoc.exists() ? userDoc.data().name || userDoc.data().email : uid,
            count: info.count
          };
        })
      );

      setUserSkillCounts(usersWithNames);
    };

    fetchPendingSkills();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📘 Probation Book Signoffs</h1>
      {userSkillCounts.length === 0 ? (
        <p className="text-gray-400">No users currently have skills awaiting signoff.</p>
      ) : (
        <div className="space-y-4">
          {userSkillCounts.map((user) => (
            <div
              key={user.uid}
              className="bg-slate-800 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p className="text-sm text-yellow-300">
                  {user.count} skill{user.count > 1 ? "s" : ""} awaiting signoff
                </p>
              </div>
              {/* 🔜 Future: navigate to detailed view per user */}
              <button
                onClick={() => navigate(`/officer-signoffs/${user.uid}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                >
                  View Details
                </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OfficerSignoffs;
