import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { useAuth } from "./hooks/useAuth";

function OfficerUserDetails() {
  const { uid } = useParams();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [skills, setSkills] = useState([]);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const fetchUserSkills = async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setName(userDoc.data().name || userDoc.data().email);
      }

      const skillSnap = await getDocs(collection(db, "users", uid, "probation_progress"));
      const awaitingSkills = [];

      skillSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === "awaiting_signoff") {
          awaitingSkills.push({ id: docSnap.id, ...data });
        }
      });

      setSkills(awaitingSkills);
    };

    fetchUserSkills();
  }, [uid]);

  const handleSignOff = async (skillId) => {
    const ref = doc(db, "users", uid, "probation_progress", skillId);
    await updateDoc(ref, {
        status: "signed_off",
        officer: user.email,
        signedOffAt: new Date(),
        note: notes[skillId] || ""
      });
      

    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const handleNoteChange = (skillId, value) => {
    setNotes((prev) => ({
      ...prev,
      [skillId]: value
    }));
  };
  

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">👤 {name}</h1>
      <h2 className="text-xl mb-6 text-yellow-400">Awaiting Signoff</h2>

      {skills.length === 0 ? (
        <p className="text-gray-400">No pending skills for this user.</p>
      ) : (
        <div className="space-y-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-slate-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{skill.id.replace(/_/g, " ")}</h3>
                <p className="text-sm text-gray-400">Status: {skill.status}</p>
              </div>
              <textarea
  value={notes[skill.id] || ""}
  onChange={(e) => handleNoteChange(skill.id, e.target.value)}
  placeholder="Add signoff note..."
  className="w-full bg-slate-700 text-white text-sm p-2 rounded mb-2"
></textarea>
              <button
                onClick={() => handleSignOff(skill.id)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
              >
                ✅ Sign Off
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OfficerUserDetails;
