import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const JoinHR = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth(); //
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // ১. ফায়ারবেসে ইউজার তৈরি
            const result = await createUser(data.email, data.password);
            
            // ২. প্রোফাইল আপডেট (নাম ও ছবি)
            await updateUserProfile(data.name, data.photo);

            // ৩. ডেটাবেজে পাঠানোর জন্য অবজেক্ট তৈরি
            const userInfo = {
                name: data.name,
                email: data.email,
                companyName: data.companyName,
                companyLogo: data.photo,
                role: 'hr',
                packageLimit: parseInt(data.package),
                status: 'active'
            };

            // ৪. ব্যাকএন্ডে ইউজার সেভ করা
            const res = await axios.post('http://localhost:5001/users', userInfo);
            
            if (res.data.insertedId) {
                Swal.fire("Success!", "HR Account Created Successfully", "success");
                navigate('/');
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 pt-24">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Join as HR Manager</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input {...register("name", { required: "Name is required" })} placeholder="Full Name" className="w-full p-3 border rounded-lg focus:outline-blue-500" />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                    </div>
                    <input {...register("companyName", { required: true })} placeholder="Company Name" className="w-full p-3 border rounded-lg" />
                    <input {...register("photo", { required: true })} placeholder="Company Logo URL" className="w-full p-3 border rounded-lg" />
                    <input {...register("email", { required: true })} type="email" placeholder="Email" className="w-full p-3 border rounded-lg" />
                    <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Password (min 6 chars)" className="w-full p-3 border rounded-lg" />
                    
                    <label className="text-sm font-semibold text-gray-600">Select Package</label>
                    <select {...register("package", { required: true })} className="w-full p-3 border rounded-lg bg-gray-50">
                        <option value="5">5 Members ($5)</option>
                        <option value="10">10 Members ($8)</option>
                        <option value="20">20 Members ($15)</option>
                    </select>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">Signup & Pay</button>
                </form>
            </div>
        </div>
    );
};

export default JoinHR;