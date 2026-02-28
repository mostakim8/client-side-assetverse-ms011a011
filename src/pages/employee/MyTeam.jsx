import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Mail,
  ShieldCheck,
  User,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";

const MyTeam = () => {
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const axiosSecure = useAxiosSecure();

  const { data: team = [], isLoading } = useQuery({
    queryKey: ["my-team", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-team/${user?.email}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91] w-10 h-10" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 pt-24 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Page Header - Balanced with RequestAsset Style */}
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter italic leading-none">
            Our <span className="text-[#535C91]">Colleagues</span>
          </h2>
          <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black tracking-[0.3em] mt-3 italic uppercase">
            Organization Network Overview
          </p>

          {/* Team Strength Badge - Matches Active Tab Look */}
          <div className="mt-6 bg-gray-50 dark:bg-[#1B1A55]/20 px-5 py-2 rounded-xl border border-gray-100 dark:border-[#535C91]/20 flex items-center gap-3 shadow-sm">
            <Users size={16} className="text-[#535C91]" />
            <span className="text-[10px] font-black text-[#535C91] uppercase tracking-widest">
              Team Strength:{" "}
              <span className="text-[#1B1A55] dark:text-[#9290C3] ml-1">
                {team.length}
              </span>
            </span>
          </div>
        </div>

        {team.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {team.map((member) => (
              <div
                key={member._id}
                className="bg-white dark:bg-[#1B1A55]/10 p-4 rounded-[2rem] border border-gray-100 dark:border-[#535C91]/20 hover:border-[#9290C3]/40 transition-all group flex flex-col items-center text-center h-full shadow-sm hover:shadow-xl"
              >
                {/* Compact Background Accent */}
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#1B1A55]/5 dark:from-[#535C91]/10 to-transparent"></div>

                {/* Avatar Section - Matches RequestAsset Product Image Scale */}
                <div className="relative mb-4 z-10">
                  <div className="w-20 h-20 rounded-2xl ring-4 ring-[#535C91]/5 dark:ring-[#535C91]/20 ring-offset-2 ring-offset-white dark:ring-offset-[#070F2B] overflow-hidden shadow-md transition-all group-hover:scale-105">
                    <img
                      src={
                        member.photo ||
                        member.image ||
                        "https://i.ibb.co/0Qkb09Y/user.png"
                      }
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {member.role === "hr" && (
                    <div className="absolute -bottom-1 -right-1 bg-[#1B1A55] text-white p-1.5 rounded-lg shadow-lg border border-white dark:border-[#070F2B]">
                      <ShieldCheck size={12} />
                    </div>
                  )}
                </div>

                {/* Info Section - Sharp & Compact */}
                <h3 className="text-[13px] font-black text-[#070F2B] dark:text-white tracking-tight italic z-10 truncate w-full px-2 uppercase mb-1">
                  {member.name}
                </h3>

                <div
                  className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-[0.1em] flex items-center gap-1.5 z-10 uppercase mb-4 ${
                    member.role === "hr"
                      ? "bg-[#1B1A55] text-white"
                      : "bg-[#535C91]/10 text-[#535C91] dark:text-[#9290C3]"
                  }`}
                >
                  {member.role === "hr" ? (
                    <ShieldCheck size={10} />
                  ) : (
                    <User size={10} />
                  )}
                  {member.role === "hr" ? "HR Manager" : "Employee"}
                </div>

                {/* Contact Footer - Clean & Matches Button Style Height */}
                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-[#535C91]/10 w-full z-10">
                  <div className="flex items-center justify-center gap-2 text-[#535C91]/60 dark:text-[#9290C3]/40 group-hover:text-[#1B1A55] dark:group-hover:text-[#9290C3] transition-colors">
                    <Mail size={12} />
                    <p className="text-[10px] font-bold truncate lowercase tracking-tighter">
                      {member.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - Balanced with RequestAsset Modal Look */
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-white dark:bg-[#1B1A55]/10 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-[#535C91]/20 text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#070F2B] rounded-2xl flex items-center justify-center text-[#535C91] mx-auto mb-6 border border-[#535C91]/10 shadow-inner">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-[#070F2B] dark:text-white mb-3 tracking-tighter italic uppercase">
                Access <span className="text-[#535C91]">Restricted</span>
              </h3>
              <p className="text-[#535C91] dark:text-[#9290C3]/60 font-bold text-[11px] tracking-wide leading-relaxed">
                You are not currently linked to a team.
                <br />
                <span className="italic">Awaiting HR authorization.</span>
              </p>
              <div className="mt-8 inline-block px-6 py-2.5 bg-[#1B1A55] text-white rounded-xl text-[9px] font-black tracking-[0.3em] uppercase shadow-lg">
                Status: Pending
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
