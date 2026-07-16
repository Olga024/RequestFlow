import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { FiltersProvider } from './context/FiltersContext'
import { DataContextProvider } from './context/DataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DataContextProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </DataContextProvider>
    </BrowserRouter>
  </StrictMode>
)
