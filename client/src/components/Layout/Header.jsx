import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[var(--card-bg)] border-b border-[var(--border-color)] flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-color)] lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold hidden sm:block text-[var(--text-main)]">Overview</h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-color)] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-color)] transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-[var(--border-color)] mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[var(--text-main)] leading-none mb-1">{user?.name || 'User'}</p>
            <p className="text-xs text-[var(--text-muted)] leading-none">Free Plan</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
