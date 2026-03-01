import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { CheckCircle2, Crown, Lock, Star, Zap } from "lucide-react";

const UpgradePackage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  const { data: hrData = {} } = useQuery({
    queryKey: ["hr-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  const currentLimit = hrData?.employeeLimit || 0;

  const packages = [
    {
      id: 1,
      name: "BASIC",
      employees: 5,
      price: 5,
      features: ["ASSET TRACKING", "MEMBER CONTROL", "STANDARD NODE"],
    },
    {
      id: 2,
      name: "STANDARD",
      employees: 10,
      price: 15,
      features: ["ADVANCED ANALYTICS", "PRIORITY UPLINK", "EXTENDED STORAGE"],
    },
    {
      id: 3,
      name: "PREMIUM",
      employees: 20,
      price: 20,
      features: ["CUSTOM BRANDING", "24/7 TERMINAL SUPPORT", "UNLIMITED LOGS"],
    },
  ];

  const handleUpgrade = (employees, price) => {
    Swal.fire({
      title: `UPGRADE TO ${employees} MEMBERS?`,
      text: `PAY: $${price}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "PROCEED TO PAYMENT",
      confirmButtonColor: "#1B1A55",
      cancelButtonColor: "#535C91",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
      customClass: {
        title: "font-black uppercase italic tracking-tighter text-lg",
        confirmButton:
          "font-black text-[10px] tracking-widest uppercase italic py-3 px-6 rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/payment", { state: { employees, price } });
      }
    });
  };

  return (
    <div className="p-4 md:p-12 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-500 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-20 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#535C91]/10 rounded-full blur-[100px] opacity-50"></div>
        <span className="text-[9px] font-black text-[#535C91] tracking-[0.6em] uppercase italic opacity-60">
          Subscription Terminal
        </span>
        <h2 className="text-5xl md:text-6xl font-black text-[#070F2B] dark:text-white mt-2 tracking-tighter uppercase italic relative z-10">
          Package <span className="text-[#9290C3]">List</span>
        </h2>
        <div className="h-1 w-20 bg-[#9290C3] mx-auto mt-4"></div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
        {packages.map((pkg) => {
          const isExactCurrentPlan = pkg.employees === currentLimit;
          const isCurrentOrLowerPlan = pkg.employees <= currentLimit;

          return (
            <div
              key={pkg.id}
              className={`relative p-10 rounded-[3rem] transition-all duration-500 flex flex-col items-center border 
                ${
                  isExactCurrentPlan
                    ? "bg-[#1B1A55] border-[#535C91] shadow-2xl scale-105 z-20"
                    : "bg-gray-50/50 dark:bg-[#1B1A55]/10 border-gray-100 dark:border-[#535C91]/20 hover:border-[#9290C3]/40 shadow-sm hover:-translate-y-2"
                }
                ${!isExactCurrentPlan && isCurrentOrLowerPlan ? "opacity-50 grayscale-[0.5]" : ""}`}
            >
              {/* Active Badge */}
              {isExactCurrentPlan && (
                <div className="absolute -top-5 bg-[#9290C3] text-[#1B1A55] px-6 py-2 rounded-xl flex items-center gap-2 shadow-2xl border border-white/20">
                  <Zap size={14} className="fill-current" />
                  <span className="text-[9px] font-black uppercase italic tracking-widest">
                    Active
                  </span>
                </div>
              )}

              <h3
                className={`text-[10px] font-black tracking-[0.4em] uppercase italic mb-8 ${isExactCurrentPlan ? "text-[#9290C3]" : "text-[#535C91]"}`}
              >
                {pkg.name}
              </h3>

              <div className="flex items-start mb-8">
                <span
                  className={`text-xl font-black mt-3 ${isExactCurrentPlan ? "text-[#9290C3]" : "text-[#535C91]"}`}
                >
                  $
                </span>
                <span
                  className={`text-8xl font-black tracking-tighter italic ${isExactCurrentPlan ? "text-white" : "text-[#070F2B] dark:text-white"}`}
                >
                  {pkg.price}
                </span>
              </div>

              <div
                className={`w-full py-4 rounded-2xl text-center font-black text-[9px] uppercase italic tracking-[0.3em] mb-10 border transition-colors ${
                  isExactCurrentPlan
                    ? "bg-[#070F2B] border-[#535C91]/40 text-[#9290C3]"
                    : "bg-white dark:bg-[#070F2B]/50 border-gray-200 dark:border-[#535C91]/20 text-[#535C91]"
                }`}
              >
                CAPACITY: {pkg.employees} Members
              </div>

              <ul className="space-y-5 mb-12 w-full flex-grow">
                {pkg.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 font-black text-[9px] uppercase italic tracking-widest ${
                      isExactCurrentPlan
                        ? "text-white/70"
                        : "text-[#535C91] dark:text-[#9290C3]/50"
                    }`}
                  >
                    <CheckCircle2
                      size={14}
                      className={
                        isExactCurrentPlan
                          ? "text-[#9290C3]"
                          : "text-[#535C91] opacity-40"
                      }
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(pkg.employees, pkg.price)}
                disabled={isCurrentOrLowerPlan}
                className={`w-full py-5 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase italic transition-all flex items-center justify-center gap-3 border shadow-xl active:scale-95 cursor-pointer
                  ${
                    isCurrentOrLowerPlan
                      ? "bg-transparent border-[#535C91]/20 text-[#535C91] cursor-not-allowed"
                      : isExactCurrentPlan
                        ? "bg-white text-[#1B1A55] border-transparent"
                        : "bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] border-[#535C91]/30 hover:bg-[#535C91] dark:hover:bg-[#9290C3]"
                  }`}
              >
                {isExactCurrentPlan ? (
                  "Upgraded"
                ) : isCurrentOrLowerPlan ? (
                  <>
                    {" "}
                    <Lock size={14} /> DEPLETED PLAN{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Crown size={16} /> UPGRADE{" "}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center text-[#535C91] dark:text-[#9290C3]/30 text-[9px] font-black tracking-[0.4em] uppercase italic flex items-center justify-center gap-3">
        <Star size={12} className="opacity-40" /> SECURE STRIPE ENCRYPTION
        ACTIVE
      </div>
    </div>
  );
};

export default UpgradePackage;
