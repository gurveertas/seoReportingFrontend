import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { ThemeContext } from './themeContext.js'

const THEME_STORAGE_KEY = 'seo-reporting-theme'

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (
    window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  ))

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
