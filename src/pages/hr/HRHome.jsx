import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  AlertCircle,
  Clock,
  PieChart as ChartIcon,
  TrendingUp,
  Megaphone,
  Send,
  Users,
  Package,
} from "lucide-react";
import Swal from "sweetalert2";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/ThemeContext";
import { motion } from "framer-motion"; 

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

  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const { data: stats = {}, isLoading } = useQuery({
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#535C91]/20 border-t-[#9290C3] rounded-full"
        />
        <p className="mt-4 font-black text-[#535C91] tracking-[0.4em] text-[9px] uppercase italic">
          System Syncing...
        </p>
      </div>
    );

  return (
    <div
      style={interFont}
      className="p-4 md:p-10 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-500 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <span className="text-[10px] font-black text-[#535C91] tracking-[0.5em] uppercase italic opacity-60">
            Admin Terminal
          </span>
          <h2 className="text-4xl font-black text-[#070F2B] dark:text-white tracking-tighter uppercase italic">
            HR <span className="text-[#9290C3]"> Management </span>
          </h2>
        </motion.div>

        {/* Hero Slider with Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-[#535C91]/10 shadow-2xl relative"
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 6000 }}
            pagination={{ clickable: true }}
            className="h-[350px]"
          >
            {sliderData.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.img}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
                    alt="Slider"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070F2B] via-[#070F2B]/90 to-transparent"></div>
                  <div className="relative h-full flex flex-col justify-center px-12 md:px-20 max-w-2xl">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase mb-2"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    />
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="text-[#9290C3] font-black text-[9px] tracking-[0.3em] uppercase italic opacity-80"
                    >
                      {slide.desc}
                    </motion.p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Stats Grid - Staggered Animation */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
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
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5, borderColor: "rgba(146, 144, 195, 0.5)" }}
              className="bg-white dark:bg-[#1B1A55]/10 p-8 rounded-3xl border border-gray-100 dark:border-[#535C91]/10 flex items-center gap-6 transition-all group shadow-sm"
            >
              <div
                className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
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
            </motion.div>
          ))}
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Announcement Terminal - Left Slide Animation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/10 p-10"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] rounded-xl flex items-center justify-center animate-pulse">
                  <Megaphone size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#070F2B] dark:text-white uppercase tracking-[0.3em] italic">
                    Notice Announcement
                  </h3>
                  <p className="text-[9px] font-black text-[#535C91] uppercase tracking-widest mt-0.5 opacity-40">
                    Update your team
                  </p>
                </div>
              </div>

              <form onSubmit={handlePostNotice} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] italic opacity-60">
                      Title / Subject
                    </label>
                    <input
                      name="title"
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-xl outline-none font-black text-[11px] uppercase tracking-widest italic dark:text-white focus:border-[#9290C3]/50 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] italic opacity-60">
                      Priority Type
                    </label>
                    <select
                      name="priority"
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-xl outline-none font-black text-[11px] uppercase tracking-widest italic dark:text-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] italic opacity-60">
                    Notice Message
                  </label>
                  <textarea
                    name="message"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 rounded-xl outline-none font-black text-[11px] tracking-widest uppercase italic dark:text-white h-32 resize-none"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-5 bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] rounded-xl font-black tracking-[0.4em] text-[10px] uppercase italic transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
                >
                  <Send size={14} /> Post
                </motion.button>
              </form>
            </motion.div>

            {/* Request Log - Fade In Up */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/10 overflow-hidden shadow-sm"
            >
              <div className="p-8 border-b border-gray-100 dark:border-[#535C91]/10 bg-gray-50/30 dark:bg-white/5">
                <h3 className="text-xs font-black text-[#070F2B] dark:text-white uppercase tracking-[0.3em] italic flex items-center gap-2">
                  <Clock size={16} /> Pending Requests Queue
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100 dark:divide-[#535C91]/5">
                    {stats.pendingRequests?.slice(0, 5).map((req, idx) => (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={req._id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-8 font-black text-[11px] text-[#070F2B] dark:text-white uppercase italic tracking-widest group-hover:text-[#9290C3] transition-colors">
                          {req.productName}
                        </td>
                        <td className="text-[11px] font-black text-[#535C91] uppercase italic tracking-widest opacity-60">
                          {req.userName}
                        </td>
                        <td className="text-right pr-8">
                          <span className="px-4 py-1.5 border border-amber-500/30 text-amber-500 text-[8px] font-black uppercase italic tracking-widest rounded-lg">
                            Await Approval
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR - Right Slide Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 h-full"
          >
            <div className="sticky top-28 space-y-8 z-10">
              {/* Chart Card */}
              <div className="bg-white dark:bg-[#1B1A55]/10 p-10 rounded-[3rem] border border-gray-100 dark:border-[#535C91]/10 shadow-xl shadow-black/5">
                <div className="mb-8">
                  <h3 className="text-xs font-black text-[#070F2B] dark:text-white uppercase tracking-[0.3em] italic flex items-center gap-2">
                    <ChartIcon size={16} className="text-[#9290C3]" /> Inventory
                    Ratio
                  </h3>
                </div>

                <div className="h-56 w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.chartData || []}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
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
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    { l: "Stock Health", v: "Optimal" },
                    { l: "Cycle Time", v: "4.2 Days" },
                  ].map((d, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-[#535C91]/10"
                    >
                      <span className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] italic">
                        {d.l}
                      </span>
                      <span className="text-[11px] font-black uppercase italic text-[#070F2B] dark:text-white tracking-widest">
                        {d.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts Card with Shaking Icon Animation */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-rose-500/5 p-8 rounded-[2.5rem] border border-rose-500/10"
              >
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] italic mb-6 flex items-center gap-2">
                  <motion.div
                    animate={{ x: [0, -2, 2, -2, 2, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      repeatDelay: 2,
                    }}
                  >
                    <AlertCircle size={14} />
                  </motion.div>
                  Low Inventory Alert
                </h3>
                <div className="space-y-3">
                  {stats.limitedStock?.slice(0, 3).map((item) => (
                    <div
                      key={item._id}
                      className="p-5 bg-white dark:bg-[#070F2B] rounded-2xl flex justify-between items-center border border-rose-500/10 shadow-sm hover:border-rose-500/30 transition-colors"
                    >
                      <span className="text-[10px] font-black text-[#070F2B] dark:text-white uppercase italic tracking-widest">
                        {item.productName}
                      </span>
                      <span className="text-rose-500 font-black italic">
                        {item.productQuantity}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HRHome;
