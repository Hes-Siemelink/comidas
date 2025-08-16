import { Box, HStack, VStack } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import AccessibleButton from './ui/AccessibleButton'

function Navigation() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box as="nav" p={4} borderBottom="1px" borderColor="gray.200">
      <VStack gap={4}>
        <LanguageSwitcher />
        
        <HStack gap={4}>
          <AccessibleButton 
            onClick={() => navigate('/')}
            variant="navigation"
            isActive={location.pathname === '/'}
            size="sm"
          >
            {t('nav.home', 'Home')}
          </AccessibleButton>
          <AccessibleButton 
            onClick={() => navigate('/recipes')}
            variant="navigation"
            isActive={location.pathname === '/recipes'}
            size="sm"
          >
            {t('nav.recipes', 'Recipes')}
          </AccessibleButton>
          <AccessibleButton 
            onClick={() => navigate('/planner')}
            variant="navigation"
            isActive={location.pathname === '/planner'}
            size="sm"
          >
            {t('nav.planner', 'Planner')}
          </AccessibleButton>
          <AccessibleButton 
            onClick={() => navigate('/cooking')}
            variant="navigation"
            isActive={location.pathname === '/cooking'}
            size="sm"
          >
            {t('nav.cooking', 'Cooking')}
          </AccessibleButton>
        </HStack>
      </VStack>
    </Box>
  )
}

export default Navigation