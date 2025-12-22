import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
import { useState } from "react";
import Swal from "sweetalert2";

const AllRequests = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState("");

    const { data: requests = [], refetch } = useQuery({
        queryKey: ['requests', user?.email, search],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/all-requests/${user?.email}?search=${search}`);
            return res.data;
        }
    });

    const handleStatusUpdate = async (id, newStatus) => {
        const approvalDate = newStatus === 'Approved' ? new Date().toLocaleDateString() : null;
        
        try {
            const res = await axios.patch(`http://localhost:5001/requests/${id}`, { 
                status: newStatus,
                approvalDate: approvalDate 
            });
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success", `Request ${newStatus}`, "success");
                refetch();
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4">All Asset Requests</h2>

                {/* Search Bar */}
                <div className="mb-6 max-w-md">
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="input input-bordered w-full"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="table w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th>Asset Name</th>
                                <th>Asset Type</th>
                                <th>Requester</th>
                                <th>Request Date</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id}>
                                    <td className="font-bold">{req.productName}</td>
                                    <td>{req.productType}</td>
                                    <td>
                                        <div className="text-sm">
                                            <p className="font-bold">{req.userName}</p>
                                            <p className="text-gray-500">{req.userEmail}</p>
                                        </div>
                                    </td>
                                    <td>{req.requestDate}</td>
                                    <td>
                                        <span className={`badge font-bold ${req.status === 'Pending' ? 'badge-warning' : req.status === 'Approved' ? 'badge-success' : 'badge-error'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="flex justify-center gap-2">
                                        {req.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="btn btn-success btn-xs text-white">Approve</button>
                                                <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="btn btn-error btn-xs text-white">Reject</button>
                                            </>
                                        )}
                                        {req.status !== 'Pending' && <span className="text-xs italic text-gray-400">Action Taken</span>}
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