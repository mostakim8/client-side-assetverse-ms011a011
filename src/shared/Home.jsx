import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/UseAuth";
import UseRole from "../hooks/UseRole";
import { ThemeContext } from "../hooks/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Heart,
  LayoutDashboard,
  PieChart,
  ShieldAlert,
  Plus,
  Minus,
  Settings,
  Users,
} from "lucide-react";

const Home = () => {
  const { user, loading } = useAuth();
  const [role, isRoleLoading] = UseRole();
  const { isDark } = useContext(ThemeContext);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Updated Slider Data: Focused on HR & Employee Workflows
  const sliderData = [
    {
      img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600",
      headline: (
        <>
          HR Strategic <br /> <span className="text-[#9290C3]">Control.</span>
        </>
      ),
      subHeadline:
        "Empowering HR Managers to track assets, manage teams, and monitor real-time inventory levels effortlessly.",
    },
    {
      img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600",
      headline: (
        <>
          Seamless <br />{" "}
          <span className="text-[#9290C3]">Asset Requests.</span>
        </>
      ),
      subHeadline:
        "Employees can request tools and equipment in seconds, with instant notifications and transparent approval tracking.",
    },
    {
      img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1600",
      headline: (
        <>
          Automated <br /> <span className="text-[#9290C3]">Workflows.</span>
        </>
      ),
      subHeadline:
        "Connecting HR and Employees through a smart dashboard for smooth distribution and hassle-free return processes.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderData.length]);

  useEffect(() => {
    if (!loading && !isRoleLoading && user && role) {
      if (role === "hr") {
        navigate("/hr-home", { replace: true });
      } else if (role === "employee") {
        navigate("/employee-home", { replace: true });
      }
    }
  }, [user, role, loading, isRoleLoading, navigate]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
  };

  if (loading || isRoleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#070F2B]">
        <div className="w-16 h-16 border-4 border-[#535C91]/20 border-t-[#9290C3] rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-[#535C91]   tracking-widest text-[10px]">
          Syncing Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070F2B] font-sans text-[#070F2B] dark:text-[#9290C3] overflow-x-hidden transition-colors duration-300">
      {/* Hero Banner (70% Viewport) */}
      <section className="relative h-[70vh] flex items-center justify-center bg-[#070F2B] overflow-hidden">
        {/* Wrapper to sync Background and Content transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${currentSlide}`}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Background Image inside the transition wrapper */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-35"
              style={{
                backgroundImage: `url(${sliderData[currentSlide].img})`,
              }}
            />

            <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#070F2B]/40 to-[#070F2B] z-1"></div>

            {/* Content that enters/exits with the slide background */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-7xl mx-auto px-6 relative z-10 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
                <span className="text-white text-[10px] font-black   tracking-[0.2em]">
                  The Future of Workplace Management
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1] tracking-tighter mb-4 italic  ">
                {sliderData[currentSlide].headline}
              </h1>

              <p className="text-[#9290C3] text-sm md:text-lg font-bold   tracking-widest mb-10 max-w-3xl mx-auto">
                {sliderData[currentSlide].subHeadline}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/join-hr"
                  className="w-full sm:w-auto px-10 py-5 bg-[#1B1A55] text-white font-black rounded-2xl flex items-center justify-center gap-2 group transition-all"
                >
                  JOIN AS HR MANAGER{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  to="/join-employee"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-[#070F2B] font-black rounded-2xl flex items-center justify-center transition-all"
                >
                  JOIN AS EMPLOYEE
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* About Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeInUp} className="relative group">
            <div className="absolute -inset-4 bg-[#1B1A55]/20 rounded-[4rem] blur-2xl group-hover:bg-[#9290C3]/20 transition-all duration-500"></div>
            <div className="relative bg-[#1B1A55] aspect-square rounded-[3.5rem] overflow-hidden border-8 border-white dark:border-[#070F2B]">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <h3 className="text-2xl font-black italic tracking-tighter text-white  ">
                  Built for Modern Teams.
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.span
              variants={fadeInUp}
              className="text-[#535C91] font-black text-[10px]   tracking-[0.3em] block"
            >
              Our Philosophy
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-black text-[#070F2B] dark:text-white leading-[1.1] tracking-tighter   italic"
            >
              Solve Clutter, <br />{" "}
              <span className="text-[#1B1A55] dark:text-[#9290C3] underline">
                Focus on Culture.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed"
            >
              We believe resource management should be invisible. AssetVerse
              organizes property so you can focus on your team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Package Pricing */}
      <section className="py-24 bg-gray-50 dark:bg-[#1B1A55]/10">
        <motion.div
          {...fadeInUp}
          className="max-w-7xl mx-auto px-6 text-center mb-16"
        >
          <h2 className="text-4xl font-black text-[#070F2B] dark:text-white   italic tracking-tighter">
            Package Pricing
          </h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              name: "Basic",
              price: "$5",
              features: [
                "Asset Tracking",
                "Employee Management",
                "Basic Support",
              ],
            },
            {
              name: "Standard",
              price: "$10",
              popular: true,
              features: [
                "All Basic features",
                "Advanced Analytics",
                "Priority Support",
              ],
            },
            {
              name: "Premium",
              price: "$15",
              features: [
                "All Standard features",
                "Custom Branding",
                "24/7 Support",
              ],
            },
          ].map((plan, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className={`bg-white dark:bg-[#070F2B] p-10 rounded-[3rem] border flex flex-col items-center md:items-start ${
                plan.popular
                  ? "border-[#1B1A55] ring-4 ring-[#9290C3]/20 md:scale-105"
                  : "border-gray-100 dark:border-[#535C91]/20"
              } shadow-xl transition-all`}
            >
              <h3 className="text-xl font-black text-[#070F2B] dark:text-[#9290C3]   italic mb-2 text-center md:text-left">
                {plan.name}
              </h3>
              <div className="flex items-end justify-center md:justify-start gap-1 mb-8">
                <span className="text-5xl font-black text-[#070F2B] dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400 font-bold mb-2">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 text-center md:text-left">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold text-gray-600 dark:text-[#9290C3]/70"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-[#535C91] shrink-0"
                    />{" "}
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/join-hr"
                className={`w-full py-4 rounded-2xl font-black text-center text-[10px]   tracking-widest block transition-all ${
                  plan.popular
                    ? "bg-[#1B1A55] text-white"
                    : "bg-gray-100 dark:bg-white/5 dark:text-white"
                }`}
              >
                Select Plan
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-20">
          <span className="text-[#535C91] font-black text-[10px]   tracking-[0.3em] block">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-6xl font-black mt-4   italic tracking-tighter dark:text-white">
            Advanced{" "}
            <span className="text-[#1B1A55] dark:text-[#9290C3]">
              Features.
            </span>
          </h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <LayoutDashboard />,
              title: "Central Registry",
              desc: "One truth for every asset in your company.",
            },
            {
              icon: <PieChart />,
              title: "Visual Analytics",
              desc: "Track usage with interactive charts.",
            },
            {
              icon: <Globe />,
              title: "Multi-Affiliation",
              desc: "Work with multiple companies seamlessly.",
            },
            {
              icon: <ShieldAlert className="text-rose-600" />,
              title: "Stock Alerts",
              desc: "Get notified on low-quantity items.",
            },
            {
              icon: <Users className="text-orange-600" />,
              title: "Team Insights",
              desc: "Manage your employees and their gear.",
            },
            {
              icon: <Settings />,
              title: "Customization",
              desc: "Tailor the system to your identity.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-[#1B1A55]/10 border border-gray-100 dark:border-[#535C91]/20 rounded-[2.5rem] hover:border-[#9290C3] transition-all group"
            >
              <div className="w-12 h-12 bg-gray-50 dark:bg-[#070F2B] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-[#1B1A55] dark:text-[#9290C3]">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-black   italic mb-2 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials  */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover opacity-90 dark:opacity-90"
          />
          <div className="absolute inset-0 bg-white/50 dark:bg-[#070F2B]/50 z-1"></div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-[#070F2B] z-2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <motion.div {...fadeInUp} className="text-center lg:text-left">
              <span className="text-[#535C91] dark:text-[#9290C3] font-black text-[10px]   tracking-[0.3em] block mb-4">
                Testimonials
              </span>
              <h2 className="text-5xl md:text-7xl font-black italic   tracking-tighter leading-[0.85] text-[#070F2B] dark:text-white">
                Trusted <br />
                <span className="text-[#1B1A55] dark:text-[#9290C3]">
                  By 500+
                </span>{" "}
                <br /> Teams.
              </h2>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
            >
              {[
                {
                  quote:
                    "AssetVerse turned our inventory chaos into a structured system.",
                  name: "Sarah Jenkins",
                  role: "HR Director",
                  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
                },
                {
                  quote:
                    "Finally, an asset manager that looks modern and works intuitively.",
                  name: "Michael Chen",
                  role: "Ops Lead",
                  img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
                },
              ].map((testi, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="p-10  rounded-[3rem] border border-gray-100 dark:border-[#535C91]/20 backdrop-blur-xl group hover:border-[#9290C3] transition-all shadow-2xl"
                >
                  <p className="text-xl md:text-2xl font-black text-[#070F2B] dark:text-white   italic leading-tight mb-10">
                    "{testi.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testi.img}
                      className="w-14 h-14 rounded-2xl border-2 border-[#9290C3] object-cover"
                    />
                    <div className="text-left">
                      <h5 className="font-black   text-sm md:text-base text-[#070F2B] dark:text-white">
                        {testi.name}
                      </h5>
                      <p className="text-[10px] font-bold   text-[#535C91] dark:text-[#9290C3] tracking-widest">
                        {testi.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section  */}
      <section className="py-24 bg-gray-50 dark:bg-[#070F2B]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            {...fadeInUp}
            className="text-4xl font-black   italic mb-16 dark:text-white"
          >
            How It{" "}
            <span className="text-[#1B1A55] dark:text-[#9290C3]">Works.</span>
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {[
              {
                q: "How do I upgrade my limit?",
                a: "You can upgrade through Stripe payment in your HR dashboard.",
              },
              {
                q: "Are requests real-time?",
                a: "Yes, inventory updates instantly upon HR approval.",
              },
              {
                q: "Can employees use multiple companies?",
                a: "Yes, we support multi-company affiliation.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white dark:bg-[#1B1A55]/10 rounded-xl border border-gray-100 dark:border-[#535C91]/20 overflow-hidden text-left"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="cursor-pointer w-full px-6 py-5 flex justify-between items-center font-black   text-[10px] tracking-widest italic dark:text-white"
                >
                  {faq.q}
                  {activeFaq === i ? (
                    <Minus size={14} className="text-[#9290C3]" />
                  ) : (
                    <Plus size={14} className="text-[#9290C3]" />
                  )}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-500 dark:text-gray-400 text-xs font-medium border-t dark:border-[#535C91]/20 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 transition-colors duration-500 overflow-hidden relative text-center">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover opacity-90 dark:opacity-90 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-white/50 dark:hidden z-1"></div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-[#070F2B] z-2"></div>
        </div>
        <motion.div
          {...fadeInUp}
          className="max-w-7xl mx-auto px-6 relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-black   italic mb-8 text-[#070F2B] dark:text-white">
            Ready to start?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToTop}
              className="cursor-pointer bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] px-8 py-4 rounded-xl font-black   text-[10px] tracking-widest hover:bg-[#535C91] dark:hover:bg-[#9290C3] transition-all active:scale-95 shadow-lg relative z-20"
            >
              Get Started
            </button>
            <button
              onClick={scrollToTop}
              className="cursor-pointer border-2 border-[#1B1A55]/20 dark:border-white/30 text-[#070F2B] dark:text-white px-8 py-4 rounded-xl font-black   text-[10px] tracking-widest hover:bg-[#1B1A55]/5 dark:hover:bg-white/10 transition-all active:scale-95 relative z-20"
            >
              Talk to Us
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
