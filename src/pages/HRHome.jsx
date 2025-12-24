import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
    LayoutDashboard, AlertCircle, Clock, PieChart as ChartIcon, 
    ChevronRight, ArrowUpRight, Package, User 
} from "lucide-react";

const HRHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['hr-stats', user?.email],
        enabled: !!user?.email, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/hr-stats/${user?.email}`);
            return res.data;
        }
    });

    // vibrant colors 
    const COLORS = ['#3b82f6', '#8b5cf6']; 

    if (isLoading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
            <p className="mt-4 text-gray-500 font-bold tracking-widest animate-pulse uppercase text-xs">Analytics Loading...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-7xl mx-auto">
                
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-1 uppercase tracking-[0.2em]">
                            <LayoutDashboard size={14} /> HR Manager Overview
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            Welcome Back, <span className="text-blue-600">{user?.displayName?.split(' ')[0]}!</span>
                        </h2>
                        <p className="text-gray-400 mt-1 font-medium italic">Here is what’s happening with your assets today.</p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 px-6">
                            <div className="h-10 w-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Status</p>
                                <p className="font-bold text-gray-800 leading-none">Real-time</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Pending Requests Table */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/20 border border-gray-100 overflow-hidden">
                            <div className="p-8 pb-4 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 tracking-tighter uppercase">
                                    <Clock className="text-blue-600" size={22} /> Pending Requests
                                </h3>
                                <button className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                    View All
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto px-4 pb-4">
                                <table className="table w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-black border-none">
                                            <th className="bg-transparent pl-6 uppercase">Asset Details</th>
                                            <th className="bg-transparent uppercase">Requested By</th>
                                            <th className="bg-transparent uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.pendingRequests?.map((req) => (
                                            <tr key={req._id} className="group transition-all">
                                                <td className="bg-gray-50 group-hover:bg-blue-50 rounded-l-2xl border-none pl-6 py-4 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Package size={16} className="text-blue-600"/></div>
                                                        <span className="font-bold text-gray-800">{req.productName}</span>
                                                    </div>
                                                </td>
                                                <td className="bg-gray-50 group-hover:bg-blue-50 border-none py-4 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-black text-blue-600"><User size={14}/></div>
                                                        <span className="font-semibold text-gray-600 text-sm">{req.userName}</span>
                                                    </div>
                                                </td>
                                                <td className="bg-gray-50 group-hover:bg-blue-50 rounded-r-2xl border-none py-4 transition-colors">
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase rounded-lg">Pending</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {stats.pendingRequests?.length === 0 && (
                                    <div className="text-center py-20 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <AlertCircle className="text-gray-200" size={32} />
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Everything is up to date</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Limited Stock Section */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-red-100/20 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 tracking-tighter uppercase">
                                    <AlertCircle className="text-red-600" size={22} /> Critical Stock Alert
                                </h3>
                                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black">Stock &lt; 10</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {stats.limitedStock?.map((item) => (
                                    <div key={item._id} className="p-5 rounded-3xl border border-gray-50 bg-gray-50/50 flex justify-between items-center hover:scale-[1.02] transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                <Package size={20} className="text-red-400"/>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 leading-tight">{item.productName}</h4>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{item.productType}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-red-600">{item.productQuantity}</span>
                                            <p className="text-[9px] font-black text-red-300 uppercase leading-none">Items</p>
                                        </div>
                                    </div>
                                ))}
                                {stats.limitedStock?.length === 0 && (
                                    <div className="col-span-full py-10 bg-gray-50/50 rounded-3xl text-center border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Inventory Health: Optimal</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Analytics Chart */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-100/20 border border-gray-100 h-full flex flex-col">
                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 tracking-tighter uppercase mb-2">
                                <ChartIcon className="text-blue-600" size={22} /> Asset Analytics
                            </h3>
                            <p className="text-gray-400 text-xs font-medium mb-8">Distribution of company resources</p>
                            
                            <div className="h-[350px] w-full flex-grow relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.chartData || []}
                                            innerRadius={85}
                                            outerRadius={110}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {stats.chartData?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            iconType="circle"
                                            wrapperStyle={{ paddingTop: '20px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', color: '#64748b' }} 
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Chart Center Stats */}
                                <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <p className="text-xs font-black text-gray-400 uppercase leading-none mb-1">Total</p>
                                    <p className="text-4xl font-black text-gray-900 leading-none">
                                        {stats.chartData?.reduce((acc, curr) => acc + curr.value, 0) || 0}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-3">
                                <button onClick={() => window.location.href='/asset-list'} className="w-full flex justify-between items-center p-4 bg-blue-50/50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all group">
                                    <span className="font-bold text-sm">Manage Full Inventory</span>
                                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HRHome;