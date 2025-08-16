import { IoBook, IoCalendar, IoRestaurant } from 'react-icons/io5'
import Icon, { type IconSize } from './Icon'

interface FeatureIconProps {
  size?: IconSize
  color?: string
}

const sizeMap: Record<IconSize, string> = {
  sm: '48px',
  md: '72px', 
  lg: '96px',
  xl: '144px'
}

/**
 * Recipe Database icon - Uses book icon to represent recipe collection
 */
export function RecipeIcon({ size = 'md', color = 'blue.500', ...props }: FeatureIconProps) {
  const iconSize = sizeMap[size]
  return (
    <Icon 
      size={size} 
      color={color}
      aria-label="Recipe Database"
      {...props}
    >
      <IoBook size={iconSize} />
    </Icon>
  )
}

/**
 * Meal Planner icon - Uses calendar icon to represent meal planning
 */
export function PlannerIcon({ size = 'md', color = 'green.500', ...props }: FeatureIconProps) {
  const iconSize = sizeMap[size]
  return (
    <Icon 
      size={size} 
      color={color}
      aria-label="Meal Planner"
      {...props}
    >
      <IoCalendar size={iconSize} />
    </Icon>
  )
}

/**
 * Cooking Assistant icon - Uses restaurant/chef icon to represent cooking
 */
export function CookingIcon({ size = 'md', color = 'orange.500', ...props }: FeatureIconProps) {
  const iconSize = sizeMap[size]
  return (
    <Icon 
      size={size} 
      color={color}
      aria-label="Cooking Assistant"
      {...props}
    >
      <IoRestaurant size={iconSize} />
    </Icon>
  )
}