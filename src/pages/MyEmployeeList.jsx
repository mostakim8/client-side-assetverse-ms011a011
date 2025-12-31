import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { UserMinus, Users, Search, Loader2, UserCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const MyEmployeeList = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: employees = [], refetch, isLoading, isFetching } = useQuery({
        queryKey: ['my-employees', user?.email, debouncedSearch],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-employees/${user?.email.toLowerCase()}?search=${debouncedSearch}`);
            return res.data;
        }
    });

    const handleRemove = (id) => {
        Swal.fire({
            title: `<span style="font-family: 'Inter', sans-serif;">Remove from Team?</span>`,
            text: "This employee will lose access to all company assets and dashboard features.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#94a3b8",
            confirmButtonText: "Yes, Remove Member",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/employees/remove/${id}`);
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            title: "Member Removed",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Action could not be completed.", "error");
                }
            }
        });
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#fcfcfd]">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={18} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Organization</span>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                            Team <span className="text-blue-600 italic">Directory</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-medium mt-1">Total {employees.length} active members.</p>
                    </div>

                    <div className="relative w-full lg:w-96">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-300" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="input w-full pl-14 h-16 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {isFetching && <Loader2 size={16} className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-blue-600" />}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50/50">
                                <tr className="text-gray-400 text-[10px] uppercase font-black text-center">
                                    <th className="py-6 ">Image</th> 
                                    <th>Name</th> 
                                    <th>Email</th>
                                    <th>Join Date</th>
                                    <th>Type</th>
                                    <th className="text-right pr-10">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {employees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-blue-50/30 transition-all border-b border-gray-50 last:border-0">
                                        <td className="py-6 pl-10">
                                            <img 
                                                src={emp.photo || emp.image || emp.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                                                className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shadow-sm" 
                                                alt=""
                                                onError={(e) => { e.target.src = "https://i.ibb.co/mJR7z1C/avatar.png" }} 
                                            />
                                        </td>
                                        <td>
                                            <span className="font-black text-gray-800">{emp.name}</span>
                                        </td>
                                        <td className="text-gray-500 font-medium text-sm">{emp.email}</td>
                                        <td className="text-gray-400 text-xs font-bold">{emp.joinedDate || "Pre-registered"}</td>
                                        <td className="text-center">
                                    
                                                <span className="text-[10px] font-black uppercase bg-blue-300/10 text-blue-600 px-2 py-1 rounded-xl" >Employee</span>
                                            
                                        </td>
                                        <td className="text-right pr-10">
                                            <button 
                                                onClick={() => handleRemove(emp._id)} 
                                                className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Remove from Team"
                                            >
                                                <UserMinus size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {employees.length === 0 && (
                            <div className="text-center py-20">
                                <UserCircle size={40} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-black uppercase text-xs">No Members Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEmployeeList;