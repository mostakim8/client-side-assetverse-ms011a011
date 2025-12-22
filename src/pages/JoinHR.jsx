import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const JoinHR = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const result = await createUser(data.email, data.password);
            
            await updateUserProfile(data.name, data.photo);

            const userInfo = {
                name: data.name,
                email: data.email,
                companyName: data.companyName,
                companyLogo: data.photo,
                role: 'hr',
                packageLimit: parseInt(data.package),
                status: 'active'
            };

            const res = await axios.post('${import.meta.env.VITE_API_URL}/users', userInfo);
            
            if (res.data.insertedId) {
                
               
                const resToken = await axios.post('${import.meta.env.VITE_API_URL}/jwt', { email: data.email });
                if (resToken.data.token) {
                    localStorage.setItem('access-token', resToken.data.token);
                }

                Swal.fire({
                    title: "Success!",
                    text: "HR Account Created Successfully",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                
                
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", error.message || "Registration failed", "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 pt-24 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-black text-center text-blue-600 mb-6">Join as HR Manager</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <input {...register("name", { required: "Name is required" })} placeholder="Full Name" className="w-full p-3 border rounded-lg focus:outline-blue-500" />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                    </div>

                    {/* Company Details */}
                    <input {...register("companyName", { required: "Company name is required" })} placeholder="Company Name" className="w-full p-3 border rounded-lg focus:outline-blue-500" />
                    <input {...register("photo", { required: "Logo URL is required" })} placeholder="Company Logo URL" className="w-full p-3 border rounded-lg focus:outline-blue-500" />
                    
                    {/* Auth Details */}
                    <input {...register("email", { required: "Email is required" })} type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:outline-blue-500" />
                    <input {...register("password", { required: "Password is required", minLength: 6 })} type="password" placeholder="Password (min 6 chars)" className="w-full p-3 border rounded-lg focus:outline-blue-500" />
                    
                    {/* Package Selection */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-600 ml-1">Select Membership Package</label>
                        <select {...register("package", { required: true })} className="w-full p-3 border rounded-lg bg-gray-50 font-medium text-gray-700">
                            <option value="5">5 Members ($5)</option>
                            <option value="10">10 Members ($8)</option>
                            <option value="20">20 Members ($15)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg mt-4 active:scale-95">
                        Signup & Start Management
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinHR;