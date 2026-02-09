import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react"; 
import { ThemeContext } from "../hooks/ThemeContext"; 
import axios from "axios";
import Swal from "sweetalert2";
import { 
    Mail, Lock, LogIn, UserCheck, 
    Briefcase, ChevronRight
} from "lucide-react";

const Login = () => {
    const { signIn, googleSignIn } = useAuth(); 
    const { isDark } = useContext(ThemeContext); 
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const roleBasedNavigate = (role) => {
        if (role === 'hr') {
            navigate('/hr-home', { replace: true });
        } else if (role === 'employee') {
            navigate('/employee-home', { replace: true });
        } else {
            navigate(from, { replace: true });
        }
    };

    const onSubmit = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            const userEmail = result.user.email.toLowerCase();
            
            const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: userEmail });
            const token = resToken.data.token;

            if (token) {
                localStorage.setItem('access-token', token);

                const resRole = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${userEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userRole = resRole.data?.role;

                Swal.fire({
                    title: "Success!",
                    text: `Logged in as ${userRole || 'User'}`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    background: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });

                setTimeout(() => {
                    roleBasedNavigate(userRole);
                }, 600);
            }
        } catch (error) {
            Swal.fire({
                title: "Login Failed",
                text: "Invalid Email or Password",
                icon: "error",
                background: isDark ? '#0f172a' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const userEmail = result.user.email.toLowerCase();
            const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: userEmail });
            const token = resToken.data.token;

            if (token) {
                localStorage.setItem('access-token', token);
                const resRole = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${userEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userRole = resRole.data?.role;

                Swal.fire({
                    title: "Success!",
                    text: "Logged in with Google",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    background: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });

                setTimeout(() => roleBasedNavigate(userRole), 600);
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Google sign-in failed",
                icon: "error",
                background: isDark ? '#0f172a' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950 px-4 pt-16 transition-colors duration-300">
            {/* Login Card */}
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 dark:shadow-none w-full max-w-md border border-gray-100 dark:border-slate-800">
                
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                        Account <span className="text-blue-600">Login</span>
                    </h2>
                    <p className="text-gray-400 dark:text-slate-500 text-sm font-medium mt-2 uppercase tracking-widest text-[10px]">Portal Access</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="form-control">
                        <div className="relative group">
                            <Mail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input 
                                {...register("email", { required: "Email is required" })} 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none text-sm font-medium dark:text-slate-200 transition-all" 
                            />
                        </div>
                        {errors.email && <span className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.email.message}</span>}
                    </div>

                    <div className="form-control">
                        <div className="relative group">
                            <Lock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input 
                                {...register("password", { required: "Password is required" })} 
                                type="password" 
                                placeholder="Password" 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none text-sm font-medium dark:text-slate-200 transition-all" 
                            />
                        </div>
                        {errors.password && <span className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-100 dark:shadow-none active:scale-95">
                        Log In
                    </button>
                </form>

                <div className="flex items-center gap-4 my-8">
                    <div className="h-[1px] bg-gray-100 dark:bg-slate-800 flex-grow"></div>
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">Or</span>
                    <div className="h-[1px] bg-gray-100 dark:bg-slate-800 flex-grow"></div>
                </div>

                <button 
                    onClick={handleGoogleSignIn} 
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 py-4 rounded-2xl font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all shadow-sm active:scale-95"
                >
                    <img className="w-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
                    Sign in with Google
                </button>

                <p className="text-center mt-8 text-sm font-medium text-gray-500 dark:text-slate-500">
                    New to the platform? 
                    <button 
                        onClick={() => document.getElementById('register_selection_modal').showModal()} 
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1 uppercase text-xs tracking-wider"
                    >
                        Register Now
                    </button>
                </p>
            </div>

            {/* Register Selection Modal - FIXED WHITE CORNERS & OUTLINE */}
            <dialog id="register_selection_modal" className="  bg-white dark:bg-[#0f172a] modal modal-bottom sm:modal-middle transition-all duration-300 outline-none border-none">


                <div className="modal-box p-0 rounded-[2.5rem] bg-white dark:bg-[#0f172a] border-none shadow-none outline-none overflow-hidden max-w-md w-[95%] sm:w-full mx-auto">
                    
                    <div className="bg-blue-600 dark:bg-blue-700 p-8 text-white relative">

                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:bg-white/20 border-none outline-none">✕</button>
                        </form>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Choose Account <span className="text-blue-200">Type</span></h3>
                    </div>
                    
                    <div className="p-8 space-y-4 bg-gray-50/30 dark:bg-[#0f172a]">
                        <button 
                            onClick={() => { document.getElementById('register_selection_modal').close(); navigate("/join-employee"); }} 
                            className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/50 border border-gray-100 dark:border-slate-700 rounded-3xl transition-all group shadow-sm outline-none"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <UserCheck size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-black text-gray-800 dark:text-slate-200 text-lg">Join as Employee</h4>
                                </div>
                            </div>
                            <ChevronRight className="dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button 
                            onClick={() => { document.getElementById('register_selection_modal').close(); navigate("/join-hr"); }} 
                            className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700/50 border border-gray-100 dark:border-slate-700 rounded-3xl transition-all group shadow-sm outline-none"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <Briefcase size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-black text-gray-800 dark:text-slate-200 text-lg">Join as HR Manager</h4>
                                </div>
                            </div>
                            <ChevronRight className="dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
                {/* Backdrop Fixed with solid black overlay to hide gaps */}
                <form method="dialog" className="modal-backdrop bg-black/80 backdrop-blur-sm">
                    <button className="cursor-default outline-none border-none">close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Login;