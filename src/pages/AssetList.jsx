import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const AssetList = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");

    // Edit এর জন্য নতুন স্টেট
    const [selectedAsset, setSelectedAsset] = useState(null);

    const { data: assets = [], refetch, isLoading } = useQuery({
        queryKey: ['assets', user?.email, search, filter, sort],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/assets/${user?.email}?search=${search}&filter=${filter}&sort=${sort}`);
            return res.data;
        }
    });

    // for update function
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const productName = form.productName.value;
        const productType = form.productType.value;
        const productQuantity = parseInt(form.productQuantity.value);

        const updatedInfo = { productName, productType, productQuantity };

        try {
            const res = await axios.put(`http://localhost:5001/assets/${selectedAsset._id}`, updatedInfo);
            if (res.data.modifiedCount > 0) {
                Swal.fire("Updated!", "Asset details updated successfully", "success");
                refetch();
                setSelectedAsset(null); // modal off
                document.getElementById('edit_modal').close();
            }
        } catch (error) {
            Swal.fire("Error", "Update failed!", "error");
        }
    };

    const handleDelete = (id) => {
    };

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4">Product List</h2>

                {/* Search & Filter Controls  */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* ... Search/Filter/Sort inputs ... */}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset._id}>
                                    <td className="font-bold">{asset.productName}</td>
                                    <td>{asset.productType}</td>
                                    <td>{asset.productQuantity}</td>
                                    <td>{asset.addedDate}</td>
                                    <td className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedAsset(asset);
                                                document.getElementById('edit_modal').showModal();
                                            }}
                                            className="btn btn-ghost btn-xs text-blue-600"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(asset._id)} className="btn btn-ghost btn-xs text-red-600">
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal*/}
            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4 text-blue-600">Edit Asset</h3>
                    {selectedAsset && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="form-control">
                                <label className="label font-bold">Product Name</label>
                                <input name="productName" defaultValue={selectedAsset.productName} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold">Product Type</label>
                                <select name="productType" defaultValue={selectedAsset.productType} className="select select-bordered">
                                    <option value="Returnable">Returnable</option>
                                    <option value="Non-returnable">Non-returnable</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label font-bold">Product Quantity</label>
                                <input type="number" name="productQuantity" defaultValue={selectedAsset.productQuantity} className="input input-bordered" required />
                            </div>
                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary bg-blue-600 border-none text-white">Update Asset</button>
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