import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddAsset = () => {
    const { register, handleSubmit, reset, watch } = useForm();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const imageUrl = watch("productImage");

    const onSubmit = async (data) => {
        const assetInfo = {
            productName: data.productName,
            productType: data.productType,
            productQuantity: parseInt(data.productQuantity), 
            productImage: data.productImage,
            hrEmail: user?.email,
            addedDate: new Date().toISOString().split('T')[0],
        };

        try {
            const serverRes = await axiosSecure.post('/assets', assetInfo);
            
            if (serverRes.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Asset Added!",
                    text: "Product successfully added to your inventory.",
                    showConfirmButton: false,
                    timer: 1500
                });
                reset();
                navigate('/asset-list');
            }
        } catch (error) {
            console.error("Error saving asset:", error);
            Swal.fire("Error", "Failed to save asset. Check your connection.", "error");
        }
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="card w-full max-w-lg bg-white shadow-sm border border-gray-100 p-8 rounded-4xl">
                <h2 className="text-3xl font-black mb-6 text-gray-800 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter">
                    Add New Asset
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="form-control">
                        <label className="label font-bold text-gray-600">Product Name</label>
                        <input 
                            type="text" 
                            {...register("productName")} 
                            placeholder="Ex: Apple MacBook Pro" 
                            className="input input-bordered rounded-2xl bg-gray-50 focus:bg-white transition-all" 
                            required 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-600">Product Type</label>
                        <select {...register("productType")} className="select select-bordered rounded-2xl bg-gray-50 font-bold" required>
                            <option value="Returnable">Returnable (Laptop, Phone, etc.)</option>
                            <option value="Non-returnable">Non-returnable (Pen, Paper, etc.)</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-600">Initial Quantity</label>
                        <input 
                            type="number" 
                            {...register("productQuantity")} 
                            placeholder="Ex: 10" 
                            className="input input-bordered rounded-2xl bg-gray-50" 
                            required 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-blue-600">Product Image URL</label>
                        <input 
                            type="url" 
                            {...register("productImage")} 
                            placeholder="https://example.com/image.jpg" 
                            className="input input-bordered border-blue-200 rounded-2xl bg-gray-50" 
                            required 
                        />
                       
                        {imageUrl && (
                            <div className="mt-4 p-2 bg-blue-50 rounded-2xl border border-dashed border-blue-200">
                                <p className="text-[10px] font-black text-blue-400 mb-2 uppercase text-center tracking-widest">Live Preview</p>
                                <img 
                                    src={imageUrl} 
                                    alt="Preview" 
                                    className="w-32 h-32 object-cover mx-auto rounded-xl shadow-md"
                                    onError={(e) => e.target.style.display = 'none'} 
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-none text-white mt-4 font-bold rounded-2xl h-14 shadow-lg shadow-blue-100">
                        Add to Inventory
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAsset;