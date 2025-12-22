import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./UseAuth"; // আপনার পাথ অনুযায়ী ইম্পোর্ট করুন
import UseRole from "./UseRole"; // আপনার পাথ অনুযায়ী ইম্পোর্ট করুন

const HrRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [role, isRoleLoading] = UseRole();
    const location = useLocation();

    // ডাটা লোড হওয়ার সময় লোডিং স্পিনার দেখাবে
    if (loading || isRoleLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    // ইউজার যদি লগইন থাকে এবং তার রোল যদি 'hr' হয়, তবেই তাকে পেজে ঢুকতে দিবে
    if (user && role === 'hr') {
        return children;
    }

    // যদি সে HR না হয়, তবে তাকে হোমপেজে পাঠিয়ে দিবে
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default HrRoute;