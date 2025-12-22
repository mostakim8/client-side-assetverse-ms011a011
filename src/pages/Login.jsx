import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
    const { signIn, googleSignIn } = useAuth();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    
    // after login redirect to the page where user came from
    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (data) => {
        try {
            // login firebase
            await signIn(data.email, data.password);
            
            // ২. verify user role from backend
            const res = await axios.get(`http://localhost:5001/users/role/${data.email}`);
            
            if (res.data) {
                Swal.fire({
                    title: "Success",
                    text: "Login Successful!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                
                // direct to home page
                navigate(from, { replace: true });
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-black text-center text-blue-600 mb-6 tracking-tighter">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="form-control">
                        <label className="label font-bold text-gray-600">Email</label>
                        <input {...register("email")} type="email" placeholder="Enter your email" className="input input-bordered focus:border-blue-500" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-gray-600">Password</label>
                        <input {...register("password")} type="password" placeholder="Enter your password" className="input input-bordered focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-300 shadow-lg mt-2">
                        Login
                    </button>
                </form>
                
                <div className="divider my-6 text-gray-400 font-bold uppercase text-xs">OR</div>
                
                <button 
                    onClick={() => googleSignIn().then(() => navigate(from))} 
                    className="w-full border-2 border-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition active:scale-95"
                >
                    <img className="w-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    Continue with Google
                </button>
                
                <p className="mt-6 text-center text-sm text-gray-600 font-medium">
                    New here? <span className="text-blue-600 font-bold">Register as Employee or HR</span>
                </p>
            </div>
        </div>
    );
};

export default Login;