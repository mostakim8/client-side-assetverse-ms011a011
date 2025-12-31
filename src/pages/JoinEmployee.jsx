import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Mail, Lock, User, Calendar, Image as ImageIcon, ArrowRight, UserPlus } from 'lucide-react';

const JoinEmployee = () => {
    const { createUser, updateUserProfile, setUser } = useContext(AuthContext);
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
            const result = await createUser(email, password);
            await updateUserProfile(name, photo);

            const currentUser = { ...result.user, displayName: name, photoURL: photo };

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

                if (setUser) setUser(currentUser);

                Swal.fire({
                    title: 'Welcome!',
                    text: 'Employee Account Created Successfully',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                
                // delay navigation to allow users to see the success message
                setTimeout(() => navigate('/'), 500);
            }
        } catch (error) {
            Swal.fire('Error!', error.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-16 px-4">
            <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-10 text-center text-white relative">
                    <div className="absolute top-4 right-6 opacity-10">
                        <UserPlus size={100} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Join <span className="text-blue-200">Team</span></h2>
                    <p className="mt-2 text-blue-100 font-bold uppercase text-[10px] tracking-[0.3em]">Employee Registration</p>
                </div>

                <div className="p-10">
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="relative group">
                            <User className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input type="text" name="name" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium transition-all" placeholder="Full Name" required />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input type="email" name="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium transition-all" placeholder="Email Address" required />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input type="password" name="password" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium transition-all" placeholder="Secure Password" required />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <Calendar className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                                <input type="date" name="dob" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold text-gray-500 uppercase" required />
                            </div>
                            <div className="relative group">
                                <ImageIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                                <input type="text" name="photo" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium transition-all" placeholder="Profile Photo URL" required />
                            </div>
                        </div>

                        <button className="w-full flex justify-center items-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 mt-4 group">
                            Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                    
                    <p className="mt-8 text-center text-sm font-medium text-gray-400">
                        Already part of a team? <Link to="/login" className="text-blue-600 font-black hover:underline uppercase text-xs tracking-wider">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JoinEmployee;