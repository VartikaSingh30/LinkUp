import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Home, Users, MessageSquare, Bell, Briefcase as JobsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/profile', icon: Users, label: 'Profile' },
    { path: '/network', icon: Users, label: 'Network' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/jobs', icon: JobsIcon, label: 'Jobs' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 hidden lg:block overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 mb-8">
          <Briefcase size={32} />
          <span>LinkUp</span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
