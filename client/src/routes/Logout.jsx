import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function Logout() {
    const [status, setStatus] = useState("Logging out...");
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();  // Access setIsLoggedIn from context

    useEffect(() => {
        async function logout() {
            const apiHost = import.meta.env.VITE_API_HOST;
            const apiURL = `${apiHost}/api/users/logout`;
            const response = await fetch(apiURL, {
                method: "GET",
                credentials: 'include'
            });

            if (response.ok) {
                setStatus('You have successfully logged out.');
                setIsLoggedIn(false);  // Set isLoggedIn to false on logout
            } else {
                setStatus('An error occurred. Please try again.');
            }
        }

        logout();
    }, [setIsLoggedIn]);

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center p-4">
                <h1 className="mb-4">Logout</h1>
                <p className="lead">{status}</p>
                <div className="d-flex justify-content-center">
                    <Link to="/" className="btn btn-primary btn-lg me-2 cart-btn">Home</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-lg go-back-btn">Login</Link>
                </div>
            </div>
        </div>
    );
}
