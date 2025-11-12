import { useNavigate } from 'react-router-dom'
import CreateTaskForm from '../components/CreateTaskForm'

export default function CreateTaskPage() {
  const navigate = useNavigate()

  const handleCreated = () => {
    navigate('/tasks')
  }

  return (
    <main>
      <h1>Create Task</h1>
      <CreateTaskForm onCreated={handleCreated} />
    </main>
  )
}
