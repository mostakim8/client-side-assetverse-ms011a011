import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { Search, Edit3, Trash2, X, Package, Loader2, Calendar, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Swal from "sweetalert2";

const AssetList = () => {
    const { user, loading: authLoading } = useAuth(); 
    const axiosSecure = useAxiosSecure(); 
    
    // States for Filtering & Pagination
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Pagination States (Requirement: Page size 10 default)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); 

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); 
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Fetching Data with Pagination Params
    const { data: { result: assets = [], totalCount = 0 } = {}, refetch, isLoading } = useQuery({
        queryKey: ['assets', user?.email, debouncedSearch, filter, sort, currentPage, itemsPerPage],
        enabled: !!user?.email && !authLoading, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/assets/${user?.email.toLowerCase()}`, {
                params: {
                    search: debouncedSearch,
                    filter: filter,
                    sort: sort,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            return res.data;
        }
    });

    // Pagination Logic
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const pages = [...Array(totalPages).keys()].map(num => num + 1);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedAsset?._id) return;
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
                Swal.fire({ title: 'Success!', text: 'Asset updated successfully', icon: 'success', showConfirmButton: false, timer: 1500 });
                refetch();
                document.getElementById('edit_modal').close();
                setSelectedAsset(null);
            }
        } catch (error) {
            Swal.fire('Error', 'Update failed', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This item will be removed from your inventory!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, Delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/assets/${id}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire("Deleted!", "Asset removed.", "success");
                    refetch();
                }
            }
        });
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="font-black uppercase text-xs tracking-widest text-gray-400">Loading Inventory...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 pt-28 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Asset <span className="text-blue-600">Registry</span></h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Inventory Management System</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-4xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 px-3 border-r border-gray-100">
                            <span className="text-[10px] font-black uppercase text-gray-400">Show</span>
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => {setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1);}}
                                className="select select-ghost select-xs font-black focus:bg-transparent outline-none"
                            >
                                <option value="5">05</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                        <div className="hidden md:block">
                            <span className="text-gray-400 text-[10px] font-black uppercase">Total Records: </span>
                            <span className="text-blue-600 font-black">{totalCount}</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="table w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-widest">
                                    <th className="py-8 pl-12 text-left">Image</th>
                                    <th className="text-left">Product Name</th>
                                    <th className="text-center">Type</th>
                                    <th className="text-center">Quantity</th>
                                    <th className="text-center">Added Date</th>
                                    <th className="text-right pr-12">Management</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-50">
                                {assets.length > 0 ? assets.map((asset) => (
                                    <tr key={asset._id} className="hover:bg-blue-50/10 transition-all group">
                                        <td className="py-6 pl-12">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                                <img src={asset.productImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={asset.productName} />
                                            </div>
                                        </td>
                                        <td className="text-left"><span className="font-black text-gray-800 uppercase text-sm tracking-tight">{asset.productName}</span></td>
                                        <td className="text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${asset.productType === 'Returnable' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {asset.productType}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`font-black text-xl leading-none ${asset.productQuantity < 10 ? 'text-rose-500' : 'text-gray-800'}`}>{asset.productQuantity}</span>
                                                <span className="text-[9px] font-black uppercase text-gray-300 mt-1">Units</span>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-500">
                                                <Calendar size={16} className="text-gray-300" />
                                                <span className="text-xs font-black text-gray-600">{asset.addedDate ? new Date(asset.addedDate).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="text-right pr-12">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => { setSelectedAsset(asset); document.getElementById('edit_modal').showModal(); }} className="btn btn-square bg-blue-50 border-none text-blue-600 rounded-2xl transition-all duration-300"><Edit3 size={20}/></button>
                                                <button onClick={() => handleDelete(asset._id)} className="btn btn-square bg-rose-50 border-none text-rose-500   rounded-2xl transition-all duration-300"><Trash2 size={20} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <Package size={48} className="mx-auto text-gray-200 mb-4" />
                                            <p className="font-black uppercase text-gray-400 tracking-widest text-xs">No Assets Found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10 pb-12">
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="btn btn-circle btn-sm bg-white border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        <div className="flex gap-2">
                            {pages.map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`btn btn-sm w-10 h-10 rounded-xl font-black transition-all duration-300 ${currentPage === page ? 'bg-blue-600 text-white border-none shadow-lg shadow-blue-200' : 'bg-white text-gray-400 border-gray-100 hover:bg-blue-50 hover:text-blue-600 shadow-sm'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="btn btn-circle btn-sm bg-white border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Page {currentPage} of {totalPages || 1}</span>
                </div>
            </div>

            {/* Edit Modal */}
            <dialog id="edit_modal" className="modal">
                <div className="modal-box rounded-[2.5rem] p-10 max-w-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-2xl uppercase tracking-tighter">Edit <span className="text-blue-600">Asset</span></h3>
                        <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost"><X size={20}/></button></form>
                    </div>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Product Name</label>
                            <input name="productName" defaultValue={selectedAsset?.productName} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Asset Type</label>
                                <select name="productType" defaultValue={selectedAsset?.productType} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold outline-none" required>
                                    <option value="Returnable">Returnable</option>
                                    <option value="Non-returnable">Non-returnable</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Quantity</label>
                                <input name="productQuantity" type="number" defaultValue={selectedAsset?.productQuantity} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold outline-none" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Image URL</label>
                            <input name="productImage" defaultValue={selectedAsset?.productImage} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold outline-none" required />
                        </div>
                        <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-100">Update Inventory</button>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default AssetList;