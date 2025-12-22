import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const JoinHR = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => { 
        e.preventDefault();
        const form = e.target;
        
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const companyName = form.companyName.value;
        const companyLogo = form.companyLogo.value;
        const packageLimit = parseInt(form.package.value);

        const hrInfo = {
            name,
            email,
            companyName,
            companyLogo,
            role: 'hr',
            packageLimit,
            status: 'active'
        };

        try {
            
            const result = await createUser(email, password);
            
            
            await updateUserProfile(name, companyLogo);

            
            const response = await fetch('http://localhost:5001/users', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    
                },
                body: JSON.stringify(hrInfo)
            });

            const data = await response.json();

            if (data.insertedId) {
                Swal.fire({
                    title: 'Success!',
                    text: 'HR Registered Successfully',
                    icon: 'success',
                    timer: 2000
                });
                navigate('/');
            } else {
                Swal.fire('Info', data.message || 'Registration failed', 'info');
            }

        } catch (error) {
            console.error("Registration Error:", error);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error'
            });
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-10">
            <div className="card w-full max-w-lg shadow-2xl bg-base-100 p-8">
                <form onSubmit={handleRegister}>
                    <h2 className="text-3xl font-bold text-center mb-6">Join as HR Manager</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Full Name</span></label>
                            <input type="text" name="name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" name="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" name="password" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Company Name</span></label>
                            <input type="text" name="companyName" className="input input-bordered" required />
                        </div>
                    </div>

                    <div className="form-control mt-4">
                        <label className="label"><span className="label-text">Company Logo (URL)</span></label>
                        <input type="text" name="companyLogo" className="input input-bordered" required />
                    </div>

                    <div className="form-control mt-4">
                        <label className="label"><span className="label-text font-bold">Select a Subscription Package</span></label>
                        <select name="package" className="select select-bordered w-full" required>
                            <option value="5">5 Members - $5</option>
                            <option value="10">10 Members - $8</option>
                            <option value="20">20 Members - $15</option>
                        </select>
                    </div>

                    <button className="btn btn-secondary w-full mt-6">Register & Pay</button>
                </form>
            </div>
        </div>
    );
};

export default JoinHR;