import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { 
    Search, Filter, ArrowUpDown, Edit3, Trash2, 
    Box, Calendar, Layers, X, ChevronRight, MoreVertical, Package
} from "lucide-react";
import Swal from "sweetalert2";

const AssetList = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);

    // data fetching with react query
    const { data: assets = [], refetch, isLoading } = useQuery({
        queryKey: ['assets', user?.email, search, filter, sort],
        queryFn: async () => {
            const res = await axiosSecure.get(`/assets/${user?.email}?search=${search}&filter=${filter}&sort=${sort}`);
            return res.data;
        }
    });

    // update handler
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
                    text: "Asset updated successfully.",
                    timer: 1500,
                    showConfirmButton: false,
                });
                refetch();
                document.getElementById('edit_modal').close();
            }
        } catch (error) {
            Swal.fire("Error", "Failed to update asset.", "error");
        }
    };

    // delete handler
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This asset will be removed forever!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Yes, Delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/assets/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire("Deleted!", "Asset has been removed.", "success");
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Could not delete the asset.", "error");
                }
            }
        });
    };

    if (isLoading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-24 md:pt-28 min-h-screen bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-1 uppercase tracking-widest">
                            <Layers size={14} /> HR Management
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                            Asset <span className="text-blue-600">Inventory</span>
                        </h2>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Total Items</p>
                            <p className="text-xl md:text-2xl font-black text-gray-800 leading-none">{assets.length}</p>
                        </div>
                        <Box className="text-blue-600" size={28} />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl shadow-xl shadow-blue-100/20 border border-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="relative">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search asset..." 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="select select-bordered w-full rounded-xl bg-gray-50 border-none font-bold text-gray-600" onChange={(e) => setFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Returnable">Returnable</option>
                        <option value="Non-returnable">Non-returnable</option>
                    </select>
                    <select className="select select-bordered w-full rounded-xl bg-gray-50 border-none font-bold text-gray-600" onChange={(e) => setSort(e.target.value)}>
                        <option value="">Sort by Quantity</option>
                        <option value="quantity">Stock: High to Low</option>
                    </select>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="table w-full border-none">
                            <thead className="bg-gray-50/50 uppercase text-[10px] tracking-widest font-black text-gray-400">
                                <tr>
                                    <th className="py-5 pl-8">Asset Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Date Added</th>
                                    <th className="text-center pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {assets.map((asset) => (
                                    <tr key={asset._id} className="hover:bg-blue-50/40 transition-all">
                                        <td className="py-4 pl-8 font-bold text-gray-800">
                                            <div className="flex items-center gap-3">
                                                <img src={asset.productImage || "https://i.ibb.co/mJR7z1C/avatar.png"} className="h-10 w-10 rounded-lg object-cover" />
                                                {asset.productName}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                asset.productType === 'Returnable' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                            }`}>
                                                {asset.productType}
                                            </span>
                                        </td>
                                        <td className="font-bold text-gray-700">{asset.productQuantity}</td>
                                        <td className="text-gray-500 text-sm">{asset.addedDate}</td>
                                        <td className="text-center pr-8">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => { setSelectedAsset(asset); document.getElementById('edit_modal').showModal(); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16}/></button>
                                                <button onClick={() => handleDelete(asset._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden grid grid-cols-1 divide-y divide-gray-100">
                        {assets.map((asset) => (
                            <div key={asset._id} className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={asset.productImage || "https://i.ibb.co/mJR7z1C/avatar.png"} className="h-14 w-14 rounded-2xl object-cover shadow-sm" />
                                        <div>
                                            <h4 className="font-black text-gray-800 leading-tight">{asset.productName}</h4>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase mt-1 tracking-wider">{asset.productType}</p>
                                        </div>
                                    </div>
                                    <div className="dropdown dropdown-left">
                                        <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm text-gray-400">
                                            <MoreVertical size={20}/>
                                        </label>
                                        <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-2xl bg-white rounded-2xl w-32 border border-gray-100 font-bold text-xs">
                                            <li><button onClick={() => { setSelectedAsset(asset); document.getElementById('edit_modal').showModal(); }} className="text-blue-600"><Edit3 size={14}/> Edit</button></li>
                                            <li><button onClick={() => handleDelete(asset._id)} className="text-red-600"><Trash2 size={14}/> Delete</button></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="text-center flex-grow border-r border-gray-200">
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Quantity</p>
                                        <p className="text-sm font-black text-gray-700">{asset.productQuantity}</p>
                                    </div>
                                    <div className="text-center flex-grow">
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Added Date</p>
                                        <p className="text-sm font-black text-gray-700">{asset.addedDate}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {assets.length === 0 && <p className="text-center py-20 text-gray-400 italic">No assets found matching your criteria.</p>}
                </div>
            </div>

            {/* Edit Modal */}
            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 rounded-t-3xl sm:rounded-3xl overflow-hidden bg-white">
                    <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                        <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter"><Package size={22}/> Update Item</h3>
                        <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost"><X size={20}/></button></form>
                    </div>
                    {selectedAsset && (
                        <form onSubmit={handleUpdate} className="p-8 space-y-5">
                            <div className="form-control">
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Asset Name</label>
                                <input name="productName" defaultValue={selectedAsset.productName} className="input input-bordered w-full rounded-xl bg-gray-50 font-bold" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Type</label>
                                    <select name="productType" defaultValue={selectedAsset.productType} className="select select-bordered rounded-xl bg-gray-50 font-bold">
                                        <option value="Returnable">Returnable</option>
                                        <option value="Non-returnable">Non-returnable</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Quantity</label>
                                    <input type="number" name="productQuantity" defaultValue={selectedAsset.productQuantity} className="input input-bordered rounded-xl bg-gray-50 font-bold" required />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Image URL</label>
                                <input name="productImage" defaultValue={selectedAsset.productImage} className="input input-bordered w-full rounded-xl bg-gray-50" />
                            </div>
                            <button type="submit" className="btn btn-primary w-full rounded-xl text-white font-black bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-100">Save Changes</button>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default AssetList;