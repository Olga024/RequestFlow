import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { EmployeesProvider } from './context/EmployeesContext'
import { RequestsProvider } from './context/RequestsContext'
import { FiltersProvider } from './context/FiltersContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EmployeesProvider>
        <RequestsProvider>
          <FiltersProvider>
            <App />
          </FiltersProvider>
        </RequestsProvider>
      </EmployeesProvider>
    </BrowserRouter>
  </StrictMode>
)
