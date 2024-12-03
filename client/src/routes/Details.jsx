import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function Details() {
    // Get product ID from URL
    const { productID } = useParams();
    const [product, setProduct] = useState({});
    const apiHost = import.meta.env.VITE_API_HOST;
    const apiURL = `${apiHost}/api/products/${productID}`;

    // Set up cookies
    const [cookies, setCookie] = useCookies(['cart']);

    //Formatting cost
    const formattedCost = Number(product.cost).toFixed(2);

    //Fetch product details
    useEffect(() => {
        async function fetchProductDetails() {
            const response = await fetch(apiURL);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            } else {
                setProduct(null);
            }
        }

        fetchProductDetails();
    }, [productID]);

    //Function to get current cart cookie value
    const getCartCookie = () => {
        return cookies.cart || ''; //Return an empty string if no cart exists
    };

    //Function to set the cart cookie value
    const setCartCookie = (value) => {
        setCookie('cart', value, { path: '/', maxAge: 7200 }); //Setting the cookie with updated value
    };

    //Function to update the cart cookie with the new product ID
    const updateCartCookie = (productId) => {
        const currentCart = getCartCookie();
        const updatedCart = currentCart ? `${currentCart},${productId}` : productId; //Append new product ID or set it if empty
        setCartCookie(updatedCart); //Update the cart cookie
    };

    //Function to handle "Add to Cart" button click
    const addToCart = () => {
        updateCartCookie(productID); 
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={`${apiHost}/${product.image_filename}`}
                        alt={product.name}
                        className="img-fluid rounded shadow-lg mb-4"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>

                <div className="col-md-6">
                    <h1 className="display-4 font-weight-bold">{product.name}</h1>
                    <h3 className="text-success">${formattedCost}</h3><br />
                    <p className="text-muted">Colour: {product.colour}</p>
                    <p className="text-muted">Type: {product.type}</p>
                    <p className="lead">{product.description}</p>

                    <div className="d-flex justify-content-start mt-4">
                        <Link to="/" className="btn btn-outline-secondary btn-lg go-back-btn">
                            Go Back
                        </Link>
                        <button onClick={addToCart} className="btn btn-primary btn-lg cart-btn">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
