import {
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
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
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);

  const handleDatabaseUpdate = useCallback(
    async (transactionId) => {
      try {
        const res = await axiosSecure.patch(`/upgrade-package/${user?.email}`, {
          newLimit: parseInt(employees),
          transactionId: transactionId,
        });

        if (
          res.data &&
          (res.data.success ||
            res.data.matchedCount > 0 ||
            res.data.modifiedCount > 0)
        ) {
          if (refetch) await refetch();

          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: `Your employee limit is now ${employees}`,
            showConfirmButton: false,
            timer: 2000,
            background: isDark ? "#070F2B" : "#fff",
            color: isDark ? "#9290C3" : "#070F2B",
          });

          navigate("/payment-success", {
            state: { transactionId, email: user?.email, employees, price },
          });
        } else {
          throw new Error(res.data.message || "Backend update failed");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Database update failed. Contact support.",
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });
      }
    },
    [axiosSecure, user?.email, employees, refetch, navigate, price, isDark],
  );

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Subscription Upgrade",
          amount: Math.round(price * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) setPaymentRequest(pr);
      });

      pr.on("paymentmethod", async (ev) => {
        try {
          const { data } = await axiosSecure.post("/create-payment-intent", {
            price,
          });
          const { paymentIntent, error: confirmError } =
            await stripe.confirmCardPayment(
              data.clientSecret,
              { payment_method: ev.paymentMethod.id },
              { handleActions: false },
            );

          if (confirmError) {
            ev.complete("fail");
          } else {
            ev.complete("success");
            if (paymentIntent.status === "succeeded") {
              await handleDatabaseUpdate(paymentIntent.id);
            }
          }
        } catch (err) {
          ev.complete("fail");
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
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price,
      });
      const clientSecret = data.clientSecret;

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              email: user?.email || "anonymous",
              name: user?.displayName || "anonymous",
            },
          },
        },
      );

      if (error) {
        setProcessing(false);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: error.message,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
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
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  const inputStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: isDark ? "#9290C3" : "#1B1A55",
        fontFamily: "Inter, sans-serif",
        "::placeholder": {
          color: isDark ? "#535C91" : "#94a3b8",
        },
      },
      invalid: { color: "#fb7185" },
    },
  };

  return (
    <div className="max-w-md mx-auto space-y-6 bg-white dark:bg-transparent p-2 transition-all">
      {paymentRequest && (
        <div className="mb-8">
          <PaymentRequestButtonElement options={{ paymentRequest }} />
          <div className="relative my-8 flex items-center justify-center">
            <span className="absolute inset-0 border-t border-gray-100 dark:border-[#535C91]/30"></span>
            <span className="relative bg-white dark:bg-[#070F2B] px-4 text-[9px] font-black text-[#535C91]   tracking-[0.2em]">
              Secure Fast Checkout
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black   tracking-widest text-[#535C91] flex items-center gap-2 ml-1">
            <CreditCard size={12} className="text-[#9290C3]" /> Card Number
          </label>
          <div className="p-4 border border-gray-100 dark:border-[#535C91]/30 rounded-2xl bg-gray-50/50 dark:bg-[#1B1A55]/20 focus-within:border-[#9290C3] transition-all">
            <CardNumberElement options={inputStyle} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black   tracking-widest text-[#535C91] flex items-center gap-2 ml-1">
              <Calendar size={12} className="text-[#9290C3]" /> Expiry
            </label>
            <div className="p-4 border border-gray-100 dark:border-[#535C91]/30 rounded-2xl bg-gray-50/50 dark:bg-[#1B1A55]/20 focus-within:border-[#9290C3] transition-all">
              <CardExpiryElement options={inputStyle} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black   tracking-widest text-[#535C91] flex items-center gap-2 ml-1">
              <Lock size={12} className="text-[#9290C3]" /> CVC
            </label>
            <div className="p-4 border border-gray-100 dark:border-[#535C91]/30 rounded-2xl bg-gray-50/50 dark:bg-[#1B1A55]/20 focus-within:border-[#9290C3] transition-all">
              <CardCvcElement options={inputStyle} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-5 bg-[#1B1A55] text-white rounded-2xl font-black text-[10px]   tracking-[0.2em] hover:bg-[#535C91] shadow-xl transition-all disabled:opacity-50 disabled:bg-gray-400 flex justify-center items-center gap-2 border border-[#535C91]/30 active:scale-95 mt-4"
        >
          {processing ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            `Confirm & Pay $${price}`
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[#535C91] pt-2">
          <ShieldCheck size={14} className="text-[#9290C3]" />
          <span className="text-[9px] font-black   tracking-widest italic opacity-60">
            Verified Secure Connection
          </span>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
