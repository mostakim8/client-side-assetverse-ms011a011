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
    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            
            // JWT Token
            const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: result.user.email });
            if (resToken.data.token) {
                localStorage.setItem('access-token', resToken.data.token);
            }

            Swal.fire({ title: "Success", text: "Login Successful!", icon: "success", timer: 1500 });
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire("Error", "Invalid Email or Password", "error");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: result.user.email });
            if (res.data.token) {
                localStorage.setItem('access-token', res.data.token);
            }
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-black text-center text-blue-600 mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register("email")} type="email" placeholder="Email" className="input input-bordered w-full" required />
                    <input {...register("password")} type="password" placeholder="Password" className="input input-bordered w-full" required />
                    <button type="submit" className="btn btn-primary w-full bg-blue-600 border-none">Login</button>
                </form>
                <div className="divider">OR</div>
                <button onClick={handleGoogleSignIn} className="btn btn-outline w-full flex items-center gap-2">
                    <img className="w-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;