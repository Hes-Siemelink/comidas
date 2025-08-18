import { useState, useRef, useEffect, forwardRef } from 'react'
import { VStack, Input, Text, Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import type { ComidasWeek } from '../../types/schemas'

// Helper functions
const focusInput = (inputRef: React.RefObject<HTMLInputElement> | React.ForwardedRef<HTMLInputElement>) => {
  if (inputRef && 'current' in inputRef && inputRef.current) {
    inputRef.current.focus()
  }
}

interface QuickPlanningFormProps {
  week: ComidasWeek
  onAddMeal: (mealTitle: string) => Promise<void>
  onComplete?: () => void
  placeholder?: string
}

const QuickPlanningForm = forwardRef<HTMLInputElement, QuickPlanningFormProps>(
  function QuickPlanningForm({ 
    week,
    onAddMeal,
    onComplete, 
    placeholder
  }, externalRef) {
    const { t } = useTranslation()
    const [currentInput, setCurrentInput] = useState('')
    const internalRef = useRef<HTMLInputElement>(null)
    
    // Use external ref if provided, otherwise use internal ref
    const inputRef = externalRef || internalRef

    const canAddMore = !!week // Can always add more meals in dynamic mode

    useEffect(() => {
      // Auto-focus input when component mounts
      focusInput(inputRef)
    }, [inputRef])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentInput.trim() || !canAddMore) return

    try {
      await onAddMeal(currentInput.trim())
      setCurrentInput('')
      
      // Keep focus on input for rapid entry
      focusInput(inputRef)

      // Call completion callback if provided
      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error('Failed to add meal:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  if (!week) {
    return (
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text color="gray.600">
          {t('planner.quickForm.noWeek', 'Create a new week to start planning meals')}
        </Text>
      </Box>
    )
  }

  return (
    <VStack gap={3} align="stretch">
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder || 
            t('planner.quickForm.placeholder', 'Type meal and press Enter...')
          }
          disabled={!canAddMore}
          bg="white"
          size="lg"
          autoComplete="off"
        />
      </form>
      
      <Box fontSize="sm" color="gray.600">
        <Text>
          {t('planner.quickForm.addMealHint', 'Type a meal name and press Enter to add')}
        </Text>
      </Box>
    </VStack>
  )
})

export default QuickPlanningForm