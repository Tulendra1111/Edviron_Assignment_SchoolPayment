import { CreditCard, FileText, Home, School } from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="flex-shrink-0 fixed top-0 left-0 w-60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-900 dark:text-gray-100 h-screen overflow-y-auto z-10 shadow-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">SP</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">
              {user?.email || 'User Email'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Administrator</p>
          </div>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {[
            { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
            { path: '/transaction', icon: FileText, label: 'Transactions', color: 'from-green-500 to-green-600' },
            { path: '/school-transactions', icon: School, label: 'School Transactions', color: 'from-purple-500 to-purple-600' },
            { path: '/transaction-status-check', icon: FileText, label: 'Status Check', color: 'from-orange-500 to-orange-600' },
            { path: '/create-payment', icon: CreditCard, label: 'Create Payment', color: 'from-pink-500 to-pink-600' },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="group flex items-center gap-4 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-200`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
