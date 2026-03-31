import { Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useSession();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/blogs" replace />;
  }

  return children;
};

export default ProtectedRoute;