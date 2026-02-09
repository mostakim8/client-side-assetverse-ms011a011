import { useForm } from "react-hook-form";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react"; 
import { ThemeContext } from "../../hooks/ThemeContext"; 
import { 
    PackagePlus, ClipboardList, Layers, Hash, 
    Link as LinkIcon, Image as ImageIcon, 
    CheckCircle2, AlertCircle, Sparkles 
} from "lucide-react";

const AddAsset = () => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const { user } = useAuth();
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure(); 

    const imageUrl = watch("productImage");

    const onSubmit = async (data) => {
        const assetInfo = {
            productName: data.productName,
            productType: data.productType,
            productQuantity: parseInt(data.productQuantity), 
            availableQuantity: parseInt(data.productQuantity),
            productImage: data.productImage,
            hrEmail: user?.email,
            hrName: user?.displayName,
            addedDate: new Date().toISOString().split('T')[0],
        };

        try {
            Swal.fire({ 
                title: 'Registering...', 
                background: isDark ? '#0f172a' : '#fff',
                color: isDark ? '#fff' : '#000',
                didOpen: () => { Swal.showLoading() } 
            });
            
            const serverRes = await axiosSecure.post('/assets', assetInfo);
            if (serverRes.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Asset Registered!",
                    showConfirmButton: false,
                    timer: 2000,
                    borderRadius: '24px',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
                reset();
                navigate('/asset-list');
            }
        } catch (error) {
            Swal.fire({ 
                icon: "error", 
                title: "Failed", 
                text: "Check your inventory limit.",
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pt-28 pb-12 px-4 flex justify-center items-center transition-colors duration-300">
            <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
                
                {/* Left Side: Branding */}
                <div className="md:w-5/12 bg-slate-900 dark:bg-black p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-10">
                            <PackagePlus size={28} />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] italic">Asset <br /><span className="text-blue-500">Inventory</span></h2>
                        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-4">Register assets in company inventory</p>
                    </div>
                    <div className="relative z-10 space-y-3 mt-12">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 p-4 rounded-2xl border border-white/5">
                            <CheckCircle2 size={16} className="text-blue-500" /> <span>Real-time Tracking</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-7/12 p-8 lg:p-14 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Add New <span className="text-blue-600 italic">Asset</span></h3>

                        <div className="form-control">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2">Item Name</label>
                            <input {...register("productName", { required: true })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 dark:text-slate-200 transition-all" placeholder="write item name.." />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2">Type</label>
                                <select {...register("productType")} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 outline-none font-bold text-sm text-slate-700 dark:text-slate-200 transition-all">
                                    <option value="Returnable">Returnable</option>
                                    <option value="Non-returnable">Non-returnable</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2">Quantity</label>
                                <input type="number" {...register("productQuantity", { required: true, min: 1 })} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 dark:text-slate-200 transition-all" placeholder="00" />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2">Image URL</label>
                            <input type="url" {...register("productImage", { required: true })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 dark:text-slate-200 transition-all" placeholder="https://..." />
                        </div>

                        {/* Full Image Preview Section */}
                        {/* <div className="space-y-2">
                            <div className="flex items-center gap-2 ml-1">
                                <ImageIcon size={14} className="text-blue-600" />
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Instant Preview</span>
                            </div>
                            <div className="h-56 w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-4xl flex items-center justify-center overflow-hidden transition-all duration-500 hover:border-blue-300 dark:hover:border-blue-900 group">
                                {imageUrl && imageUrl.startsWith('http') ? (
                                    <img 
                                        key={imageUrl}
                                        src={imageUrl} 
                                        alt="Asset Preview" 
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }} 
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <AlertCircle size={24} className="mx-auto text-slate-200 dark:text-slate-700 mb-2" />
                                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">show your image</p>
                                    </div>
                                )}
                            </div>
                        </div> */}

                        <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-lg dark:shadow-none active:scale-95 flex items-center justify-center gap-3">
                            <PackagePlus size={18} /> Register Asset
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAsset;