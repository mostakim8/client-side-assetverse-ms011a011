import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { PackagePlus, ClipboardList, Layers, Hash, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

const AddAsset = () => {
    const { register, handleSubmit, reset, watch } = useForm();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure(); 

    const imageUrl = watch("productImage");

    const onSubmit = async (data) => {
        const assetInfo = {
            productName: data.productName,
            productType: data.productType,
            productQuantity: parseInt(data.productQuantity), 
            productImage: data.productImage,
            hrEmail: user?.email,
            hrName: user?.displayName,
            addedDate: new Date().toISOString().split('T')[0],
        };

        try {
            const serverRes = await axiosSecure.post('/assets', assetInfo);
            
            if (serverRes.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Asset Registered!",
                    text: "The new item has been successfully added to the inventory.",
                    showConfirmButton: false,
                    timer: 1500,
                    color: '#1e293b',
                    background: '#ffffff',
                });
                reset();
                navigate('/asset-list');
            }
        } catch (error) {
            console.error("Error saving asset:", error);
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "Could not add the asset. Please check your connection and try again."
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-12 px-4 flex justify-center items-center">
            <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl shadow-blue-100 overflow-hidden border border-gray-100">
                
                {/* Left Side: Info Panel */}
                <div className="md:w-2/5 bg-linear-to-br from-blue-600 to-blue-800 p-10 text-white flex flex-col justify-between">
                    <div>
                        <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                            <PackagePlus size={28} />
                        </div>
                        <h2 className="text-3xl font-extrabold leading-tight">Asset <br />Management</h2>
                        <p className="mt-4 text-blue-100 text-sm leading-relaxed opacity-90">
                            Maintain complete control over company resources by adding detailed asset information to the central registry.
                        </p>
                    </div>
                    
                    <div className="space-y-4 mt-8">
                        <div className="flex items-center gap-3 text-xs font-semibold bg-white/10 p-3 rounded-xl border border-white/10">
                            <Layers size={16} /> <span>Categorize by Asset Type</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold bg-white/10 p-3 rounded-xl border border-white/10">
                            <Hash size={16} /> <span>Real-time Stock Tracking</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-3/5 p-8 lg:p-12">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">Add New Item</h3>
                        <p className="text-gray-400 text-sm">Please provide accurate details for the new asset</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Product Name */}
                        <div className="form-control">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Product Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                                    <ClipboardList size={18} />
                                </span>
                                <input 
                                    type="text" 
                                    {...register("productName")} 
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-gray-700 placeholder:text-gray-300" 
                                    placeholder="e.g. Wireless Keyboard" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Product Type */}
                            <div className="form-control">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Asset Type</label>
                                <select {...register("productType")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700" required>
                                    <option value="Returnable">Returnable</option>
                                    <option value="Non-returnable">Non-returnable</option>
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="form-control">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Initial Quantity</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                                        <Hash size={18} />
                                    </span>
                                    <input 
                                        type="number" 
                                        {...register("productQuantity")} 
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder:text-gray-300" 
                                        placeholder="0" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className="form-control">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Product Image Link</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                                    <LinkIcon size={18} />
                                </span>
                                <input 
                                    type="url" 
                                    {...register("productImage")} 
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder:text-gray-300" 
                                    placeholder="https://example.com/image.jpg" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Live Preview Area */}
                        <div className="mt-2">
                             <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 ml-1">Live Image Preview:</p>
                             <div className="h-44 w-full bg-blue-50 border-2 border-dashed border-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt="Preview" 
                                        className="h-full w-full object-contain p-2" 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }} 
                                    />
                                ) : (
                                    <div className="text-center text-blue-300">
                                        <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting valid link...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
                            <PackagePlus size={20} />
                            Add Asset
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAsset;