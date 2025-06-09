import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("user"); // or use Firebase auth context
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
