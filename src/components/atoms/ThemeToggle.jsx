import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-center w-full mt-2">
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}
        title={`Beralih ke mode ${isDark ? 'Terang' : 'Gelap'}`}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform ${
            isDark ? 'translate-x-6' : 'translate-x-1'
          }`}
        >
          {isDark ? (
            <Moon size={12} className="text-blue-500" />
          ) : (
            <Sun size={12} className="text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  );
}
