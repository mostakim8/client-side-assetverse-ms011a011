import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/UseAuth";
import { Loader2, Building2, Search, Send, ArrowUpRight } from "lucide-react";
import Swal from "sweetalert2";

const JoinCompany = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);

  const {
    data: companies = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-companies");
      return res.data;
    },
  });

  const handleJoinRequest = async (company) => {
    const hr_email = company.hrEmail || company.email;

    if (!hr_email) {
      return Swal.fire({
        title: "Error",
        text: "No HR email associated!",
        icon: "error",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#000",
      });
    }

    const joinInfo = {
      employeeName: user?.displayName,
      employeeEmail: user?.email,
      employeePhoto: user?.photoURL,
      hrEmail: hr_email,
      status: "pending",
    };

    try {
      const res = await axiosSecure.patch(
        `/users/join-request/${user?.email}`,
        joinInfo,
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Request Sent!",
          text: "Wait for HR approval.",
          showConfirmButton: false,
          timer: 1500,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#000",
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#000",
      });
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
      <div className="max-w-6xl mx-auto">
        {/* Header - Balanced Scale */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter italic leading-none">
            Find Your <span className="text-[#535C91]">Company</span>
          </h2>
          <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black tracking-[0.3em] mt-3 italic uppercase">
            Search and join an organization to start managing assets.
          </p>
        </div>

        {/* Search Bar - Matches Marketplace Input Style */}
        <div className="relative max-w-lg mx-auto mb-12">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by company name..."
            className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 border border-gray-100 dark:border-[#535C91]/30 rounded-2xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
          />
        </div>

        {/* Company Cards Grid - Matches Marketplace/MyTeam */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white dark:bg-[#1B1A55]/10 p-6 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/20 hover:border-[#9290C3]/40 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl relative overflow-hidden"
            >
              {/* Subtle Decorative Background Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#535C91]/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>

              {/* Logo Section */}
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#070F2B] rounded-[1.5rem] flex items-center justify-center text-[#535C91] mb-6 border border-[#535C91]/10 group-hover:scale-105 transition-transform duration-500 shadow-sm overflow-hidden">
                {company.companyLogo ? (
                  <img
                    src={company.companyLogo}
                    className="w-full h-full object-cover"
                    alt="Logo"
                  />
                ) : (
                  <Building2 size={28} />
                )}
              </div>

              {/* Info Section */}
              <div className="flex-grow">
                <h3 className="font-black text-[18px] text-[#070F2B] dark:text-white tracking-tight italic uppercase leading-tight mb-1">
                  {company.companyName}
                </h3>
                <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[9px] font-black tracking-[0.2em] uppercase italic flex items-center gap-1.5 opacity-80">
                  HR Manager: {company.hrName || "Corporate Admin"}
                </p>
              </div>

              {/* Action Button - Matches Marketplace Button Scale */}
              <button
                onClick={() => handleJoinRequest(company)}
                className="mt-8 w-full py-3.5 bg-[#1B1A55] text-white rounded-xl font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 uppercase shadow-md hover:bg-[#535C91] active:scale-95"
              >
                <Send size={14} /> Send Join Request{" "}
                <ArrowUpRight size={14} className="opacity-50" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinCompany;
