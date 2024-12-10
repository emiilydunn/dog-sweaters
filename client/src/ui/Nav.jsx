import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function Nav({ isLoggedIn }) {
    const [cartItemCount, setCartItemCount] = useState(0);
    const [cookies] = useCookies(['cart']); // Get the cart cookie

    // Update cart item count whenever the cart cookie changes
    useEffect(() => {
        if (cookies.cart) {
            // Ensure cookies.cart is a string before splitting
            const cartString = cookies.cart;
            const cartArray = typeof cartString === 'string' ? cartString.split(',').filter(Boolean) : []; // Convert cart string to array
            const totalItems = cartArray.length; // Count total items
            setCartItemCount(totalItems); // Set the cart item count state
        } else {
            setCartItemCount(0); // No cart data
        }
    }, [cookies.cart]); // Re-run the effect if the cart cookie changes

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3">
            <div className="container">
                <div className="d-flex align-items-center">
                    <img
                        src='./icons8-dog-100.png'
                        alt="Dog Sweaters Logo"
                        className="me-2 rounded-circle"
                        style={{ width: '50px', height: '50px' }}
                    />
                    <span className="navbar-brand fs-1 fw-bold text-dark">Dog Sweaters</span>
                </div>

                <div className="ms-auto d-flex align-items-center">
                    <Link to="/" className="nav-link text-dark fs-5 mx-3">Home</Link>
                    {isLoggedIn ? (
                        <Link to="/logout" className="nav-link text-dark fs-5 mx-3">Logout</Link>
                    ) : (
                        <Link to="/login" className="nav-link text-dark fs-5 mx-3">Login</Link>
                    )}
                    <Link to="/cart" className="nav-link text-dark fs-5 mx-3 position-relative">
                        <i className="bi bi-cart" style={{ width: '24px', height: '24px' }}></i>
                        {/* Display cart count inside the cart icon */}
                        {cartItemCount > 0 && (
                            <span className="badge bg-danger rounded-circle" 
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    fontSize: '12px',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
