import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './components/AppRoutes'
import { PlannerProvider } from './context/PlannerContext'

function App() {
  return (
    <PlannerProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PlannerProvider>
  )
}

export default App
