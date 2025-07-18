import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeContext"
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="rounded-full border-2 border-[#3F1470] dark:border-[#FFA301] transition-colors"
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5" style={{ color: '#FFA301' }} />
      ) : (
        <Sun className="h-5 w-5" style={{ color: '#3F1470' }} />
      )}
    </Button>
  )
} 