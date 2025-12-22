import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
import { useState } from "react";
import Swal from "sweetalert2";

const AllRequests = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState("");

    const { data: requests = [], refetch, isLoading } = useQuery({
        queryKey: ['requests', user?.email, search],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/all-requests/${user?.email}?search=${search}`);
            return res.data;
        }
    });

    const handleStatusUpdate = (req, newStatus) => {
        Swal.fire({
            title: `Confirm ${newStatus}?`,
            text: newStatus === 'Approved' ? "Deducting quantity and creating affiliation if new employee." : "Status will be marked as Rejected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: newStatus === 'Approved' ? "#22c55e" : "#ef4444",
            confirmButtonText: `Yes, ${newStatus}`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.patch(`http://localhost:5001/requests/${req._id}`, { 
                        status: newStatus,
                        assetId: req.assetId,
                        userEmail: req.userEmail,
                        hrEmail: user?.email,
                        companyName: "AssetVerse", 
                        companyLogo: user?.photoURL
                    });
                    
                    if (res.data.modifiedCount > 0) {
                        Swal.fire("Done!", `Request is ${newStatus}`, "success");
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Something went wrong", "error");
                }
            }
        });
    };

    if (isLoading) return <div className="text-center mt-20 font-bold">Loading...</div>;

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-black text-gray-800">All Asset Requests</h2>
                    <input 
                        type="text" 
                        placeholder="Search by name/email" 
                        className="input input-bordered w-full md:w-80"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full border">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th>Employee</th>
                                <th>Asset</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id}>
                                    {/* Employee Column */}
                                    <td>
                                        <div className="font-bold">{req.userName}</div>
                                        <div className="text-xs text-gray-500">{req.userEmail}</div>
                                    </td>
                                    {/* Asset Column */}
                                    <td>
                                        <div className="font-medium">{req.productName}</div>
                                        <div className="text-xs badge badge-ghost">{req.productType}</div>
                                    </td>
                                    {/* Date Column */}
                                    <td className="text-sm">{req.requestDate}</td>
                                    {/* Status Column */}
                                    <td>
                                        <span className={`badge badge-sm font-bold ${
                                            req.status === 'Pending' ? 'badge-warning' : 
                                            req.status === 'Approved' ? 'badge-success text-white' : 'badge-error text-white'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    {/* Actions Column */}
                                    <td className="text-center">
                                        {req.status === 'Pending' ? (
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleStatusUpdate(req, 'Approved')} className="btn btn-success btn-xs text-white">Approve</button>
                                                <button onClick={() => handleStatusUpdate(req, 'Rejected')} className="btn btn-error btn-xs text-white">Reject</button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-semibold uppercase italic">Action Taken</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllRequests;