import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; 
import useAuth from "../hooks/UseAuth";
import UseRole from "../hooks/UseRole";
import Swal from "sweetalert2";
import { 
    LayoutDashboard, Box, PlusCircle, GitPullRequest, 
    Users, ArrowUpCircle, UserCircle, LogOut, Menu, X, ChevronDown, Home 
} from "lucide-react";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [role] = UseRole();
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate(); 

    const handleLogOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'Redirecting to Home...',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#fff',
                });
                navigate('/'); 
                setIsOpen(false);
                setProfileOpen(false);
            })
            .catch(error => console.log(error));
    };

    // স্টাইল কনফিগারেশন
    const linkStyle = "flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300 no-underline";
    const activeStyle = "flex items-center gap-2 px-4 py-2 text-sm font-black text-blue-600 bg-blue-50 rounded-xl no-underline";

    // মেনু আইটেম লজিক (মোবাইলে ক্লিক করলে বন্ধ হওয়ার সুবিধাসহ)
    const menuItems = (
        <>
            <li>
                <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}>
                    <Home size={16}/> Home
                </NavLink>
            </li>

            {!user && (
                <>
                    <li><NavLink to="/join-employee" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}>Join Employee</NavLink></li>
                    <li><NavLink to="/join-hr" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}>Join HR Manager</NavLink></li>
                </>
            )}

            {/* HR Manager Links */}
            {user && role === 'hr' && (
                <>
                    <li><NavLink to="/asset-list" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}><Box size={16}/> Asset List</NavLink></li>
                    <li><NavLink to="/add-asset" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}><PlusCircle size={16}/> Add Asset</NavLink></li>
                    <li><NavLink to="/all-requests" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}><GitPullRequest size={16}/> Requests</NavLink></li>
                    <li><NavLink to="/my-employee-list" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}><Users size={16}/> Employees</NavLink></li>
                </>
            )}

            {/* Employee Links */}
            {user && role === 'employee' && (
                <>
                    <li><NavLink to="/my-assets" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}><Box size={16}/> My Assets</NavLink></li>
                    <li><NavLink to="/my-team" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}><Users size={16}/> My Team</NavLink></li>
                    <li><NavLink to="/request-asset" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? activeStyle : linkStyle}><PlusCircle size={16}/> Request Asset</NavLink></li>
                </>
            )}
        </>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-[100] h-20 flex items-center shadow-sm">
            <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link to="/" className="flex items-center gap-2 no-underline group">
                        <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tighter">
                            Asset<span className="text-blue-600">Verse</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center">
                    <ul className="flex items-center gap-1 list-none m-0 p-0">
                        {menuItems}
                    </ul>
                </div>

                {/* Right Side: Profile & Auth */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <div 
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-100"
                            >
                                <img 
                                    className="w-10 h-10 rounded-xl object-cover shadow-sm border border-blue-100" 
                                    src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                                    alt="profile" 
                                />
                                <div className="hidden md:block text-left leading-tight">
                                    <p className="text-sm font-black text-gray-800 m-0">{user?.displayName?.split(' ')[0]}</p>
                                    <span className="text-[10px] uppercase text-blue-500 font-bold tracking-widest">{role}</span>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Profile Dropdown */}
                            {profileOpen && (
                                <div className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <NavLink to="/profile" onClick={() => setProfileOpen(false)} className={linkStyle}>
                                        <UserCircle size={18} /> View Profile
                                    </NavLink>
                                    {role === 'hr' && (
                                        <NavLink to="/upgrade" onClick={() => setProfileOpen(false)} className={linkStyle}>
                                            <ArrowUpCircle size={18} className="text-orange-500" /> Upgrade Plan
                                        </NavLink>
                                    )}
                                    <div className="h-px bg-gray-50 my-2" />
                                    <button 
                                        onClick={handleLogOut} 
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm no-underline hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Sidebar Navigation */}
                {isOpen && (
                    <>
                        {/* মডাল ব্যাকড্রপ */}
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />
                        
                        <div className="absolute top-20 left-4 right-4 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 lg:hidden z-40 overflow-hidden animate-in slide-in-from-top-5">
                            <ul className="flex flex-col p-6 gap-2 list-none m-0">
                                {menuItems}
                                {user && (
                                    <li className="pt-4 mt-4 border-t border-gray-50">
                                        <button 
                                            onClick={handleLogOut} 
                                            className="w-full flex justify-center items-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-colors"
                                        >
                                            <LogOut size={18} /> Logout
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