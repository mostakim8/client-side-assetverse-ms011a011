import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
import { FaTrash, FaEdit, FaSearch, FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";

const AssetList = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);

    const { data: assets = [], refetch, isLoading } = useQuery({
        queryKey: ['assets', user?.email, search, filter, sort],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/assets/${user?.email}?search=${search}&filter=${filter}&sort=${sort}`);
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
            const res = await axios.put(`http://localhost:5001/assets/${selectedAsset._id}`, updatedInfo);
            if (res.data.modifiedCount > 0) {
                Swal.fire("Updated!", "Asset has been updated.", "success");
                refetch();
                document.getElementById('edit_modal').close();
            }
        } catch (error) {
            Swal.fire("Error", "Update failed!", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This asset will be permanently removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, Delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axios.delete(`http://localhost:5001/assets/${id}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire("Deleted!", "Asset removed from inventory.", "success");
                    refetch();
                }
            }
        });
    };

    if (isLoading) return <div className="text-center mt-20 font-bold">Loading Inventory...</div>;

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-2"><FaBoxOpen className="text-blue-600"/> Company Asset List</h2>

                {/* Search & Filter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative">
                        <FaSearch className="absolute top-4 left-3 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            className="input input-bordered w-full pl-10"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="select select-bordered" onChange={(e) => setFilter(e.target.value)}>
                        <option value="">Filter by Type</option>
                        <option value="Returnable">Returnable</option>
                        <option value="Non-returnable">Non-returnable</option>
                    </select>
                    <select className="select select-bordered" onChange={(e) => setSort(e.target.value)}>
                        <option value="">Sort by Quantity</option>
                        <option value="quantity">High to Low</option>
                    </select>
                </div>

                {/* Asset Table */}
                <div className="overflow-x-auto">
                    <table className="table w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th>Asset Image</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Date Added</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset._id} className="hover:bg-gray-50">
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={asset.productImage || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Asset" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-bold">{asset.productName}</td>
                                    <td><span className="badge badge-ghost font-medium">{asset.productType}</span></td>
                                    <td className="font-semibold">{asset.productQuantity}</td>
                                    <td className="text-sm">{asset.addedDate}</td>
                                    <td className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => { setSelectedAsset(asset); document.getElementById('edit_modal').showModal(); }}
                                            className="btn btn-ghost btn-xs text-blue-600"
                                        ><FaEdit size={16} /></button>
                                        <button onClick={() => handleDelete(asset._id)} className="btn btn-ghost btn-xs text-red-600"><FaTrash size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <dialog id="edit_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Edit Asset</h3>
                    {selectedAsset && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input name="productName" defaultValue={selectedAsset.productName} className="input input-bordered w-full" placeholder="Name" required />
                            <select name="productType" defaultValue={selectedAsset.productType} className="select select-bordered w-full">
                                <option value="Returnable">Returnable</option>
                                <option value="Non-returnable">Non-returnable</option>
                            </select>
                            <input type="number" name="productQuantity" defaultValue={selectedAsset.productQuantity} className="input input-bordered w-full" placeholder="Quantity" required />
                            <input name="productImage" defaultValue={selectedAsset.productImage} className="input input-bordered w-full" placeholder="Image URL" />
                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary text-white">Update</button>
                                <button type="button" onClick={() => document.getElementById('edit_modal').close()} className="btn">Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default AssetList;