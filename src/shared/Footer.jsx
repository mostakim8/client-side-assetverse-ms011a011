import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Brand Section */}
                <div className="md:col-span-1 text-center md:text-left">
                    <h2 className="text-2xl font-black text-blue-600 tracking-tight mb-4">AssetVerse</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        A modern asset management solution. Streamlining resource tracking and team management for businesses worldwide.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4 mt-6">
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaFacebook size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaTwitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaLinkedin size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Company</h3>
                    <ul className="space-y-4 text-sm text-gray-600 list-none p-0">
                        <li><Link to="/" className="hover:text-blue-600 transition-all">Home</Link></li>
                        <li><Link to="/about" className="hover:text-blue-600 transition-all">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-600 transition-all">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Services/Joining */}
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Get Started</h3>
                    <ul className="space-y-4 text-sm text-gray-600 list-none p-0">
                        <li><Link to="/join-employee" className="hover:text-blue-600 transition-all">Join as Employee</Link></li>
                        <li><Link to="/join-hr" className="hover:text-blue-600 transition-all">Join as HR Manager</Link></li>
                        <li><Link to="/login" className="hover:text-blue-600 transition-all">Login to Account</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Support</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-3">
                            <FaEnvelope className="text-blue-600" /> support@assetverse.com
                        </p>
                        <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-3">
                            <FaPhoneAlt className="text-blue-600" /> +880 123 456 789
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-400 font-medium">
                    © 2025 AssetVerse. Built for better asset control.
                </p>
                <div className="flex gap-6">
                    <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;