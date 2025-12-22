import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./UseAuth"; 
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const EmployeeRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const { data: role, isLoading: isRoleLoading } = useQuery({
        queryKey: [user?.email, 'role'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${user?.email}`);
return res.data.role;
        }
    });

    if (loading || isRoleLoading) {
        return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (user && role === 'employee') {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default EmployeeRoute;