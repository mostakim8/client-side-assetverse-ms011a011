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
            await createUser(data.email, data.password);
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

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);
            
            if (res.data.insertedId) {
                const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: data.email });
                if (resToken.data.token) {
                    localStorage.setItem('access-token', resToken.data.token);
                }

                Swal.fire({ title: "Success!", text: "HR Account Created", icon: "success", timer: 1500 });
                navigate('/');
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 pt-24">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border">
                <h2 className="text-3xl font-black text-center text-blue-600 mb-6">Join as HR Manager</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register("name", { required: true })} placeholder="Full Name" className="input input-bordered w-full" />
                    <input {...register("companyName", { required: true })} placeholder="Company Name" className="input input-bordered w-full" />
                    <input {...register("photo", { required: true })} placeholder="Company Logo URL" className="input input-bordered w-full" />
                    <input {...register("email", { required: true })} type="email" placeholder="Email" className="input input-bordered w-full" />
                    <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Password" className="input input-bordered w-full" />
                    
                    <select {...register("package", { required: true })} className="select select-bordered w-full">
                        <option value="5">5 Members ($5)</option>
                        <option value="10">10 Members ($8)</option>
                        <option value="20">20 Members ($15)</option>
                    </select>

                    <button type="submit" className="btn btn-primary w-full bg-blue-600 border-none mt-4">Signup & Start</button>
                </form>
            </div>
        </div>
    );
};

export default JoinHR;