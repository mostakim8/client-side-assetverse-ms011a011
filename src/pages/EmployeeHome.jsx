import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const EmployeeHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['employee-stats', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/employee-stats/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-20 min-h-screen bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-linear-to-r from-blue-600 to-blue-400 p-8 rounded-2xl text-white shadow-lg">
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome, {user?.displayName}!</h2>
                    <p className="opacity-90 font-medium">Have a productive day at work today.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider">My Monthly Requests</h3>
                        <p className="text-sm text-gray-400">Total requests made in {new Date().toLocaleString('default', { month: 'long' })}</p>
                    </div>
                    <div className="text-5xl font-black text-blue-600">
                        {stats.monthlyCount || 0}
                    </div>
                </div>
            </div>

            {/* Pending Requests Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">My Pending Requests</h3>
                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Active Trace
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>Asset Name</th>
                                <th>Type</th>
                                <th>Request Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.pendingRequests?.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="font-bold text-gray-700">{req.productName}</td>
                                    <td className="text-gray-500 font-medium">{req.productType}</td>
                                    <td className="text-gray-600">{req.requestDate}</td>
                                    <td>
                                        <span className="badge badge-warning badge-sm font-bold text-xs">Pending</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {stats.pendingRequests?.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 italic">You have no pending requests at this time.</p>
                        </div>
                    )}
                </div>
            </div>

            {!user?.hrEmail && (
                <div className="mt-10 p-6 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-center gap-4">
                    <div className="text-2xl">⚠️</div>
                    <p className="text-yellow-800 font-medium">
                        You are not currently part of any team. Please contact your HR Manager to be added to the company team.
                    </p>
                </div>
            )}
        </div>
    );
};

export default EmployeeHome;