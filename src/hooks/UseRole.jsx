import useAuth from "./UseAuth"; 
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const UseRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: role, isLoading: isRoleLoading, refetch } = useQuery({
        queryKey: [user?.email, 'role'],
        
        enabled: !loading && !!user?.email && !!localStorage.getItem('access-token'),
        
        queryFn: async () => {
            if (!user?.email) return null;
            
            const res = await axiosSecure.get(`/users/role/${user?.email}`); 
            // console.log("Current User Role:", res.data?.role); 
            return res.data?.role;
        }
    });

    return [role, isRoleLoading, refetch];
};

export default UseRole;