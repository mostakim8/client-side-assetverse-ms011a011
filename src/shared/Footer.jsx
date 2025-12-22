import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {/* ব্র্যান্ড এবং লোগো */}
                <div>
                    <h2 className="text-xl font-bold text-blue-600 mb-4">AssetVerse</h2>
                    <p className="text-gray-500 text-sm">
                        একটি আধুনিক অ্যাসেট ম্যানেজমেন্ট সিস্টেম। আপনার কোম্পানির সম্পদ ট্র্যাকিং এখন আরও সহজ।
                    </p>
                </div>

                {/* কুইক লিঙ্কস */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-600 list-none p-0">
                        <li><Link to="/" className="hover:text-blue-600 no-underline">Home</Link></li>
                        <li><Link to="/join-employee" className="hover:text-blue-600 no-underline">Join Employee</Link></li>
                        <li><Link to="/join-hr" className="hover:text-blue-600 no-underline">Join HR Manager</Link></li>
                    </ul>
                </div>

                {/* কন্টাক্ট ইনফো */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-4">Contact</h3>
                    <p className="text-sm text-gray-500">Email: support@assetverse.com</p>
                    <p className="text-sm text-gray-500">Phone: +880 123 456 789</p>
                </div>
            </div>

            <div className="border-t border-gray-200 mt-10 pt-6 text-center">
                <p className="text-xs text-gray-400">
                    Copyright © 2025 - All rights reserved by AssetVerse
                </p>
            </div>
        </footer>
    );
};

export default Footer;