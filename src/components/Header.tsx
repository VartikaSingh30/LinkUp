import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Menu, X, Briefcase, User } from 'lucide-react';
import { signOut } from '../lib/auth';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg sm:text-xl">
              <Briefcase size={28} className="hidden sm:block" />
              <Briefcase size={24} className="sm:hidden" />
              <span className="hidden sm:inline">LinkUp</span>
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Notifications Icon - Visible on mobile */}
            <Link
              to="/notifications"
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Profile Link - Desktop */}
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
            >
              <User size={20} />
              <span className="hidden lg:inline text-sm font-medium">Profile</span>
            </Link>

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden sm:block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 mt-2 pt-3 space-y-3 animate-slide-up">
            {/* Mobile Menu Items */}
            <div className="space-y-1 sm:hidden">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"
              >
                <User size={20} />
                <span className="font-medium">My Profile</span>
              </Link>
              
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"
              >
                <Bell size={20} />
                <span className="font-medium">Notifications</span>
              </Link>
              
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition text-left"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
