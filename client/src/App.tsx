import { Route, Routes } from 'react-router-dom'
import './App.css'
import { RequestsList } from './pages/RequestsList'
import { RequestCreate } from './pages/RequestCreate'
import { EmployeesList } from './pages/EmployeesList'
import { Reports } from './pages/Reports'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<RequestsList />} />
        <Route path="/create" element={<RequestCreate />} />
        <Route path="/employees" element={<EmployeesList />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </>
  )
}

export default App;
