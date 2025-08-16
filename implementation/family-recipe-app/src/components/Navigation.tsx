import { Box, Button, HStack, VStack } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

function Navigation() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box as="nav" p={4} borderBottom="1px" borderColor="gray.200">
      <VStack gap={4}>
        <LanguageSwitcher />
        
        <HStack gap={4}>
          <Button 
            onClick={() => navigate('/')}
            variant={location.pathname === '/' ? 'solid' : 'ghost'}
            size="sm"
          >
            {t('nav.home', 'Home')}
          </Button>
          <Button 
            onClick={() => navigate('/recipes')}
            variant={location.pathname === '/recipes' ? 'solid' : 'ghost'}
            size="sm"
          >
            {t('nav.recipes', 'Recipes')}
          </Button>
          <Button 
            onClick={() => navigate('/planner')}
            variant={location.pathname === '/planner' ? 'solid' : 'ghost'}
            size="sm"
          >
            {t('nav.planner', 'Planner')}
          </Button>
          <Button 
            onClick={() => navigate('/cooking')}
            variant={location.pathname === '/cooking' ? 'solid' : 'ghost'}
            size="sm"
          >
            {t('nav.cooking', 'Cooking')}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default Navigation