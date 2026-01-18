import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/UseAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, Loader2 } from "lucide-react";

const CheckoutForm = ({ price, members }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (price > 0) {
            axios.post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, { price })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Stripe Secret Error:", err));
        }
    }, [price]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // ১. চেক: স্ট্রাইপ এবং এলিমেন্টস লোড হয়েছে কি না
        if (!stripe || !elements || processing || !clientSecret) return;

        setProcessing(true);

        // ২. পেমেন্ট কনফার্ম করা (আপনার জিজ্ঞেস করা অংশটি এখানে বসবে)
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // পেমেন্ট সফল হওয়ার পর ইউজারকে এই ইউআরএল-এ পাঠাবে (আপনার ইচ্ছা মতো রুট দিন)
                return_url: `${window.location.origin}/dashboard/payment-success`, 
                payment_method_data: {
                    billing_details: {
                        email: user?.email || 'anonymous',
                        name: user?.displayName || 'HR Manager',
                    },
                },
            },
            redirect: "if_required", // এটি দিলে পেজ সাথে সাথে রিফ্রেশ হবে না
        });

        if (error) {
            setProcessing(false);
            Swal.fire("Error", error.message, "error");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // ৩. ডাটাবেজ আপডেট লজিক
            try {
                const paymentInfo = { 
                    newLimit: members, 
                    transactionId: paymentIntent.id 
                };
                
                const res = await axios.patch(`${import.meta.env.VITE_API_URL}/upgrade-package/${user?.email}`, paymentInfo);
                
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Package upgraded successfully!",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    navigate('/hr-home');
                }
            } catch (dbError) {
                console.error("DB Update Error:", dbError);
                Swal.fire("Error", "Payment successful but DB update failed.", "error");
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 ">
            <div className="bg-amber-600 rounded-3xl border-2 border-gray-50 p-6 shadow-sm">
                {/* ৪. PaymentElement ই এখন কার্ড নাম্বার, ডেট, সিভিভিসহ 
                   Google Pay/Apple Pay অপশনগুলো অটোমেটিক রেন্ডার করবে 
                */}
                <PaymentElement className=""/>
            </div>

            <button 
                type="submit" 
                disabled={!stripe || !clientSecret || processing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest disabled:bg-gray-200 transition-all flex justify-center items-center gap-2"
            >
                {processing ? (
                    <> <Loader2 className="animate-spin" size={16} /> Processing... </>
                ) : (
                    `Confirm Payment of $${price}`
                )}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-gray-400">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Secure SSL Encryption</span>
            </div>
        </form>
    );
};

export default CheckoutForm;