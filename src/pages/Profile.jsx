import { useState } from "react";
import useAuth from "../hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: dbUser, refetch } = useQuery({
        queryKey: ['profile-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    const [name, setName] = useState(user?.displayName);
    const [image, setImage] = useState(user?.photoURL);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(name, image);
            const res = await axiosSecure.patch(`/users/update/${user?.email}`, {
                name: name,
                image: image
            });

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile Information Updated Successfully',
                    showConfirmButton: false,
                    timer: 2000
                });
                refetch();
            }
        } catch (error) {
            Swal.fire('Error', 'Could not update profile.', 'error');
        }
    };

    return (
        <div className="p-6 pt-28 min-h-screen bg-slate-50 flex justify-center items-start">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Identity Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="h-24 bg-linear-to-r from-blue-600 to-indigo-600"></div>
                        <div className="px-6 pb-8">
                            <div className="relative -mt-12 flex justify-center">
                                <img 
                                    src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                                    alt="Profile" 
                                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover bg-white"
                                />
                            </div>
                            <div className="text-center mt-4">
                                <h2 className="text-xl font-bold text-slate-800">{user?.displayName}</h2>
                                <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mt-2">
                                    {dbUser?.role?.toUpperCase() || 'USER'}
                                </p>
                            </div>
                            
                            <div className="mt-6 space-y-3 border-t pt-6">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <span className="text-lg">📧</span>
                                    <span className="text-sm truncate font-medium">{user?.email}</span>
                                </div>
                                {dbUser?.companyName && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="text-lg">🏢</span>
                                        <span className="text-sm font-medium">{dbUser?.companyName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Settings Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-800">Edit Profile</h3>
                            <p className="text-slate-500 text-sm mt-1">Update your personal information and profile picture.</p>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue={user?.displayName} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={user?.email || ''} 
                                        readOnly 
                                        className="input input-bordered w-full rounded-xl bg-slate-100 cursor-not-allowed text-slate-500 font-medium" 
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Image URL</label>
                                <input 
                                    type="text" 
                                    defaultValue={user?.photoURL} 
                                    onChange={(e) => setImage(e.target.value)}
                                    className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium" 
                                />
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="btn btn-primary w-full md:w-max px-10 bg-blue-600 hover:bg-blue-700 border-none text-white rounded-xl shadow-lg shadow-blue-200 normal-case font-bold">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;