import React, { useContext,useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/UseAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../hooks/ThemeContext";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Mail,
  Lock,
  UserCheck,
  Briefcase,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

const Login = () => {
  const { signIn, googleSignIn } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const roleBasedNavigate = (role) => {
    if (role === "hr") {
      navigate("/hr-home", { replace: true });
    } else if (role === "employee") {
      navigate("/employee-home", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const userEmail = result.user.email.toLowerCase();

      const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, {
        email: userEmail,
      });
      const token = resToken.data.token;

      if (token) {
        localStorage.setItem("access-token", token);
        const resRole = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/role/${userEmail}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const userRole = resRole.data?.role;

        Swal.fire({
          title: "SUCCESS!",
          text: `Logged in as ${userRole || "User"}`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });

        setTimeout(() => roleBasedNavigate(userRole), 600);
      }
    } catch (error) {
      Swal.fire({
        title: "LOGIN FAILED",
        text: "Invalid Email or Password",
        icon: "error",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      const userEmail = result.user.email.toLowerCase();
      const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, {
        email: userEmail,
      });
      const token = resToken.data.token;

      if (token) {
        localStorage.setItem("access-token", token);
        const resRole = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/role/${userEmail}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const userRole = resRole.data?.role;
        Swal.fire({
          title: "SUCCESS!",
          text: "Logged in with Google",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });
        setTimeout(() => roleBasedNavigate(userRole), 600);
      }
    } catch (error) {
      Swal.fire({
        title: "ERROR",
        text: "Google sign-in failed",
        icon: "error",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#070F2B] transition-colors duration-300 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-[#1B1A55]/10 rounded-[4rem] shadow-2xl w-full max-w-5xl border border-gray-100 dark:border-[#535C91]/20 flex flex-col lg:flex-row overflow-hidden"
      >
        {/* LEFT COMPARTMENT */}
        <div className="w-full lg:w-1/2 bg-gray-50/50 dark:bg-[#1B1A55]/10 flex items-center justify-center p-8 lg:p-5 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-[#535C91]/20">
          <div className="w-full max-w-md">
            <DotLottieReact
              src="https://lottie.host/9792bbb9-3e37-4b1f-a823-85b762a457af/o9lYh0JE9A.lottie"
              loop
              autoplay
            />
          </div>
        </div>

        {/* RIGHT COMPARTMENT */}
        <div className="w-full lg:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-4xl font-black text-[#070F2B] dark:text-white tracking-tighter   italic leading-none">
              Account
              <span className="text-[#535C91] dark:text-[#9290C3]">
                {" "}
                Login{" "}
              </span>
            </h2>
            <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black   tracking-[0.3em] mt-4 italic">
              Access Your Secure Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2 ">
              <label className="text-[11px] font-black text-[#535C91] dark:text-[#9290C3]   tracking-[0.2em] ml-2 ">
                Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute top-1/2 -translate-y-1/2 left-5 text-[#535C91] group-focus-within:text-[#9290C3] transition-colors"
                  size={18}
                />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  className="w-full pl-14 pr-6 py-3 bg-gray-200 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-2xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[12px] font-semibold tracking-wider dark:text-white transition-all "
                />
              </div>
              {errors.email && (
                <span className="text-[9px] text-red-500 font-black mt-1 ml-2 tracking-widest">
                  ⚠️ {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2  -mt-4">
              <label className="text-[11px] font-black text-[#535C91] dark:text-[#9290C3]   tracking-[0.2em] ml-2 ">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute top-1/2 -translate-y-1/2 left-5 text-[#535C91] group-focus-within:text-[#9290C3] transition-colors"
                  size={18}
                />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-14 pr-6 py-3 bg-gray-200 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-2xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[12px] font-semibold  tracking-wider dark:text-white transition-all "
                />
                {/* Password Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-6 text-[#535C91] hover:text-[#9290C3] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[9px] text-red-500 font-black   mt-1 ml-2 tracking-widest">
                  ⚠️ {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B1A55] hover:bg-[#535C91] text-white py-3 rounded-2xl font-black text-[11px]   tracking-[0.3em] transition-all shadow-xl shadow-[#1B1A55]/20 active:scale-95 mt-2"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="h-[1px] bg-gray-100 dark:bg-[#535C91]/20 flex-grow"></div>
            <span className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/40   tracking-widest italic">
              OR
            </span>
            <div className="h-[1px] bg-gray-100 dark:bg-[#535C91]/20 flex-grow"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 py-3 rounded-2xl font-black text-[10px]  tracking-widest text-[#070F2B] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1B1A55]/40 transition-all active:scale-95 shadow-sm"
          >
            <img
              className="w-5 "
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="G"
            />
            Google Sign-In
          </button>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#535C91]/20 text-center">
            <p className="text-[10px] font-black   tracking-[0.2em] text-[#535C91] dark:text-[#9290C3]/60">
              Are you new user AssetVerse?
              <button
                onClick={() =>
                  document
                    .getElementById("register_selection_modal")
                    .showModal()
                }
                className="text-[#1B1A55] text-semibold dark:text-white hover:text-[#535C91] ml-2 underline-none decoration-[#9290C3] underline-offset-4 transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modal - Register Selection */}
      <dialog
        id="register_selection_modal"
        className="modal modal-bottom sm:modal-middle backdrop-blur-md bg-white dark:bg-[#070F2B] rounded-4xl"
      >
        <div className="modal-box p-0 rounded-[3.5rem] bg-white dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 overflow-hidden max-w-md shadow-2xl">
          <div className="bg-[#1B1A55] p-10 text-white relative">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:bg-white/10 text-white border-none">
                ✕
              </button>
            </form>
            <span className="text-[#9290C3] font-black text-[10px]   tracking-[0.3em] block mb-2 italic">
              Initialization
            </span>
            <h3 className="text-3xl font-black   italic tracking-tighter">
              Account <span className="text-[#9290C3]">Type</span>
            </h3>
          </div>
          <div className="p-8 space-y-4 dark:bg-[#070F2B]">
            <button
              onClick={() => {
                document.getElementById("register_selection_modal").close();
                navigate("/join-employee");
              }}
              className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-[#1B1A55]/20 hover:bg-[#1B1A55] group border border-gray-100 dark:border-[#535C91]/20 rounded-[2.5rem] transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white dark:bg-[#070F2B] text-[#1B1A55] dark:text-[#9290C3] rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <UserCheck size={24} />
                </div>
                <h4 className="font-black text-[#070F2B] dark:text-white   italic text-[11px] group-hover:text-white transition-colors tracking-widest">
                  Join as Employee
                </h4>
              </div>
              <ChevronRight
                size={20}
                className="text-[#535C91] group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </button>
            <button
              onClick={() => {
                document.getElementById("register_selection_modal").close();
                navigate("/join-hr");
              }}
              className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-[#1B1A55]/20 hover:bg-[#535C91] group border border-gray-100 dark:border-[#535C91]/20 rounded-[2.5rem] transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white dark:bg-[#070F2B] text-[#535C91] dark:text-[#9290C3] rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <Briefcase size={24} />
                </div>
                <h4 className="font-black text-[#070F2B] dark:text-white   italic text-[11px] group-hover:text-white transition-colors tracking-widest">
                  Join as HR Manager
                </h4>
              </div>
              <ChevronRight
                size={20}
                className="text-[#535C91] group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60"></form>
      </dialog>
    </div>
  );
};

export default Login;
