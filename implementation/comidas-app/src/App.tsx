import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './components/AppRoutes'
import { PlannerProvider } from './context/PlannerContext'
import { RecipeProvider } from './context/RecipeContext'

function App() {
  return (
    <RecipeProvider>
      <PlannerProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PlannerProvider>
    </RecipeProvider>
  )
}

export default App
