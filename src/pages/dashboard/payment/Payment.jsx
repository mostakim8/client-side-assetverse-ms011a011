import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ShieldCheck, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const location = useLocation();
    const { price, members } = location.state || { price: 5, members: 5 };

    useEffect(() => {
        const hideBadge = () => {
            const badge = document.querySelector('.StripeInspector');
            if (badge) badge.style.display = 'none';
        };
        const interval = setInterval(hideBadge, 500);
        return () => clearInterval(interval);
    }, []);

    const options = {
        mode: 'payment',
        amount: Math.round(price * 100),
        currency: 'usd',
        appearance: {
            theme: 'none', // কাস্টম স্টাইল কন্ট্রোল করার জন্য
            variables: {
                colorPrimary: '#2563eb',
                colorBackground: '#ffffff',
                colorText: '#1e293b',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '12px',
            },
            rules: {
                '.Input': {
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                },
                '.Input:focus': {
                    border: '1px solid #2563eb',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                },
                '.Label': {
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    color: '#64748b',
                }
            }
        },
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#f8fafc] flex flex-col items-center px-4 relative overflow-hidden">
            
            {/* Background Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-xl w-full">
                {/* Back Button */}
                <Link to="/upgrade-package" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors mb-8 group w-fit">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Plans</span>
                </Link>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-white overflow-hidden">
                    {/* Upper Header Section */}
                    <div className="bg-gray-900 p-10 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 text-blue-400">
                                <ShieldCheck size={20} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Checkout</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-2">
                                Upgrade <span className="text-blue-500 italic">Plan</span>
                            </h2>
                            <p className="text-gray-400 text-sm font-medium">Complete your transaction securely via Stripe.</p>
                        </div>
                        
                        {/* Summary Card inside Header */}
                        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Plan Limit</p>
                                <p className="font-bold text-lg">{members} Team Members</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pay</p>
                                <p className="text-3xl font-black text-blue-400">${price}</p>
                            </div>
                        </div>
                        
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Lock size={150} />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-10">
                        <div className="flex items-center gap-2 mb-8 text-gray-400">
                            <CreditCard size={18} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Payment Information</span>
                        </div>

                        {price > 0 ? (
                            <Elements stripe={stripePromise} options={options}>
                                <CheckoutForm price={price} members={members} />
                            </Elements>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-rose-500 font-bold">Invalid Amount. Please try again.</p>
                            </div>
                        )}

                        {/* <div className="mt-10 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between opacity-50">
                                <img src="https://i.ibb.co/Vv999Y6/stripe-badge.png" alt="Stripe" className="h-6 grayscale" />
                                <div className="flex gap-4">
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                <p className="text-center mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                    By continuing, you agree to our Terms of Service
                </p>
            </div>

            <style>
                {`
                    .StripeInspector { display: none !important; }
                    iframe[name^="__privateStripeController"] { display: none !important; }
                `}
            </style>
        </div>
    );
};

export default Payment;