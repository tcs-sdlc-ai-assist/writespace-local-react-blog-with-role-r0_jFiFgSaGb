import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const Footer = () => {
  const { isAuthenticated, isAdmin } = useSession();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? '/blogs' : '/'}
              className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
            >
              WriteSpace
            </Link>
          </div>

          <nav className="flex items-center gap-6">
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
                  className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;