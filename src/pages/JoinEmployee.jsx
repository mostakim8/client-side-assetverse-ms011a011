import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'; 

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
            const result = await createUser(email, password);
            await updateUserProfile(name, photo);

            const userInfo = {
                name,
                email,
                dob,
                photo,
                role: 'employee',
                status: 'pending'
            };

            // URL ঠিক করা হয়েছে
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);
            
            if (res.data.insertedId) {
                // JWT Token জেনারেশন
                const resToken = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email });
                if (resToken.data.token) {
                    localStorage.setItem('access-token', resToken.data.token);
                }

                Swal.fire({
                    title: 'Success!',
                    text: 'Employee Registered Successfully',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate('/');
            }
        } catch (error) {
            Swal.fire('Error!', error.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-10">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
                <form onSubmit={handleRegister}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Join as Employee</h2>
                    <div className="form-control mb-4">
                        <label className="label-text font-bold mb-1">Full Name</label>
                        <input type="text" name="name" className="input input-bordered" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label-text font-bold mb-1">Email</label>
                        <input type="email" name="email" className="input input-bordered" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label-text font-bold mb-1">Password</label>
                        <input type="password" name="password" className="input input-bordered" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label-text font-bold mb-1">Date of Birth</label>
                        <input type="date" name="dob" className="input input-bordered" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label-text font-bold mb-1">Photo URL</label>
                        <input type="text" name="photo" className="input input-bordered" required />
                    </div>
                    <button className="btn btn-primary w-full mt-4 bg-blue-600 border-none">Register as Employee</button>
                </form>
            </div>
        </div>
    );
};

export default JoinEmployee;