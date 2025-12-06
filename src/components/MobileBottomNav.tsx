import { Link, useLocation } from 'react-router-dom';
import { Home, Users, MessageSquare, Search, User } from 'lucide-react';

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/network', icon: Users, label: 'Network' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="mobile-bottom-nav lg:hidden">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={isActive(item.path) ? 'active' : ''}
        >
          <item.icon />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
