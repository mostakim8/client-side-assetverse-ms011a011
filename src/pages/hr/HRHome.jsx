import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertCircle,
  Clock,
  PieChart as ChartIcon,
  User,
  TrendingUp,
  Megaphone,
  Send,
  Sparkles,
  Layers,
  Type,
  Flag,
  Users,
  Package,
} from "lucide-react";
import Swal from "sweetalert2";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HRHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);
  const interFont = { fontFamily: "'Inter', sans-serif" };

  const {
    data: stats = {},
    isLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["hr-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/hr-stats/${user?.email}`);
      return res.data;
    },
  });

  const sliderData = [
    {
      title:
        "Strategic <span class='text-[#9290C3] uppercase italic'>Team</span> Management",
      desc: "Connect your global workforce and monitor resource allocation efficiency.",
      img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title:
        "Asset <span class='text-[#9290C3] uppercase italic'>Intelligence</span>",
      desc: "Real-time tracking of returnable equipment and inventory health.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title:
        "Broadcast <span class='text-[#9290C3] uppercase italic'>Protocol</span>",
      desc: "Deploy critical announcements across the organization instantly.",
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
    },
  ];

  const handlePostNotice = async (e) => {
    e.preventDefault();
    const form = e.target;
    const noticeData = {
      title: form.title.value,
      message: form.message.value,
      priority: form.priority.value,
      hrEmail: user.email,
      hrName: user.displayName,
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/notices", noticeData);
      if (res.data.insertedId) {
        Swal.fire({
          title: "NOTICE DEPLOYED",
          text: "Protocol update shared with the team successfully.",
          icon: "success",
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
          confirmButtonColor: "#1B1A55",
          customClass: {
            title: "font-black uppercase italic tracking-widest text-sm",
            confirmButton:
              "font-black uppercase italic tracking-[0.2em] text-[10px] py-4 px-8 rounded-xl",
          },
        });
        form.reset();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Notice failed to deploy",
        icon: "error",
      });
    }
  };

  const COLORS = ["#1B1A55", "#9290C3"];

  if (isLoading)
    return (
      <div
        style={interFont}
        className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]"
      >
        <div className="w-16 h-16 border-4 border-[#535C91]/20 border-t-[#9290C3] rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-[#535C91] tracking-[0.4em] text-[9px] uppercase italic">
          System Syncing...
        </p>
      </div>
    );

  return (
    <div
      style={interFont}
      className="p-4 md:p-10 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-4">
          <div>
            <span className="text-[10px] font-black text-[#535C91] tracking-[0.5em] uppercase italic opacity-60">
              Admin Terminal
            </span>
            <h2 className="text-4xl font-black text-[#070F2B] dark:text-white tracking-tighter uppercase italic flex items-center gap-3">
              HR <span className="text-[#9290C3]">Intelligence</span>
            </h2>
            <p className="text-[#535C91] dark:text-[#9290C3]/50 font-black text-[10px] tracking-[0.2em] uppercase italic mt-1">
              Operator: {user?.displayName}
            </p>
          </div>
        </div>

        {/* Dynamic Swiper - Hero Banner */}
        <div className="mb-16 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-[#535C91]/10 shadow-2xl relative group">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 6000 }}
            pagination={{ clickable: true }}
            className="h-[400px]"
          >
            {sliderData.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.img}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
                    alt="Slider"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070F2B] via-[#070F2B]/80 to-transparent"></div>
                  <div className="relative h-full flex flex-col justify-center px-12 md:px-24 max-w-3xl">
                    <h1
                      className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-4"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    />
                    <p className="text-[#9290C3] font-black text-[10px] tracking-[0.3em] uppercase italic leading-relaxed opacity-80">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              label: "Active Team",
              value: stats.teamCount || 0,
              icon: <Users size={16} />,
              color: "bg-[#1B1A55]",
            },
            {
              label: "Global Assets",
              value: stats.totalAssets || 0,
              icon: <Package size={16} />,
              color: "bg-[#535C91]",
            },
            {
              label: "Alert Req",
              value: stats.pendingRequests?.length || 0,
              icon: <Clock size={16} />,
              color: "bg-[#1B1A55]",
            },
            {
              label: "Efficiency",
              value: "98.2%",
              icon: <TrendingUp size={16} />,
              color: "bg-[#535C91]",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1B1A55]/10 p-8 rounded-3xl border border-gray-100 dark:border-[#535C91]/10 flex items-center gap-6 hover:border-[#9290C3]/30 transition-all group"
            >
              <div
                className={`w-12 h-12 ${stat.color} text-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-[9px] font-black text-[#535C91] tracking-[0.4em] uppercase italic opacity-60 mb-1">
                  {stat.label}
                </p>
                <h4 className="text-2xl font-black text-[#070F2B] dark:text-white tracking-tighter italic">
                  {stat.value}
                </h4>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Terminal Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Announcement Terminal */}
            <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/10 overflow-hidden relative">
              <div className="p-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] rounded-xl flex items-center justify-center shadow-lg">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#070F2B] dark:text-white uppercase tracking-[0.3em] italic">
                      Deploy Broadcast
                    </h3>
                    <p className="text-[9px] font-black text-[#535C91] dark:text-[#9290C3]/40 uppercase tracking-widest mt-0.5">
                      Global Protocol Update
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePostNotice} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] ml-1 italic opacity-60">
                        Terminal Header
                      </label>
                      <input
                        name="title"
                        placeholder="ENTER SUBJECT..."
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-xl focus:border-[#9290C3] outline-none transition-all font-black text-[11px] uppercase tracking-widest italic dark:text-white placeholder:opacity-30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] ml-1 italic opacity-60">
                        Priority Code
                      </label>
                      <select
                        name="priority"
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-xl focus:border-[#9290C3] outline-none font-black text-[11px] uppercase tracking-widest italic dark:text-white appearance-none"
                        required
                      >
                        <option value="Low">Low - System</option>
                        <option value="Medium">Medium - Operation</option>
                        <option value="High">High - Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] ml-1 italic opacity-60">
                      Message Payload
                    </label>
                    <textarea
                      name="message"
                      placeholder="ENTER DATA PACKET..."
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-xl focus:border-[#9290C3] outline-none font-black text-[11px] tracking-widest uppercase italic dark:text-white h-32 resize-none placeholder:opacity-30"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] rounded-xl font-black tracking-[0.4em] text-[10px] uppercase italic transition-all hover:bg-[#535C91] dark:hover:bg-[#9290C3] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3"
                  >
                    <Send size={14} /> Execute Deployment
                  </button>
                </form>
              </div>
            </div>

            {/* Request Log Table */}
            <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/10 overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-[#535C91]/10 flex justify-between items-center">
                <h3 className="text-xs font-black text-[#070F2B] dark:text-white uppercase tracking-[0.3em] italic flex items-center gap-2">
                  <Clock size={16} /> Pending Requests Queue
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#535C91]/10">
                      <th className="p-8 text-left text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                        Asset Unit
                      </th>
                      <th className="text-left text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                        Personnel
                      </th>
                      <th className="text-right pr-8 text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#535C91]/5">
                    {stats.pendingRequests?.slice(0, 5).map((req) => (
                      <tr
                        key={req._id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="p-8 font-black text-[11px] text-[#070F2B] dark:text-white uppercase italic tracking-widest">
                          {req.productName}
                        </td>
                        <td className="text-[11px] font-black text-[#535C91] dark:text-[#9290C3]/60 uppercase italic tracking-widest">
                          {req.userName}
                        </td>
                        <td className="text-right pr-8">
                          <span className="px-4 py-1.5 border border-amber-500/30 text-amber-500 text-[8px] font-black uppercase italic tracking-widest rounded-lg bg-amber-500/5">
                            Await Approval
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Intelligence Column (Right) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-[#1B1A55]/10 p-10 rounded-[3rem] border border-gray-100 dark:border-[#535C91]/10 sticky top-28">
              <div className="mb-10">
                <h3 className="text-xs font-black text-[#070F2B] dark:text-white uppercase tracking-[0.3em] italic flex items-center gap-2">
                  <ChartIcon size={16} className="text-[#9290C3]" /> Inventory
                  Ratio
                </h3>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.chartData || []}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={10}
                      dataKey="value"
                    >
                      {stats.chartData?.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#070F2B",
                        border: "none",
                        borderRadius: "15px",
                        fontSize: "10px",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 space-y-4">
                {[
                  {
                    l: "Stock Health",
                    v: "Optimal",
                    c: "text-[#1B1A55] dark:text-white",
                  },
                  {
                    l: "Cycle Time",
                    v: "4.2 Days",
                    c: "text-[#1B1A55] dark:text-white",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-[#535C91]/10"
                  >
                    <span className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] italic">
                      {d.l}
                    </span>
                    <span
                      className={`text-[11px] font-black uppercase italic tracking-widest ${d.c}`}
                    >
                      {d.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-rose-500/5 dark:bg-rose-500/10 p-8 rounded-[2.5rem] border border-rose-500/20">
              <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] italic mb-6 flex items-center gap-2">
                <AlertCircle size={14} /> Low Inventory Alert
              </h3>
              <div className="space-y-3">
                {stats.limitedStock?.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-white dark:bg-[#070F2B] rounded-xl flex justify-between items-center border border-rose-500/10"
                  >
                    <span className="text-[10px] font-black text-[#070F2B] dark:text-white uppercase italic tracking-widest">
                      {item.productName}
                    </span>
                    <span className="text-rose-500 font-black italic">
                      {item.productQuantity} UNIT
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRHome;
