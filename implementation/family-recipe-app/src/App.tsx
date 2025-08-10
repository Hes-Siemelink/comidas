import { useState } from 'react'
import { Box, Button, Heading, Text, VStack, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  const { t, i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <Box p={8} textAlign="center">
      <VStack gap={6}>
        <HStack gap={4}>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </HStack>
        
        <Heading>{t('hello')}</Heading>
        <Text>{t('welcome')}</Text>
        
        <HStack gap={2}>
          <Button 
            size="sm"
            variant={i18n.language === 'en' ? 'solid' : 'outline'}
            onClick={() => changeLanguage('en')}
          >
            English
          </Button>
          <Button 
            size="sm"
            variant={i18n.language === 'es' ? 'solid' : 'outline'}
            onClick={() => changeLanguage('es')}
          >
            Español
          </Button>
          <Button 
            size="sm"
            variant={i18n.language === 'nl' ? 'solid' : 'outline'}
            onClick={() => changeLanguage('nl')}
          >
            Nederlands
          </Button>
        </HStack>
        
        <Button 
          colorScheme="blue" 
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
        
        <Text fontSize="sm" color="gray.500">
          Edit <code>src/App.tsx</code> and save to test HMR
        </Text>
      </VStack>
    </Box>
  )
}

export default App
