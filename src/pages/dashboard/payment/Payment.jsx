import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react"; 
import { ShieldCheck, ArrowLeft } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { ThemeContext } from "../../../hooks/ThemeContext"; 

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const location = useLocation();
    const axiosSecure = useAxiosSecure();
    const { isDark } = useContext(ThemeContext);
    const { price, employees } = location.state || { price: 5, employees: 5 };
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post('/create-payment-intent', { price })
                .then(res => setClientSecret(res.data.clientSecret))
                .catch(err => console.error("Error:", err));
        }
    }, [price, axiosSecure]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 flex flex-col items-center px-4">
            <div className="max-w-xl w-full">
                <Link to="/upgrade-package" className="flex items-center gap-2 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 w-fit transition-colors">
                    <ArrowLeft size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Back</span>
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl dark:shadow-none overflow-hidden border border-gray-100 dark:border-slate-800 transition-all">
                    {/* Upper Header Part */}
                    <div className="bg-gray-900 dark:bg-black p-10 text-white">
                        <div className="flex items-center gap-3 mb-4 text-blue-400 font-black uppercase text-[10px] tracking-widest">
                            <ShieldCheck size={20} /> Secure Payment
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter mb-6 uppercase">Upgrade <span className="text-blue-500 italic">Plan</span></h2>
                        <div className="bg-white/10 dark:bg-slate-800/50 p-5 rounded-2xl flex justify-between items-center border border-white/5">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Package Details</p>
                                <p className="font-bold text-lg">{employees} Employees Limit</p>
                            </div>
                            <p className="text-3xl font-black text-blue-400 tracking-tighter">${price}</p>
                        </div>
                    </div>

                    {/* Form Part */}
                    <div className="p-10">
                        {clientSecret ? (
                            <div className="dark:bg-slate-900">
                                <Elements 
                                    stripe={stripePromise} 
                                    options={{ 
                                        clientSecret,
                                        appearance: {
                                            theme: isDark ? 'night' : 'flat', // style based on dark mode
                                            variables: {
                                                colorPrimary: '#2563eb',
                                            }
                                        }
                                    }}
                                >
                                    <CheckoutForm price={price} employees={employees} />
                                </Elements>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-400 dark:text-slate-600 font-bold uppercase text-[10px] flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Loading Secure Portal...
                            </div>
                        )}
                    </div>
                </div>
                
                <p className="mt-8 text-center text-gray-400 dark:text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em]">
                    End-to-end encrypted by Stripe Technology
                </p>
            </div>
        </div>
    );
};

export default Payment;