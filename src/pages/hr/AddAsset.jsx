import { useForm } from "react-hook-form";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";
import {
  PackagePlus,
  Database,
  ShieldCheck,
  Zap,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

const AddAsset = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const interFont = { fontFamily: "'Inter', sans-serif" };

  const onSubmit = async (data) => {
    const assetInfo = {
      productName: data.productName,
      productType: data.productType,
      productQuantity: parseInt(data.productQuantity),
      availableQuantity: parseInt(data.productQuantity),
      productImage: data.productImage,
      hrEmail: user?.email,
      hrName: user?.displayName,
      addedDate: new Date().toISOString().split("T")[0],
    };

    try {
      Swal.fire({
        title: "INITIALIZING REGISTRY...",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
        customClass: {
          title: "font-black uppercase italic tracking-widest text-sm",
        },
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const serverRes = await axiosSecure.post("/assets", assetInfo);
      if (serverRes.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "ASSET REGISTERED",
          text: "System inventory has been updated.",
          showConfirmButton: false,
          timer: 2000,
          background: isDark ? "#1B1A55" : "#fff",
          color: isDark ? "#9290C3" : "#1B1A55",
          customClass: {
            title: "font-black uppercase italic tracking-widest text-lg",
            popup: "rounded-[2rem]",
          },
        });
        reset();
        navigate("/asset-list");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "REGISTRATION FAILED",
        text: "Check your inventory limit.",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  return (
    <div
      style={interFont}
      className="min-h-screen bg-white dark:bg-[#070F2B] flex justify-center items-center p-6 md:p-12 pt-32 transition-colors duration-500"
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white dark:bg-[#1B1A55]/10 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-[#535C91]/10 overflow-hidden">
        {/* LEFT BRANDING */}
        <div className="md:w-5/12 bg-[#070F2B] p-12 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B1A55] rounded-full blur-[120px] -mr-32 -mt-32 opacity-40"></div>

          <div className="relative z-10">
            <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-12 border border-white/10 backdrop-blur-xl shadow-2xl">
              <PackagePlus size={32} className="text-[#9290C3]" />
            </div>
            <span className="text-[10px] font-black text-[#535C91] tracking-[0.5em] uppercase italic opacity-80">
              Inventory System
            </span>
            <h2 className="text-5xl font-black tracking-tighter leading-[0.85] uppercase italic mt-4">
              Asset <br />
              <span className="text-[#9290C3]">Deployment</span>
            </h2>
          </div>

          <div className="relative z-10 space-y-4 mt-12">
            {[
              { icon: <Database size={14} />, text: "Database Sync" },
              { icon: <ShieldCheck size={14} />, text: "Secure Registry" },
              { icon: <Zap size={14} />, text: "Instant Update" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 text-[9px] font-black tracking-[0.3em] uppercase italic text-[#535C91] bg-white/5 p-4 rounded-xl border border-white/5"
              >
                <span className="text-[#9290C3]">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:w-7/12 p-10 lg:p-20 bg-white dark:bg-transparent">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-12">
              <span className="text-[10px] font-black text-[#535C91] tracking-[0.4em] uppercase italic">
                Form Entry
              </span>
              <h3 className="text-3xl font-black text-[#070F2B] dark:text-white tracking-tighter uppercase italic mt-1">
                New <span className="text-[#9290C3]">Asset Entry</span>
              </h3>
              <div className="h-1 w-12 bg-[#9290C3] mt-3"></div>
            </div>

            <div className="space-y-6">
              <div className="form-control">
                <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.4em] ml-2 mb-3 italic opacity-60">
                  Product Item
                </label>
                <input
                  {...register("productName", { required: true })}
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-2xl focus:ring-1 focus:ring-[#9290C3] outline-none text-[11px] font-black tracking-widest uppercase italic text-[#070F2B] dark:text-white transition-all "
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="form-control">
                  <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.4em] ml-2 mb-3 italic opacity-60">
                    Asset Type
                  </label>
                  <select
                    {...register("productType")}
                    className="w-full px-8 py-5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-2xl focus:ring-1 focus:ring-[#9290C3] outline-none font-black text-[10px] tracking-widest uppercase italic text-[#070F2B] dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="Returnable">RETURNABLE</option>
                    <option value="Non-returnable">NON-RETURNABLE</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.4em] ml-2 mb-3 italic opacity-60">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register("productQuantity", { required: true, min: 1 })}
                    className="w-full px-8 py-5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-2xl focus:ring-1 focus:ring-[#9290C3] outline-none text-[11px] font-black italic text-[#070F2B] dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.4em] ml-2 mb-3 italic opacity-60">
                  Assets Image URL
                </label>
                <input
                  type="url"
                  {...register("productImage", { required: true })}
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-2xl focus:ring-1 focus:ring-[#9290C3] outline-none text-[11px] font-black italic text-[#070F2B] dark:text-white transition-all "
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-6 bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] font-black text-[10px] tracking-[0.5em] rounded-2xl transition-all shadow-2xl hover:bg-[#535C91] dark:hover:bg-[#9290C3] active:scale-[0.98] flex items-center justify-center gap-4 uppercase italic cursor-pointer"
            >
              <PlusCircle size={18} />
              Add Asset
              <ArrowRight size={16} className="ml-2 opacity-50" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;
