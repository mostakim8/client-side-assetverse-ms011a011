import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { PackagePlus, ClipboardList, Layers, Hash, Link as LinkIcon, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

const AddAsset = () => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure(); 

    // use watch for live image preview
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
            Swal.fire({
                title: 'Registering...',
                didOpen: () => { Swal.showLoading() }
            });

            const serverRes = await axiosSecure.post('/assets', assetInfo);
            
            if (serverRes.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Asset Registered!",
                    text: "Item successfully added to your inventory.",
                    showConfirmButton: false,
                    timer: 1500,
                    borderRadius: '24px'
                });
                reset();
                navigate('/asset-list');
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "Something went wrong. Please check your inventory limit.",
                borderRadius: '24px'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] pt-28 pb-12 px-4 flex justify-center items-center">
            <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                
                {/* Left Side: Info & Branding */}
                <div className="md:w-5/12 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                            <PackagePlus size={32} />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic">
                            Asset <br /><span className="text-blue-200">Inventory</span>
                        </h2>
                        <p className="mt-6 text-blue-100/80 text-sm font-medium leading-relaxed uppercase tracking-wider">
                            Centralize your resource management. Track every item, from laptops to office supplies, in real-time.
                        </p>
                    </div>
                    
                    <div className="relative z-10 space-y-4 mt-12">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <CheckCircle2 size={16} className="text-blue-200" /> 
                            <span>Automated Stock Tracking</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <Layers size={16} className="text-blue-200" /> 
                            <span>Smart Categorization</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="md:w-7/12 p-8 lg:p-14">
                    <div className="mb-10">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2 block">HR Management Portal</span>
                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Add New <span className="text-blue-600 italic">Item</span></h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Product Name */}
                        <div className="form-control">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Item Name</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <ClipboardList size={20} />
                                </span>
                                <input 
                                    type="text" 
                                    {...register("productName", { required: "Item name is required" })} 
                                    className="w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-gray-700 transition-all" 
                                    placeholder="e.g. Dell Latitude 5420" 
                                />
                            </div>
                            {errors.productName && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.productName.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Type */}
                            <div className="form-control">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Type</label>
                                <select 
                                    {...register("productType")} 
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-gray-700 appearance-none cursor-pointer"
                                >
                                    <option value="Returnable">Returnable</option>
                                    <option value="Non-returnable">Non-returnable</option>
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="form-control">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Quantity</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400 group-focus-within:text-blue-600">
                                        <Hash size={20} />
                                    </span>
                                    <input 
                                        type="number" 
                                        {...register("productQuantity", { required: true, min: 1 })} 
                                        className="w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-gray-700" 
                                        placeholder="0" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className="form-control">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Image (URL)</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400 group-focus-within:text-blue-600">
                                    <LinkIcon size={20} />
                                </span>
                                <input 
                                    type="url" 
                                    {...register("productImage", { required: "Image URL is required" })} 
                                    className="w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-gray-700" 
                                    placeholder="https://..." 
                                />
                            </div>
                        </div>

                        {/* Live Preview Area */}
                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                             <div className="flex items-center gap-2 mb-4">
                                <ImageIcon size={14} className="text-blue-600" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Image Preview</span>
                             </div>
                             <div className="h-48 w-full bg-white border-2 border-dashed border-gray-200 rounded-4xl flex items-center justify-center overflow-hidden transition-all group">
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt="Preview" 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }} 
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <AlertCircle size={20} className="text-gray-300" />
                                        </div>
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Paste link to see preview</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-5 bg-gray-900 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-gray-200 hover:shadow-blue-100 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-3 group"
                        >
                            <PackagePlus size={18} className="group-hover:rotate-12 transition-transform" />
                            Complete Registration
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAsset;