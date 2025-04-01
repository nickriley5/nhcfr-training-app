import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./hooks/useAuth";
import { db } from "./firebase/firebaseConfig";

const sampleSkills = [
  {
    id: "ppe_bunker_scba",
    title: "PPE – Bunker Gear & SCBA",
    objective: "Demonstrate ability to don full bunker gear and SCBA within 60 seconds.",
    performance_steps: [
      "Don bunker gear completely",
      "Activate SCBA and secure facepiece",
      "Check air levels and regulator",
      "Complete donning in under 60 seconds"
    ]
  },
  {
    id: "hose_deployment",
    title: "Hose Deployment",
    objective: "Demonstrate deployment of 200' crosslay for fire attack.",
    performance_steps: [
      "Deploy hose from apparatus",
      "Extend fully to target",
      "Call for water",
      "Bleed line and confirm nozzle pattern"
    ]
  },
  {
    id: "ladder_throw",
    title: "Ladder Throw",
    objective: "Perform one-person throw of 24’ extension ladder.",
    performance_steps: [
      "Lift and carry ladder",
      "Position base correctly",
      "Extend fly section with control",
      "Lock fly and secure"
    ]
  }
];

function ProbationBook() {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fileInputs, setFileInputs] = useState({});

const toggleFileInput = (skillId) => {
  setFileInputs((prev) => ({
    ...prev,
    [skillId]: !prev[skillId]
  }));
};

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      const progressData = {};
      for (let skill of sampleSkills) {
        const ref = doc(db, "users", user.uid, "probation_progress", skill.id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          progressData[skill.id] = data.status;
          if (data.note) {
            progressData[skill.id + "_note"] = data.note;
          }
        } else {
          progressData[skill.id] = "not_started";
        }
        
      }
      setProgress(progressData);
      setIsLoading(false);
    };

    fetchProgress();
  }, [user]);

  const toggleStatus = async (skillId) => {
    const currentStatus = progress[skillId];
    const newStatus =
    currentStatus === "awaiting_signoff" ? "not_started" : "awaiting_signoff";

    const ref = doc(db, "users", user.uid, "probation_progress", skillId);
    await setDoc(ref, { status: newStatus });

    setProgress((prev) => ({
      ...prev,
      [skillId]: newStatus
    }));
  };

  if (loading || isLoading) return <div className="text-white p-10">Loading Probation Book...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📘 Probation Book</h1>
      <div className="grid gap-6">
        {sampleSkills.map((skill) => (
          <div key={skill.id} className="bg-slate-800 p-5 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{skill.title}</h2>
              <button
  onClick={() => toggleStatus(skill.id)}
  className={`px-3 py-1 text-sm rounded ${
    progress[skill.id] === "signed_off"
      ? "bg-green-600"
      : progress[skill.id] === "awaiting_signoff"
      ? "bg-yellow-400 text-black"
      : "bg-slate-600"
  }`}
>
  {progress[skill.id] === "signed_off"
    ? "Signed Off ✅"
    : progress[skill.id] === "awaiting_signoff"
    ? "Awaiting Signoff"
    : "Mark Complete"}
</button>

            </div>
            <p className="mb-3 text-sm text-gray-300">{skill.objective}</p>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
              {skill.performance_steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            {progress[skill.id + "_note"] && progress[skill.id] === "signed_off" && (
  <p className="text-xs text-green-400 mt-2 italic">
    ✅ Officer Note: {progress[skill.id + "_note"]}
  </p>
)}

            <div className="mt-4">
  <button
    onClick={() => toggleFileInput(skill.id)}
    className="text-sm underline text-blue-400"
  >
    📤 Upload Video or File
  </button>

  {fileInputs[skill.id] && (
    <div className="mt-2 text-sm text-gray-400">
      <input
        type="file"
        disabled
        className="mb-1 bg-slate-700 p-2 rounded cursor-not-allowed"
      />
      <p className="text-xs italic text-red-400">
        ⚠️ Upload disabled — upgrade to enable this feature
      </p>
    </div>
  )}
</div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default ProbationBook;
