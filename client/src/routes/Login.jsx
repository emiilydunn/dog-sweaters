import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOutletContext } from 'react-router-dom';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginFail, setLoginFail] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();  // Access isLoggedIn and setIsLoggedIn from context
    const navigate = useNavigate(); // Navigate after successful login

    // form submit function
    async function formSubmit(data) {
        const apiHost = import.meta.env.VITE_API_HOST;
        const apiURL = `${apiHost}/api/users/login`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: 'include' // Include cookies in the request
        });

        if (response.ok) {
            setIsLoggedIn(true); // Set isLoggedIn to true
            navigate('/'); // Redirect to home page
        } else {
            setLoginFail(true); // Show login fail message
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="w-25">
                <h1 className="text-center">Login</h1>
                {loginFail && <p className="text-danger text-center">Incorrect username or password.</p>}
                <form onSubmit={handleSubmit(formSubmit)} method="post">
                    <div className="mb-3">
                        <label className="form-label">Email (username)</label>
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
                        <button type="submit" className="btn btn-primary btn-lg me-2 cart-btn">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
