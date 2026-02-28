import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaBuilding,
  FaUserShield,
} from "react-icons/fa";
import { LayoutDashboard } from "lucide-react";

const Footer = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userData = {} } = useQuery({
    queryKey: ["footer-user-info", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email.toLowerCase()}`);
      return res.data;
    },
  });

  const headingStyle =
    "text-[10px] font-black text-[#070F2B] dark:text-white mb-6 uppercase tracking-[0.4em] italic opacity-90";
  const linkItemStyle =
    "text-[11px] font-black tracking-widest text-[#535C91] dark:text-[#9290C3]/60 hover:text-[#1B1A55] dark:hover:text-white transition-all duration-300 no-underline uppercase italic";

  return (
    <footer className="bg-white dark:bg-[#070F2B] border-t border-gray-100 dark:border-[#535C91]/10 pt-20 pb-10 transition-colors duration-500 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#535C91]/30 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#1B1A55]/5 dark:bg-[#9290C3]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand Identity Section */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline group mb-6"
          >
            <div className="bg-[#1B1A55] dark:bg-[#535C91] p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-500">
              <LayoutDashboard className="text-white" size={18} />
            </div>
            <span className="text-2xl font-black text-[#070F2B] dark:text-white tracking-tighter italic uppercase leading-none">
              Asset
              <span className="text-[#535C91] dark:text-[#9290C3]">Verse</span>
            </span>
          </Link>

          <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black tracking-[0.15em] leading-[2] uppercase italic  max-w-[240px] text-center md:text-justify">
            The next generation of corporate resource intelligence & asset
            tracking.
          </p>

          <div className="flex gap-4 mt-8">
            {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-[#1B1A55]/40 text-[#535C91] dark:text-[#9290C3]/50 hover:bg-[#1B1A55] dark:hover:bg-[#535C91] hover:text-white transition-all duration-500 border border-gray-100 dark:border-[#535C91]/10"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Corporate Links */}
        <div className="text-center md:text-left">
          <h3 className={headingStyle}>Navigation</h3>
          <ul className="space-y-4 list-none p-0">
            {["Home", "System Overview", "Global Support", "Security"].map(
              (link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : "#"}
                    className={linkItemStyle}
                  >
                    {link}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* User Identity - High Tech Style */}
        <div className="text-center md:text-left">
          <h3 className={headingStyle}>
            {user ? "Auth Identity" : "Portal Access"}
          </h3>
          <ul className="space-y-5 list-none p-0">
            {user ? (
              <>
                <li className="flex flex-col items-center md:items-start group">
                  <span className="text-[8px] font-black text-[#535C91] uppercase tracking-[0.3em] mb-1.5 opacity-60 italic">
                    Current Position
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1B1A55]/10 dark:bg-[#9290C3]/10 rounded-lg text-[#1B1A55] dark:text-[#9290C3]">
                      <FaUserShield size={12} />
                    </div>
                    <span className="font-black text-[#070F2B] dark:text-white tracking-widest text-[11px] uppercase italic">
                      {userData?.role === "hr" ? "Admin / HR" : "Employee"}
                    </span>
                  </div>
                </li>
                <li className="flex flex-col items-center md:items-start group">
                  <span className="text-[8px] font-black text-[#535C91] uppercase tracking-[0.3em] mb-1.5 opacity-60 italic">
                    Organization
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1B1A55]/10 dark:bg-[#9290C3]/10 rounded-lg text-[#1B1A55] dark:text-[#9290C3]">
                      <FaBuilding size={12} />
                    </div>
                    <span className="font-black text-[#070F2B] dark:text-white tracking-widest text-[11px] uppercase italic truncate max-w-[140px]">
                      {userData?.companyName || "Standard Unit"}
                    </span>
                  </div>
                </li>
              </>
            ) : (
              <div className="space-y-4 flex flex-col items-center md:items-start">
                {["Join Employee", "Join Manager", "Portal Login"].map(
                  (label) => (
                    <Link
                      key={label}
                      to={
                        label === "Join Employee"
                          ? "/join-employee"
                          : label === "Join Manager"
                            ? "/join-hr"
                            : "/login"
                      }
                      className={linkItemStyle}
                    >
                      {label}
                    </Link>
                  ),
                )}
              </div>
            )}
          </ul>
        </div>

        {/* Global Support */}
        <div className="text-center md:text-left">
          <h3 className={headingStyle}>Terminal Support</h3>
          <div className="space-y-5">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[8px] font-black text-[#535C91] uppercase tracking-[0.3em] mb-1.5 opacity-60 italic">
                Email Terminal
              </span>
              <p className="text-[11px] font-black tracking-tighter text-[#1B1A55] dark:text-white flex items-center gap-2 lowercase italic">
                <FaEnvelope size={12} className="opacity-50" />{" "}
                support@assetverse.io
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[8px] font-black text-[#535C91] uppercase tracking-[0.3em] mb-1.5 opacity-60 italic">
                Secure Line
              </span>
              <p className="text-[11px] font-black tracking-widest text-[#1B1A55] dark:text-white flex items-center gap-2 italic">
                <FaPhoneAlt size={12} className="opacity-50" /> +880 1700 0000
                00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom / Legal */}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-100 dark:border-[#535C91]/10 mt-20 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-[#535C91] font-black tracking-[0.4em] uppercase italic opacity-70">
            © 2026 AssetVerse Identity System.{" "}
            <span className="hidden md:inline border-l border-[#535C91]/30 ml-3 pl-3">
              Code-Base Version 3.1.0
            </span>
          </p>

          <div className="flex gap-8">
            {["System Policy", "Terms of Use"].map((legal) => (
              <a
                key={legal}
                href="#"
                className="text-[9px] font-black tracking-[0.3em] uppercase italic text-[#535C91] hover:text-[#1B1A55] dark:hover:text-white transition-all no-underline"
              >
                {legal}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
