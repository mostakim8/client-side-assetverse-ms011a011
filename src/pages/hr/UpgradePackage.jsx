import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { CheckCircle2, Crown, Lock, Star } from "lucide-react";

const UpgradePackage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  const { data: hrData = {}, refetch: hrRefetch } = useQuery({
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
      name: "Basic",
      employees: 5,
      price: 5,
      features: ["Asset Tracking", "Employee Management", "Basic Support"],
    },
    {
      id: 2,
      name: "Standard",
      employees: 10,
      price: 8,
      features: [
        "All Basic features",
        "Advanced Analytics",
        "Priority Support",
      ],
    },
    {
      id: 3,
      name: "Premium",
      employees: 20,
      price: 15,
      features: ["All Standard features", "Custom Branding", "24/7 Support"],
    },
  ];

  const handleUpgrade = (employees, price) => {
    Swal.fire({
      title: `Upgrade to ${employees} employees?`,
      text: `Investment: $${price} to expand your empire.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Go to Payment",
      confirmButtonColor: "#1B1A55",
      cancelButtonColor: "#535C91",
      borderRadius: "32px",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/payment", { state: { employees, price } });
      }
    });
  };

  return (
    <div className="p-4 md:p-8 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300 flex flex-col items-center">
      <div className="text-center mb-16 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#535C91]/10 rounded-full blur-3xl"></div>
        <h2 className="text-5xl font-black text-[#070F2B] dark:text-white mb-4   tracking-tighter italic relative z-10">
          Upgrade <span className="text-[#535C91]"> Plan</span>
        </h2>
        <p className="text-[#535C91] dark:text-[#9290C3]/60 font-black   text-[10px] tracking-[0.4em]">
          Scaling your business made simple
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
        {packages.map((pkg) => {
          const isExactCurrentPlan = pkg.employees === currentLimit;
          const isCurrentOrLowerPlan = pkg.employees <= currentLimit;

          return (
            <div
              key={pkg.id}
              className={`relative p-10 rounded-[3.5rem] transition-all duration-500 flex flex-col items-center border 
                             ${
                               isExactCurrentPlan
                                 ? "bg-[#1B1A55] border-[#535C91] shadow-2xl scale-105 z-20"
                                 : "bg-gray-50 dark:bg-[#1B1A55]/10 border-gray-100 dark:border-[#535C91]/20 hover:border-[#9290C3]/40 shadow-sm hover:-translate-y-2"
                             }
                             ${!isExactCurrentPlan && isCurrentOrLowerPlan ? "opacity-60 grayscale-[0.3]" : ""}`}
            >
              {/* Status Badge */}
              {isExactCurrentPlan && (
                <div className="absolute -top-5 bg-[#535C91] text-white px-6 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-[#9290C3]/30">
                  <Star size={14} className="fill-current text-[#9290C3]" />
                  <span className="text-[9px] font-black   tracking-widest">
                    Active Plan
                  </span>
                </div>
              )}

              <h3
                className={`text-xs font-black   tracking-[0.3em] mb-8 ${isExactCurrentPlan ? "text-[#9290C3]" : "text-[#535C91]"}`}
              >
                {pkg.name}
              </h3>

              <div className="flex items-start mb-10">
                <span
                  className={`text-2xl font-black mt-2 ${isExactCurrentPlan ? "text-[#9290C3]" : "text-[#070F2B] dark:text-[#535C91]"}`}
                >
                  $
                </span>
                <span
                  className={`text-8xl font-black tracking-tighter ${isExactCurrentPlan ? "text-white" : "text-[#070F2B] dark:text-white"}`}
                >
                  {pkg.price}
                </span>
              </div>

              <div
                className={`w-full py-4 rounded-2xl text-center font-black text-[10px]   tracking-widest mb-10 border ${
                  isExactCurrentPlan
                    ? "bg-[#070F2B] border-[#535C91] text-[#9290C3]"
                    : "bg-white dark:bg-[#070F2B] border-gray-200 dark:border-[#535C91]/30 text-[#535C91]"
                }`}
              >
                Limit: {pkg.employees} Members
              </div>

              <ul className="space-y-6 mb-12 w-full flex-grow">
                {pkg.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 font-bold text-[11px]   tracking-tight ${
                      isExactCurrentPlan
                        ? "text-white/80"
                        : "text-[#535C91] dark:text-[#9290C3]/60"
                    }`}
                  >
                    <CheckCircle2
                      size={16}
                      className={`${isExactCurrentPlan ? "text-[#9290C3]" : "text-[#535C91]"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(pkg.employees, pkg.price)}
                disabled={isCurrentOrLowerPlan}
                className={`w-full py-5 rounded-[2rem] font-black text-[10px]   tracking-[0.2em] transition-all flex items-center justify-center gap-3 border shadow-xl active:scale-95
                                    ${
                                      isCurrentOrLowerPlan
                                        ? "bg-transparent border-[#535C91]/20 text-[#535C91] cursor-not-allowed"
                                        : isExactCurrentPlan
                                          ? "bg-white text-[#1B1A55] border-transparent"
                                          : "bg-[#1B1A55] text-white border-[#535C91]/30 hover:bg-[#535C91]"
                                    }`}
              >
                {isExactCurrentPlan ? (
                  "Already Enjoying"
                ) : isCurrentOrLowerPlan ? (
                  <>
                    {" "}
                    <Lock size={14} /> Previous Plan{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Crown size={16} /> Upgrade Now{" "}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradePackage;
