import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

    const COLORS = ['#3b82f6', '#fbbf24'];

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-20 min-h-screen bg-gray-50">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-800">HR Manager Dashboard</h2>
                <p className="text-gray-500">Overview of your company's pending tasks and assets.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                
                {/* Top Pending Requests Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-xl font-bold mb-6 text-blue-600 border-l-4 border-blue-600 pl-3">Top Pending Requests</h3>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th>Asset Name</th>
                                    <th>Employee</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.pendingRequests?.map((req) => (
                                    <tr key={req._id}>
                                        <td className="font-bold text-gray-700">{req.productName}</td>
                                        <td className="text-gray-600">{req.userName}</td>
                                        <td><span className="badge badge-warning badge-sm font-bold">Pending</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {stats.pendingRequests?.length === 0 && (
                            <p className="text-center py-10 text-gray-400">No pending requests found.</p>
                        )}
                    </div>
                </div>

                {/* Asset Distribution (Pie Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-blue-600 border-l-4 border-blue-600 pl-3">Returnable vs Non-returnable</h3>
                    <div className="h-[300px] w-full">
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/*  Limited Stock Items Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-10">
                <h3 className="text-xl font-bold mb-6 text-red-600 border-l-4 border-red-600 pl-3">Limited Stock Items (Quantity &lt; 10)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.limitedStock?.map((item) => (
                        <div key={item._id} className="p-5 rounded-2xl border border-red-100 bg-red-50 flex justify-between items-center group hover:bg-red-100 transition-all shadow-sm">
                            <div>
                                <h4 className="font-black text-gray-800 group-hover:text-red-700">{item.productName}</h4>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.productType}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-red-600 leading-none">{item.productQuantity}</span>
                                <p className="text-[10px] font-bold text-red-400">Left</p>
                            </div>
                        </div>
                    ))}
                    {stats.limitedStock?.length === 0 && (
                        <p className="col-span-full text-center py-4 text-gray-400 italic">Inventory is well-maintained.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HRHome;