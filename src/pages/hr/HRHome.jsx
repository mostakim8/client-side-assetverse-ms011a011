import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure"; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
    AlertCircle, Clock, PieChart as ChartIcon, 
    User, TrendingUp, Megaphone, Send, Sparkles, 
    Layers, Type, Flag
} from "lucide-react";
import Swal from "sweetalert2";
import { useContext } from "react"; 
import { ThemeContext } from "../../hooks/ThemeContext";

const HRHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const { isDark } = useContext(ThemeContext);

    const { data: stats = {}, isLoading, refetch: refetchStats } = useQuery({
        queryKey: ['hr-stats', user?.email],
        enabled: !!user?.email, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/hr-stats/${user?.email}`);
            return res.data;
        }
    });

    const handlePostNotice = async (e) => {
        e.preventDefault();
        const form = e.target;
        const noticeData = {
            title: form.title.value,
            message: form.message.value,
            priority: form.priority.value, 
            hrEmail: user.email,
            hrName: user.displayName,
            createdAt: new Date()
        };

        try {
            const res = await axiosSecure.post('/notices', noticeData);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Published!",
                    text: "Your announcement is now visible to everyone.",
                    icon: "success",
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                    confirmButtonColor: '#2563eb',
                    timer: 2000
                });
                form.reset();
            }
        } catch (error) {
            Swal.fire("Error", "Failed to post notice", "error");
        }
    };

    const COLORS = ['#3b82f6', '#f59e0b'];

    if (isLoading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-950">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

   return (
    <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Sparkles className="text-blue-600" /> HR <span className="text-blue-600 italic">Insights</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 flex items-center gap-2">
                         Welcome back, {user?.displayName} 
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* NOTICE BOARD */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 overflow-hidden relative transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 text-slate-900 dark:text-white">
                            <Megaphone size={120} />
                        </div>
                        
                        <div className="p-8 md:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
                                    <Megaphone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Quick Announcement</h3>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500">BROADCAST UPDATES TO YOUR TEAM</p>
                                </div>
                            </div>

                            <form onSubmit={handlePostNotice} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1 flex items-center gap-2">
                                            <Type size={12}/> Title
                                        </label>
                                        <input name="title" placeholder="write notice title here" 
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1 flex items-center gap-2">
                                            <Flag size={12}/> Priority Level
                                        </label>
                                        <select name="priority" 
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-600 dark:text-slate-300 appearance-none" required>
                                            <option value="Low">Low Priority</option>
                                            <option value="Medium">Medium Priority</option>
                                            <option value="High">High Priority</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1 flex items-center gap-2">
                                        <Layers size={12}/> Announcement Content
                                    </label>
                                    <textarea name="message" placeholder=" write your announcement here" 
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 h-32 resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600" required></textarea>
                                </div>

                                <button type="submit" 
                                    className="group w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 dark:shadow-none active:scale-95">
                                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                                    Post Announcement
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Pending Requests Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase text-sm tracking-widest">
                                <Clock className="text-blue-600" size={18} /> Recent Pending Requests
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full border-collapse">
                                <thead>
                                    <tr className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black border-b border-slate-50 dark:border-slate-800">
                                        <th className="p-6">Asset Name</th>
                                        <th>Requester</th>
                                        <th className="text-right pr-8">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.pendingRequests?.slice(0, 5).map((req) => (
                                        <tr key={req._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800">
                                            <td className="p-6 font-bold text-slate-700 dark:text-slate-300">{req.productName}</td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                        <User size={14}/>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{req.userName}</span>
                                                </div>
                                            </td>
                                            <td className="text-right pr-8">
                                                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase rounded-full border border-amber-100 dark:border-amber-900/50">Pending</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Inventory & Trends Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
                            <h3 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase text-sm mb-6 tracking-widest">
                                <TrendingUp className="text-emerald-500" size={18} /> Top Trends
                            </h3>
                            <div className="space-y-4">
                                {stats.topRequested?.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.productName}</span>
                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-xl text-[10px] font-black">{item.count} REQS</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
                            <h3 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase text-sm mb-6 tracking-widest">
                                <AlertCircle className="text-rose-500" size={18} /> Low Stock
                            </h3>
                            <div className="space-y-4">
                                {stats.limitedStock?.slice(0, 3).map((item) => (
                                    <div key={item._id} className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex justify-between items-center">
                                        <p className="font-bold text-rose-900 dark:text-rose-200">{item.productName}</p>
                                        <p className="text-rose-600 dark:text-rose-400 font-black text-lg">{item.productQuantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Analytics */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-28 transition-colors">
                        <div className="mb-8">
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter flex items-center gap-2">
                                <ChartIcon className="text-blue-600" size={20} /> Request Ratio
                            </h3>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase">Returnable vs Non-Returnable</p>
                        </div>
                        
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.chartData || []}
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {stats.chartData?.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} className="outline-none" />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '20px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            backgroundColor: isDark ? '#1e293b' : '#fff', 
                                            color: isDark ? '#f8fafc' : '#1e293b'
                                        }}
                                        itemStyle={{ color: isDark ? '#f8fafc' : '#1e293b' }}
                                    />
                                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Assets</span>
                                <span className="font-black text-slate-700 dark:text-slate-300">{stats.totalAssets || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Requests</span>
                                <span className="font-black text-slate-700 dark:text-slate-300">{stats.pendingRequests?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
);
};

export default HRHome;