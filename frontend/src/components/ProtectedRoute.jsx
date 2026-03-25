import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    // On peut afficher un loader ou juste un div vide
    return <div>Chargement...</div>;
  }

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;