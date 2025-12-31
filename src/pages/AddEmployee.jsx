import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Crown, Users, CheckCircle2, AlertCircle, Search, Loader2 } from "lucide-react";

const AddEmployee = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [search, setSearch] = useState("");

    // Get HR Profile for Package Limit
    const { data: hrData = {} } = useQuery({
        queryKey: ['hr-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    // Get current team count
    const { data: teamCount = 0, refetch: refetchCount } = useQuery({
        queryKey: ['team-count', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/team-count/${user?.email}`);
            return res.data.count;
        }
    });

    // Get unaffiliated employees (available for hire)
    const { data: availableEmployees = [], refetch: refetchAvailable, isLoading, isFetching } = useQuery({
        queryKey: ['unaffiliated-employees', search],
        queryFn: async () => {
            const res = await axiosSecure.get(`/unaffiliated-employees?search=${search}`);
            return res.data;
        }
    });

    const packageLimit = hrData?.packageLimit || 0;
    const remainingSlots = packageLimit - teamCount;

    const handleSelect = (id) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
        } else {
            const currentSelectedCount = selectedEmployees.length;
            if (currentSelectedCount >= remainingSlots) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Capacity Reached!',
                    text: `Your current package (${packageLimit} members) doesn't have enough slots.`,
                    showCancelButton: true,
                    confirmButtonText: 'Upgrade Package',
                    confirmButtonColor: '#2563eb',
                    borderRadius: '24px'
                }).then((result) => {
                    if (result.isConfirmed) navigate("/upgrade-package");
                });
            }
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleBulkAdd = async () => {
        if (selectedEmployees.length === 0) return;

        Swal.fire({
            title: 'Adding Members...',
            didOpen: () => { Swal.showLoading() }
        });

        const info = {
            hrEmail: user?.email,
            companyName: hrData?.companyName || "Your Company",
            companyLogo: hrData?.companyLogo || user?.photoURL,
            employeeIds: selectedEmployees
        };

        try {
            const res = await axiosSecure.patch('/add-to-team-bulk', info);
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: `${res.data.modifiedCount} members joined your organization.`,
                    timer: 2000,
                    showConfirmButton: false,
                    borderRadius: '20px'
                });
                setSelectedEmployees([]);
                refetchAvailable();
                refetchCount();
            }
        } catch (error) {
            Swal.fire("Error", "Check your internet connection and try again.", "error");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#fcfcfd]">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-6xl mx-auto">
                
                {/* Package Status Dashboard */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                    
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Users size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Team <span className="text-blue-600 italic">Builder</span></h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                                            style={{ width: `${(teamCount / packageLimit) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {teamCount} / {packageLimit} Slots
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <Link 
                            to="/upgrade-package" 
                            className="w-full lg:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-500 text-amber-900 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-amber-100"
                        >
                            <Crown size={18} /> Upgrade Capacity
                        </Link>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-50 overflow-hidden">
                    <div className="p-8 lg:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="relative w-full md:w-96 group">
                            <Search className={`absolute top-1/2 -translate-y-1/2 left-5 transition-colors ${search ? 'text-blue-600' : 'text-gray-300'}`} size={18} />
                            <input 
                                type="text" 
                                placeholder="Search candidates..." 
                                className="input w-full pl-14 h-14 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button 
                            onClick={handleBulkAdd}
                            disabled={selectedEmployees.length === 0}
                            className="w-full md:w-auto px-10 py-4 bg-gray-900 hover:bg-blue-600 disabled:bg-gray-100 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl"
                        >
                            <UserPlus size={18} /> Add Selected ({selectedEmployees.length})
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="py-6 pl-10 text-[10px] font-black uppercase tracking-widest text-gray-400">Select</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Candidate Profile</th>
                                    <th className="py-6 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {availableEmployees.map((emp) => (
                                    <tr key={emp._id} className="group hover:bg-blue-50/30 transition-all">
                                        <td className="py-5 pl-10">
                                            <input 
                                                type="checkbox" 
                                                className="checkbox checkbox-primary rounded-xl w-6 h-6 border-2 border-gray-200"
                                                checked={selectedEmployees.includes(emp._id)}
                                                onChange={() => handleSelect(emp._id)}
                                            />
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                                    <img src={emp.photo || emp.image || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Member" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 tracking-tight">{emp.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 pr-10 text-right">
                                            <button 
                                                onClick={() => handleSelect(emp._id)}
                                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    selectedEmployees.includes(emp._id) 
                                                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                                    : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm'
                                                }`}
                                            >
                                                {selectedEmployees.includes(emp._id) ? 'Deselect' : 'Select'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {availableEmployees.length === 0 && !isLoading && (
                            <div className="text-center py-24">
                                <AlertCircle size={40} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No candidates available at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;