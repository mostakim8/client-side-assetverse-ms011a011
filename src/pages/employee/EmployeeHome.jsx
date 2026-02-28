import { useQuery } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import {
  Calendar,
  AlertCircle,
  Loader2,
  Inbox,
  Gift,
  X,
  ArrowUpRight,
  PartyPopper,
  Info,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const EmployeeHome = () => {
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const axiosSecure = useAxiosSecure();

  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 4; // Compact grid
  const [selectedNotice, setSelectedNotice] = useState(null);

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["employee-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/employee-stats/${user?.email.toLowerCase()}`,
      );
      return res.data;
    },
  });

  const { data: birthdays = [] } = useQuery({
    queryKey: ["team-birthdays", user?.email, stats?.userData?.hrEmail],
    enabled: !!user?.email && !!stats?.userData?.hrEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/team-birthdays/${user?.email.toLowerCase()}`,
      );
      return res.data;
    },
  });

  const { data: notices = [] } = useQuery({
    queryKey: ["notices", stats?.userData?.hrEmail],
    enabled: !!stats?.userData?.hrEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/notices/${stats?.userData?.hrEmail}`);
      return res.data;
    },
  });

  const sliderData = [
    {
      title: "Request <span class='text-[#9290C3]'>Assets</span> Easily",
      desc: "Browse company inventory and request tools in just a few clicks.",
      img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Stay <span class='text-[#9290C3]'>Updated</span> Always",
      desc: "Check the notice board for real-time announcements.",
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
    },
  ];

  const sortedNotices = [...notices].sort((a, b) => {
    if (a.priority === "High" && b.priority !== "High") return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const currentNotices = sortedNotices.slice(
    (currentPage - 1) * noticesPerPage,
    currentPage * noticesPerPage,
  );
  const totalPages = Math.ceil(sortedNotices.length / noticesPerPage);

  const isJoined =
    stats?.userData?.hrEmail && stats?.userData?.status === "joined";
  const isPending = stats?.userData?.status === "pending";

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91] w-10 h-10" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 pt-24 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <style>{`.swiper-pagination-bullet-active { background: #9290C3 !important; }`}</style>

      <div className="max-w-6xl mx-auto">
        {/* SECTION 1: COMPACT SLIDER - Rounded Like Product Cards */}
        <div className="mb-8 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-[#535C91]/20">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            className="h-[250px] md:h-[320px]"
          >
            {sliderData.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.img}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Slider"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-[#070F2B] via-[#070F2B]/70 to-transparent"></div>
                  <div className="relative h-full flex flex-col justify-center px-10 md:px-16 max-w-xl text-white">
                    <h1
                      className="text-3xl md:text-5xl font-black italic tracking-tighter mb-3 leading-none uppercase"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    />
                    <p className="text-[#9290C3] font-bold text-[10px] md:text-xs tracking-[0.2em] leading-relaxed uppercase opacity-80">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* AFFILIATION ALERT - Balanced Style */}
        {!isJoined && (
          <div className="mb-8 p-5 bg-gray-50/50 dark:bg-[#1B1A55]/10 rounded-2xl border border-gray-100 dark:border-[#535C91]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-[#070F2B] dark:text-white font-black text-[11px] tracking-widest uppercase italic">
                  {isPending
                    ? "Request Under Review"
                    : "Company Affiliation Required"}
                </h4>
                <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-bold uppercase tracking-tight">
                  {isPending
                    ? "Your HR is currently reviewing your profile access."
                    : "Join an organization to access inventory & team features."}
                </p>
              </div>
            </div>
            {!isPending && (
              <Link to="/join-company">
                <button className="px-6 py-2.5 bg-[#1B1A55] text-white rounded-xl font-black text-[9px] tracking-widest uppercase shadow-md hover:bg-[#535C91] transition-all active:scale-95">
                  Browse Teams{" "}
                  <ArrowUpRight size={14} className="inline ml-1" />
                </button>
              </Link>
            )}
          </div>
        )}

        {/* STATS & WELCOME GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
          <div className="lg:col-span-8 bg-[#1B1A55] dark:bg-[#1B1A55]/30 p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-center border border-white/5 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <span className="bg-[#535C91] px-3 py-1 rounded-lg text-[8px] font-black uppercase w-fit mb-3 tracking-widest">
              {isJoined ? stats.userData?.companyName : "Independent Member"}
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic leading-none uppercase">
              Greetings,{" "}
              <span className="text-[#9290C3]">
                {user?.displayName?.split(" ")[0]}
              </span>
            </h2>
            <p className="mt-3 text-[#9290C3]/60 text-[9px] font-bold uppercase tracking-[0.3em]">
              Corporate Dashboard Active
            </p>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#1B1A55]/10 p-6 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/20 flex flex-col justify-center items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-[#535C91]/10 rounded-2xl flex items-center justify-center text-[#535C91] mb-3">
              <Calendar size={22} />
            </div>
            <p className="text-[9px] font-black text-[#535C91] tracking-[0.2em] uppercase mb-1">
              Monthly Asset Usage
            </p>
            <h3 className="text-5xl font-black text-[#070F2B] dark:text-[#9290C3] tracking-tighter italic">
              {stats.monthlyCount || 0}
            </h3>
          </div>
        </div>

        {/* ANNOUNCEMENTS & BIRTHDAYS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Notice Board - Matches MyAssets Table Container Style */}
          <div
            className={`${isJoined && birthdays.length > 0 ? "lg:col-span-8" : "lg:col-span-12"} bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/20 p-6 shadow-sm`}
          >
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-[12px] font-black flex items-center gap-2 uppercase italic text-[#070F2B] dark:text-white tracking-tighter">
                <Inbox size={16} className="text-[#535C91]" /> Corporate
                Announcements
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentNotices?.length > 0 ? (
                currentNotices.map((notice) => (
                  <div
                    key={notice._id}
                    onClick={() => setSelectedNotice(notice)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                      notice.priority === "High"
                        ? "bg-rose-50/40 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30"
                        : "bg-gray-50/50 dark:bg-[#070F2B] border-gray-100 dark:border-[#535C91]/20"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${notice.priority === "High" ? "bg-rose-500 text-white" : "bg-[#1B1A55] text-white"}`}
                      >
                        {notice.priority}
                      </span>
                      <span className="text-[9px] text-[#535C91] font-bold italic opacity-60">
                        {new Date(notice.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <h4 className="font-black text-[#070F2B] dark:text-white text-[12px] truncate uppercase italic tracking-tight mb-1">
                      {notice.title}
                    </h4>
                    <p className="text-[9px] text-[#535C91] dark:text-[#9290C3]/40 font-bold uppercase tracking-widest">
                      Click to view detail
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-[#535C91] text-[9px] font-black tracking-[0.4em] uppercase opacity-30">
                  Inbox Clear
                </div>
              )}
            </div>

            {/* Pagination - Small & Clean */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl text-[9px] font-black transition-all ${currentPage === i + 1 ? "bg-[#1B1A55] text-white" : "bg-gray-100 dark:bg-[#1B1A55] text-[#535C91]"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Birthdays - Compact Card */}
          {isJoined && birthdays.length > 0 && (
            <div className="lg:col-span-4  bg-linear-to-br from-[#1B1A55] to-[#535C91] p-6 rounded-[2.5rem] text-white shadow-xl border border-white/5 relative overflow-hidden flex flex-col justify-center">
              <PartyPopper
                size={80}
                className="absolute -bottom-6 -right-6 opacity-10 rotate-12"
              />
              <h3 className="text-[13px] font-black tracking-widest italic uppercase mb-5 flex items-center gap-2">
                <Gift size={16} /> Team Birthdays
              </h3>
              <div className="flex flex-wrap gap-2.5 relative z-10">
                {birthdays.map((member, idx) => (
                  <a
                    key={idx}
                    href={`mailto:${member.email}`}
                    title={member.name}
                    className="group relative"
                  >
                    <img
                      className="w-11 h-11 rounded-xl border-2 border-white/20 object-cover group-hover:scale-110 transition-transform"
                      src={member.photo || "https://i.ibb.co/0Qkb09Y/user.png"}
                      alt={member.name}
                    />
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </a>
                ))}
              </div>
              <p className="mt-6 text-[9px] font-black uppercase tracking-widest opacity-60 italic">
                Send them a wish!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL - Balanced Detail View */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className="relative bg-white dark:bg-[#070F2B] rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-[#535C91]/30">
            <div className="bg-[#1B1A55] p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[#9290C3] font-black text-[8px] tracking-[0.3em] uppercase block mb-1">
                    Official Publication
                  </span>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                    Announcement
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-50 dark:bg-[#1B1A55]/20 rounded-xl flex items-center justify-center text-[#535C91]">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="font-black text-[15px] text-[#070F2B] dark:text-white leading-none uppercase italic">
                    {selectedNotice.title}
                  </h4>
                  <p className="text-[9px] font-bold text-[#535C91] mt-1.5 uppercase opacity-60">
                    {new Date(selectedNotice.createdAt).toDateString()}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-[#1B1A55]/20 p-5 rounded-2xl border border-gray-100 dark:border-[#535C91]/20">
                <p className="text-[#070F2B] dark:text-[#9290C3]/80 text-[12px] leading-relaxed font-semibold whitespace-pre-wrap italic">
                  "{selectedNotice.message}"
                </p>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="w-full mt-8 py-3.5 bg-[#1B1A55] text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg active:scale-95 transition-all"
              >
                Dismiss Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHome;
