import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ closeSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
  ];

  return (
    <div className="h-full bg-[var(--card-bg)] border-r border-[var(--border-color)] flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)] flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">Smart Expense</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[var(--accent-color)] text-white' 
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-main)]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => {
            logout();
            closeSidebar();
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
