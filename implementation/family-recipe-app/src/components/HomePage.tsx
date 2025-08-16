import { Box, Container, Heading, Text, VStack, SimpleGrid, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RecipeIcon, PlannerIcon, CookingIcon } from './icons'
import AccessibleButton from './ui/AccessibleButton'

interface FeatureSectionProps {
  title: string
  description: string
  placeholder?: boolean
  icon?: React.ReactNode
}

interface RecipeDatabaseSectionProps {
  title: string
  description: string
  icon?: React.ReactNode
}

function RecipeDatabaseSection({ title, description, icon }: RecipeDatabaseSectionProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box 
      p={6} 
      borderRadius="lg" 
      border="1px" 
      borderColor="gray.300"
      bg="white"
      textAlign="center"
      minH="200px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      _hover={{ shadow: "md", borderColor: "blue.300" }}
      transition="all 0.2s"
    >
      <VStack gap={4}>
        {icon && (
          <Box color="blue.500">
            {icon}
          </Box>
        )}
        <Heading as="h3" size="md" color="gray.700">
          {title}
        </Heading>
        <Text color="gray.600" mb={4}>
          {description}
        </Text>
        <HStack gap={3} justify="center" flexWrap="wrap">
          <AccessibleButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/recipes')}
            aria-label={t('recipes.browseAllAriaLabel')}
          >
            {t('recipes.browseAll')}
          </AccessibleButton>
          <AccessibleButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/recipes/new')}
            aria-label={t('recipes.addNewAriaLabel')}
          >
            {t('recipes.addNew')}
          </AccessibleButton>
        </HStack>
      </VStack>
    </Box>
  )
}

function FeatureSection({ title, description, placeholder = false, icon }: FeatureSectionProps) {
  return (
    <Box 
      p={6} 
      borderRadius="lg" 
      border="1px" 
      borderColor={placeholder ? "gray.200" : "gray.300"}
      bg={placeholder ? "gray.50" : "white"}
      textAlign="center"
      minH="200px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <VStack gap={4}>
        {icon && (
          <Box>
            {icon}
          </Box>
        )}
        <Heading as="h3" size="md" color={placeholder ? "gray.400" : "gray.700"}>
          {title}
        </Heading>
        <Text color={placeholder ? "gray.400" : "gray.600"}>
          {description}
        </Text>
        {placeholder && (
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
            <RecipeDatabaseSection
              title={t('recipes.title', 'Recipe Database')}
              description={t('recipes.description', 'Browse and manage your family recipes.')}
              icon={<RecipeIcon size="xl" />}
            />
            
            {/* Meal Planner Section */}
            <FeatureSection
              title={t('planner.title', 'Meal Planner')}
              description={t('planner.description', 'Plan your weekly family meals.')}
              placeholder={true}
              icon={<PlannerIcon size="xl" />}
            />
            
            {/* Cooking Assistant Section */}
            <FeatureSection
              title={t('cooking.title', 'Cooking Assistant')}
              description={t('cooking.description', 'Step-by-step cooking guidance and timers.')}
              placeholder={true}
              icon={<CookingIcon size="xl" />}
            />
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  )
}

export default HomePage