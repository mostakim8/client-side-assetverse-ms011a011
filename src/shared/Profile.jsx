import { useState, useRef, useContext } from "react";
import useAuth from "../hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { ThemeContext } from "../hooks/ThemeContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  ShieldCheck,
  Camera,
  Save,
  Loader2,
  Building2,
  Fingerprint,
} from "lucide-react";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);
  const imageInputRef = useRef(null);

  const {
    data: dbUser,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["profile-data", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email.toLowerCase()}`);
      return res.data;
    },
  });

  const [name, setName] = useState(user?.displayName);
  const [image, setImage] = useState(user?.photoURL);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCameraClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.focus();
      imageInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateUserProfile(name, image);
      const res = await axiosSecure.patch(`/users/update/${user?.email}`, {
        name: name,
        image: image,
      });

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "SUCCESS!",
          text: "Profile Identity Updated",
          showConfirmButton: false,
          timer: 1500,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "Update failed.",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91] w-10 h-10" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 pt-24 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header - Matches Marketplace Style */}
        <div className="mb-10 flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className="text-4xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter italic leading-none uppercase">
            Account <span className="text-[#535C91]">Profile</span>
          </h2>
          <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black tracking-[0.3em] mt-3 italic uppercase">
            Identity & Access Management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left: Info Card - Balanced with Team Cards */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-[#535C91]/20 overflow-hidden sticky top-28 transition-all hover:shadow-xl group">
              {/* Profile Background Banner */}
              <div className="h-28 bg-[#1B1A55] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#535C91] to-transparent"></div>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              </div>

              <div className="px-6 pb-10 text-center">
                <div className="relative -mt-14 mb-5 flex justify-center">
                  <div className="p-1.5 bg-white dark:bg-[#070F2B] rounded-[2rem] shadow-xl border border-gray-100 dark:border-[#535C91]/30 overflow-hidden transition-transform group-hover:scale-105 duration-500">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/0Qkb09Y/user.png"
                      }
                      alt="Profile"
                      className="w-28 h-28 rounded-[1.6rem] object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="absolute bottom-1 right-[30%] p-2.5 bg-[#1B1A55] text-white rounded-xl shadow-lg hover:bg-[#535C91] transition-all border-4 border-white dark:border-[#070F2B] active:scale-90"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <h3 className="text-xl font-black text-[#070F2B] dark:text-white italic tracking-tighter uppercase mb-2">
                  {user?.displayName}
                </h3>

                <div className="flex justify-center mb-8">
                  <span
                    className={`px-4 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase flex items-center gap-2 shadow-sm ${
                      dbUser?.role === "hr"
                        ? "bg-[#1B1A55] text-white"
                        : "bg-[#535C91]/10 text-[#535C91] dark:text-[#9290C3]"
                    }`}
                  >
                    <ShieldCheck size={10} />{" "}
                    {dbUser?.role === "hr" ? "HR Manager" : "Employee"}
                  </span>
                </div>

                <div className="space-y-3 text-left">
                  <div className="bg-gray-50/50 dark:bg-[#070F2B] p-4 rounded-2xl border border-gray-100 dark:border-[#535C91]/20">
                    <p className="text-[8px] font-black text-[#535C91]/60 dark:text-[#9290C3]/30 tracking-widest uppercase mb-1">
                      Business Identity
                    </p>
                    <div className="flex items-center gap-2 text-[#070F2B] dark:text-white">
                      <Fingerprint size={12} className="text-[#535C91]" />
                      <p className="text-[11px] font-bold italic truncate lowercase">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {(dbUser?.companyName || dbUser?.role === "hr") && (
                    <div className="bg-gray-50/50 dark:bg-[#070F2B] p-4 rounded-2xl border border-gray-100 dark:border-[#535C91]/20">
                      <p className="text-[8px] font-black text-[#535C91]/60 dark:text-[#9290C3]/30 tracking-widest uppercase mb-1">
                        Affiliated Entity
                      </p>
                      <div className="flex items-center gap-2 text-[#070F2B] dark:text-white">
                        <Building2 size={12} className="text-[#535C91]" />
                        <p className="text-[11px] font-black italic uppercase tracking-tight">
                          {dbUser?.companyName || "Independent"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Update Form - Matches Marketplace Table Container */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/20 p-6 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-[#535C91]/10 pb-6">
                <div className="w-10 h-10 bg-[#535C91]/10 rounded-xl flex items-center justify-center text-[#535C91]">
                  <User size={18} />
                </div>
                <h4 className="text-[14px] font-black text-[#070F2B] dark:text-white uppercase italic tracking-tighter">
                  Profile Credentials
                </h4>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-widest uppercase ml-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.displayName}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/30 tracking-widest uppercase ml-1">
                      Account Email (Fixed)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-5 py-3.5 bg-gray-100/50 dark:bg-[#070F2B]/40 border border-transparent rounded-xl text-[#535C91]/50 font-semibold text-[13px] cursor-not-allowed italic"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/60 tracking-widest uppercase ml-1">
                    Identity Image Resource (URL)
                  </label>
                  <input
                    ref={imageInputRef}
                    type="text"
                    defaultValue={user?.photoURL}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                  />
                </div>

                <div className="pt-8">
                  <button
                    disabled={isUpdating}
                    type="submit"
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1B1A55] text-white px-10 py-3.5 rounded-xl font-black text-[10px] tracking-[0.2em] transition-all shadow-lg hover:bg-[#535C91] active:scale-95 disabled:opacity-50 uppercase"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />{" "}
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
