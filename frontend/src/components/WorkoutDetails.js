import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(workout.title);
  const [load, setLoad] = useState(workout.load);
  const [reps, setReps] = useState(workout.reps);
  const [error, setError] = useState(null);

  // Handle DELETE workout
  const handleDelete = async () => {
    if (!user) return;

    const response = await fetch(`/api/workouts/${workout._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: workout });
    }
  };

  // Handle EDIT workout
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const updatedWorkout = { title, load, reps };

    const response = await fetch(`/api/workouts/${workout._id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedWorkout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    } else {
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
      setIsEditing(false); // Close edit form after saving
    }
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleEdit} className="edit-form">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>

          <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
          <button onClick={handleDelete}>🗑 Delete</button>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
