import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const JoinEmployee = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const dob = form.dob.value;
        const photo = form.photo.value;

        // ১. ফায়ারবেসে ইউজার তৈরি করা
        createUser(email, password)
            .then(result => {
                // ২. ইউজারের নাম এবং প্রোফাইল পিকচার আপডেট করা
                updateUserProfile(name, photo)
                    .then(() => {
                        const userInfo = {
                            name,
                            email,
                            dob,
                            photo,
                            role: 'employee',
                            status: 'pending' // শুরুতে স্ট্যাটাস পেন্ডিং থাকবে
                        };

                        // ৩. MongoDB-তে ইউজারের তথ্য পাঠানো
                        fetch('http://localhost:5001/users', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(userInfo)
                        })
                        .then(res => res.json())
                        .then(data => {
                           
                            
                            if (data.insertedId) {
                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Employee Registered Successfully',
                                    icon: 'success',
                                    confirmButtonText: 'Cool'
                                });
                                navigate('/');
                            }
                        })
                    })
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-10">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
                <form onSubmit={handleRegister}>
                    <h2 className="text-3xl font-bold text-center mb-6">Join as Employee</h2>
                    
                    {/* Full Name */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <input type="text" name="name" placeholder="Enter your name" className="input input-bordered" required />
                    </div>

                    {/* Email */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" name="email" placeholder="Enter your email" className="input input-bordered" required />
                    </div>

                    {/* Password */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" name="password" placeholder="Min 6 characters" className="input input-bordered" required />
                    </div>

                    {/* Date of Birth */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Date of Birth</span>
                        </label>
                        <input type="date" name="dob" className="input input-bordered" required />
                    </div>

                    {/* Photo URL */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Photo URL</span>
                        </label>
                        <input type="text" name="photo" placeholder="Image URL link" className="input input-bordered" required />
                    </div>

                    <button className="btn btn-primary w-full mt-4">Register as Employee</button>
                </form>
            </div>
        </div>
    );
};

export default JoinEmployee;