import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TasksListView from './features/tasks/pages/TasksListView'
import CreateTaskView from './features/tasks/pages/CreateTaskView'
import TaskDetailsView from './features/tasks/pages/TaskDetailsView'
import EditTaskView from './features/tasks/pages/EditTaskView'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TasksListView />} />
        <Route path="/tasks/create" element={<CreateTaskView />} />
        <Route path="/tasks/:id" element={<TaskDetailsView />} />
        <Route path="/tasks/:id/edit" element={<EditTaskView />} />
        <Route path="*" element={<p>Not found. Please contact support</p>} />
      </Routes>
    </BrowserRouter>
  )
}
