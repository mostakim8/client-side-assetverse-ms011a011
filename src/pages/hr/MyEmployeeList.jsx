import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure"; 
import { ThemeContext } from "../../hooks/ThemeContext"; 
import Swal from "sweetalert2";
import { UserMinus, Search, Loader2, UserPlus, CheckCircle, Calendar, Briefcase, Users, PackagePlus } from "lucide-react";
import { useState, useEffect, useContext } from "react";

const MyEmployeeList = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const { isDark } = useContext(ThemeContext); 
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: myAssets = [] } = useQuery({
        queryKey: ['my-assets-list', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/assets/${user?.email.toLowerCase()}`);
            return res.data.result || [];
        }
    });

    const { data: pendingRequests = [], refetch: refetchPending } = useQuery({
        queryKey: ['pending-requests', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/pending-requests/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    const { data: employees = [], refetch: refetchMembers, isLoading } = useQuery({
        queryKey: ['my-employees', user?.email, debouncedSearch],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-employees/${user?.email.toLowerCase()}?search=${debouncedSearch}`);
            return res.data;
        }
    });

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        const assetId = e.target.asset.value;
        const asset = myAssets.find(a => a._id === assetId);

        const assignData = {
            assetId: asset._id,
            productName: asset.productName,
            productType: asset.productType,
            userEmail: selectedEmployee.email,
            userName: selectedEmployee.name,
            hrEmail: user?.email.toLowerCase(),
        };

        try {
            const res = await axiosSecure.post('/assign-asset', assignData);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Asset Assigned!',
                    text: `${asset.productName} assigned to ${selectedEmployee.name}`,
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
                document.getElementById('assign_modal').close();
                refetchMembers();
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed to Assign' });
        }
    };

    const handleApprove = async (emp) => {
        try {
            const res = await axiosSecure.patch(`/users/approve-request/${emp.email}`, {
                hrEmail: user?.email
            });
            if (res.data.modifiedCount > 0) {
                Swal.fire({ 
                    icon: 'success', 
                    title: 'Employee Added!', 
                    showConfirmButton: false, 
                    timer: 1500,
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
                refetchPending();
                refetchMembers();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Action Failed",
                text: error.response?.data?.message || "Error occurred",
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    };

    const handleRemove = (id) => {
        Swal.fire({
            title: `Remove from Team?`,
            text: "This employee will lose access to all company assets.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, Remove Member",
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f8fafc' : '#1e293b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/employees/remove/${id}`);
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            title: "Removed!", 
                            text: "Member has been removed.", 
                            icon: "success",
                            background: isDark ? '#1e293b' : '#fff',
                            color: isDark ? '#f8fafc' : '#1e293b',
                        });
                        refetchMembers();
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error", 
                        text: "Action failed.", 
                        icon: "error",
                        background: isDark ? '#1e293b' : '#fff',
                        color: isDark ? '#f8fafc' : '#1e293b',
                    });
                }
            }
        });
    };

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd] dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                            Manage Team <span className="text-blue-600 italic">Members</span>
                        </h2>
                        <p className="text-gray-400 dark:text-slate-500 text-sm font-medium mt-1">Manage and monitor active team members.</p>
                    </div>
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-300 dark:text-slate-600" size={20} />
                        <input 
                            type="text" 
                            className="w-full pl-14 pr-6 h-16 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                        />
                    </div>
                </div>

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className="mb-12 bg-amber-50/30 dark:bg-amber-900/10 p-8 rounded-[2.5rem] border border-amber-100/50 dark:border-amber-900/20">
                        <div className="flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-500">
                            <UserPlus size={20} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Join Requests ({pendingRequests.length})</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingRequests.map(req => (
                                <div key={req._id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-amber-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <img src={req.photo || "https://i.ibb.co/mJR7z1C/avatar.png"} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-blue-100 dark:group-hover:ring-slate-700 transition-all" alt="" />
                                        <div className="min-w-0">
                                            <p className="font-black text-gray-800 dark:text-slate-200 text-xs truncate uppercase">{req.name || req.employeeName}</p>
                                            <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold truncate">{req.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleApprove(req)} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all active:scale-95"><CheckCircle size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-32"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 dark:bg-slate-800/50 text-gray-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-100 dark:border-slate-800">
                                        <th className="py-7 pl-10">Member Info</th> 
                                        <th className="py-7">Email Address</th>
                                        <th className="py-7">Join Date</th>
                                        <th className="py-7 text-center">Assign</th>
                                        <th className="py-7 pr-10 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp) => (
                                        <tr key={emp._id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all border-b border-gray-50 dark:border-slate-800 last:border-0">
                                            <td className="py-6 pl-10">
                                                <div className="flex items-center gap-4">
                                                    <img src={emp.photo || "https://i.ibb.co/mJR7z1C/avatar.png"} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                                                    <div>
                                                        <p className="font-black text-gray-800 dark:text-slate-200 text-sm">{emp.name}</p>
                                                        <span className="text-[9px] font-black uppercase bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md">Active</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <p className="text-gray-500 dark:text-slate-400 font-bold text-xs">{emp.email}</p>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                                                    <Calendar size={14} />
                                                    <span className="text-xs font-bold text-gray-600 dark:text-slate-400">{emp.joinedDate || "N/A"}</span>
                                                </div>
                                            </td>

                                            <td className="py-6 text-center">
                                                <button 
                                                    onClick={() => { setSelectedEmployee(emp); document.getElementById('assign_modal').showModal(); }}
                                                    className="p-3 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Assign Asset Directly"
                                                >
                                                    <PackagePlus size={18} />
                                                </button>
                                            </td>
                                            <td className="py-6 pr-10 text-right">
                                                <button 
                                                    onClick={() => handleRemove(emp._id)} 
                                                    className="inline-flex items-center gap-2 text-gray-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 font-black uppercase text-[10px] tracking-widest transition-all p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"
                                                >
                                                    <UserMinus size={18} />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        
                        {!isLoading && employees.length === 0 && (
                            <div className="text-center py-32">
                                <Users size={48} className="mx-auto text-gray-100 dark:text-slate-800 mb-4" />
                                <p className="text-gray-300 dark:text-slate-600 font-black uppercase text-xs tracking-widest">No team members found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ASSIGN ASSET MODAL */}
            <dialog id="assign_modal" className="modal backdrop-blur-sm">
                <div className="modal-box rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border dark:border-slate-800 shadow-2xl">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-2">Assign Asset</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Directly assign to: <span className="text-blue-600">{selectedEmployee?.name}</span></p>
                    
                    <form onSubmit={handleAssignSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Select Asset from Inventory</label>
                            <select name="asset" className="w-full h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl px-6 outline-none font-bold text-sm text-gray-700 dark:text-slate-200 border-none focus:ring-2 focus:ring-blue-600 transition-all" required>
                                <option value="" disabled selected>Choose an asset...</option>
                                {myAssets.filter(a => a.productQuantity > 0).map(asset => (
                                    <option key={asset._id} value={asset._id}>{asset.productName} ({asset.productQuantity} left)</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-grow h-14 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all">Assign Now</button>
                            <button type="button" onClick={() => document.getElementById('assign_modal').close()} className="px-8 h-14 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-widest">Cancel</button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop bg-slate-900/40">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default MyEmployeeList;