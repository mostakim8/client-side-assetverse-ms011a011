import { useForm } from "react-hook-form";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";
import {
  PackagePlus,
  ClipboardList,
  Layers,
  Hash,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const AddAsset = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const imageUrl = watch("productImage");

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
        title: "Registering...",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const serverRes = await axiosSecure.post("/assets", assetInfo);
      if (serverRes.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Asset Registered!",
          showConfirmButton: false,
          timer: 2000,
          borderRadius: "24px",
          background: isDark ? "#1B1A55" : "#fff",
          color: isDark ? "#9290C3" : "#1B1A55",
        });
        reset();
        navigate("/asset-list");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Check your inventory limit.",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070F2B]  flex justify-center items-center transition-colors duration-300">
      <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white dark:bg-[#1B1A55]/20 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-[#535C91]/30 overflow-hidden transition-colors">
        {/* Left Side: Branding */}
        <div className="md:w-5/12 bg-[#070F2B] p-12 text-white flex flex-col justify-between relative overflow-hidden border-r border-[#535C91]/20">
          <div className="relative z-10">
            <div className="bg-[#1B1A55] w-14 h-14 rounded-2xl flex items-center justify-center mb-10 border border-[#535C91]/40 shadow-xl">
              <PackagePlus size={28} className="text-[#9290C3]" />
            </div>
            <h2 className="text-4xl font-black   tracking-tighter leading-[0.9] italic">
              Asset <br />
              <span className="text-[#535C91]">Inventory</span>
            </h2>
            <p className="text-[#9290C3]/60 text-[10px] font-black   tracking-[0.2em] mt-4">
              Register assets in company inventory
            </p>
          </div>
          <div className="relative z-10 space-y-3 mt-12">
            <div className="flex items-center gap-4 text-[10px] font-black   tracking-[0.2em] bg-[#1B1A55]/40 p-4 rounded-2xl border border-[#535C91]/20">
              <CheckCircle2 size={16} className="text-[#9290C3]" />
              <span className="text-[#535C91]">Real-time Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 lg:p-14 bg-white dark:bg-transparent">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h3 className="text-3xl font-black text-[#070F2B] dark:text-white   tracking-tighter italic">
              Add New <span className="text-[#535C91]">Asset</span>
            </h3>

            <div className="form-control">
              <label className="text-[10px] font-black text-[#535C91] dark:text-[#9290C3]/60   tracking-widest ml-1 mb-2">
                Item Name
              </label>
              <input
                {...register("productName", { required: true })}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-2xl focus:bg-white dark:focus:bg-[#1B1A55]/40 focus:ring-2 focus:ring-[#9290C3] outline-none text-sm font-bold text-[#070F2B] dark:text-white transition-all "
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="form-control">
                <label className="text-[10px] font-black text-[#535C91] dark:text-[#9290C3]/60   tracking-widest ml-1 mb-2">
                  Type
                </label>
                <select
                  {...register("productType")}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-2xl focus:bg-white dark:focus:bg-[#1B1A55]/40 focus:ring-2 focus:ring-[#9290C3] outline-none font-bold text-sm text-[#070F2B] dark:text-white transition-all appearance-none"
                >
                  <option value="Returnable">Returnable</option>
                  <option value="Non-returnable">Non-returnable</option>
                </select>
              </div>
              <div className="form-control">
                <label className="text-[10px] font-black text-[#535C91] dark:text-[#9290C3]/60   tracking-widest ml-1 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  {...register("productQuantity", { required: true, min: 1 })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-2xl focus:bg-white dark:focus:bg-[#1B1A55]/40 focus:ring-2 focus:ring-[#9290C3] outline-none text-sm font-bold text-[#070F2B] dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="text-[10px] font-black text-[#535C91] dark:text-[#9290C3]/60   tracking-widest ml-1 mb-2">
                Image URL
              </label>
              <input
                type="url"
                {...register("productImage", { required: true })}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/30 rounded-2xl focus:bg-white dark:focus:bg-[#1B1A55]/40 focus:ring-2 focus:ring-[#9290C3] outline-none text-sm font-bold text-[#070F2B] dark:text-white transition-all "
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-[#1B1A55] hover:bg-[#535C91] text-white font-black text-[11px]   tracking-[0.3em] rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 border border-[#535C91]/20"
            >
              <PackagePlus size={18} className="text-[#9290C3]" />
              Register Asset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;
