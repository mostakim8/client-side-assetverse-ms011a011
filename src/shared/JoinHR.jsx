import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../hooks/ThemeContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Building2,
  ImageIcon,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Eye,
  EyeOff,
  Loader2, 
} from "lucide-react";

const JoinHR = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile, setUser } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const onSubmit = async (data) => {
    setLoading(true); // রেজিস্ট্রেশন শুরু হলে লোডিং ট্রু
    try {
      const result = await createUser(data.email, data.password);
      await updateUserProfile(data.name, data.photo);

      const currentUser = {
        ...result.user,
        displayName: data.name,
        photoURL: data.photo,
      };

      const userInfo = {
        name: data.name,
        email: data.email,
        dob: data.dob,
        companyName: data.companyName,
        companyLogo: data.photo,
        role: "hr",
        employeeLimit: parseInt(data.package),
        status: "active",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userInfo,
      );

      if (res.data.insertedId || res.data.message === "user already exists") {
        const resToken = await axios.post(
          `${import.meta.env.VITE_API_URL}/jwt`,
          { email: data.email },
        );
        if (resToken.data.token) {
          localStorage.setItem("access-token", resToken.data.token);
        }

        if (setUser) setUser(currentUser);

        Swal.fire({
          title: "SUCCESS!",
          text: "HR Account Created Successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });

        setTimeout(() => navigate("/"), 500);
      }
    } catch (error) {
      setLoading(false); 
      Swal.fire({
        title: "ERROR",
        text: error.message,
        icon: "error",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#070F2B] py-20 px-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] shadow-sm w-full max-w-2xl border border-gray-100 dark:border-[#535C91]/20 overflow-hidden"
      >
        <div className="bg-[#1B1A55] p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 rotate-12 -mr-6 -mt-6">
            <ShieldCheck size={140} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">
              Registration As <span className="text-[#9290C3]"> Manager </span>
            </h2>
            <p className="text-[#9290C3] text-[9px] font-black tracking-[0.4em] uppercase mt-3 opacity-80">
              Corporate Administrative Access
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 md:p-10 space-y-5"
        >
         

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50 group-focus-within:text-[#9290C3] transition-colors"
                  size={18}
                />
                <input
                  {...register("name", { required: true })}
                  className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Company Name
              </label>
              <div className="relative group">
                <Building2
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50 group-focus-within:text-[#9290C3] transition-colors"
                  size={18}
                />
                <input
                  {...register("companyName", { required: true })}
                  className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50 group-focus-within:text-[#9290C3] transition-colors"
                  size={18}
                />
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Image URL
              </label>
              <div className="relative group">
                <ImageIcon
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50"
                  size={18}
                />
                <input
                  {...register("photo", { required: true })}
                  className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50"
                  size={18}
                />
                <input
                  {...register("password", { required: true, minLength: 6 })}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#535C91]/50 hover:text-[#9290C3] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Date of Birth
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50"
                  size={18}
                />
                <input
                  {...register("dob", { required: true })}
                  type="date"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[12px] font-bold text-[#535C91] dark:text-[#9290C3] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
              Subscription Plan
            </label>
            <div className="relative group">
              <CreditCard
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50"
                size={18}
              />
              <select
                {...register("package", { required: true })}
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[12px] font-bold tracking-widest text-[#535C91] dark:text-white appearance-none cursor-pointer transition-all shadow-inner italic uppercase"
              >
                <option value="5">Basic Pack: 5 members ($5)</option>
                <option value="10">Standard Pack: 10 members ($8)</option>
                <option value="20">Premium Pack: 20 members ($15)</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#535C91]">
                <ArrowRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>

          
          <button
            type="submit"
            disabled={loading} 
            className="w-full mt-4 flex justify-center items-center gap-3 py-4 bg-[#1B1A55] text-white rounded-xl font-black text-[10px] tracking-[0.4em] transition-all shadow-lg hover:bg-[#535C91] active:scale-95 group uppercase italic cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing...
              </>
            ) : (
              <>
                Authorize & Registered
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1.5 transition-transform"
                />
              </>
            )}
          </button>

          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-[#535C91]/10 text-center">
            <p className="text-[10px] font-black tracking-widest text-[#535C91] dark:text-[#9290C3]/40 uppercase">
              Already Managing?{" "}
              <Link
                to="/login"
                className="text-[#1B1A55] dark:text-white hover:underline transition-colors ml-1 font-black"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default JoinHR;
