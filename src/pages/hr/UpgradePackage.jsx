import { useNavigate } from "react-router-dom";
import { useContext } from "react"; 
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext"; 
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { CheckCircle2, Crown, Lock } from "lucide-react";

const UpgradePackage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { isDark } = useContext(ThemeContext); 

    const { data: hrData = {}, refetch: hrRefetch } = useQuery({ 
        queryKey: ['hr-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    const currentLimit = hrData?.employeeLimit || 0;

    const packages = [
        {
            id: 1,
            name: "Basic",
            employees: 5,
            price: 5,
            features: ["Asset Tracking", "Employee Management", "Basic Support"]
        },
        {
            id: 2,
            name: "Standard",
            employees: 10,
            price: 8,
            features: ["All Basic features", "Advanced Analytics", "Priority Support"]
        },
        {
            id: 3,
            name: "Premium",
            employees: 20,
            price: 15,
            features: ["All Standard features", "Custom Branding", "24/7 Support"]
        }
    ];

    const handleUpgrade = (employees, price) => {
        Swal.fire({
            title: `Upgrade to ${employees} employees?`,
            text: `You need to pay $${price} to continue.`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Go to Payment",
            confirmButtonColor: "#2563eb",
            borderRadius: '24px',
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f8fafc' : '#1e293b',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/payment', { state: { employees , price } });
            }
        });
    };

    return (
        <div className="p-8 pt-28 min-h-screen bg-[#fcfcfd] dark:bg-slate-950 transition-colors duration-300 flex flex-col items-center">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">
                    Upgrade <span className="text-blue-600 italic"> Package</span>
                </h2>
                <p className="text-gray-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Choose a plan that fits your team size</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {packages.map((pkg) => {
                    const isExactCurrentPlan = pkg.employees === currentLimit;
                    const isCurrentOrLowerPlan = pkg.employees <= currentLimit;

                    return (
                        <div key={pkg.id} 
                             className={`relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl transition-all duration-500 flex flex-col items-center border-2 
                             ${isExactCurrentPlan ? 'border-blue-600 shadow-blue-100 dark:shadow-none scale-105' : 'border-transparent dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 shadow-gray-200/40 dark:shadow-none hover:-translate-y-2'}
                             ${!isExactCurrentPlan && isCurrentOrLowerPlan ? 'opacity-75 grayscale-[0.5] dark:opacity-50' : ''}`}>
                            
                            {/* Active Plan Badge */}
                            {isExactCurrentPlan && (
                                <div className="absolute -top-5 bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none">
                                    <CheckCircle2 size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Currently Active</span>
                                </div>
                            )}

                            <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${isExactCurrentPlan ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`}>
                                {pkg.name}
                            </h3>
                            
                            <div className="flex items-start mb-10">
                                <span className="text-2xl font-black text-gray-900 dark:text-slate-200 mt-2">$</span>
                                <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter">{pkg.price}</span>
                            </div>
                            
                            <ul className="space-y-5 mb-12 w-full">
                                <li className={`py-3 rounded-2xl text-center font-black text-xs uppercase tracking-wider ${isExactCurrentPlan ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                                    Limit: {pkg.employees} Employees
                                </li>
                                {pkg.features.map((feature, index) => (
                                    <li key={index} className="flex items-center justify-center gap-2 text-gray-500 dark:text-slate-400 font-bold text-xs uppercase tracking-tight text-center">
                                        <div className="w-1 h-1 bg-gray-300 dark:bg-slate-700 rounded-full shrink-0"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => handleUpgrade(pkg.employees, pkg.price)}
                                disabled={isCurrentOrLowerPlan}
                                className={`w-full py-5 rounded-4xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                                    ${isCurrentOrLowerPlan 
                                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed border dark:border-slate-700' 
                                        : 'bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-blue-200'
                                    }`}
                            >
                                {isExactCurrentPlan ? (
                                    "Already Active"
                                ) : isCurrentOrLowerPlan ? (
                                    <> <Lock size={14} /> Active Plan </>
                                ) : (
                                    <> <Crown size={16} /> Buy This Package </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <p className="mt-16 text-gray-300 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">
                Secure payment processing via Stripe
            </p>
        </div>
    );
};

export default UpgradePackage;