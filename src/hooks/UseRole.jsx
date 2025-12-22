import useAuth from "./UseAuth"; 
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const UseRole = () => {
    const {user, loading} = useAuth();
    const {data: role, isLoading: isRoleLoading} = useQuery({
        queryKey: [user?.email, 'role'],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/users/role/${user?.email}`); // user?.email ব্যবহার করুন
            console.log("Current User Role:", res.data?.role); // এটি চেক করার জন্য যোগ করুন
            return res.data?.role;
        }
    });
    return [role, isRoleLoading];
};

export default UseRole;