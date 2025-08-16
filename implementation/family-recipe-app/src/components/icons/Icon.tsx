import { Box, type BoxProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export type IconSize = 'sm' | 'md' | 'lg' | 'xl'

interface IconProps extends Omit<BoxProps, 'children'> {
  size?: IconSize
  children: React.ReactNode
  'aria-label'?: string
}

const sizeMap: Record<IconSize, string> = {
  sm: '48px',
  md: '72px', 
  lg: '96px',
  xl: '144px'
}

/**
 * Reusable icon wrapper component that provides consistent sizing and styling
 * Integrates with Chakra UI theming system and ensures accessibility
 */
const Icon = forwardRef<HTMLDivElement, IconProps>(
  ({ size = 'md', children, 'aria-label': ariaLabel, ...props }, ref) => {
    const iconSize = sizeMap[size]
    
    return (
      <Box
        ref={ref}
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        width={iconSize}
        height={iconSize}
        flexShrink={0}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        {...props}
        sx={{
          '& > svg': {
            width: '100%',
            height: '100%',
            fontSize: iconSize,
          },
          '& > *': {
            width: '100%',
            height: '100%',
            fontSize: iconSize,
          },
          fontSize: iconSize, // For React Icons that inherit font-size
          ...props.sx
        }}
      >
        {children}
      </Box>
    )
  }
)

Icon.displayName = 'Icon'

export default Icon