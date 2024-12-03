import { Link } from 'react-router-dom';

export default function Nav() {
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
                    <Link to="/" className="nav-link text-dark fs-5 mx-3">
                        Home
                    </Link>
                    <Link to="/login" className="nav-link text-dark fs-5 mx-3">
                        Login
                    </Link>
                    <Link to="/cart" className="nav-link text-dark fs-5 mx-3">
                        Cart
                    </Link>
                    <Link to="/logout" className="nav-link text-dark fs-5 mx-3">
                        Logout
                    </Link>
                </div>
            </div>
        </nav>
    );
}
