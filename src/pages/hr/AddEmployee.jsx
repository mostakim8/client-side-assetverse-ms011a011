import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure"; 
import { ThemeContext } from "../../hooks/ThemeContext"; 
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Crown, Users, AlertCircle, Search, Loader2, CheckCircle2, UserCheck, CheckCircle } from "lucide-react";

const AddEmployee = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [displaySearch, setDisplaySearch] = useState(""); 
    const [search, setSearch] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearch(displaySearch);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [displaySearch]);

    
    const { data: pendingRequests = [], refetch: refetchPending } = useQuery({
        queryKey: ['pending-requests', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/pending-requests/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    const { data: hrData = {} } = useQuery({
        queryKey: ['hr-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    const { data: teamCount = 0, refetch: refetchCount } = useQuery({
        queryKey: ['team-count', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/team-count/${user?.email}`);
            return res.data.count;
        }
    });

    const { data: availableEmployees = [], isLoading, isFetching, refetch: refetchAvailable } = useQuery({
        queryKey: ['unaffiliated-employees', search], 
        queryFn: async () => {
            const res = await axiosSecure.get(`/unaffiliated-employees?search=${search}`);
            return res.data;
        },
    });

    const employeeLimit = hrData?.employeeLimit || 5;
    const remainingSlots = employeeLimit - teamCount;

    const handleApprove = async (emp) => {
        if (remainingSlots <= 0) {
            return Swal.fire({ 
                icon: 'error', 
                title: 'Limit Reached!', 
                text: 'Please upgrade your package to add more members.',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
        try {
            const res = await axiosSecure.patch(`/users/approve-request/${emp.email}`, {
                hrEmail: user?.email,
            });
            if (res.data.modifiedCount > 0) {
                Swal.fire({ 
                    icon: 'success', 
                    title: 'Member Added!', 
                    timer: 1500, 
                    showConfirmButton: false,
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
                refetchPending();
                refetchCount();
                refetchAvailable();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to approve",
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    };

    const handleSelect = (id) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
        } else {
            if (selectedEmployees.length >= remainingSlots) {
                return Swal.fire({ 
                    icon: 'warning', 
                    title: 'Limit Reached!', 
                    text: 'Please upgrade your package.', 
                    confirmButtonColor: '#f59e0b',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
            }
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleBulkAdd = async () => {
        if (selectedEmployees.length === 0) return;
        
        const info = { 
            hrEmail: user?.email, 
            companyName: hrData?.companyName, 
            companyLogo: hrData?.companyLogo, 
            employeeIds: selectedEmployees 
        };

        try {
            const res = await axiosSecure.patch('/add-to-team', info);
            if (res.data.modifiedCount > 0) {
                Swal.fire({ 
                    icon: "success", 
                    title: "Team Updated!", 
                    text: `${selectedEmployees.length} members added.`, 
                    timer: 2000, 
                    showConfirmButton: false,
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
                setSelectedEmployees([]);
                refetchAvailable();
                refetchCount();
                refetchPending(); 
            }
        } catch (error) { 
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to add team members",
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    };

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                
                {/* Stats Card */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full opacity-50 blur-3xl"></div>
                    <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-700 rounded-4xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none"><Users size={36} /></div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">ADD <span className="text-blue-600 italic">MEMBERS</span></h2>
                                <div className="mt-3">
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Team Capacity</span>
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{teamCount} / {employeeLimit} Slots</span>
                                    </div>
                                    <div className="w-64 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700">
                                       <div className={`h-full rounded-full transition-all duration-1000 ${teamCount >= employeeLimit ? 'bg-rose-500' : 'bg-blue-600'}`} style={{ width: `${(teamCount / employeeLimit) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/upgrade-package" className="group flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-6 py-4 rounded-2xl font-black transition-all border border-amber-100 dark:border-amber-900/30 uppercase text-xs tracking-widest">
                            <Crown size={18} /> Upgrade Plan
                        </Link>
                    </div>
                </div>

                {/* Pending Requests Section */}
                {pendingRequests.length > 0 && (
                    <div className="mb-12 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-amber-100 dark:border-slate-800 shadow-xl shadow-amber-50 dark:shadow-none">
                        <div className="flex items-center gap-2 mb-8 text-amber-600">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg"><UserPlus size={20} /></div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Join Requests ({pendingRequests.length})</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingRequests.map(req => (
                                <div key={req._id} className="p-5 bg-amber-50/30 dark:bg-slate-800/50 rounded-3xl border border-amber-50 dark:border-slate-700 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <img src={req.photo || req.employeePhoto || "https://i.ibb.co/mJR7z1C/avatar.png"} className="w-12 h-12 rounded-2xl object-cover" />
                                        <div className="min-w-0">
                                            <p className="font-black text-slate-800 dark:text-slate-200 text-xs truncate uppercase">{req.name || req.employeeName}</p>
                                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold truncate">{req.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleApprove(req)}
                                        className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-100 dark:shadow-none transition-all"
                                        title="Approve Member"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Action Area (Bulk Add) */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute top-1/2 -translate-y-1/2 left-5 text-slate-400 dark:text-slate-600" size={20} />
                            <input type="text" placeholder="Search by name or email..." value={displaySearch} className="w-full pl-14 pr-12 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none font-bold transition-all" onChange={(e) => setDisplaySearch(e.target.value)} />
                        </div>
                        <button onClick={handleBulkAdd} disabled={selectedEmployees.length === 0} className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 dark:bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white px-10 h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95">
                            <UserPlus size={18} /> Add Selected ({selectedEmployees.length})
                        </button>
                    </div>

                    <div className="overflow-x-auto min-h-100">
                        {isLoading && availableEmployees.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-32 space-y-4"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>
                        ) : (
                            <table className={`table w-full ${isFetching ? 'opacity-40' : ''}`}>
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/30">
                                        <th className="py-6 pl-10 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Select</th>
                                        <th className="py-6 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Candidate Info</th>
                                        <th className="py-6 pr-10 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {availableEmployees.map((emp) => (
                                        <tr key={emp._id} className="group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-all">
                                            <td className="py-6 pl-10">
                                                <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-transparent text-blue-600 cursor-pointer" checked={selectedEmployees.includes(emp._id)} onChange={() => handleSelect(emp._id)} />
                                            </td>
                                            <td className="py-6 flex items-center gap-4">
                                                <img src={emp.photo || emp.image || "https://i.ibb.co/mJR7z1C/avatar.png"} className="w-12 h-12 rounded-xl object-cover" />
                                                <div>
                                                    <p className="font-black text-slate-800 dark:text-slate-200 text-sm">{emp.name}</p>
                                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{emp.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-6 pr-10 text-right">
                                                <button onClick={() => handleSelect(emp._id)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedEmployees.includes(emp._id) ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600'}`}>
                                                    {selectedEmployees.includes(emp._id) ? 'Deselect' : 'Select'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {!isLoading && availableEmployees.length === 0 && (
                            <div className="text-center py-32"><UserCheck size={32} className="mx-auto text-slate-200 dark:text-slate-800" /><p className="text-slate-400 dark:text-slate-600 font-black uppercase text-[10px] mt-2">No candidates found</p></div>
                        )}
                    </div>
                </div>
                <div className="mt-8 text-center text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <AlertCircle size={14} /> You have {remainingSlots} slots remaining.
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;