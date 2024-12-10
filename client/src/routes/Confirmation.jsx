import { Link } from "react-router-dom";

export default function Confirmation() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <h1>Your purchase is complete!</h1>
                <Link to="/" className="btn btn-outline-secondary btn-lg cart-btn">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
