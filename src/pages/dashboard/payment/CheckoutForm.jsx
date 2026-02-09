import { 
    useElements, 
    useStripe, 
    CardNumberElement, 
    CardExpiryElement, 
    CardCvcElement,
    PaymentRequestButtonElement 
} from "@stripe/react-stripe-js";
import { useCallback, useState, useEffect, useContext } from "react"; 
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/UseAuth";
import { ThemeContext } from "../../../hooks/ThemeContext"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck, CreditCard, Calendar, Lock } from "lucide-react";
import UseRole from "../../../hooks/UseRole";

const CheckoutForm = ({ price, employees }) => {
    const [, , refetch] = UseRole();
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { isDark } = useContext(ThemeContext); //test dark mode state
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [paymentRequest, setPaymentRequest] = useState(null);

    const handleDatabaseUpdate = useCallback(async (transactionId) => {
        try {
            const res = await axiosSecure.patch(`/upgrade-package/${user?.email}`, {
                newLimit: parseInt(employees),
                transactionId: transactionId
            });
            
            if (res.data && (res.data.success || res.data.matchedCount > 0 || res.data.modifiedCount > 0)) {
                if (refetch) await refetch();
                
                Swal.fire({
                    icon: "success",
                    title: "Payment Successful!",
                    text: `Your employee limit is now ${employees}`,
                    showConfirmButton: false,
                    timer: 2000,
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });

                navigate('/payment-success', { 
                    state: { transactionId, email: user?.email, employees, price } 
                });
            } else {
                throw new Error(res.data.message || "Backend update failed");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Database update failed. Contact support.",
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    }, [axiosSecure, user?.email, employees, refetch, navigate, price, isDark]);

    useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: { label: 'AssetVerse Membership', amount: Math.round(price * 100) },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            pr.canMakePayment().then((result) => {
                if (result) setPaymentRequest(pr);
            });

            pr.on('paymentmethod', async (ev) => {
                try {
                    const { data } = await axiosSecure.post('/create-payment-intent', { price });
                    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                        data.clientSecret,
                        { payment_method: ev.paymentMethod.id },
                        { handleActions: false }
                    );

                    if (confirmError) { 
                        ev.complete('fail'); 
                    } else { 
                        ev.complete('success'); 
                        if (paymentIntent.status === "succeeded") {
                            await handleDatabaseUpdate(paymentIntent.id);
                        }
                    }
                } catch (err) {
                    ev.complete('fail');
                }
            });
        }
    }, [stripe, price, axiosSecure, handleDatabaseUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || processing) return;

        setProcessing(true);
        const cardNumberElement = elements.getElement(CardNumberElement);

        try {
            const { data } = await axiosSecure.post('/create-payment-intent', { price });
            const clientSecret = data.clientSecret;

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        email: user?.email || 'anonymous',
                        name: user?.displayName || 'anonymous',
                    },
                },
            });

            if (error) {
                setProcessing(false);
                Swal.fire({
                    icon: "error",
                    title: "Payment Failed",
                    text: error.message,
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
            } else if (paymentIntent.status === "succeeded") {
                await handleDatabaseUpdate(paymentIntent.id);
                setProcessing(false);
            }
        } catch (err) {
            setProcessing(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Could not process payment.",
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        }
    };

    // Dynamic style logic for dark mode
    const inputStyle = {
        style: {
            base: {
                fontSize: '16px',
                // white text for dark mode
                color: isDark ? '#f8fafc' : '#1f2937', 
                fontFamily: 'sans-serif',
                '::placeholder': { 
                    color: isDark ? '#475569' : '#9ca3af' 
                },
            },
            invalid: { color: '#ef4444' },
        },
    };

    return (
        <div className="max-w-md mx-auto space-y-6 bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 transition-all">
            {paymentRequest && (
                <div className="mb-6">
                    <PaymentRequestButtonElement options={{ paymentRequest }} />
                    <div className="relative my-6 flex items-center justify-center">
                        <span className="absolute inset-0 border-t border-gray-100 dark:border-slate-800"></span>
                        <span className="relative bg-white dark:bg-slate-900 px-4 text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Or Pay with Card</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500 flex items-center gap-2">
                        <CreditCard size={12} /> Card Number
                    </label>
                    <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/30 dark:bg-slate-800/50 focus-within:border-blue-500 transition-all">
                        <CardNumberElement options={inputStyle} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500 flex items-center gap-2">
                            <Calendar size={12} /> Expiry
                        </label>
                        <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/30 dark:bg-slate-800/50 focus-within:border-blue-500 transition-all">
                            <CardExpiryElement options={inputStyle} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500 flex items-center gap-2">
                            <Lock size={12} /> CVC
                        </label>
                        <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/30 dark:bg-slate-800/50 focus-within:border-blue-500 transition-all">
                            <CardCvcElement options={inputStyle} />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {processing ? <Loader2 className="animate-spin" size={18} /> : `Pay $${price}`}
                </button>

                <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-slate-600">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest italic">Secure SSL Encryption</span>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;