import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { FaTrash, FaEdit, FaSearch, FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";

const AssetList = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);

    const { data: assets = [], refetch, isLoading } = useQuery({
        queryKey: ['assets', user?.email, search, filter, sort],
        queryFn: async () => {
            const res = await axiosSecure.get(`/assets/${user?.email}?search=${search}&filter=${filter}&sort=${sort}`);
            return res.data;
        }
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedInfo = {
            productName: form.productName.value,
            productType: form.productType.value,
            productQuantity: parseInt(form.productQuantity.value),
            productImage: form.productImage.value 
        };

        try {
            const res = await axiosSecure.put(`/assets/${selectedAsset._id}`, updatedInfo);
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Asset information has been updated successfully.",
                    timer: 1500,
                    showConfirmButton: false
                });
                refetch();
                document.getElementById('edit_modal').close();
            }
        } catch (error) {
            Swal.fire("Error", "Failed to update asset.", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This asset will be permanently removed from your inventory!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, Delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/assets/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire("Deleted!", "Asset removed from inventory.", "success");
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Could not delete the asset.", "error");
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
                    <h2 className="text-3xl font-black text-gray-800 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter flex items-center gap-3">
                        <FaBoxOpen className="text-blue-600"/> Inventory List
                    </h2>
                </div>

                {/* Search & Filter Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative">
                        <FaSearch className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search asset name..." 
                            className="input input-bordered w-full pl-12 h-14 rounded-2xl bg-gray-50"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="select select-bordered h-14 rounded-2xl bg-gray-50 font-bold" onChange={(e) => setFilter(e.target.value)}>
                        <option value="">Filter by Type</option>
                        <option value="Returnable">Returnable</option>
                        <option value="Non-returnable">Non-returnable</option>
                    </select>
                    <select className="select select-bordered h-14 rounded-2xl bg-gray-50 font-bold" onChange={(e) => setSort(e.target.value)}>
                        <option value="">Sort by Quantity</option>
                        <option value="quantity">High to Low</option>
                    </select>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto rounded-2xl border border-gray-50">
                    <table className="table w-full">
                        <thead className="bg-gray-100 text-gray-700 h-16">
                            <tr>
                                <th className="pl-6">Image</th>
                                <th>Asset Name</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Date Added</th>
                                <th className="text-center pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {assets.map((asset) => (
                                <tr key={asset._id} className="hover:bg-blue-50/30 transition-all h-20">
                                    <td className="pl-6">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={asset.productImage || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Asset" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-black text-gray-800">{asset.productName}</td>
                                    <td>
                                        <span className={`badge border-none font-bold py-3 px-4 rounded-lg ${
                                            asset.productType === 'Returnable' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                        }`}>
                                            {asset.productType}
                                        </span>
                                    </td>
                                    <td className="font-bold text-gray-700">{asset.productQuantity}</td>
                                    <td className="text-sm font-medium text-gray-500">{asset.addedDate}</td>
                                    <td className="text-center pr-6">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => { setSelectedAsset(asset); document.getElementById('edit_modal').showModal(); }}
                                                className="btn btn-sm btn-ghost text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl"
                                                title="Edit Asset"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(asset._id)} 
                                                className="btn btn-sm btn-ghost text-red-600 bg-red-50 hover:bg-red-100 rounded-xl"
                                                title="Delete Asset"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {assets.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 italic">No assets found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal - Improved UI */}
            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box rounded-4xl p-8">
                    <h3 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Update Asset Info</h3>
                    {selectedAsset && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="form-control">
                                <label className="label font-bold text-gray-600">Product Name</label>
                                <input name="productName" defaultValue={selectedAsset.productName} className="input input-bordered rounded-2xl bg-gray-50" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-gray-600">Asset Type</label>
                                <select name="productType" defaultValue={selectedAsset.productType} className="select select-bordered rounded-2xl bg-gray-50 font-bold">
                                    <option value="Returnable">Returnable</option>
                                    <option value="Non-returnable">Non-returnable</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-gray-600">Quantity</label>
                                <input type="number" name="productQuantity" defaultValue={selectedAsset.productQuantity} className="input input-bordered rounded-2xl bg-gray-50" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-gray-600">Image URL</label>
                                <input name="productImage" defaultValue={selectedAsset.productImage} className="input input-bordered rounded-2xl bg-gray-50" />
                            </div>
                            
                            <div className="modal-action gap-3 pt-4">
                                <button type="submit" className="btn btn-primary flex-grow bg-blue-600 border-none text-white rounded-2xl font-bold">Save Changes</button>
                                <button type="button" onClick={() => document.getElementById('edit_modal').close()} className="btn rounded-2xl px-8">Close</button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default AssetList;