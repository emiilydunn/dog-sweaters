import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [signupFail, setSignupFail] = useState(false); // Add state for signup failure

    async function formSubmit(data) {
        const apiHost = import.meta.env.VITE_API_HOST;
        const apiURL = `${apiHost}/api/users/signup`;
    
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Make sure to specify the content type
            },
            body: JSON.stringify({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
            }),
        });
    
        if (response.ok) {
            window.location.href = '/login';
        } else {
            setSignupFail(true); // Set the failure state if signup fails
        }
    }
    
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="w-25">
                <h1 className="text-center">Sign Up</h1>
                {signupFail && <p className="text-danger text-center">Sign-up failed. Please try again.</p>}
                <form onSubmit={handleSubmit(formSubmit)} method="post">
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            {...register("first_name", { required: "First Name is required." })}
                            type="text"
                            className="form-control bg-light"
                        />
                        {errors.first_name && <span className="text-danger">{errors.first_name.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            {...register("last_name", { required: "Last Name is required." })}
                            type="text"
                            className="form-control bg-light"
                        />
                        {errors.last_name && <span className="text-danger">{errors.last_name.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            {...register("email", { required: "Email is required." })}
                            type="text"
                            className="form-control bg-light"
                        />
                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            {...register("password", { required: "Password is required." })}
                            type="password"
                            className="form-control bg-light"
                        />
                        {errors.password && <span className="text-danger">{errors.password.message}</span>}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary btn-lg me-2 cart-btn">Sign Up</button>
                        <Link to="/login" className="btn btn-outline-secondary btn-lg go-back-btn">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
