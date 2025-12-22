import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
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
            addedDate: new Date().toLocaleDateString(),
        };

        try {
            const serverRes = await axios.post('http://localhost:5001/assets', assetInfo);
            
            if (serverRes.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Asset Added!",
                    text: "Product successfully added with Image URL.",
                    showConfirmButton: false,
                    timer: 1500
                });
                reset();
                navigate('/asset-list');
            }
        } catch (error) {
            console.error("Error saving asset:", error);
            Swal.fire("Error", "Failed to save asset. Please try again.", "error");
        }
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="card w-full max-w-lg bg-white shadow-xl border p-8 rounded-2xl">
                <h2 className="text-3xl font-black mb-6 text-blue-600 text-center uppercase">
                    Add Asset
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Product Name */}
                    <div className="form-control">
                        <label className="label font-bold">Product Name</label>
                        <input 
                            type="text" 
                            {...register("productName")} 
                            placeholder="Ex: Wireless Mouse" 
                            className="input input-bordered" 
                            required 
                        />
                    </div>

                    {/* Product Type */}
                    <div className="form-control">
                        <label className="label font-bold">Product Type</label>
                        <select {...register("productType")} className="select select-bordered" required>
                            <option value="Returnable">Returnable</option>
                            <option value="Non-returnable">Non-returnable</option>
                        </select>
                    </div>

                    {/* Product Quantity */}
                    <div className="form-control">
                        <label className="label font-bold">Product Quantity</label>
                        <input 
                            type="number" 
                            {...register("productQuantity")} 
                            placeholder="Ex: 25" 
                            className="input input-bordered" 
                            required 
                        />
                    </div>

                    {/* Product Image URL Input */}
                    <div className="form-control">
                        <label className="label font-bold text-red-500">Product Image URL</label>
                        <input 
                            type="url" 
                            {...register("productImage")} 
                            placeholder="Paste ImgBB or any Image Link here" 
                            className="input input-bordered border-blue-300" 
                            required 
                        />
                       
                        {imageUrl && (
                            <div className="mt-3 text-center">
                                <p className="text-[10px] text-gray-400 mb-1">Image Preview:</p>
                                <img 
                                    src={imageUrl} 
                                    alt="Preview" 
                                    className="w-24 h-24 object-cover mx-auto rounded-lg border shadow-sm"
                                    onError={(e) => e.target.style.display = 'none'} 
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-full bg-blue-600 border-none text-white mt-4 font-bold">
                        Save Asset
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAsset;