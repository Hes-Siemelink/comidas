import { Button, type ButtonProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

interface AccessibleButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'navigation'
  isActive?: boolean
}

/**
 * Accessible button component with high contrast variants
 * Ensures WCAG AA compliance with 4.5:1 contrast ratio minimum
 */
const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ variant = 'secondary', isActive = false, ...props }, ref) => {
    const getButtonStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            bg: 'blue.600',
            color: 'white',
            _hover: {
              bg: 'blue.700',
            },
            _active: {
              bg: 'blue.800',
            }
          }
        
        case 'navigation':
          if (isActive) {
            return {
              bg: 'blue.600',
              color: 'white',
              _hover: {
                bg: 'blue.700',
              },
              _active: {
                bg: 'blue.800',
              }
            }
          }
          return {
            bg: 'transparent',
            color: 'gray.700',
            _hover: {
              bg: 'gray.100',
              color: 'gray.900',
            },
            _active: {
              bg: 'gray.200',
            }
          }
        
        case 'ghost':
          return {
            bg: 'transparent',
            color: 'gray.700',
            _hover: {
              bg: 'gray.100',
              color: 'gray.900',
            },
            _active: {
              bg: 'gray.200',
            }
          }
        
        case 'secondary':
        default:
          return {
            bg: 'gray.100',
            color: 'gray.900',
            _hover: {
              bg: 'gray.200',
            },
            _active: {
              bg: 'gray.300',
            }
          }
      }
    }

    return (
      <Button
        ref={ref}
        {...getButtonStyles()}
        _focus={{
          boxShadow: '0 0 0 2px blue.500',
          outline: 'none',
        }}
        {...props}
      />
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton