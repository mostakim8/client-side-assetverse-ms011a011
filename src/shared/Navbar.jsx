import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/UseAuth";
import UseRole from "../hooks/UseRole";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [role] = UseRole();
    const [isOpen, setIsOpen] = useState(false);

    // স্টাইল ভেরিয়েবল
    const linkStyle = "px-4 py-2 hover:text-blue-600 transition-all duration-200 font-semibold no-underline text-gray-700 text-sm block lg:inline-block";
    const activeStyle = "px-4 py-2 text-blue-600 font-bold border-b-2 border-blue-600 no-underline text-sm block lg:inline-block";

    // মেনু আইটেমগুলো (রোল অনুযায়ী কন্ডিশনাল)
    const menuItems = (
        <>
            {/* Home/Dashboard Link */}
            <li onClick={() => setIsOpen(false)}>
                <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : linkStyle}>
                    {user && role === 'hr' ? "Dashboard" : "Home"}
                </NavLink>
            </li>

            {/* গেস্ট ইউজারদের জন্য (লগইন না থাকলে) */}
            {!user && (
                <>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/join-employee" className={linkStyle}>Join as Employee</NavLink></li>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/join-hr" className={linkStyle}>Join as HR Manager</NavLink></li>
                </>
            )}

            {/* HR Manager-এর জন্য অপশন */}
            {user && role === 'hr' && (
                <>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/asset-list" className={linkStyle}>Asset List</NavLink></li>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/add-asset" className={linkStyle}>Add Asset</NavLink></li>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/all-requests" className={linkStyle}>All Requests</NavLink></li>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/my-employee-list" className={linkStyle}>My Employee List</NavLink></li>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/add-employee" className={linkStyle}>Add Employee</NavLink></li>
                </>
            )}

            {/* Employee-এর জন্য অপশন */}
            {user && role === 'employee' && (
                <>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/my-assets" className={linkStyle}>My Assets</NavLink></li>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/my-team" className={linkStyle}>My Team</NavLink></li>
                    <li onClick={() => setIsOpen(false)}><NavLink to="/request-asset" className={linkStyle}>Request Asset</NavLink></li>
                </>
            )}

            {/* সবার জন্য প্রোফাইল লিঙ্ক (লগইন থাকলে) */}
            {user && <li onClick={() => setIsOpen(false)}><NavLink to="/profile" className={linkStyle}>Profile</NavLink></li>}
        </>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 flex items-center shadow-sm">
            <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between relative">
                
                {/* লোগো এবং মোবাইল মেনু বাটন */}
                <div className="flex items-center">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md mr-2 focus:outline-none"
                    >
                        {isOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        )}
                    </button>
                    <Link to="/" className="text-xl md:text-2xl font-black text-blue-600 no-underline tracking-tighter">
                        AssetVerse
                    </Link>
                </div>

                {/* ডেক্সটপ মেনু */}
                <div className="hidden lg:flex items-center">
                    <ul className="flex items-center space-x-1 list-none m-0 p-0">
                        {menuItems}
                    </ul>
                </div>

                {/* মোবাইল ড্রপডাউন মেনু */}
                {isOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white shadow-xl border-b border-gray-100 lg:hidden animate-in slide-in-from-top duration-300 z-40">
                        <ul className="flex flex-col p-4 space-y-2 list-none m-0">
                            {menuItems}
                            {user && (
                                <li className="pt-2">
                                    <button onClick={() => { logOut(); setIsOpen(false); }} className="w-full btn btn-error btn-sm text-white">Logout</button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* প্রোফাইল ও লগআউট সেকশন */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right leading-none">
                                <p className="text-[11px] font-bold text-gray-800 m-0">{user?.displayName}</p>
                                <span className="text-[9px] uppercase text-blue-500 font-black">{role || 'User'}</span>
                            </div>
                            <img 
                                className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" 
                                src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                                alt="profile" 
                            />
                            <button 
                                onClick={() => logOut()} 
                                className="hidden lg:block bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold no-underline hover:bg-blue-700">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;