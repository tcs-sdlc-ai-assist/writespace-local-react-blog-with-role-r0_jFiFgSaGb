import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    closeMenu();
    navigate('/login');
  }, [logout, closeMenu, navigate]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? '/blogs' : '/'}
              className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
              onClick={closeMenu}
            >
              WriteSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/blogs"
                  className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
                >
                  Blogs
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 ml-2">
                  <Avatar role={user.role} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Avatar role={user.role} size="md" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {user.username}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
                <Link
                  to="/blogs"
                  className="block text-gray-600 hover:text-indigo-600 text-sm font-medium"
                  onClick={closeMenu}
                >
                  Blogs
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-gray-600 hover:text-indigo-600 text-sm font-medium"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-600 hover:text-indigo-600 text-sm font-medium"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;