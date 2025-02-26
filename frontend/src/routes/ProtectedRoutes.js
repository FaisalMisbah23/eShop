import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux";


const ProtectedRoutes = ({ children }) => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);

    if (loading === false) {
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />
        }
        return children;
    }
}

export default ProtectedRoutes;