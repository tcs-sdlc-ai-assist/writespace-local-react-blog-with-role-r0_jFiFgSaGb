import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  const { isAuthenticated, isAdmin } = useSession();

  const homeLink = isAuthenticated
    ? isAdmin
      ? '/admin'
      : '/blogs'
    : '/';

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Navbar />}

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            to={homeLink}
            className="bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Go Back Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;