import { useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth";
import axios from "axios";
import HRHome from "./HRHome"; 

const Home = () => {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:5001/users/role/${user.email}`)
                .then(res => {
                    setRole(res.data.role);
                    setIsRoleLoading(false);
                })
                .catch(() => setIsRoleLoading(false));
        } else {
            setIsRoleLoading(false);
        }
    }, [user]);

    if (loading || isRoleLoading) {
        return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;
    }

    
    if (user && role === 'hr') {
        return <HRHome />;
    }

    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <div className="relative h-[550px] flex items-center justify-center bg-blue-900 text-white text-center overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-black"></div>
                <div className="relative z-10 px-4">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">Smart Asset <br/> Tracking Solution</h1>
                    <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-200 mb-8 font-medium">
                        Manage company resources with efficiency and transparency. Designed for modern HR teams.
                    </p>
                    {user && (
                        <div className="bg-white/20 backdrop-blur-md inline-block px-6 py-3 rounded-2xl border border-white/30">
                            <span className="text-xl font-semibold">Welcome back, {user?.displayName}! 👋</span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* About Section */}
            <div className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-gray-900">Efficient Asset Management <br/> For Your <span className="text-blue-600">Growth</span></h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        AssetVerse helps companies track their physical assets, monitor status, and manage employee requests in one single dashboard.
                    </p>
                </div>
                <div className="bg-blue-600 h-80 rounded-3xl shadow-2xl flex items-center justify-center text-white text-6xl font-black italic">
                    AssetVerse
                </div>
            </div>
        </div>
    );
};

export default Home;