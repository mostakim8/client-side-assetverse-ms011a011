import { useState, useRef } from "react"; // useRef যুক্ত করা হয়েছে
import useAuth from "../hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { User, Mail, Building, ShieldCheck, Camera, Save, Loader2 } from "lucide-react";

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const imageInputRef = useRef(null); 

    const { data: dbUser, refetch, isLoading } = useQuery({
        queryKey: ['profile-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/profile/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    const [name, setName] = useState(user?.displayName);
    const [image, setImage] = useState(user?.photoURL);
    const [isUpdating, setIsUpdating] = useState(false);

    // when camera button is clicked
    const handleCameraClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.focus(); // focus input field
            imageInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); // scroll into view
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

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    text: 'Your changes have been saved successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
                refetch();
            }
        } catch (error) {
            Swal.fire('Error', 'Could not update profile.', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Account <span className="text-blue-600 italic">Settings</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Manage your public profile and personal information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Info Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="h-32 bg-linear-to-br from-blue-600 to-indigo-700 relative">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            </div>
                            <div className="px-6 pb-10 text-center">
                                <div className="relative -mt-16 mb-4 flex justify-center">
                                    <div className="p-2 bg-white rounded-4xl shadow-2xl">
                                        <img 
                                            src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                                            alt="Profile" 
                                            className="w-28 h-28 rounded-3xl object-cover"
                                        />
                                    </div>
                                    {/* camera button */}
                                    <button 
                                        type="button"
                                        onClick={handleCameraClick}
                                        className="absolute bottom-2 right-1/4 p-2 bg-blue-600 rounded-xl text-white shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform active:scale-95"
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>
                                
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user?.displayName}</h3>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-100 flex items-center gap-1">
                                        <ShieldCheck size={12} /> {dbUser?.role || 'User'}
                                    </span>
                                </div>

                                <div className="mt-8 space-y-4 text-left bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                    <div className="flex items-start gap-4 group">
                                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Mail size={16} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-bold text-slate-700 break-all">{user?.email}</p>
                                        </div>
                                    </div>

                                    {dbUser?.companyName && (
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Building size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</p>
                                                <p className="text-sm font-bold text-slate-700">{dbUser?.companyName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Update Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                                            <User size={14} className="text-blue-500" /> Full Name
                                        </label>
                                        <input 
                                            type="text" 
                                            defaultValue={user?.displayName} 
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                                            <Mail size={14} className="text-slate-400" /> Account Email
                                        </label>
                                        <input 
                                            type="email" 
                                            value={user?.email || ''} 
                                            readOnly 
                                            className="w-full px-6 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 font-bold cursor-not-allowed" 
                                        />
                                    </div>
                                </div>

                                
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                                        <Camera size={14} className="text-blue-500" /> Profile Picture URL
                                    </label>
                                    <input 
                                        ref={imageInputRef} 
                                        type="text" 
                                        defaultValue={user?.photoURL} 
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <button 
                                        disabled={isUpdating}
                                        type="submit" 
                                        className="w-full md:w-max flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-slate-200 disabled:opacity-50"
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