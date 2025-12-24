import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Mail, Lock, User, Calendar, Image as ImageIcon, ArrowRight } from 'lucide-react';

const JoinEmployee = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const dob = form.dob.value;
        const photo = form.photo.value;

        try {
            await createUser(email, password);
            await updateUserProfile(name, photo);

            const userInfo = {
                name,
                email,
                dob,
                photo,
                role: 'employee',
                status: 'pending'
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);
            
            if (res.data.insertedId || res.data.message === 'user already exists') {
                const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email });
                if (resToken.data.token) {
                    localStorage.setItem('access-token', resToken.data.token);
                }

                Swal.fire({
                    title: 'Welcome!',
                    text: 'Your Employee Account is Ready',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            }
        } catch (error) {
            Swal.fire('Error!', error.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-8 text-center text-white">
                    <h2 className="text-3xl font-extrabold tracking-tight">Join AssetVerse</h2>
                    <p className="mt-2 text-blue-100 opacity-90">Register as an Employee to get started</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <User size={18} />
                                </span>
                                <input type="text" name="name" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="John Doe" required />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <Mail size={18} />
                                </span>
                                <input type="email" name="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="example@mail.com" required />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Secure Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input type="password" name="password" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="••••••••" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* DOB Field */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Birth Date</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <Calendar size={18} />
                                    </span>
                                    <input type="date" name="dob" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                                </div>
                            </div>

                            {/* Photo URL */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Profile URL</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <ImageIcon size={18} />
                                    </span>
                                    <input type="text" name="photo" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Image Link" required />
                                </div>
                            </div>
                        </div>

                        <button className="group relative w-full flex justify-center py-3 px-4 border border-transparent font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-6 shadow-lg shadow-blue-200">
                            Create Account
                            <span className="ml-2">
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </form>
                    
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JoinEmployee;