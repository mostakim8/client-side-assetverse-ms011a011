import { useState } from "react";
import useAuth from "../hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    
    const { data: dbUser, refetch } = useQuery({
        queryKey: ['profile-data', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/users/${user?.email}`);
            return res.data;
        }
    });

    const [name, setName] = useState(user?.displayName);
    const [image, setImage] = useState(user?.photoURL);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(name, image);

            const res = await axios.patch(`http://localhost:5001/users/update/${user?.email}`, {
                name: name,
                image: image
            });

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    showConfirmButton: false,
                    timer: 1500
                });
                refetch();
            }
        } catch (error) {
            Swal.fire('Error', 'Could not update profile', 'error');
        }
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50 flex justify-center">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border">
                
                {/* Header/Affiliation Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <img 
                            src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black">{user?.displayName}</h2>
                            <p className="text-blue-100 font-medium">Role: {dbUser?.role?.toUpperCase()}</p>
                            
                            {/* Company Affiliation Display */}
                            {dbUser?.companyName ? (
                                <div className="mt-2 flex items-center gap-2 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <img src={dbUser?.companyLogo} className="w-6 h-6 rounded-full" alt="" />
                                    <span className="text-sm font-bold">Works at: {dbUser?.companyName}</span>
                                </div>
                            ) : (
                                <p className="mt-2 text-xs italic text-blue-200">Not affiliated with any company yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Full Name</label>
                            <input 
                                type="text" 
                                defaultValue={user?.displayName} 
                                onChange={(e) => setName(e.target.value)}
                                className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>

                        {/* Email Read Only */}
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Email (Read-only)</label>
                            <input 
                                type="email" 
                                value={user?.email} 
                                readOnly 
                                className="input input-bordered w-full rounded-xl bg-gray-100 cursor-not-allowed" 
                            />
                        </div>

                        {/* Image URL Input */}
                        <div className="form-control md:col-span-2">
                            <label className="label font-bold text-gray-700">Profile Image URL</label>
                            <input 
                                type="text" 
                                defaultValue={user?.photoURL} 
                                onChange={(e) => setImage(e.target.value)}
                                className="input input-bordered w-full rounded-xl" 
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button type="submit" className="btn btn-primary w-full bg-blue-600 border-none text-white rounded-xl h-12 shadow-lg hover:bg-blue-700 transition-all">
                                Update Information
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;