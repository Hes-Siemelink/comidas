import { Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <HStack gap={2}>
      <Button 
        size="sm"
        variant="outline"
        fontWeight={i18n.language === 'en' ? 'bold' : 'normal'}
        onClick={() => changeLanguage('en')}
      >
        English
      </Button>
      <Button 
        size="sm"
        variant="outline"
        fontWeight={i18n.language === 'es' ? 'bold' : 'normal'}
        onClick={() => changeLanguage('es')}
      >
        Español
      </Button>
      <Button 
        size="sm"
        variant="outline"
        fontWeight={i18n.language === 'nl' ? 'bold' : 'normal'}
        onClick={() => changeLanguage('nl')}
      >
        Nederlands
      </Button>
    </HStack>
  )
}

export default LanguageSwitcher