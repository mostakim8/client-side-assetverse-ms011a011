import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { 
    Clock, Calendar, Package, AlertCircle, LayoutDashboard, 
    CheckCircle, Loader2, Inbox, Megaphone 
} from "lucide-react";

const EmployeeHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const noticesPerPage = 5;

    // Employee Stats Data
    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['employee-stats', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/employee-stats/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    // --- Notice Board Data Fetching ---
    const { data: notices = [] } = useQuery({
        queryKey: ['notices', stats?.userData?.hrEmail],
        enabled: !!stats?.userData?.hrEmail, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/notices/${stats?.userData?.hrEmail}`);
            return res.data;
        }
    });

    // pagination logic
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
    const totalPages = Math.ceil(notices.length / noticesPerPage);

    const isJoined = stats?.userData?.hrEmail && stats?.userData?.status === 'joined';

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-7xl mx-auto">
                
                {/* Team Status Warning */}
                {!isJoined && (
                    <div className="mb-10 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-center gap-6 shadow-sm">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-500">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <h4 className="text-amber-900 font-black uppercase text-sm tracking-widest">Affiliation Required</h4>
                            <p className="text-amber-800/80 text-xs font-medium mt-1">Please contact your HR. You need to join a company to request assets.</p>
                        </div>
                    </div>
                )}

                {/* Hero & Monthly Stats Count */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <LayoutDashboard size={180} />
                        </div>
                        <div className="relative z-10">
                            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                {isJoined ? stats.userData?.companyName : "Independent User"}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black mt-6 uppercase leading-tight tracking-tighter">
                                Welcome back, <br />
                                <span className="text-blue-500 italic">{user?.displayName?.split(' ')[0]}!</span>
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <Calendar size={24} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Summary</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Monthly Obtained</p>
                            <h3 className="text-6xl font-black text-gray-900 tracking-tighter">{stats.monthlyCount || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Notice Board Section with Pagination */}
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50 p-8 md:p-10 lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter text-gray-800">
                                <Inbox className="text-blue-600" size={22} /> Company <span className="text-gray-400 font-medium">Announcements</span>
                            </h3>
                            <Megaphone className="text-blue-100" size={24} />
                        </div>

                        <div className="space-y-4">
                            {currentNotices?.length > 0 ? (
                                currentNotices.map((notice) => (
                                    <div key={notice._id} className="p-6 bg-gray-50 rounded-3xl border-l-4 transition-all hover:bg-white hover:shadow-md" 
                                        style={{ borderLeftColor: notice.priority === 'High' ? '#ef4444' : notice.priority === 'Medium' ? '#f59e0b' : '#3b82f6' }}>
                                        
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                                                notice.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {notice.priority} Priority
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold">
                                                {new Date(notice.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <h4 className="font-black text-gray-800 uppercase text-sm mb-1">{notice.title}</h4>
                                        <p className="text-gray-600 text-xs leading-relaxed">{notice.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No notices from HR</p>
                                </div>
                            )}
                        </div>

                        {/* pagination buttons */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-9 h-9 rounded-full font-bold transition-all ${
                                            currentPage === i + 1
                                                ? "bg-blue-600 text-white shadow-lg"
                                                : "bg-white border text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50 p-8 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter text-gray-800">
                                <Clock className="text-amber-500" size={22} /> Pending <span className="text-gray-400 font-medium">Queue</span>
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            {stats.pendingRequests?.length > 0 ? (
                                <table className="table w-full">
                                    <thead className="text-[10px] uppercase text-gray-400 font-black border-b border-gray-100">
                                        <tr>
                                            <th className="pb-4 pl-0">Asset</th>
                                            <th className="pb-4">Type</th>
                                            <th className="pb-4 text-right pr-0">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {stats.pendingRequests.map((req) => (
                                            <tr key={req._id}>
                                                <td className="py-4 pl-0 font-bold text-gray-700">{req.productName || req.assetName}</td>
                                                <td className="py-4 text-[10px] font-bold text-gray-500 uppercase">{req.productType}</td>
                                                <td className="py-4 text-right pr-0 text-gray-400 text-xs font-bold">
                                                    {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-10">
                                    <Package size={40} className="mx-auto text-gray-100 mb-3" />
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No requests pending</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Activity Summary */}
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50 p-8 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter text-gray-800">
                                <CheckCircle className="text-green-500" size={22} /> Monthly <span className="text-gray-400 font-medium">Activity</span>
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {stats.monthlyAssets && stats.monthlyAssets.length > 0 ? (
                                stats.monthlyAssets.map((asset, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm text-green-500">
                                                <Package size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-800">{asset.productName || asset.assetName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Status: {asset.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase px-3 py-1 rounded-lg shadow-sm">Received</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-14 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No approved assets this month</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeHome;