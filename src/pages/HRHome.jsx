import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
    LayoutDashboard, AlertCircle, Clock, PieChart as ChartIcon, 
    ArrowUpRight, Package, User, TrendingUp, Megaphone, Send, Inbox 
} from "lucide-react";
import Swal from "sweetalert2";

const HRHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 

    const { data: stats = {}, isLoading, refetch: refetchStats } = useQuery({
        queryKey: ['hr-stats', user?.email],
        enabled: !!user?.email, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/hr-stats/${user?.email}`);
            return res.data;
        }
    });

    // --- Notice Posting Handler ---
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
                    text: "Announcement has been posted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                form.reset();
                
            }
        } catch (error) {
            Swal.fire("Error", "Failed to post notice", "error");
        }
    };

    const COLORS = ['#3b82f6', '#f59e0b'];

    if (isLoading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Dashboard <span className="text-blue-600">Overview</span>
                    </h2>
                    <p className="text-gray-400 font-medium italic">Welcome back, {user?.displayName}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Notice Posting Form Section (New Requirement) */}
                        <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
                            <h3 className="font-black text-gray-800 flex items-center gap-2 uppercase text-sm mb-6">
                                <Megaphone className="text-blue-600" size={18} /> Create Announcement
                            </h3>
                            <form onSubmit={handlePostNotice} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="title" placeholder="Notice Title" className="input input-bordered w-full rounded-2xl font-bold bg-gray-50 border-none" required />
                                    <select name="priority" className="select select-bordered w-full rounded-2xl font-bold bg-gray-50 border-none" required>
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                </div>
                                <textarea name="message" placeholder="Type your message here..." className="textarea textarea-bordered w-full rounded-2xl font-medium bg-gray-50 border-none h-24" required></textarea>
                                <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none rounded-2xl w-full gap-2 font-black uppercase tracking-widest text-xs">
                                    <Send size={16} /> Post Announcement
                                </button>
                            </form>
                        </div>

                        {/* Pending Requests */}
                        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-gray-800 flex items-center gap-2 uppercase text-sm">
                                    <Clock className="text-blue-600" size={18} /> Pending Requests (Top 5)
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="text-gray-400 text-[10px] uppercase font-black">
                                            <th className="pl-6">Asset</th>
                                            <th>Requester</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.pendingRequests?.slice(0, 5).map((req) => (
                                            <tr key={req._id} className="hover:bg-gray-50">
                                                <td className="pl-6 font-bold text-gray-700">{req.productName}</td>
                                                <td>
                                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                                        <User size={12}/> {req.userName}
                                                    </div>
                                                </td>
                                                <td><span className="badge badge-warning badge-sm font-bold text-[9px] uppercase">Pending</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Requested Items */}
                        <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
                            <h3 className="font-black text-gray-800 flex items-center gap-2 uppercase text-sm mb-6">
                                <TrendingUp className="text-green-600" size={18} /> Top Requested Items
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {stats.topRequested?.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                                        <span className="font-bold text-gray-700">{item.productName}</span>
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black">{item.count} Requests</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Limited Stock Items */}
                        <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
                            <h3 className="font-black text-gray-800 flex items-center gap-2 uppercase text-sm mb-6">
                                <AlertCircle className="text-red-600" size={18} /> Limited Stock Items
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stats.limitedStock?.map((item) => (
                                    <div key={item._id} className="p-4 border border-red-100 bg-red-50/30 rounded-2xl">
                                        <p className="font-bold text-gray-800">{item.productName}</p>
                                        <p className="text-red-600 font-black text-xl">{item.productQuantity} <span className="text-[10px] uppercase">Left</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
                            <h3 className="text-xl font-black text-gray-800 uppercase mb-6 flex items-center gap-2">
                                <ChartIcon className="text-blue-600" size={20} /> Request Ratio
                            </h3>
                            <div className="h-75 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.chartData || []}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.chartData?.map((entry, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HRHome;