import { useState } from 'react'
import { Input, HStack, Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import AccessibleButton from '../ui/AccessibleButton'

interface RecipeSearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  currentSearchQuery?: string
}

function RecipeSearchBar({ onSearch, placeholder, disabled = false, currentSearchQuery }: RecipeSearchBarProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery.trim())
  }

  const handleClear = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <HStack gap={2}>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder || t('recipes.search.placeholder', 'Search recipes by name...')}
            disabled={disabled}
            flex={1}
          />
          <AccessibleButton
            type="submit"
            variant="outline"
            disabled={disabled}
            aria-label={t('recipes.search.button', 'Search recipes')}
          >
            {t('recipes.search.search', 'Search')}
          </AccessibleButton>
          {(searchQuery || currentSearchQuery) && (
            <AccessibleButton
              variant="ghost"
              onClick={handleClear}
              disabled={disabled}
              aria-label={t('recipes.search.clear', 'Clear search')}
            >
              {t('recipes.search.clear', 'Clear')}
            </AccessibleButton>
          )}
        </HStack>
      </form>
    </Box>
  )
}

export default RecipeSearchBar