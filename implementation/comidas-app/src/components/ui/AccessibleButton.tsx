import { Button, type ButtonProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

interface AccessibleButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'navigation' | 'outline' | 'danger'
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
              _disabled: {
                bg: 'blue.600'
              }
            },
            _active: {
              bg: 'blue.800',
            },
            _disabled: {
              bg: 'gray.300',
              color: 'gray.500',
              cursor: 'not-allowed',
              _hover: {
                bg: 'gray.300',
                color: 'gray.500'
              }
            }
          }
        
        case 'navigation':
          if (isActive) {
            return {
              bg: 'blue.600',
              color: 'white',
              _hover: {
                bg: 'blue.700',
                _disabled: {
                  bg: 'blue.600'
                }
              },
              _active: {
                bg: 'blue.800',
              },
              _disabled: {
                bg: 'gray.300',
                color: 'gray.500',
                cursor: 'not-allowed',
                _hover: {
                  bg: 'gray.300',
                  color: 'gray.500'
                }
              }
            }
          }
          return {
            bg: 'transparent',
            color: 'gray.700',
            _hover: {
              bg: 'gray.100',
              color: 'gray.900',
              _disabled: {
                bg: 'transparent',
                color: 'gray.400'
              }
            },
            _active: {
              bg: 'gray.200',
            },
            _disabled: {
              color: 'gray.400',
              cursor: 'not-allowed',
              _hover: {
                bg: 'transparent',
                color: 'gray.400'
              }
            }
          }
        
        case 'ghost':
          return {
            bg: 'transparent',
            color: 'gray.700',
            _hover: {
              bg: 'gray.100',
              color: 'gray.900',
              _disabled: {
                bg: 'transparent',
                color: 'gray.400'
              }
            },
            _active: {
              bg: 'gray.200',
            },
            _disabled: {
              color: 'gray.400',
              cursor: 'not-allowed',
              _hover: {
                bg: 'transparent',
                color: 'gray.400'
              }
            }
          }
        
        case 'outline':
          return {
            bg: 'transparent',
            color: 'blue.600',
            border: '1px solid',
            borderColor: 'blue.600',
            _hover: {
              bg: 'blue.50',
              _disabled: {
                bg: 'transparent'
              }
            },
            _active: {
              bg: 'blue.100',
            },
            _disabled: {
              color: 'gray.400',
              borderColor: 'gray.300',
              cursor: 'not-allowed',
              _hover: {
                bg: 'transparent',
                color: 'gray.400',
                borderColor: 'gray.300'
              }
            }
          }
        
        case 'danger':
          return {
            bg: 'red.600',
            color: 'white',
            _hover: {
              bg: 'red.700',
              _disabled: {
                bg: 'red.600'
              }
            },
            _active: {
              bg: 'red.800',
            },
            _disabled: {
              bg: 'gray.300',
              color: 'gray.500',
              cursor: 'not-allowed',
              _hover: {
                bg: 'gray.300',
                color: 'gray.500'
              }
            }
          }
        
        case 'secondary':
        default:
          return {
            bg: 'gray.100',
            color: 'gray.900',
            border: '1px solid',
            borderColor: 'gray.300',
            _hover: {
              bg: 'gray.200',
              borderColor: 'gray.400',
              _disabled: {
                bg: 'gray.100',
                borderColor: 'gray.300'
              }
            },
            _active: {
              bg: 'gray.300',
            },
            _disabled: {
              bg: 'gray.50',
              color: 'gray.400',
              borderColor: 'gray.200',
              cursor: 'not-allowed',
              _hover: {
                bg: 'gray.50',
                color: 'gray.400',
                borderColor: 'gray.200'
              }
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