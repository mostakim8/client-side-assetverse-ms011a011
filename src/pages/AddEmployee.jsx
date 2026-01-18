import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Crown, Users, AlertCircle, Search, Loader2 } from "lucide-react";

const AddEmployee = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
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

    // Queries
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
        // placeholderData: (prev) => prev, // এটি নতুন ভিক্টোরি ভার্সনে keepPreviousData এর বিকল্প
    });

    const packageLimit = hrData?.packageLimit || 0;
    const remainingSlots = packageLimit - teamCount;

    // Handlers (পেমেন্ট বা অ্যাড লজিক আগের মতোই)
    const handleSelect = (id) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
        } else {
            if (selectedEmployees.length >= remainingSlots) {
                return Swal.fire({ icon: 'warning', title: 'Limit Reached!', text: 'Upgrade your package.' });
            }
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleBulkAdd = async () => {
        if (selectedEmployees.length === 0) return;
        const info = { hrEmail: user?.email, companyName: hrData?.companyName, companyLogo: hrData?.companyLogo, employeeIds: selectedEmployees };
        try {
            const res = await axiosSecure.patch('/add-to-team-bulk', info);
            if (res.data.modifiedCount > 0) {
                Swal.fire({ icon: "success", title: "Added!", timer: 2000 });
                setSelectedEmployees([]);
                refetchAvailable();
                refetchCount();
            }
        } catch (error) { console.error(error) }
    };

    // --- মনোযোগ দিন: এখানে আর 'if (isLoading) return' নেই ---

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-6xl mx-auto">
                
                {/* Dashboard Header */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white"><Users size={32} /></div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase">Team Builder</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                                       <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${teamCount >= packageLimit ? 'bg-rose-500' : 'bg-blue-600'}`} 
                                        style={{ width: `${(teamCount / packageLimit) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{teamCount} / {packageLimit} Slots</span>
                                </div>
                            </div>
                        </div>
                        <Link to="/upgrade-package" className="btn bg-amber-400 font-black rounded-2xl border-none text-amber-900 uppercase text-xs"><Crown size={18} /> Upgrade Capacity</Link>
                    </div>
                </div>

                {/* Search & Table Area */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
                    <div className="p-8 lg:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="relative w-full md:w-96">
                            <Search className={`absolute top-1/2 -translate-y-1/2 left-5 ${isFetching ? 'text-blue-600 animate-pulse' : 'text-gray-300'}`} size={18} />
                            
                            {/* টাইপিং এখানে একদম স্মুথ থাকবে, ফোকাস হারাবে না */}
                            <input 
                                type="text" 
                                placeholder="Start typing (e.g. apple)..." 
                                value={displaySearch}
                                className="input w-full pl-14 h-14 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                                onChange={(e) => setDisplaySearch(e.target.value)} 
                                autoFocus
                            />
                            {isFetching && (
                                <Loader2 className="absolute top-1/2 -translate-y-1/2 right-5 animate-spin text-blue-400" size={16} />
                            )}
                        </div>

                        <button onClick={handleBulkAdd} disabled={selectedEmployees.length === 0} className="btn bg-gray-900 text-white font-black px-10 rounded-2xl border-none uppercase text-xs">
                            <UserPlus size={18} /> Add Selected ({selectedEmployees.length})
                        </button>
                    </div>

                    <div className="overflow-x-auto relative min-h-[300px]">
                        {/* টেবিলের ভেতর লোডিং হ্যান্ডেল করা হচ্ছে */}
                        {isLoading && availableEmployees.length === 0 ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
                            </div>
                        ) : (
                            <table className={`table w-full transition-opacity ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="py-6 pl-10 text-[10px] font-black uppercase text-gray-400">Select</th>
                                        <th className="py-6 text-[10px] font-black uppercase text-gray-400">Candidate Profile</th>
                                        <th className="py-6 pr-10 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {availableEmployees.map((emp) => (
                                        <tr key={emp._id} className="group hover:bg-blue-50/30 transition-all">
                                            <td className="py-5 pl-10">
                                                <input type="checkbox" className="checkbox checkbox-primary rounded-xl" checked={selectedEmployees.includes(emp._id)} onChange={() => handleSelect(emp._id)} />
                                            </td>
                                            <td className="py-5">
                                                <div className="flex items-center gap-4">
                                                    <img src={emp.photo || emp.image || "https://i.ibb.co/mJR7z1C/avatar.png"} className="w-12 h-12 rounded-2xl object-cover" />
                                                    <div><p className="font-black text-gray-800 tracking-tight">{emp.name}</p><p className="text-[10px] font-bold text-gray-400 uppercase">{emp.email}</p></div>
                                                </div>
                                            </td>
                                            <td className="py-5 pr-10 text-right">
                                                <button onClick={() => handleSelect(emp._id)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase ${selectedEmployees.includes(emp._id) ? 'bg-rose-50 text-rose-600' : 'bg-white text-blue-600 border border-blue-100'}`}>
                                                    {selectedEmployees.includes(emp._id) ? 'Deselect' : 'Select'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        
                        {!isLoading && availableEmployees.length === 0 && (
                            <div className="text-center py-24">
                                <AlertCircle size={40} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-gray-300 font-black uppercase text-[10px]">No candidates found for "{search}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;