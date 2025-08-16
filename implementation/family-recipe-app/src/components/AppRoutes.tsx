import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navigation from './Navigation'
import HomePage from './HomePage'
import RecipesPage from './RecipesPage'
import PlannerPage from './PlannerPage'
import CookingPage from './CookingPage'

function AppRoutes() {
  return (
    <Box minH="100vh">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/cooking" element={<CookingPage />} />
      </Routes>
    </Box>
  )
}

export default AppRoutes