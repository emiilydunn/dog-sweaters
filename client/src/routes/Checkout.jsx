import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useOutletContext(); // Destructure the context
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loginFail, setLoginFail] = useState(false);

    // Load the cart from localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    // Check if user is logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            const apiHost = import.meta.env.VITE_API_HOST;
            const apiURL = `${apiHost}/api/users/getsession`;

            const response = await fetch(apiURL, {
                method: "GET",
                credentials: 'include', // Ensure cookies are sent with the request
            });

            if (response.ok) {
                setIsLoggedIn(true); // Set logged-in status
            } else {
                setIsLoggedIn(false); // Set logged-out status
            }
        };

        checkLoginStatus();
    }, [setIsLoggedIn]);

    // Handle form submission for checkout
    const handleCheckout = async (data) => {
        const apiHost = import.meta.env.VITE_API_HOST;
        const apiURL = `${apiHost}/api/purchase`;

        // Include cart data along with form data
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                cart,
            }),
            credentials: 'include', // Include cookies for session validation
        });

        if (response.ok) {
            window.location.href = '/confirmation';
            localStorage.removeItem('cart'); // Clear cart from localStorage after successful purchase
            navigate('/confirmation'); // Redirect to confirmation page
        } else {
            alert('Error processing the purchase');
        }
    };

    // If user is not logged in, show the login link
    if (!isLoggedIn) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="w-50 text-center">
                    <p>Please log in to complete your purchase.</p>
                    <div className="d-flex justify-content-center">
                    <Link to="/login" className="btn btn-outline-secondary btn-lg cart-btn">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="w-50">
                <h2>Checkout</h2>
                {loginFail && (
                    <div className="alert alert-danger" role="alert">
                        Checkout failed. Please try again.
                    </div>
                )}
                <form onSubmit={handleSubmit(handleCheckout)}>
                    <div className="mb-3">
                        <label className="form-label">Street</label>
                        <input
                            {...register('street', { required: 'Street is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.street && <span className="text-danger">{errors.street.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                            {...register('city', { required: 'City is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.city && <span className="text-danger">{errors.city.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Province</label>
                        <input
                            {...register('province', { required: 'Province is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.province && <span className="text-danger">{errors.province.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Country</label>
                        <input
                            {...register('country', { required: 'Country is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.country && <span className="text-danger">{errors.country.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input
                            {...register('postal_code', { required: 'Postal code is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.postal_code && <span className="text-danger">{errors.postal_code.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Credit Card</label>
                        <input
                            {...register('credit_card', { required: 'Credit card is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.credit_card && <span className="text-danger">{errors.credit_card.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Expiration Date</label>
                        <input
                            {...register('credit_expire', { required: 'Expiration date is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.credit_expire && <span className="text-danger">{errors.credit_expire.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">CVV</label>
                        <input
                            {...register('credit_cvv', { required: 'CVV is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.credit_cvv && <span className="text-danger">{errors.credit_cvv.message}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100">Complete Purchase</button>
                </form>
            </div>
        </div>
    );
}
