import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { CheckCircle2, Crown, Lock } from "lucide-react";

const UpgradePackage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // ইউজারের বর্তমান প্রোফাইল ডাটা থেকে packageLimit বের করার জন্য
    const { data: hrData = {} } = useQuery({
        queryKey: ['hr-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    const currentPackageLimit = hrData?.packageLimit || 0;

    const packages = [
        {
            id: 1,
            name: "Basic",
            members: 5,
            price: 5,
            features: ["Asset Tracking", "Employee Management", "Basic Support"]
        },
        {
            id: 2,
            name: "Standard",
            members: 10,
            price: 8,
            features: ["All Basic features", "Advanced Analytics", "Priority Support"]
        },
        {
            id: 3,
            name: "Premium",
            members: 20,
            price: 15,
            features: ["All Standard features", "Custom Branding", "24/7 Support"]
        }
    ];

    const handleUpgrade = (members, price) => {
        Swal.fire({
            title: `Upgrade to ${members} members?`,
            text: `You need to pay $${price} to continue.`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Go to Payment",
            confirmButtonColor: "#2563eb",
            borderRadius: '24px'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/payment', { state: { members, price } });
            }
        });
    };

    return (
        <div className="p-8 pt-28 min-h-screen bg-[#fcfcfd] flex flex-col items-center">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
                    Upgrade <span className="text-blue-600 italic"> Package</span>
                </h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Choose a plan that fits your team size</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {packages.map((pkg) => {
                    // লজিক: বর্তমান প্যাকেজ অথবা তার চেয়ে ছোট প্যাকেজ হলে একটিভ দেখাবে
                    const isCurrentOrLowerPlan = pkg.members <= currentPackageLimit;
                    const isExactCurrentPlan = pkg.members === currentPackageLimit;

                    return (
                        <div key={pkg.id} 
                             className={`relative bg-white p-10 rounded-[3rem] shadow-xl transition-all duration-500 flex flex-col items-center border-2 
                             ${isExactCurrentPlan ? 'border-blue-600 shadow-blue-100 scale-105' : 'border-transparent hover:border-gray-200 shadow-gray-200/40 hover:-translate-y-2'}
                             ${!isExactCurrentPlan && isCurrentOrLowerPlan ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                            
                            {/* Active Plan Badge - শুধু মেইন একটিভ প্যাকেজের জন্য */}
                            {isExactCurrentPlan && (
                                <div className="absolute -top-5 bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-blue-200">
                                    <CheckCircle2 size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Currently Active</span>
                                </div>
                            )}

                            <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${isExactCurrentPlan ? 'text-blue-600' : 'text-gray-400'}`}>
                                {pkg.name}
                            </h3>
                            
                            <div className="flex items-start mb-10">
                                <span className="text-2xl font-black text-gray-900 mt-2">$</span>
                                <span className="text-7xl font-black text-gray-900 tracking-tighter">{pkg.price}</span>
                            </div>
                            
                            <ul className="space-y-5 mb-12 w-full">
                                <li className={`py-3 rounded-2xl text-center font-black text-xs uppercase tracking-wider ${isExactCurrentPlan ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600'}`}>
                                    Limit: {pkg.members} Employees
                                </li>
                                {pkg.features.map((feature, index) => (
                                    <li key={index} className="flex items-center justify-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-tight">
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => handleUpgrade(pkg.members, pkg.price)}
                                disabled={isCurrentOrLowerPlan}
                                className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                                    ${isCurrentOrLowerPlan 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-900 hover:bg-blue-600 text-white shadow-xl shadow-gray-200 hover:shadow-blue-200'
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
            
            <p className="mt-16 text-gray-300 text-[10px] font-bold uppercase tracking-widest italic">
                Secure payment processing via Stripe
            </p>
        </div>
    );
};

export default UpgradePackage;