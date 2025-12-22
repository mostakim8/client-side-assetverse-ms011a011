import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./UseAuth"; 
import UseRole from "./UseRole"; 

const HrRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [role, isRoleLoading] = UseRole();
    const location = useLocation();

    // show loading spinner while checking auth and role
    if (loading || isRoleLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    // if user is logged in and role is hr, allow access to the route
    if (user && role === 'hr') {
        return children;
    }

    // if not authorized, redirect to home page
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default HrRoute;