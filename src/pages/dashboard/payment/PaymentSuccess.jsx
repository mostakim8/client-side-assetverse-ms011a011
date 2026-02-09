import { useLocation, Link } from "react-router-dom";
import { useContext } from "react"; 
import { CheckCircle2, ArrowRight, Mail, Hash } from "lucide-react";
import { ThemeContext } from "../../../hooks/ThemeContext"; 

const PaymentSuccess = () => {
    const location = useLocation();
    const { isDark } = useContext(ThemeContext); 
    const { transactionId, email, employees, price } = location.state || {};

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 flex flex-col items-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl dark:shadow-none p-10 text-center border border-gray-100 dark:border-slate-800 transition-all">
                
                {/* Success Icon */}
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100 dark:shadow-none">
                    <CheckCircle2 size={40} />
                </div>
                
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase">Payment <span className="text-emerald-500 italic">Successful!</span></h2>
                <p className="text-gray-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-8">Your package has been upgraded for {employees} employees</p>

                {/* Receipt Card */}
                <div className="space-y-4 mb-10 text-left bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border dark:border-slate-800">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3">
                        <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 flex items-center gap-2"><Mail size={12}/> Email</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate ml-4">{email}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3">
                        <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 flex items-center gap-2"><Hash size={12}/> Trans ID</span>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 break-all ml-4 uppercase">{transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500">Total Paid</span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">${price}</span>
                    </div>
                </div>

                {/* Navigation Button */}
                <Link to="/hr-home" className="w-full py-5 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-xl shadow-gray-200 dark:shadow-none active:scale-95">
                    Go to Dashboard <ArrowRight size={16} />
                </Link>
            </div>

            <p className="mt-8 text-gray-300 dark:text-slate-700 text-[10px] font-bold uppercase tracking-widest italic">
                A confirmation email has been sent to your inbox
            </p>
        </div>
    );
};

export default PaymentSuccess;