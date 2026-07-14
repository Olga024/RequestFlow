import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { RequestsList } from './pages/RequestsList'
import { RequestCreate } from './pages/RequestCreate'
import { EmployeesList } from './pages/EmployeesList'
import { Reports } from './pages/Reports'

function App() {

  return (
    <>
      <nav className="app-nav">
        <Link to="/">Заявки</Link>
        <Link to="/create">Создать</Link>
        <Link to="/employees">Сотрудники</Link>
        <Link to="/reports">Отчёты</Link>
      </nav>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<RequestsList />} />
          <Route path="/create" element={<RequestCreate />} />
          <Route path="/employees" element={<EmployeesList />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
