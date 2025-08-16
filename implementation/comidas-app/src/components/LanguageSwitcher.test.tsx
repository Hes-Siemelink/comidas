import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import '../i18n'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

// Helper component to track language changes
const LanguageDisplay = () => {
  const { i18n } = useTranslation()
  return <div data-testid="current-language">{i18n.language}</div>
}

describe('LanguageSwitcher', () => {
  it('renders all language buttons', () => {
    render(<LanguageSwitcher />, { wrapper: TestWrapper })
    
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('Nederlands')).toBeInTheDocument()
  })

  it('changes language when button is clicked', () => {
    render(
      <div>
        <LanguageSwitcher />
        <LanguageDisplay />
      </div>, 
      { wrapper: TestWrapper }
    )
    
    const spanishButton = screen.getByText('Español')
    const currentLanguage = screen.getByTestId('current-language')
    
    // Click Spanish button
    fireEvent.click(spanishButton)
    
    // Language should change to Spanish
    expect(currentLanguage).toHaveTextContent('es')
  })

  it('switches between multiple languages', () => {
    render(
      <div>
        <LanguageSwitcher />
        <LanguageDisplay />
      </div>, 
      { wrapper: TestWrapper }
    )
    
    const englishButton = screen.getByText('English')
    const spanishButton = screen.getByText('Español')
    const dutchButton = screen.getByText('Nederlands')
    const currentLanguage = screen.getByTestId('current-language')
    
    // Switch to Spanish
    fireEvent.click(spanishButton)
    expect(currentLanguage).toHaveTextContent('es')
    
    // Switch to Dutch
    fireEvent.click(dutchButton)
    expect(currentLanguage).toHaveTextContent('nl')
    
    // Switch back to English
    fireEvent.click(englishButton)
    expect(currentLanguage).toHaveTextContent('en')
  })

  it('has accessible button labels', () => {
    render(<LanguageSwitcher />, { wrapper: TestWrapper })
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    
    buttons.forEach(button => {
      expect(button).toBeEnabled()
      expect(button.textContent).toBeTruthy()
    })
  })

  it('all buttons are clickable', () => {
    render(<LanguageSwitcher />, { wrapper: TestWrapper })
    
    const englishButton = screen.getByText('English')
    const spanishButton = screen.getByText('Español')
    const dutchButton = screen.getByText('Nederlands')
    
    // All buttons should be clickable without errors
    expect(() => fireEvent.click(englishButton)).not.toThrow()
    expect(() => fireEvent.click(spanishButton)).not.toThrow()
    expect(() => fireEvent.click(dutchButton)).not.toThrow()
  })
})