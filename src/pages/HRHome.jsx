import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const HRHome = () => {
    const { user } = useAuth();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['hr-stats', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/hr-stats/${user?.email}`);
            return res.data;
        }
    });

    const COLORS = ['#2563eb', '#facc15'];

    if (isLoading) return <div className="text-center mt-20">Loading Dashboard...</div>;

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-black mb-10 text-gray-800">HR Manager Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">Top Pending Requests</h3>
                    <div className="overflow-x-auto">
                        <table className="table table-sm w-full">
                            <thead>
                                <tr className="text-gray-500 uppercase text-xs">
                                    <th>Asset Name</th>
                                    <th>Employee</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.pendingRequests?.map((req) => (
                                    <tr key={req._id}>
                                        <td className="font-semibold">{req.productName}</td>
                                        <td>{req.userName}</td>
                                        <td><span className="badge badge-warning text-xs font-bold">Pending</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {stats.pendingRequests?.length === 0 && <p className="text-center py-4 text-gray-400">No pending requests</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px]">
                    <h3 className="text-xl font-bold mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">Asset Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.chartData || []}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.chartData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

           
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-red-600 border-l-4 border-red-600 pl-3">Limited Stock Items (Quantity &lt; 10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {stats.limitedStock?.map((item) => (
                        <div key={item._id} className="p-4 border rounded-xl bg-red-50 border-red-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800">{item.productName}</p>
                                <p className="text-xs text-gray-500">{item.productType}</p>
                            </div>
                            <span className="text-2xl font-black text-red-600">{item.productQuantity}</span>
                        </div>
                    ))}
                    {stats.limitedStock?.length === 0 && <p className="text-gray-400 italic">All items are well stocked.</p>}
                </div>
            </div>
        </div>
    );
};

export default HRHome;