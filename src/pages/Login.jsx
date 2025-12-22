import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const { signIn, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // লগইন করার পর ইউজারকে আগের পেজে বা হোম পেজে পাঠানোর জন্য
    const from = location.state?.from?.pathname || "/";

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        // ফায়ারবেস সাইন-ইন লজিক
        signIn(email, password)
            .then(result => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Login Successful',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid email or password',
                    icon: 'error'
                });
            });
    };

    // গুগল দিয়ে লগইন
    const handleGoogleLogin = () => {
        googleSignIn()
            .then(result => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Login Successful with Google',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                Swal.fire('Error', error.message, 'error');
            });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-10">
            <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
                <form onSubmit={handleLogin}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-primary">Login Now</h2>
                    
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Email Address</span>
                        </label>
                        <input type="email" name="email" placeholder="Enter your email" className="input input-bordered" required />
                    </div>

                    <div className="form-control mb-6">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" name="password" placeholder="Enter password" className="input input-bordered" required />
                    </div>

                    <button className="btn btn-primary w-full">Login</button>
                </form>

                <div className="divider text-gray-400">OR</div>

                <button onClick={handleGoogleLogin} className="btn btn-outline btn-secondary w-full">
                    Continue with Google
                </button>

                <p className="text-center mt-6 text-sm">
                    New to AssetVerse? <br />
                    <Link to="/join-employee" className="text-blue-600 hover:underline font-semibold">Join as Employee</Link> 
                    <span className="mx-2">|</span>
                    <Link to="/join-hr" className="text-purple-600 hover:underline font-semibold">Join as HR Manager</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;