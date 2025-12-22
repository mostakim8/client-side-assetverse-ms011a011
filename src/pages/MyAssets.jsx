import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import { FaPrint, FaUndo, FaSearch, FaTimes } from "react-icons/fa";

const MyAssets = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); // Secure instance
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState(""); 

    const { data: myAssets = [], refetch, isLoading } = useQuery({
        queryKey: ['my-assets', user?.email, search, filterType, filterStatus],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-requests/${user?.email}?search=${search}&type=${filterType}&status=${filterStatus}`);
            return res.data;
        }
    });

    const handleCancel = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will permanently remove your request!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/requests/cancel/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire("Cancelled!", "Request removed successfully.", "success");
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Could not cancel request", "error");
                }
            }
        });
    };

    const handleReturn = async (req) => {
        Swal.fire({
            title: "Return Asset?",
            text: "This will increase the company inventory stock.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm Return"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/requests/return/${req._id}`, {
                        assetId: req.assetId
                    });
                    if (res.data.modifiedCount > 0) {
                        Swal.fire("Returned!", "Asset returned successfully.", "success");
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Return process failed", "error");
                }
            }
        });
    };

    const handlePrint = () => window.print();

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 no-print">
                    <h2 className="text-3xl font-black text-gray-800 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter">My Requested Assets</h2>
                    <button onClick={handlePrint} className="btn btn-primary bg-blue-600 border-none text-white px-8 rounded-2xl shadow-lg font-bold">
                        <FaPrint className="mr-2" /> Download PDF
                    </button>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 no-print">
                    <div className="relative md:col-span-1">
                        <FaSearch className="absolute top-4 left-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            className="input input-bordered w-full pl-12 h-14 rounded-2xl bg-gray-50"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="select select-bordered h-14 rounded-2xl bg-gray-50 font-bold" onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">Filter by Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Returned">Returned</option>
                    </select>
                    <select className="select select-bordered h-14 rounded-2xl bg-gray-50 font-bold" onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">Filter by Type</option>
                        <option value="Returnable">Returnable</option>
                        <option value="Non-returnable">Non-returnable</option>
                    </select>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm print:shadow-none">
                    <table className="table w-full">
                        <thead className="bg-gray-100 text-gray-700 h-16">
                            <tr>
                                <th className="pl-6">Image</th>
                                <th>Asset Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Request Date</th>
                                <th>Approve Date</th>
                                <th className="text-center pr-6 no-print">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {myAssets.map((asset) => (
                                <tr key={asset._id} className="hover:bg-blue-50/30 transition-all h-20">
                                    <td className="pl-6">
                                        <img src={asset.productImage} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                    </td>
                                    <td className="font-black text-gray-800">{asset.productName}</td>
                                    <td className="font-bold text-gray-500">{asset.productType}</td>
                                    <td>
                                        <span className={`badge border-none font-bold py-3 px-4 rounded-lg ${
                                            asset.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                                            asset.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="text-sm font-medium">{asset.requestDate}</td>
                                    <td className="text-sm font-medium text-gray-400">
                                        {asset.approvalDate || "---"}
                                    </td>
                                    <td className="text-center pr-6 no-print">
                                        <div className="flex justify-center gap-2">
                                            {asset.status === 'Pending' && (
                                                <button onClick={() => handleCancel(asset._id)} className="btn btn-sm btn-error text-white rounded-xl">
                                                    Cancel
                                                </button>
                                            )}
                                            {asset.status === 'Approved' && asset.productType === 'Returnable' && (
                                                <button 
                                                    onClick={() => handleReturn(asset)}
                                                    className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white border-none rounded-xl"
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </div>
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

export default MyAssets;