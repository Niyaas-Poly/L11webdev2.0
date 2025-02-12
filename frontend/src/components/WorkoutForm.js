import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("❌ You must be logged in to add workouts.");
      return;
    }

    const workout = { title, load, reps };
    console.log("📢 Submitting Workout:", workout); // Debugging Log

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      console.log("📢 API Response:", json); // Debugging Log

      if (!response.ok) {
        setError(json.error || "Something went wrong!");
        setEmptyFields(json.emptyFields || []);
      } else {
        console.log("✅ Workout Added Successfully:", json);
        setTitle("");
        setLoad("");
        setReps("");
        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_WORKOUT", payload: json });
      }
    } catch (err) {
      console.error("❌ Workout submission error:", err.message);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Load (in kg):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes("load") ? "error" : ""}
      />

      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
