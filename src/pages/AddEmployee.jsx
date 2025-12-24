import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaCrown, FaUsers } from "react-icons/fa";

const AddEmployee = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const { data: hrData = {} } = useQuery({
        queryKey: ['hr-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    // how many members are already in the team
    const { data: teamCount = 0, refetch: refetchCount } = useQuery({
        queryKey: ['team-count', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/team-count/${user?.email}`);
            return res.data.count;
        }
    });

    const { data: availableEmployees = [], refetch: refetchAvailable, isLoading } = useQuery({
        queryKey: ['unaffiliated-employees'],
        queryFn: async () => {
            const res = await axiosSecure.get('/unaffiliated-employees');
            return res.data;
        }
    });
// member select and deselect
    const handleSelect = (id) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
        } else {
           
            const currentTotal = teamCount + selectedEmployees.length;
            if (currentTotal >= (hrData?.packageLimit || 0)) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Limit Exceeded!',
                    text: `Your package limit is ${hrData?.packageLimit}. Please upgrade to add more members.`,
                    showCancelButton: true,
                    confirmButtonText: 'Upgrade Now',
                    confirmButtonColor: '#2563eb',
                    cancelButtonColor: '#d33'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/upgrade-package");
                    }
                });
            }
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleBulkAdd = async () => {
        if (selectedEmployees.length === 0) return;

        if (teamCount + selectedEmployees.length > (hrData?.packageLimit || 0)) {
            return Swal.fire({
                icon: 'error',
                title: 'Action Denied!',
                text: `You have ${teamCount} members. You can't add ${selectedEmployees.length} more. Upgrade your package first.`,
                confirmButtonText: 'Upgrade Now',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/upgrade-package");
                }
            });
        }

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
                    title: "Members Added!",
                    text: `${res.data.modifiedCount} employees successfully joined your team.`,
                    timer: 2000,
                    showConfirmButton: false
                });
                setSelectedEmployees([]);
                refetchAvailable();
                refetchCount();
            }
        } catch (error) {
            Swal.fire("Error", "Action failed. Please try again.", "error");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                
                {/* package status card */}
                <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <FaUsers size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Team Management</h2>
                            <p className="text-gray-500 font-bold">
                                Capacity: <span className="text-blue-600">{teamCount} / {hrData?.packageLimit || 0}</span> Members Used
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/upgrade-package" 
                        className="btn bg-amber-400 hover:bg-amber-500 border-none text-amber-900 font-black rounded-2xl px-8 h-14"
                    >
                        <FaCrown /> Upgrade Limit
                    </Link>
                </div>

                {/* employee selection table */}
                <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Available Candidates</h3>
                        <button 
                            onClick={handleBulkAdd}
                            disabled={selectedEmployees.length === 0}
                            className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white px-10 rounded-2xl h-14 shadow-lg shadow-blue-100 disabled:bg-gray-200"
                        >
                            <FaUserPlus /> Add Selected ({selectedEmployees.length})
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl">
                        <table className="table w-full">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-black tracking-widest h-16">
                                <tr>
                                    <th className="pl-6">Select</th>
                                    <th>Candidate</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {availableEmployees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-blue-50/30 transition-all h-20">
                                        <td className="pl-6">
                                            <input 
                                                type="checkbox" 
                                                className="checkbox checkbox-primary rounded-lg border-gray-300"
                                                checked={selectedEmployees.includes(emp._id)}
                                                onChange={() => handleSelect(emp._id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm">
                                                        <img src={emp.photo || emp.image || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Member" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800">{emp.name}</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => handleSelect(emp._id)}
                                                className={`btn btn-sm rounded-xl px-6 font-bold transition-all ${
                                                    selectedEmployees.includes(emp._id) 
                                                    ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                                                    : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                                                }`}
                                            >
                                                {selectedEmployees.includes(emp._id) ? 'Deselect' : 'Select Employee'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {availableEmployees.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-400 font-medium italic">No unaffiliated employees found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;