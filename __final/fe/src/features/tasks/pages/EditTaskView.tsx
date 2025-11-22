import { useParams } from 'react-router-dom'
import EditTaskForm from '../components/EditTaskForm'

export default function EditTaskView() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <p>Missing task id</p>
    )
  }

  return (
    <main>
      <h1>Edit Task</h1>
      <EditTaskForm id={id} />
    </main>
  )
}
