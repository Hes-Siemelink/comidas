import { Box, Container, Heading, Text, VStack, SimpleGrid, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RecipeIcon, PlannerIcon, CookingIcon } from './icons'
import AccessibleButton from './ui/AccessibleButton'

interface FeatureAction {
  labelKey: string
  ariaLabelKey: string
  route: string
  variant: 'primary' | 'secondary'
}

interface FeatureSectionProps {
  title: string
  description: string
  icon?: React.ReactNode
  featureType: 'interactive' | 'placeholder'
  themeColor?: 'blue' | 'green'
  actions?: FeatureAction[]
}

function FeatureSection({ 
  title, 
  description, 
  icon, 
  featureType, 
  themeColor = 'blue', 
  actions = [] 
}: FeatureSectionProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const isPlaceholder = featureType === 'placeholder'
  const isInteractive = featureType === 'interactive'
  
  const getThemeColors = () => {
    const colors = {
      blue: { main: 'blue.500', hover: 'blue.300' },
      green: { main: 'green.500', hover: 'green.300' }
    }
    return colors[themeColor]
  }
  
  const themeColors = getThemeColors()

  return (
    <Box 
      p={6} 
      borderRadius="lg" 
      border="1px" 
      borderColor={isPlaceholder ? "gray.200" : "gray.300"}
      bg={isPlaceholder ? "gray.50" : "white"}
      textAlign="center"
      minH="200px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      _hover={isInteractive ? { 
        shadow: "md", 
        borderColor: themeColors.hover 
      } : undefined}
      transition="all 0.2s"
    >
      <VStack gap={4}>
        {icon && (
          <Box color={isPlaceholder ? "gray.400" : themeColors.main}>
            {icon}
          </Box>
        )}
        <Heading as="h3" size="md" color={isPlaceholder ? "gray.400" : "gray.700"}>
          {title}
        </Heading>
        <Text color={isPlaceholder ? "gray.400" : "gray.600"} mb={isInteractive ? 4 : 0}>
          {description}
        </Text>
        
        {isInteractive && actions.length > 0 && (
          <HStack gap={3} justify="center" flexWrap="wrap">
            {actions.map((action, index) => (
              <AccessibleButton
                key={index}
                variant={action.variant}
                size="sm"
                onClick={() => navigate(action.route)}
                aria-label={t(action.ariaLabelKey)}
              >
                {t(action.labelKey)}
              </AccessibleButton>
            ))}
          </HStack>
        )}
        
        {isPlaceholder && (
          <Text fontSize="xs" color="gray.400" fontStyle="italic">
            Coming soon...
          </Text>
        )}
      </VStack>
    </Box>
  )
}

function HomePage() {
  const { t } = useTranslation()

  // Feature action configurations
  const recipeActions: FeatureAction[] = [
    {
      labelKey: 'recipes.addNew',
      ariaLabelKey: 'recipes.addNewAriaLabel',
      route: '/recipes/new',
      variant: 'primary'
    },
    {
      labelKey: 'recipes.browseAll',
      ariaLabelKey: 'recipes.browseAllAriaLabel',
      route: '/recipes',
      variant: 'secondary'
    }
  ]

  const plannerActions: FeatureAction[] = [
    {
      labelKey: 'planner.planThisWeek',
      ariaLabelKey: 'planner.planThisWeekAriaLabel',
      route: '/planner/week',
      variant: 'primary'
    },
    {
      labelKey: 'planner.viewFull',
      ariaLabelKey: 'planner.viewFullAriaLabel',
      route: '/planner',
      variant: 'secondary'
    }
  ]

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center" py={8}>
          <VStack gap={4}>
            <Heading as="h1" size="2xl" color="gray.800">
              {t('app.title', 'Family Recipe App')}
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              {t('app.description', 'Record recipes, plan family meals and have a handy assistant while cooking!')}
            </Text>
          </VStack>
        </Box>

        {/* Main Features Grid */}
        <Box>
          <Heading as="h2" size="lg" textAlign="center" mb={6} color="gray.700">
            {t('home.features.title', 'Main Features')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {/* Recipe Database Section */}
            <FeatureSection
              title={t('recipes.title', 'Recipe Database')}
              description={t('recipes.description', 'Browse and manage your family recipes.')}
              icon={<RecipeIcon size="xl" />}
              featureType="interactive"
              themeColor="blue"
              actions={recipeActions}
            />
            
            {/* Meal Planner Section */}
            <FeatureSection
              title={t('planner.title', 'Meal Planner')}
              description={t('planner.description', 'Plan your weekly family meals.')}
              icon={<PlannerIcon size="xl" />}
              featureType="interactive"
              themeColor="green"
              actions={plannerActions}
            />
            
            {/* Cooking Assistant Section */}
            <FeatureSection
              title={t('cooking.title', 'Cooking Assistant')}
              description={t('cooking.description', 'Step-by-step cooking guidance and timers.')}
              icon={<CookingIcon size="xl" />}
              featureType="placeholder"
            />
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  )
}

export default HomePage