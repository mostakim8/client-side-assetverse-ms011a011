import { useQuery } from "@tanstack/react-query";
import { useState, useContext } from "react"; 
import { ThemeContext } from "../../hooks/ThemeContext"; 
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router-dom"; 
import { 
    Clock, Calendar, Package, AlertCircle, LayoutDashboard, 
    CheckCircle, Loader2, Inbox, Megaphone, Gift, X 
} from "lucide-react";

const EmployeeHome = () => {
    const { user } = useAuth();
    const { isDark } = useContext(ThemeContext);
    const axiosSecure = useAxiosSecure();

    const [currentPage, setCurrentPage] = useState(1);
    const noticesPerPage = 5;
    const [selectedNotice, setSelectedNotice] = useState(null);

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['employee-stats', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/employee-stats/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    const { data: birthdays = [] } = useQuery({
        queryKey: ['team-birthdays', user?.email, stats?.userData?.hrEmail],
        enabled: !!user?.email && !!stats?.userData?.hrEmail,
        queryFn: async () => {
            const res = await axiosSecure.get(`/team-birthdays/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    const { data: notices = [] } = useQuery({
        queryKey: ['notices', stats?.userData?.hrEmail],
        enabled: !!stats?.userData?.hrEmail, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/notices/${stats?.userData?.hrEmail}`);
            return res.data;
        }
    });

    // 3 High Priority + 2 Normal Priority on First Page, Rest Sorted by Date
    const getSortedNotices = () => {
        const highPriority = notices
            .filter(n => n.priority === 'High')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const normalPriority = notices
            .filter(n => n.priority !== 'High')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // First page: max 3 High Priority + 2 Normal Priority
        const firstPageHigh = highPriority.slice(0, 3);
        const firstPageNormal = normalPriority.slice(0, 5 - firstPageHigh.length);
        const firstPage = [...firstPageHigh, ...firstPageNormal];

        // all remaining notices
        const remainingHigh = highPriority.slice(3);
        const remainingNormal = normalPriority.slice(5 - firstPageHigh.length);
        const remaining = [...remainingHigh, ...remainingNormal].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return [...firstPage, ...remaining];
    };

    const sortedNotices = getSortedNotices();
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    const currentNotices = sortedNotices.slice(indexOfFirstNotice, indexOfLastNotice);
    const totalPages = Math.ceil(sortedNotices.length / noticesPerPage);

    const isJoined = stats?.userData?.hrEmail && stats?.userData?.status === 'joined';
    const isPending = stats?.userData?.status === 'pending';

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-white dark:bg-slate-950 transition-colors">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd] dark:bg-slate-950 transition-colors duration-300">
            <style>
                {`
                    .custom-modal-scroll::-webkit-scrollbar { width: 6px; }
                    .custom-modal-scroll::-webkit-scrollbar-track { background: ${isDark ? '#1e293b' : '#f8fafc'}; border-radius: 10px; }
                    .custom-modal-scroll::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
                `}
            </style>

            <div className="max-w-7xl mx-auto">
                
                {/* Affiliation Alert Section */}
                {!isJoined && (
                    <div className="mb-10 p-8 bg-amber-50 dark:bg-amber-900/20 rounded-[2.5rem] border border-amber-100 dark:border-amber-800/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-amber-500">
                                <AlertCircle size={32} />
                            </div>
                            <div>
                                <h4 className="text-amber-900 dark:text-amber-200 font-black uppercase text-sm tracking-widest">
                                    {isPending ? "Request Pending" : "Affiliation Required"}
                                </h4>
                                <p className="text-amber-800/80 dark:text-amber-400/80 text-xs font-medium mt-1">
                                    {isPending 
                                        ? "Your join request has been sent to HR. Please wait for approval." 
                                        : "No company affiliation.Please join a company to request and manage assets."}
                                </p>
                            </div>
                        </div>
                        {!isPending && (
                            <Link to="/join-company">
                                <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-amber-200 dark:shadow-none active:scale-95 whitespace-nowrap">
                                    Find Company Now
                                </button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Birthday Section */}
                {isJoined && birthdays.length > 0 && (
                    <div className="mb-10 bg-linear-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <Gift size={150} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-white/20 backdrop-blur-lg rounded-4xl text-3xl">🎂</div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Team Birthdays</h3>
                                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Send a wish to your colleagues!</p>
                                </div>
                            </div>
                            <div className="flex -space-x-3 p-2 bg-white/10 rounded-3xl backdrop-blur-sm">
                                {birthdays.map((member, idx) => (
                                    <a key={idx} href={`mailto:${member.email}`} title={member.name} className="hover:scale-110 hover:z-20 transition-transform">
                                        <img className="w-14 h-14 rounded-2xl border-4 border-blue-600 dark:border-slate-800 object-cover bg-white dark:bg-slate-700" src={member.photo || "https://i.ibb.co/0Qkb09Y/user.png"} alt={member.name}/>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2 bg-slate-900 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 dark:border-slate-800 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                                {isJoined ? stats.userData?.companyName : "Independent"}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black mt-6 uppercase tracking-tighter leading-tight">
                                Welcome, <br />
                                <span className="text-blue-500 italic">{user?.displayName?.split(' ')[0]}!</span>
                            </h2>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-slate-800 flex flex-col justify-between transition-all">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl w-fit"><Calendar size={24} /></div>
                        <div>
                            <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Monthly Assets</p>
                            <h3 className="text-6xl font-black text-gray-900 dark:text-slate-100 tracking-tighter">{stats.monthlyCount || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Notice Board */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-gray-50 dark:border-slate-800 p-8 md:p-10 mb-10 transition-all">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black flex items-center gap-3 uppercase text-gray-800 dark:text-slate-200">
                            <Inbox className="text-blue-600 dark:text-blue-500" size={22} /> Announcements
                        </h3>
                        {currentPage === 1 && sortedNotices.length > 0 && (
                            <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest">
                                Priority Layout Enabled
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentNotices?.length > 0 ? (
                            currentNotices.map((notice) => (
                                <div 
                                    key={notice._id} 
                                    onClick={() => setSelectedNotice(notice)} 
                                    className={`p-6 rounded-3xl border cursor-pointer transition-all hover:shadow-lg active:scale-[0.98] ${
                                        notice.priority === 'High' 
                                        ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30' 
                                        : 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${notice.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'}`}>
                                            {notice.priority}
                                        </span>
                                        <span className="text-[9px] text-gray-400 dark:text-slate-500 font-bold">{new Date(notice.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-black text-gray-800 dark:text-slate-200 uppercase text-xs mb-2 line-clamp-1 wrap-break-words">{notice.title}</h4>
                                    <p className="text-gray-500 dark:text-slate-400 text-[11px] line-clamp-2 wrap-break-words">{notice.message}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-400 dark:text-slate-600">
                                <Inbox size={48} className="mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase">No Notices Found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700"}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setSelectedNotice(null)}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[85vh] border border-gray-100 dark:border-slate-800 transition-all scale-100">
                        <div className="p-8 pb-4 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800 z-10">
                            <div className="flex items-center gap-3">
                                <Megaphone className="text-blue-600 dark:text-blue-400" size={20} />
                                <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 tracking-widest">Notice Detail</span>
                            </div>
                            <button onClick={() => setSelectedNotice(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-8 flex-grow overflow-y-auto custom-modal-scroll">
                            <h3 className="font-black text-2xl md:text-3xl text-gray-900 dark:text-slate-100 mb-6 italic uppercase tracking-tighter leading-tight wrap-break-words">{selectedNotice.title}</h3>
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 md:p-8 rounded-4xl border border-slate-100 dark:border-slate-700 mb-8 w-full overflow-hidden">
                                <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm font-medium whitespace-pre-wrap wrap-break-words">{selectedNotice.message}</p>
                            </div>
                        </div>
                        <div className="p-8 pt-4 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800">
                            <button onClick={() => setSelectedNotice(null)} className="w-full py-4 bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeHome;