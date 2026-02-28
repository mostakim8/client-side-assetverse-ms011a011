import { useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  Hash,
  ShieldCheck,
} from "lucide-react";
import { ThemeContext } from "../../../hooks/ThemeContext";

const PaymentSuccess = () => {
  const location = useLocation();
  const { isDark } = useContext(ThemeContext);
  const { transactionId, email, employees, price } = location.state || {};

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300 flex flex-col items-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1B1A55]/10 rounded-[3.5rem] shadow-2xl dark:shadow-none p-10 text-center border border-gray-100 dark:border-[#535C91]/30 transition-all">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-[#1B1A55]/10 dark:bg-[#1B1A55] text-[#9290C3] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border border-[#535C91]/20 relative">
          <CheckCircle2 size={48} className="relative z-10" />
          <div className="absolute inset-0 bg-[#535C91]/20 rounded-full animate-ping"></div>
        </div>

        <h2 className="text-3xl font-black text-[#070F2B] dark:text-white mb-2 tracking-tighter   italic">
          Upgrade <span className="text-[#535C91]">Confirmed!</span>
        </h2>
        <p className="text-[#535C91] dark:text-[#9290C3]/60 font-black   text-[9px] tracking-[0.3em] mb-10">
          Team capacity increased to {employees} members
        </p>

        {/* Receipt Card */}
        <div className="space-y-4 mb-10 text-left bg-gray-50/50 dark:bg-[#070F2B]/60 p-8 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/30">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#535C91]/20 pb-4">
            <span className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40 flex items-center gap-2">
              <Mail size={12} /> Email
            </span>
            <span className="text-[11px] font-bold text-[#070F2B] dark:text-[#9290C3] truncate ml-4   tracking-tighter">
              {email}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#535C91]/20 pb-4">
            <span className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40 flex items-center gap-2">
              <Hash size={12} /> Trans ID
            </span>
            <span className="text-[10px] font-black text-[#1B1A55] dark:text-[#9290C3] break-all ml-4   tracking-widest">
              {transactionId}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40">
              Amount Invested
            </span>
            <span className="text-2xl font-black text-[#070F2B] dark:text-white italic tracking-tighter">
              ${price}
            </span>
          </div>
        </div>

        {/* Navigation Button */}
        <Link
          to="/hr-home"
          className="w-full py-5 bg-[#1B1A55] hover:bg-[#535C91] text-white rounded-2xl font-black text-[10px]   tracking-[0.2em] transition-all flex justify-center items-center gap-3 shadow-xl active:scale-95 border border-[#535C91]/30"
        >
          Go to Dashboard <ArrowRight size={16} className="text-[#9290C3]" />
        </Link>
      </div>

      <div className="mt-10 flex items-center gap-2 text-[#535C91] dark:text-[#9290C3]/30">
        <ShieldCheck size={14} />
        <p className="text-[9px] font-black   tracking-[0.2em] italic">
          A digital receipt has been sent to your email
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
