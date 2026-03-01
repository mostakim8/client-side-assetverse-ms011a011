import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import UseRole from "../hooks/UseRole";
import { ThemeContext } from "../hooks/ThemeContext";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  Box,
  PlusCircle,
  GitPullRequest,
  Users,
  ArrowUpCircle,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  UserPlus,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role] = UseRole();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Notification Data Fetching ---
  const { data: stats = {} } = useQuery({
    queryKey: ["hr-stats", user?.email],
    enabled: !!user?.email && role === "hr",
    queryFn: async () => {
      const res = await axiosSecure.get(`/hr-stats/${user?.email}`);
      return res.data;
    },
    refetchInterval: 5000, 
  });

  const pendingCount = stats.pendingRequests?.length || 0;
  

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#1e293b",
        });
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  const linkStyle =
    "flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-widest uppercase italic text-gray-500 dark:text-[#9290C3]/70 hover:text-[#1B1A55] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1B1A55]/40 rounded-xl transition-all duration-300 no-underline";
  const activeStyle =
    "flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-widest uppercase italic text-[#1B1A55] dark:text-white bg-gray-100 dark:bg-[#1B1A55] rounded-xl no-underline border border-gray-100 dark:border-[#535C91]/20 shadow-sm";

  const dropdownLinkStyle =
    "flex items-center gap-2 px-4 py-2.5 text-[10px] font-black tracking-widest uppercase italic text-gray-600 dark:text-[#9290C3] hover:bg-gray-50 dark:hover:bg-[#1B1A55] rounded-xl transition-all no-underline";

  const menuItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          <Home size={14} /> Home
        </NavLink>
      </li>
      {!user && (
        <>
          <li>
            <NavLink
              to="/join-employee"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              Join Employee
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/join-hr"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              Join HR
            </NavLink>
          </li>
        </>
      )}
      {user && role === "hr" && (
        <>
          <li>
            <NavLink
              to="/asset-list"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              <Box size={14} /> Assets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-asset"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              <PlusCircle size={14} /> Add
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/all-requests"
              className={({ isActive }) =>
                `relative ${isActive ? activeStyle : linkStyle}`
              }
            >
              <GitPullRequest size={14} /> Requests
              {/* Notification Badge */}
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white animate-bounce shadow-md border border-white dark:border-[#070F2B]">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-employee-list"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              <Users size={14} /> Employees
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-employee"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              <UserPlus size={14} /> +Employee
            </NavLink>
          </li>
        </>
      )}
      {user && role === "employee" && (
        <>
          <li>
            <NavLink
              to="/my-assets"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              <Box size={14} /> My Assets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-team"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              <Users size={14} /> My Team
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/request-asset"
              className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
            >
              <PlusCircle size={14} /> Request
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-[#070F2B]/90 backdrop-blur-xl border-b border-gray-100 dark:border-[#1B1A55] z-[100] h-20 flex items-center transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#070F2B] dark:text-[#9290C3] hover:bg-gray-100 dark:hover:bg-[#1B1A55] rounded-xl transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2 no-underline group">
            <div className="bg-[#1B1A55] dark:bg-[#535C91] p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-[#1B1A55]/20">
              <LayoutDashboard className="text-white" size={18} />
            </div>
            <span className="text-xl font-black text-[#070F2B] dark:text-white tracking-tighter italic uppercase">
              Asset
              <span className="text-[#535C91] dark:text-[#9290C3]">Verse</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center bg-gray-50/30 dark:bg-[#1B1A55]/10 p-1 rounded-2xl">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {menuItems}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1B1A55] text-[#535C91] dark:text-[#9290C3] hover:ring-2 ring-[#535C91] transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1 pr-3 bg-gray-50/50 dark:bg-[#1B1A55]/30 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-[#535C91]/20"
              >
                <img
                  className="w-10 h-10 rounded-xl object-cover border-2 border-[#535C91]/20"
                  src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"}
                  alt="profile"
                />
                <div className="hidden md:block text-left leading-tight">
                  <p className="text-[11px] font-black text-[#070F2B] dark:text-white m-0 italic uppercase">
                    {user?.displayName?.split(" ")[0]}
                  </p>
                  <span className="text-[8px] text-[#535C91] dark:text-[#9290C3] font-bold tracking-[0.15em] uppercase">
                    {role || "User"}
                  </span>
                </div>
                <ChevronDown
                  size={12}
                  className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute top-14 right-0 w-56 bg-white dark:bg-[#070F2B] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-[#1B1A55] p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link to="/profile" className={dropdownLinkStyle}>
                    <UserCircle size={16} /> View Profile
                  </Link>
                  {role === "hr" && (
                    <Link to="/upgrade-package" className={dropdownLinkStyle}>
                      <ArrowUpCircle size={16} className="text-orange-500" />{" "}
                      Upgrade Plan
                    </Link>
                  )}
                  <div className="h-px bg-gray-100 dark:bg-[#1B1A55] my-2 mx-2" />
                  <button
                    onClick={handleLogOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-black tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all uppercase italic cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] px-6 py-3 rounded-xl font-black text-[10px] tracking-widest no-underline hover:bg-[#535C91] dark:hover:bg-[#9290C3] transition-all active:scale-95 shadow-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-[#070F2B]/40 backdrop-blur-sm z-[90] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-24 left-4 right-4 bg-white dark:bg-[#070F2B] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-[#1B1A55] lg:hidden z-[100] overflow-hidden p-6">
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {menuItems}
                {user && (
                  <li className="pt-4 mt-2 border-t border-gray-100 dark:border-[#1B1A55]">
                    <button
                      onClick={handleLogOut}
                      className="w-full flex justify-center items-center gap-2 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl font-black text-[10px] tracking-widest hover:bg-red-100 transition-colors uppercase italic"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
