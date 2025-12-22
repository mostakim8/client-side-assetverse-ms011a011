import { useState } from "react";
import useAuth from "../hooks/UseAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import UseRole from "../hooks/UseRole";

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [role] = UseRole(); 
    const [loading, setLoading] = useState(false);

   
    const { data: userData, refetch } = useQuery({
        queryKey: ['user-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/users/${user?.email}`);
            return res.data;
        }
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const name = form.name.value;
        const photo = form.photo.value;

        try {
            await updateUserProfile(name, photo);
            const res = await axios.patch(`http://localhost:5001/users/update/${user?.email}`, {
                name: name,
                image: photo
            });

            if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
                Swal.fire("Success", "Profile updated successfully!", "success");
                refetch(); 
            }
        } catch (error) {
            Swal.fire("Error", "Failed to update profile", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50 flex flex-col md:flex-row gap-8 justify-center">
            
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border p-8">
                <h2 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4">My Profile</h2>
                
                <div className="flex flex-col items-center mb-10">
                    <div className="avatar mb-4">
                        <div className="w-32 h-32 rounded-full ring ring-blue-600 ring-offset-base-100 ring-offset-2">
                            <img src={user?.photoURL || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Profile" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{user?.displayName}</h3>
                    <p className="text-gray-500">{user?.email}</p>
                    <span className="badge badge-primary mt-2 uppercase font-bold">{role}</span>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Full Name</label>
                        <input type="text" name="name" defaultValue={user?.displayName} className="input input-bordered focus:border-blue-600" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Photo URL</label>
                        <input type="text" name="photo" defaultValue={user?.photoURL} className="input input-bordered focus:border-blue-600" required />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary w-full bg-blue-600 border-none text-white hover:bg-blue-700 font-bold">
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>

            
            {role === 'hr' && (
                <div className="max-w-xs w-full bg-white rounded-3xl shadow-sm border p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-800 mb-4 uppercase">Subscription Info</h3>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                            <p className="text-sm text-blue-600 font-bold mb-1">Current Limit</p>
                            <h4 className="text-4xl font-black text-blue-800">{userData?.memberLimit || 0}</h4>
                            <p className="text-xs text-blue-500 mt-2">Team Members</p>
                        </div>
                        <ul className="mt-6 space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-2">✅ Active Subscription</li>
                            <li className="flex items-center gap-2">✅ Full Inventory Access</li>
                        </ul>
                    </div>
                    
                    <div className="mt-8">
                        <Link to="/upgrade-package" className="btn btn-outline btn-primary w-full rounded-xl font-bold">
                            Upgrade Package
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;