import useAuth from "./UseAuth"; 
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const UseRole = () => {
    const {user, loading} = useAuth();
    const {data: role, isLoading: isRoleLoading} = useQuery({
        queryKey: [user?.email, 'role'],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            // const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${user?.email}`); 

            const res = await axios.get(`https://assetverse-server-side-ms011a011.vercel.app/users/role/${user?.email}`);
            console.log("Current User Role:", res.data?.role); 
            return res.data?.role;
        }
    });
    return [role, isRoleLoading];
};

export default UseRole;