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
      axiosSecure
        .post("/create-payment-intent", { price })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("Error:", err));
    }
  }, [price, axiosSecure]);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300 flex flex-col items-center px-4">
      <div className="max-w-xl w-full">
        <Link
          to="/upgrade-package"
          className="flex items-center gap-2 text-[#535C91] dark:text-[#9290C3]/60 hover:text-[#1B1A55] dark:hover:text-white mb-8 w-fit transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black   tracking-widest">
            Return to Plans
          </span>
        </Link>

        <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[3rem] shadow-2xl dark:shadow-none overflow-hidden border border-gray-100 dark:border-[#535C91]/30 transition-all">
          {/* Upper Header Part */}
          <div className="bg-[#1B1A55] dark:bg-[#1B1A55] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#535C91]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex items-center gap-3 mb-4 text-[#9290C3] font-black   text-[10px] tracking-widest relative z-10">
              <ShieldCheck size={20} /> Secure Checkout
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-6   italic relative z-10">
              Complete <span className="text-[#9290C3]">Payment</span>
            </h2>

            <div className="bg-[#070F2B]/40 dark:bg-[#070F2B]/60 p-6 rounded-3xl flex justify-between items-center border border-[#535C91]/30 relative z-10">
              <div>
                <p className="text-[9px] font-black   text-[#9290C3]/60 mb-1 tracking-widest">
                  Subscription Upgrade
                </p>
                <p className="font-black text-lg   tracking-tight">
                  {employees} Employees Limit
                </p>
              </div>
              <p className="text-4xl font-black text-white tracking-tighter italic">
                ${price}
              </p>
            </div>
          </div>

          {/* Form Part */}
          <div className="p-10">
            {clientSecret ? (
              <div className="dark:bg-transparent">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: isDark ? "night" : "flat",
                      variables: {
                        colorPrimary: "#1B1A55",
                        colorBackground: isDark ? "#070F2B" : "#ffffff",
                        colorText: isDark ? "#9290C3" : "#070F2B",
                        borderRadius: "16px",
                      },
                    },
                  }}
                >
                  <CheckoutForm price={price} employees={employees} />
                </Elements>
              </div>
            ) : (
              <div className="text-center py-12 text-[#535C91] dark:text-[#9290C3]/40 font-black   text-[10px] flex flex-col items-center gap-4 tracking-widest">
                <div className="w-10 h-10 border-4 border-[#1B1A55] border-t-[#9290C3] rounded-full animate-spin"></div>
                Initializing Secure Gateway...
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
          <div className="h-[1px] w-12 bg-[#535C91]"></div>
          <p className="text-[#535C91] dark:text-[#9290C3] text-[9px] font-black   tracking-[0.3em]">
            Powered by Stripe
          </p>
          <div className="h-[1px] w-12 bg-[#535C91]"></div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
