import useAuth from "../hooks/UseAuth";
import UseRole from "../hooks/UseRole";
import HRHome from "./HRHome";
import EmployeeHome from "./EmployeeHome"; 

const Home = () => {
    const { user, loading } = useAuth();
    const [role, isRoleLoading] = UseRole();

    // ডাটা লোড হওয়ার সময় স্পিনার দেখানো বাধ্যতামূলক
    if (loading || isRoleLoading) {
        return <div className="min-h-screen flex items-center justify-center font-bold">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>;
    }

    // রোল অনুযায়ী আলাদা হোম দেখানো
    if (user && role === 'hr') {
        return <HRHome />;
    }
    
    if (user && role === 'employee') {
        return <EmployeeHome />;
    }

    // গেস্ট ইউজার বা লগআউট থাকা অবস্থায় যা দেখবে
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-[550px] flex items-center justify-center bg-blue-900 text-white text-center">
                <div className="relative z-10 px-4">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">Smart Asset <br/> Tracking Solution</h1>
                    <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-200 mb-8 font-medium">
                        Manage company resources with efficiency and transparency. Designed for modern teams.
                    </p>
                </div>
            </div>
            {/* About Section */}
            <div className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-gray-900">Efficient Asset Management For Your <span className="text-blue-600">Growth</span></h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        AssetVerse helps companies track assets, monitor status, and manage employee requests in one dashboard.
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