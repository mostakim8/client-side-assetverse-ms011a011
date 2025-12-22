import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'; 

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

        createUser(email, password)
            .then(result => {
                updateUserProfile(name, photo)
                    .then(() => {
                        const userInfo = {
                            name,
                            email,
                            dob,
                            photo,
                            role: 'employee',
                            status: 'pending'
                        };

                        fetch('http://localhost:5001/users', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(userInfo)
                        })
                        .then(res => res.json())
                        .then(async (data) => {
                            if (data.insertedId) {
                                
                                try {
                                    const resToken = await axios.post('http://localhost:5001/jwt', { email });
                                    if (resToken.data.token) {
                                        localStorage.setItem('access-token', resToken.data.token);
                                        console.log("Token generated and saved after registration");
                                    }
                                } catch (err) {
                                    console.error("Token error:", err);
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
                        })
                    })
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error'
                });
            });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-10">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
                <form onSubmit={handleRegister}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Join as Employee</h2>
                    <div className="form-control mb-4">
                        <label className="label"><span className="label-text font-bold">Full Name</span></label>
                        <input type="text" name="name" placeholder="Enter your name" className="input input-bordered focus:border-blue-500" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label"><span className="label-text font-bold">Email</span></label>
                        <input type="email" name="email" placeholder="Enter your email" className="input input-bordered focus:border-blue-500" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label"><span className="label-text font-bold">Password</span></label>
                        <input type="password" name="password" placeholder="Min 6 characters" className="input input-bordered focus:border-blue-500" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label"><span className="label-text font-bold">Date of Birth</span></label>
                        <input type="date" name="dob" className="input input-bordered" required />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label"><span className="label-text font-bold">Photo URL</span></label>
                        <input type="text" name="photo" placeholder="Image URL link" className="input input-bordered" required />
                    </div>
                    <button className="btn btn-primary w-full mt-4 bg-blue-600 border-none hover:bg-blue-700 font-bold">Register as Employee</button>
                </form>
            </div>
        </div>
    );
};

export default JoinEmployee;