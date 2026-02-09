import { useState, useRef, useContext } from "react";
import useAuth from "../hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { ThemeContext } from "../hooks/ThemeContext";
import Swal from "sweetalert2";
import { User, Mail, Building, ShieldCheck, Camera, Save, Loader2 } from "lucide-react";

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isDark } = useContext(ThemeContext);
    const imageInputRef = useRef(null); 

    const { data: dbUser, refetch, isLoading } = useQuery({
        queryKey: ['profile-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    const [name, setName] = useState(user?.displayName);
    const [image, setImage] = useState(user?.photoURL);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleCameraClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.focus();
            imageInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await updateUserProfile(name, image);
            const res = await axiosSecure.patch(`/users/update/${user?.email}`, {
                name: name,
                image: image
            });

            if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    text: 'Your changes have been saved successfully.',
                    showConfirmButton: false,
                    timer: 1500,
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f8fafc' : '#1e293b',
                });
                refetch();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not update profile.',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#f8fafc' : '#1e293b',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 uppercase">
                        Account <span className="text-blue-600 italic">Settings</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Profile and Personal Information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Info Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="h-32 bg-linear-to-br from-blue-600 to-indigo-700 relative">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            </div>
                            <div className="px-6 pb-10 text-center">
                                <div className="relative -mt-16 mb-4 flex justify-center">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-4xl shadow-2xl">
                                        <img 
                                            src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                                            alt="Profile" 
                                            className="w-28 h-28 rounded-3xl object-cover border-4 border-slate-50 dark:border-slate-700"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleCameraClick}
                                        className="absolute bottom-2 right-1/4 p-2 bg-blue-600 rounded-xl text-white shadow-lg border-2 border-white dark:border-slate-800 cursor-pointer hover:scale-110 transition-transform active:scale-95"
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>
                                
                                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">{user?.displayName}</h3>
                                
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border flex items-center gap-1 shadow-sm ${
                                        dbUser?.role === 'hr' 
                                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' 
                                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
                                    }`}>
                                        <ShieldCheck size={12} /> {dbUser?.role || 'User'}
                                    </span>
                                </div>

                                <div className="mt-8 space-y-4 text-left bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-start gap-4 group">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Mail size={16} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 break-all">{user?.email}</p>
                                        </div>
                                    </div>

                                    {(dbUser?.companyName || dbUser?.role === 'hr') && (
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Building size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Organization</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{dbUser?.companyName || 'Not Assigned'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Update Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12">
                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1">
                                            <User size={14} className="text-blue-500" /> Full Name
                                        </label>
                                        <input 
                                            type="text" 
                                            defaultValue={user?.displayName} 
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1">
                                            <Mail size={14} className="text-slate-400 dark:text-slate-600" /> Account Email
                                        </label>
                                        <input 
                                            type="email" 
                                            value={user?.email || ''} 
                                            readOnly 
                                            className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-600 font-bold cursor-not-allowed" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1">
                                        <Camera size={14} className="text-blue-500" /> Profile Picture URL
                                    </label>
                                    <input 
                                        ref={imageInputRef} 
                                        type="text" 
                                        defaultValue={user?.photoURL} 
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://example.com/image.jpg/png"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button 
                                        disabled={isUpdating}
                                        type="submit" 
                                        className="w-full md:w-max flex items-center justify-center gap-3 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-slate-200 dark:shadow-none disabled:opacity-50 active:scale-95"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} /> Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;