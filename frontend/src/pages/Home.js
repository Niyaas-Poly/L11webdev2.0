import { useEffect, useState, useCallback } from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch workouts function (memoized to prevent recreation)
  const fetchWorkouts = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/workouts', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (!response.ok) throw new Error(json.error || 'Failed to fetch workouts')

      dispatch({ type: 'SET_WORKOUTS', payload: json })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [dispatch, user])

  // Fetch workouts on mount and when `user` changes
  useEffect(() => {
    fetchWorkouts()
  }, [fetchWorkouts])

  return (
    <div className="home">
      <div className="workouts">
        {loading && <p>Loading workouts...</p>}
        {error && <p className="error">{error}</p>}
        {workouts?.map(workout => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  )
}

export default Home
