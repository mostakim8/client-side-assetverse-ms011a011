import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Mail, Lock, User, Building2, Image as ImageIcon, CreditCard, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';

const JoinHR = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile, setUser } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const result = await createUser(data.email, data.password);
            await updateUserProfile(data.name, data.photo);

            const currentUser = { ...result.user, displayName: data.name, photoURL: data.photo };

            const userInfo = {
                name: data.name,
                email: data.email,
                dob: data.dob,
                companyName: data.companyName,
                companyLogo: data.photo,
                role: 'hr',
                packageLimit: parseInt(data.package),
                status: 'active'
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);
            
            if (res.data.insertedId || res.data.message === 'user already exists') {
                const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: data.email });
                if (resToken.data.token) {
                    localStorage.setItem('access-token', resToken.data.token);
                }

                if (setUser) setUser(currentUser);

                Swal.fire({ 
                    title: "Success!", 
                    text: "HR Account Created Successfully", 
                    icon: "success", 
                    timer: 1500,
                    showConfirmButton: false
                });

                setTimeout(() => navigate('/'), 500);
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-20 px-4">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100 w-full max-w-xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-10 text-center text-white relative">
                    <div className="absolute top-4 right-6 opacity-10">
                        <ShieldCheck size={100} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Manager <span className="text-blue-200">Portal</span></h2>
                    <p className="mt-2 text-blue-100 font-bold uppercase text-[10px] tracking-[0.3em]">Join as HR Administrator</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative group">
                            <User className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600" size={18} />
                            <input {...register("name", { required: "Name is required" })} placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" />
                        </div>
                        <div className="relative group">
                            <Building2 className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600" size={18} />
                            <input {...register("companyName", { required: "Company name required" })} placeholder="Company Name" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" />
                        </div>
                    </div>

                    {/* Date of Birth Field */}
                    <div className="relative group">
                        <Calendar className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600" size={18} />
                        <input 
                            {...register("dob", { required: "Date of Birth is required" })} 
                            type="date" 
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium text-gray-500" 
                        />
                    </div>

                    <div className="relative group">
                        <ImageIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                        <input {...register("photo", { required: "Photo URL required" })} placeholder="Company Logo/Profile URL" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                        <input {...register("email", { required: "Email required" })} type="email" placeholder="Business Email" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                        <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Password (min 6 chars)" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" />
                    </div>
                    
                    <div className="relative group">
                        <CreditCard className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                        <select {...register("package", { required: true })} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold text-gray-600 appearance-none cursor-pointer">
                            <option value="5">Basic Pack: 5 Members ($5)</option>
                            <option value="10">Pro Pack: 10 Members ($8)</option>
                            <option value="20">Elite Pack: 20 Members ($15)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 mt-4 group">
                        Signup & Pay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-center text-sm font-medium text-gray-400 pt-6">
                        Already have an account? <Link to="/login" className="text-blue-600 font-black hover:underline uppercase text-xs tracking-widest">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default JoinHR;