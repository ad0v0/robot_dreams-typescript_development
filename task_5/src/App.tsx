import { useState } from 'react'

import Tasks from './components/Tasks'
import CreateTaskForm from './components/CreateTaskForm'
import './style.css'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <h1>Tasks</h1>
      <div className="container">
        <Tasks
          key={refreshKey}
        />
        <CreateTaskForm
          onCreated={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </>
  )
}
export default App
