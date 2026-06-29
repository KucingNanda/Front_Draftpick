import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center w-full shadow-inner"
      title={`Beralih ke mode ${theme === 'dark' ? 'Terang' : 'Gelap'}`}
    >
      {theme === 'dark' ? (
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sun size={16} className="text-yellow-400" />
          <span>Terang</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm font-medium">
          <Moon size={16} className="text-blue-500" />
          <span>Gelap</span>
        </div>
      )}
    </button>
  );
}
