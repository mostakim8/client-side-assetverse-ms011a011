import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAuth from "../hooks/UseAuth"; 
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { Search, Box, AlertCircle, Loader2 } from "lucide-react";

const RequestAsset = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: userData = {}, isLoading: userLoading } = useQuery({
        queryKey: ['user-info', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/profile/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    const { data: assets = [], isLoading: assetsLoading, refetch, isFetching } = useQuery({
        queryKey: ['available-assets', user?.email, debouncedSearch, filterType],
        enabled: !!user?.email && !!userData?.hrEmail, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-company-assets/${user?.email.toLowerCase()}`, {
                params: { search: debouncedSearch, filter: filterType }
            });
            return res.data;
        }
    });

    const handleRequest = async (e) => {
        e.preventDefault();
        const note = e.target.note.value;

        const requestData = {
            assetId: selectedAsset._id,
            productName: selectedAsset.productName,
            productType: selectedAsset.productType,
            productImage: selectedAsset.productImage,
            hrEmail: userData?.hrEmail,
            userEmail: user?.email.toLowerCase(),
            userName: user?.displayName,
            requestDate: new Date().toISOString().split('T')[0],
            status: "pending",
            note
        };

        try {
            const res = await axiosSecure.post("/asset-requests", requestData);
            if (res.data.insertedId) {
                Swal.fire({ title: "Request Sent!", icon: "success", timer: 1500, showConfirmButton: false });
                document.getElementById('request_modal').close();
                e.target.reset();
                refetch(); 
            }
        } catch (error) {
            Swal.fire("Error", "Could not send request.", "error");
        }
    };

    if (userLoading || (userData?.hrEmail && assetsLoading)) return (
        <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-7xl mx-auto">
                
                {/* Not affiliated warning */}
                {!userData?.hrEmail ? (
                    <div className="text-center py-20 bg-amber-50 rounded-[2.5rem] border border-amber-200">
                        <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
                        <h2 className="text-2xl font-black text-amber-900 uppercase">Not Affiliated!</h2>
                        <p className="text-amber-700 mt-2">Please wait until your HR adds you to the company team.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-10 flex justify-between items-end">
                            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Company <span className="text-blue-600">Assets</span></h2>
                            {isFetching && <Loader2 size={16} className="animate-spin text-blue-600" />}
                        </div>

                        {/* Search & Filter */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-white p-5 rounded-4xl shadow-sm">
                            <div className="relative md:col-span-2">
                                <Search className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-300" size={20} />
                                <input type="text" placeholder="Search product name..." className="input w-full pl-14 h-16 bg-gray-50 border-none rounded-2xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <select className="select h-16 bg-gray-50 border-none rounded-2xl font-bold uppercase text-[10px]" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <option value="">All Types</option>
                                <option value="Returnable">Returnable</option>
                                <option value="Non-returnable">Non-returnable</option>
                            </select>
                        </div>

                        {/* Assets Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {assets.map(asset => (
                                <div key={asset._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                                    <img src={asset.productImage} className="h-56 w-full object-cover" alt="" />
                                    <div className="p-8 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900 uppercase truncate">{asset.productName}</h2>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{asset.productType} • Stock: {asset.productQuantity}</p>
                                        </div>
                                        <button 
                                            disabled={asset.productQuantity === 0} 
                                            onClick={() => { setSelectedAsset(asset); document.getElementById('request_modal').showModal(); }} 
                                            className="w-full btn mt-6 h-14 bg-gray-900 hover:bg-blue-600 text-white border-none rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:bg-gray-200"
                                        >
                                            Request Asset
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {assets.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem]"><Box className="mx-auto text-gray-200 mb-4" size={48} /><p className="text-gray-400 font-bold uppercase text-xs">No assets found</p></div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            <dialog id="request_modal" className="modal">
                <div className="modal-box rounded-[2.5rem] p-0 overflow-hidden">
                    <div className="bg-blue-600 p-8 text-white"><h3 className="font-black text-2xl uppercase tracking-tighter">Submit Request</h3></div>
                    <form onSubmit={handleRequest} className="p-8 space-y-6">
                        <p className="text-sm font-bold text-gray-500 italic">Requesting: {selectedAsset?.productName}</p>
                        <textarea name="note" className="textarea w-full h-32 bg-gray-50 rounded-2xl p-5 border-none outline-none focus:ring-2 focus:ring-blue-600" required placeholder="Add a note for HR..."></textarea>
                        <div className="flex gap-3">
                            <button type="submit" className="flex-grow btn h-14 bg-blue-600 text-white border-none rounded-2xl font-black uppercase text-[10px]">Confirm</button>
                            <button type="button" onClick={() => document.getElementById('request_modal').close()} className="btn h-14 bg-gray-100 rounded-2xl border-none">Cancel</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default RequestAsset;