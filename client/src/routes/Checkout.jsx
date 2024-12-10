import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loginFail, setLoginFail] = useState(false);

    // Load the cart from localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    const handleCheckout = async (data) => {
        console.log("handleCheckout is called");
    
        const apiHost = import.meta.env.VITE_API_HOST;
        const apiURL = `${apiHost}/api/purchase`;
    
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                cart,
            }),
            credentials: 'include',
        });
    
        console.log("API response status:", response.status); // Log the status code of the response
    
        if (response.ok) {
            console.log("Navigating to confirmation...");
    
            // Clear the cart from localStorage
            localStorage.removeItem('cart');
    
            // Clear the cart from cookies by setting the expiration date to a past time
            document.cookie = "cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
            navigate('/confirmation');
        } else {
            console.log("API response failed:", response.status, await response.text()); // Log the failure response
            setLoginFail(true);
        }
    };
    
    

    if (!isLoggedIn) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="w-50 text-center">
                    <p>Please log in to complete your purchase.</p>
                    <Link to="/login" className="btn btn-outline-secondary btn-lg cart-btn">Login</Link>
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
                    {/* Street */}
                    <div className="mb-3">
                        <label className="form-label">Street</label>
                        <input
                            {...register('street', { required: 'Street is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.street && <span className="text-danger">{errors.street.message}</span>}
                    </div>

                    {/* City */}
                    <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                            {...register('city', { required: 'City is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.city && <span className="text-danger">{errors.city.message}</span>}
                    </div>

                    {/* Province */}
                    <div className="mb-3">
                        <label className="form-label">Province</label>
                        <input
                            {...register('province', { required: 'Province is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.province && <span className="text-danger">{errors.province.message}</span>}
                    </div>

                    {/* Country */}
                    <div className="mb-3">
                        <label className="form-label">Country</label>
                        <input
                            {...register('country', { required: 'Country is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.country && <span className="text-danger">{errors.country.message}</span>}
                    </div>

                    {/* Postal Code */}
                    <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input
                            {...register('postal_code', { required: 'Postal code is required' })}
                            type="text"
                            className="form-control"
                        />
                        {errors.postal_code && <span className="text-danger">{errors.postal_code.message}</span>}
                    </div>

                    {/* Credit Card */}
                    <div className="mb-3">
                        <label className="form-label">Credit Card</label>
                        <input
                            {...register('credit_card', { 
                                required: 'Credit card is required', 
                                pattern: {
                                    value: /^\d{16}$/, 
                                    message: 'Credit card must be 16 digits.'
                                }
                            })}
                            type="text"
                            className="form-control"
                        />
                        {errors.credit_card && <span className="text-danger">{errors.credit_card.message}</span>}
                    </div>

                    {/* Expiration Date */}
                    <div className="mb-3">
                        <label className="form-label">Expiration Date</label>
                        <input
                            {...register('credit_expire', {
                                required: 'Expiration date is required',
                                pattern: {
                                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                    message: 'Expiration date must be in MM/YY format.'
                                }
                            })}
                            type="text"
                            className="form-control"
                        />
                        {errors.credit_expire && <span className="text-danger">{errors.credit_expire.message}</span>}
                    </div>

                    {/* CVV */}
                    <div className="mb-3">
                        <label className="form-label">CVV</label>
                        <input
                            {...register('credit_cvv', {
                                required: 'CVV is required',
                                pattern: {
                                    value: /^\d{3}$/,
                                    message: 'CVV must be 3 digits.'
                                }
                            })}
                            type="text"
                            className="form-control"
                        />
                        {errors.credit_cvv && <span className="text-danger">{errors.credit_cvv.message}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 cart-btn">Complete Purchase</button>
                </form>
            </div>
        </div>
    );
}
