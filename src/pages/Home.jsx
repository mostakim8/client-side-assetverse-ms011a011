import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/UseAuth";
import UseRole from "../hooks/UseRole";
import HRHome from "./HRHome";
import EmployeeHome from "./EmployeeHome"; 
import { Link } from "react-router-dom";
import { 
    CheckCircle2, ShieldCheck, Zap, Globe, ArrowRight, Star, Heart, 
    LayoutDashboard, PieChart, ShieldAlert, Laptop, MessageSquare, Plus, Minus,
    Settings, Users
} from "lucide-react";

const Home = () => {
    const { user, loading } = useAuth();
    const [role, isRoleLoading] = UseRole();
    const [activeFaq, setActiveFaq] = useState(null);

    // banner scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (loading || isRoleLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Syncing Data...</p>
            </div>
        );
    }

    if (user && role === 'hr') return <HRHome />;
    if (user && role === 'employee') return <EmployeeHome />;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
            
            {/*  Hero Banner with Motion */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0A0D14] overflow-hidden">
                <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto px-6 relative z-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
                        <Star className="text-amber-400 fill-amber-400" size={14} />
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">The Future of Workplace Management</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-8 italic uppercase">
                        Master Your <br /> <span className="text-blue-500 underline decoration-blue-500/30">Resources.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 font-medium">
                        Ditch the spreadsheets. AssetVerse helps you track company hardware and office supplies in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/join-hr" className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 group transition-all">
                            JOIN AS HR MANAGER <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/join-employee" className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-gray-100 text-black font-black rounded-2xl flex items-center justify-center transition-all">
                            JOIN AS EMPLOYEE
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/*  About Section */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
                        <div className="bg-blue-600 aspect-square rounded-[3.5rem] flex flex-col items-center justify-center text-white p-12 shadow-2xl relative overflow-hidden">
                            <h3 className="text-6xl font-black italic tracking-tighter mb-4 leading-none z-10">Built for <br/> People.</h3>
                            <Heart size={200} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
                            <div className="absolute inset-0 bg-linear-to-br from-black/20 to-transparent"></div>
                        </div>
                    </motion.div>
                    <div className="space-y-8">
                        <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Our Philosophy</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase italic">
                            Solve the Clutter, <br/> <span className="text-blue-600 underline">Focus on Culture.</span>
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            We believe resource management should be invisible. AssetVerse acts like a silent partner—organizing property so you can focus on your team.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                            <div className="flex gap-4">
                                <div className="shrink-0 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Zap size={24} /></div>
                                <div><h4 className="font-black text-gray-900 text-sm uppercase">Zero Friction</h4><p className="text-xs text-gray-500 font-medium">Fast request & approvals.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><ShieldCheck size={24} /></div>
                                <div><h4 className="font-black text-gray-900 text-sm uppercase">Full Visibility</h4><p className="text-xs text-gray-500 font-medium">Real-time asset tracking.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  Package Pricing */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Package Pricing</h2>
                    <p className="text-gray-400 font-medium mt-2 italic">Choose a plan that matches your team's ambition.</p>
                </div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "Basic", price: "$5", limit: "5 Members", features: ["Asset Tracking", "Employee Management", "Basic Support"] },
                        { name: "Standard", price: "$10", limit: "8 Members", popular: true, features: ["All Basic features", "Advanced Analytics", "Priority Support"] },
                        { name: "Premium", price: "$15", limit: "20 Members", features: ["All Standard features", "Custom Branding", "24/7 Support"] }
                    ].map((plan, idx) => (
                        <div key={idx} className={`bg-white p-10 rounded-[2.5rem] border ${plan.popular ? "border-blue-600 ring-4 ring-blue-50 scale-105" : "border-gray-100"} shadow-xl transition-all hover:-translate-y-2`}>
                            {plan.popular && <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">Recommended</span>}
                            <h3 className="text-xl font-black text-gray-900 uppercase italic mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                                <span className="text-gray-400 font-bold mb-2">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 text-left">
                                <li className="flex items-center gap-3 text-sm font-bold text-gray-600"><CheckCircle2 size={16} className="text-blue-600" /> {plan.limit}</li>
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600"><CheckCircle2 size={16} className="text-blue-600" /> {feature}</li>
                                ))}
                            </ul>
                            <Link to="/join-as-hr" className={`w-full py-4 rounded-2xl font-black text-center text-[10px] uppercase tracking-widest transition-all block ${plan.popular ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-800"}`}>Select Plan</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Showcase */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Capabilities</span>
                    <h2 className="text-4xl md:text-6xl font-black mt-4 uppercase italic tracking-tighter">Advanced <span className="text-blue-600">Features.</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <LayoutDashboard className="text-blue-600"/>, title: "Central Registry", desc: "One truth for every asset in your company." },
                        { icon: <PieChart className="text-purple-600"/>, title: "Visual Analytics", desc: "Track usage with interactive Recharts." },
                        { icon: <Globe className="text-indigo-600"/>, title: "Multi-Affiliation", desc: "Work with multiple companies seamlessly." },
                        { icon: <ShieldAlert className="text-rose-600"/>, title: "Stock Alerts", desc: "Get notified on low-quantity items." },
                        { icon: <Users className="text-orange-600"/>, title: "Team Insights", desc: "Manage your employees and their gear." },
                        { icon: <Settings className="text-gray-600"/>, title: "Customization", desc: "Tailor the system to your corporate identity." }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 bg-white border border-gray-100 rounded-4xl hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">{feature.icon}</div>
                            <h3 className="text-lg font-black uppercase italic mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials & Stats */}
            <section className="py-24 bg-[#0A0D14] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
                        <div>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter">Trusted by <br/> 500+ Teams</h2>
                            <div className="mt-8 flex justify-center lg:justify-start -space-x-3">
                                {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0A0D14] bg-gray-700"></div>)}
                            </div>
                        </div>
                        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 italic">
                                <p className="text-lg mb-6">"AssetVerse turned our inventory chaos into a structured system."</p>
                                <h5 className="font-black uppercase text-sm">Sarah Jenkins, HR Director</h5>
                            </div>
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 italic">
                                <p className="text-lg mb-6">"Finally, an asset manager that looks modern and works intuitively."</p>
                                <h5 className="font-black uppercase text-sm">Michael Chen, Ops Lead</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Extra Sections: How It Works & FAQ */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-center mb-16">How It <span className="text-blue-600">Works.</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 text-center">
                        {[
                            { step: "01", title: "Sign Up", desc: "HR Manager registers and selects a package." },
                            { step: "02", title: "Add Assets", desc: "Populate your inventory with company gear." },
                            { step: "03", title: "Manage", desc: "Approve employee requests and track returns." }
                        ].map((item, i) => (
                            <div key={i}>
                                <span className="text-6xl font-black text-blue-100 block mb-4">{item.step}</span>
                                <h4 className="text-xl font-black uppercase italic mb-2">{item.title}</h4>
                                <p className="text-gray-500 font-medium text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-black uppercase italic mb-8 text-center underline decoration-blue-500 underline-offset-8">FAQ</h3>
                        <div className="space-y-3">
                            {[
                                { q: "How do I upgrade my limit?", a: "You can upgrade through Stripe payment in your HR dashboard." },
                                { q: "Are requests real-time?", a: "Yes, inventory updates instantly upon HR approval." },
                                { q: "Can employees use multiple companies?", a: "Yes, we support multi-company affiliation for employees." }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-100">
                                    <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full px-6 py-4 text-left flex justify-between font-black uppercase text-xs tracking-widest italic">
                                        {faq.q} {activeFaq === i ? <Minus size={14}/> : <Plus size={14}/>}
                                    </button>
                                    <AnimatePresence>
                                        {activeFaq === i && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden"><div className="px-6 pb-4 text-gray-500 text-xs font-medium border-t pt-2">{faq.a}</div></motion.div>}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA - Updated with Scroll Function */}
            <section className="py-20 bg-blue-600 text-white text-center">
                <h2 className="text-4xl font-black uppercase italic mb-8">Ready to start?</h2>
                <div className="flex justify-center gap-4">
                    {/* Get Started Button - Scrolls to top to use Hero buttons */}
                    <button 
                        onClick={scrollToTop}
                        className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
                    >
                        Get Started
                    </button>
                    <button 
                        onClick={scrollToTop}
                        className="border-2 border-white/30 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                    >
                        Talk to Us
                    </button>
                </div>
            </section>

            
        </div>
    );
};

export default Home;