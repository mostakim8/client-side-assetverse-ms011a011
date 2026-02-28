import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { ThemeContext } from "../hooks/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Calendar,
  ImageIcon,
  ArrowRight,
  UserPlus,
  Fingerprint,
} from "lucide-react";

const JoinEmployee = () => {
  const { createUser, updateUserProfile, setUser } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const dob = form.dob.value;
    const photo = form.photo.value;

    try {
      const result = await createUser(email, password);
      await updateUserProfile(name, photo);

      const currentUser = {
        ...result.user,
        displayName: name,
        photoURL: photo,
      };

      const userInfo = {
        name,
        email,
        dob,
        photo,
        role: "employee",
        status: "pending",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userInfo,
      );

      if (res.data.insertedId || res.data.message === "user already exists") {
        const resToken = await axios.post(
          `${import.meta.env.VITE_API_URL}/jwt`,
          { email },
        );
        if (resToken.data.token) {
          localStorage.setItem("access-token", resToken.data.token);
        }

        if (setUser) setUser(currentUser);

        Swal.fire({
          title: "WELCOME!",
          text: "Employee Account Created Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });

        setTimeout(() => navigate("/"), 500);
      }
    } catch (error) {
      Swal.fire({
        title: "ERROR!",
        text: error.message,
        icon: "error",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070F2B] flex items-center justify-center py-20 px-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-[#535C91]/20 overflow-hidden"
      >
        {/* Header Section - Sharp & Professional */}
        <div className="bg-[#1B1A55] p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 rotate-12 -mr-6 -mt-6">
            <UserPlus size={140} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">
              Join As <span className="text-[#9290C3]">Employee</span>
            </h2>
            <p className="text-[#9290C3] text-[9px] font-black tracking-[0.4em] uppercase mt-3 opacity-80">
              Personal Workforce Identity
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
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
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50 group-focus-within:text-[#9290C3] transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50 group-focus-within:text-[#9290C3] transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Date and Photo Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                  Birth Date
                </label>
                <div className="relative group">
                  <Calendar
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50"
                    size={18}
                  />
                  <input
                    type="date"
                    name="dob"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[12px] font-bold text-[#535C91] dark:text-[#9290C3] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-[0.2em] uppercase ml-1">
                  Photo URL
                </label>
                <div className="relative group">
                  <ImageIcon
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]/50"
                    size={18}
                  />
                  <input
                    type="text"
                    name="photo"
                    placeholder="https://..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[12px] font-semibold dark:text-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button - Matches Save Identity style */}
            <button className="w-full mt-4 flex justify-center items-center gap-3 py-4 bg-[#1B1A55] text-white rounded-xl font-black text-[10px] tracking-[0.4em] transition-all shadow-lg hover:bg-[#535C91] active:scale-95 group uppercase italic">
              Create Account
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-[#535C91]/10 text-center">
            <p className="text-[10px] font-black tracking-widest text-[#535C91] dark:text-[#9290C3]/40 uppercase">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#1B1A55] dark:text-white hover:underline transition-colors ml-1 font-black"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinEmployee;
