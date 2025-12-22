import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { FaSearch, FaPaperPlane } from "react-icons/fa";

const RequestAsset = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);

    const { data: userData } = useQuery({
        queryKey: ['user-info', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    const { data: assets = [], isLoading, refetch } = useQuery({
        queryKey: ['available-assets', userData?.hrEmail, search, filterType],
        enabled: !!userData?.hrEmail, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/available-assets/${userData?.hrEmail}?search=${search}&type=${filterType}`);
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
            companyName: userData?.companyName,
            hrEmail: userData?.hrEmail,
            userEmail: user?.email,
            userName: user?.displayName,
            requestDate: new Date().toISOString().split('T')[0], // Standard Date format
            status: "Pending",
            note
        };

        try {
            const res = await axiosSecure.post("/requests", requestData);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Success!",
                    text: "Request sent for approval.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                document.getElementById('request_modal').close();
                e.target.reset();
                refetch(); 
            }
        } catch (error) {
            Swal.fire("Error", "Could not send request.", "error");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    if (!userData?.hrEmail) {
        return (
            <div className="p-8 pt-24 text-center">
                <div className="bg-yellow-50 p-10 rounded-3xl border-2 border-yellow-100 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-yellow-700 mb-4">You are not in a team!</h2>
                    <p className="text-gray-600 font-medium">Please contact your HR Manager to be added to the company team so you can request assets.</p>
                </div>
            </div>
        );
    }
if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-bars loading-lg text-blue-600"></span>
    </div>
);
    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-gray-800 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter">Request Assets</h2>
                    <p className="text-gray-500 mt-2">Find and request the equipment you need for your work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                    <div className="relative md:col-span-2">
                        <FaSearch className="absolute top-4 left-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            className="input input-bordered w-full pl-12 h-14 rounded-2xl bg-gray-50 focus:bg-white transition-all"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        className="select select-bordered h-14 rounded-2xl bg-gray-50 font-bold" 
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="Returnable">Returnable</option>
                        <option value="Non-returnable">Non-returnable</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map(asset => (
                        <div key={asset._id} className="card bg-white shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                            <figure className="px-4 pt-4 relative overflow-hidden">
                                <img src={asset.productImage} alt={asset.productName} className="rounded-2xl h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <span className="absolute top-6 right-6 badge badge-neutral bg-black/60 backdrop-blur-md border-none text-white py-3">{asset.productType}</span>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title font-black text-gray-800 uppercase tracking-tighter">{asset.productName}</h2>
                                <div className="flex justify-between items-center mt-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Availability</p>
                                        <p className="text-lg font-black text-blue-600">{asset.productQuantity} In Stock</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedAsset(asset);
                                            document.getElementById('request_modal').showModal();
                                        }}
                                        className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white rounded-2xl px-6"
                                    >
                                        Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {assets.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-400 text-xl font-bold italic">No assets found matching your criteria.</p>
                    </div>
                )}
            </div>

            <dialog id="request_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl">
                            <FaPaperPlane />
                        </div>
                        <h3 className="font-black text-2xl text-gray-800 uppercase tracking-tighter">Asset Request</h3>
                    </div>
                    
                    <p className="mb-4 font-bold text-gray-500">You are requesting: <span className="text-blue-600">{selectedAsset?.productName}</span></p>
                    
                    <form onSubmit={handleRequest}>
                        <textarea 
                            name="note" 
                            className="textarea textarea-bordered w-full h-36 rounded-2xl bg-gray-50 focus:bg-white" 
                            placeholder="Write a brief note about why you need this asset..."
                            required
                        ></textarea>
                        
                        <div className="modal-action gap-3">
                            <button type="submit" className="btn btn-primary bg-blue-600 border-none text-white flex-grow rounded-2xl font-bold">
                                Confirm Submission
                            </button>
                            <button 
                                type="button" 
                                onClick={() => document.getElementById('request_modal').close()} 
                                className="btn rounded-2xl px-8"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default RequestAsset;