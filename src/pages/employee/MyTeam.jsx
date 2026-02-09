import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Mail, ShieldCheck, User, Users, Loader2, AlertCircle } from "lucide-react";

const MyTeam = () => {
    const { user } = useAuth();
    const { isDark } = useContext(ThemeContext);
    const axiosSecure = useAxiosSecure();

    const { data: team = [], isLoading } = useQuery({
        queryKey: ['my-team', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-team/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-white dark:bg-slate-950">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#fcfcfd] dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Page Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            Our <span className="text-blue-600 italic">Colleagues</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
                            <Users size={16} className="text-blue-500" />
                            Everyone working together in your organization
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hidden md:block">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Members:</span>
                        <span className="ml-2 text-xl font-black text-blue-600">{team.length}</span>
                    </div>
                </div>

                {team.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {team.map((member) => (
                            <div key={member._id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group transition-all duration-500 hover:-translate-y-2">
                                
                                {/* Avatar Section */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-4xl ring-4 ring-blue-50 dark:ring-blue-900/20 ring-offset-4 ring-offset-white dark:ring-offset-slate-900 overflow-hidden">
                                        <img 
                                            src={member.photo || member.image || "https://i.ibb.co/0Qkb09Y/user.png"} 
                                            alt={member.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    {member.role === 'hr' && (
                                        <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-xl shadow-lg">
                                            <ShieldCheck size={16} />
                                        </div>
                                    )}
                                </div>

                                {/* Info Section */}
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter line-clamp-1">{member.name}</h3>
                                
                                <div className={`mt-3 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 ${
                                    member.role === 'hr' 
                                    ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' 
                                    : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                                }`}>
                                    {member.role === 'hr' ? <ShieldCheck size={12} /> : <User size={12} />}
                                    {member.role === 'hr' ? 'HR Manager' : 'Employee'}
                                </div>

                                {/* Contact Footer */}
                                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 w-full">
                                    <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
                                        <Mail size={14} />
                                        <p className="text-[11px] font-bold truncate max-w-45">{member.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Enhanced Empty State */
                    <div className="max-w-xl mx-auto mt-10">
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
                            <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-4xl flex items-center justify-center text-amber-500 mx-auto mb-8 shadow-inner">
                                <AlertCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic">No Team Found!</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                                It looks like you haven't been assigned to a company team yet. Once your <span className="text-blue-600 font-bold">HR Manager</span> adds you, your colleagues will appear here.
                            </p>
                            <div className="mt-8 inline-block px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Status: Waiting for Affiliation
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTeam;