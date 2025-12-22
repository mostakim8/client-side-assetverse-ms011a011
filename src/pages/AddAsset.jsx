import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import axios from "axios";
import Swal from "sweetalert2";

const AddAsset = () => {
    const { user } = useAuth();
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const assetInfo = {
            productName: data.productName,
            productType: data.productType, // Returnable or Non-returnable
            productQuantity: parseInt(data.productQuantity),
            addedDate: new Date().toLocaleDateString(), // আরও সহজে পড়ার যোগ্য ডেট
            hrEmail: user?.email,
            hrName: user?.displayName, // ট্র্যাকিংয়ের জন্য নাম রাখা ভালো
            availability: "available" // ডিফল্ট স্ট্যাটাস
        };

        try {
            const res = await axios.post('http://localhost:5001/assets', assetInfo);
            if (res.data.insertedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Asset has been saved",
                    showConfirmButton: false,
                    timer: 1500
                });
                reset();
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong!", "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
            <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
                <h2 className="text-3xl font-black mb-6 text-center text-blue-600 tracking-tighter">Add New Asset</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Product Name</label>
                        <input 
                            {...register("productName", { required: true })} 
                            placeholder="e.g. MacBook Pro, Monitor" 
                            className="input input-bordered focus:border-blue-500 w-full" 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Product Type</label>
                        <select 
                            {...register("productType", { required: true })} 
                            className="select select-bordered focus:border-blue-500 w-full"
                        >
                            <option value="Returnable">Returnable (Laptop, Phone)</option>
                            <option value="Non-returnable">Non-returnable (Paper, Pen)</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Product Quantity</label>
                        <input 
                            type="number" 
                            {...register("productQuantity", { required: true, min: 1 })} 
                            placeholder="Quantity" 
                            className="input input-bordered focus:border-blue-500 w-full" 
                        />
                    </div>

                    <button className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-none text-white font-bold text-lg">
                        Add Asset
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAsset;