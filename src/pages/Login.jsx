import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
    Mail, Lock, LogIn, UserCheck, 
    Briefcase, ChevronRight, LayoutDashboard 
} from "lucide-react";

const Login = () => {
    const { signIn, googleSignIn } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // Email/Password Login logic
    const onSubmit = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            
            // JWT Token fetching and storing
            const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: result.user.email });
            if (resToken.data.token) {
                localStorage.setItem('access-token', resToken.data.token);
            }

            Swal.fire({
                title: "Welcome Back!",
                text: "Login Successful",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                borderRadius: '20px'
            });
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Invalid Email or Password",
                icon: "error",
                borderRadius: '20px'
            });
        }
    };

    // Google Sign-in logic
    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: result.user.email });
            if (res.data.token) {
                localStorage.setItem('access-token', res.data.token);
            }
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire("Error", "Google sign-in failed", "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 pt-16 font-sans">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 w-full max-w-md border border-gray-100">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-200">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                        Account <span className="text-blue-600">Login</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium mt-2">Access your asset management portal</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="form-control">
                        <div className="relative group">
                            <Mail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input 
                                {...register("email", { required: "Email is required" })} 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" 
                            />
                        </div>
                        {errors.email && <span className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.email.message}</span>}
                    </div>

                    <div className="form-control">
                        <div className="relative group">
                            <Lock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input 
                                {...register("password", { required: "Password is required" })} 
                                type="password" 
                                placeholder="Password" 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" 
                            />
                        </div>
                        {errors.password && <span className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-100">
                        Log In
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="h-[1px] bg-gray-100 flex-grow"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or</span>
                    <div className="h-[1px] bg-gray-100 flex-grow"></div>
                </div>

                {/* Google Sign In */}
                <button 
                    onClick={handleGoogleSignIn} 
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 py-4 rounded-2xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <img className="w-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
                    Sign in with Google
                </button>

                {/* Requirement: Register button opens selection Modal */}
                <p className="text-center mt-8 text-sm font-medium text-gray-500">
                    New to the platform? 
                    <button 
                        onClick={() => document.getElementById('register_selection_modal').showModal()} 
                        className="text-blue-600 font-bold hover:underline ml-1"
                    >
                        Register Now
                    </button>
                </p>
            </div>

            {/* --- Register Selection Modal (DaisyUI) --- */}
            <dialog id="register_selection_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 rounded-t-[2.5rem] sm:rounded-[2.5rem] bg-white border-none shadow-2xl overflow-hidden">
                    
                    {/* Modal Header */}
                    <div className="bg-blue-600 p-8 text-white relative">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                        </form>
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutDashboard size={20} className="text-blue-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Get Started</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Choose Account <span className="text-blue-200">Type</span></h3>
                    </div>

                    {/* Modal Content - Buttons */}
                    <div className="p-8 space-y-4 bg-gray-50/30">
                        
                        {/*  Join as Employee Button */}
                        <button 
                            onClick={() => {
                                document.getElementById('register_selection_modal').close();
                                navigate("/join-employee");
                            }}
                            className="w-full flex items-center justify-between p-6 bg-white hover:bg-blue-50 border border-gray-100 rounded-3xl transition-all group shadow-sm hover:border-blue-200"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <UserCheck size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-black text-gray-800 text-lg leading-tight tracking-tight">Join as Employee</h4>
                                    <p className="text-gray-400 text-xs font-medium mt-0.5">Track your assigned assets</p>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </button>

                        {/*  Join as HR Manager Button */}
                        <button 
                            onClick={() => {
                                document.getElementById('register_selection_modal').close();
                                navigate("/join-hr");
                            }}
                            className="w-full flex items-center justify-between p-6 bg-white hover:bg-purple-50 border border-gray-100 rounded-3xl transition-all group shadow-sm hover:border-purple-200"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <Briefcase size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-black text-gray-800 text-lg leading-tight tracking-tight">Join as HR Manager</h4>
                                    <p className="text-gray-400 text-xs font-medium mt-0.5">Manage team and inventory</p>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <div className="p-6 text-center bg-white border-t border-gray-50">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Corporate Asset System v1.0</p>
                    </div>
                </div>

                {/* Backdrop logic to close modal */}
                <form method="dialog" className="modal-backdrop bg-gray-900/40 backdrop-blur-sm transition-all">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Login;