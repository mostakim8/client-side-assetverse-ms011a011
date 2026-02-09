import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/UseAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhoneAlt, FaBuilding, FaUserShield } from 'react-icons/fa';

const Footer = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: userData = {} } = useQuery({
        queryKey: ['footer-user-info', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Brand Section */}
                <div className="md:col-span-1 text-center md:text-left">
                    <h2 className="text-2xl font-black text-blue-600 tracking-tight mb-4 uppercase">AssetVerse</h2>
                    <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                        A modern asset management solution. Streamlining resource tracking and team management for businesses worldwide.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4 mt-6">
                        <a href="#" className="text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors"><FaFacebook size={18} /></a>
                        <a href="#" className="text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors"><FaTwitter size={18} /></a>
                        <a href="#" className="text-gray-400 dark:text-slate-500 hover:text-blue-600 transition-colors"><FaLinkedin size={18} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-6 uppercase text-[10px] tracking-[0.2em]">Company</h3>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-slate-400 list-none p-0 font-medium">
                        <li><Link to="/" className="hover:text-blue-600 transition-all">Home</Link></li>
                        <li><Link to="#" className="hover:text-blue-600 transition-all">About Us</Link></li>
                        <li><Link to="#" className="hover:text-blue-600 transition-all">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Services/Joining - Dynamic Section */}
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-6 uppercase text-[10px] tracking-[0.2em]">
                        {user ? "My Identity" : "Get Started"}
                    </h3>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-slate-400 list-none p-0">
                        {user ? (
                            <>
                                <li className="flex items-center justify-center md:justify-start gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                        <FaUserShield size={14} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Role</p>
                                        <p className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-tighter">
                                            {userData?.role === 'hr' ? 'HR Manager' : 'Employee'}
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-center justify-center md:justify-start gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                                        <FaBuilding size={14} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Team</p>
                                        <p className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-tighter truncate max-w-[150px]">
                                            {userData?.companyName || "No Company"}
                                        </p>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/join-employee" className="hover:text-blue-600 transition-all">Join as Employee</Link></li>
                                <li><Link to="/join-hr" className="hover:text-blue-600 transition-all">Join as HR Manager</Link></li>
                                <li><Link to="/login" className="hover:text-blue-600 font-black uppercase text-[10px] tracking-widest">Login to Account</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-6 uppercase text-[10px] tracking-[0.2em]">Support</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
                            <FaEnvelope className="text-blue-600" /> support@assetverse.com
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
                            <FaPhoneAlt className="text-blue-600" /> +880 123 456 789
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 border-t border-gray-100 dark:border-slate-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                    © 2026 AssetVerse. {user ? `Active: ${user.displayName}` : "Better Asset Control."}
                </p>
                <div className="flex gap-6">
                    <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;