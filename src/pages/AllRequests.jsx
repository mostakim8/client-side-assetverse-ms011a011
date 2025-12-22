import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { useState } from "react";
import Swal from "sweetalert2";
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";

const AllRequests = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const [search, setSearch] = useState("");

    const { data: requests = [], refetch, isLoading } = useQuery({
        queryKey: ['requests', user?.email, search],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-requests/${user?.email}?search=${search}`);
            return res.data;
        }
    });

    const handleStatusUpdate = (req, newStatus) => {
        Swal.fire({
            title: `Confirm ${newStatus}?`,
            text: newStatus === 'Approved' ? "Deducting quantity from inventory." : "This request will be marked as rejected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: newStatus === 'Approved' ? "#22c55e" : "#ef4444",
            confirmButtonText: `Yes, ${newStatus}`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/requests/${req._id}`, { 
                        status: newStatus,
                        assetId: req.assetId,
                        userEmail: req.userEmail,
                        hrEmail: user?.email,
                        companyName: "AssetVerse", 
                        companyLogo: user?.photoURL
                    });
                    
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            icon: "success",
                            title: `Request ${newStatus}!`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Failed to update status. Please try again.", "error");
                }
            }
        });
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-black text-gray-800 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter">
                        Employee Requests
                    </h2>
                    
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="input input-bordered w-full pl-12 h-14 rounded-2xl bg-gray-50 focus:bg-white transition-all"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="table w-full">
                        <thead className="bg-gray-100 text-gray-700 h-16">
                            <tr>
                                <th className="pl-6">Employee Info</th>
                                <th>Asset Details</th>
                                <th>Request Date</th>
                                <th>Current Status</th>
                                <th className="text-center pr-6">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {requests.map((req) => (
                                <tr key={req._id} className="hover:bg-blue-50/30 transition-all h-20">
                                    <td className="pl-6">
                                        <div className="font-black text-gray-800">{req.userName}</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{req.userEmail}</div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-blue-600">{req.productName}</div>
                                        <div className={`text-[10px] font-black uppercase mt-1 ${req.productType === 'Returnable' ? 'text-purple-500' : 'text-orange-500'}`}>
                                            {req.productType}
                                        </div>
                                    </td>
                                    <td className="text-sm font-medium text-gray-500">{req.requestDate}</td>
                                    <td>
                                        <span className={`badge badge-md border-none font-bold py-3 px-4 rounded-lg ${
                                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                            req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="text-center pr-6">
                                        {req.status === 'Pending' ? (
                                            <div className="flex justify-center gap-3">
                                                <button 
                                                    onClick={() => handleStatusUpdate(req, 'Approved')} 
                                                    className="btn btn-sm bg-green-500 hover:bg-green-600 border-none text-white rounded-xl shadow-md shadow-green-100"
                                                    title="Approve Request"
                                                >
                                                    <FaCheck /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(req, 'Rejected')} 
                                                    className="btn btn-sm bg-red-500 hover:bg-red-600 border-none text-white rounded-xl shadow-md shadow-red-100"
                                                    title="Reject Request"
                                                >
                                                    <FaTimes /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.length === 0 && !isLoading && (
                        <div className="text-center py-20 text-gray-400 font-medium">
                            No requests found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllRequests;