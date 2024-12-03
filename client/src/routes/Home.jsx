import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '../ui/Card';

export default function Home(){
    const [product, setProduct] = useState([]);
    const apiHost = import.meta.env.VITE_API_HOST;
    const apiURL = `${apiHost}/api/products/all`;

    //Get products from API
    useEffect(() => {
        async function fetchData(){
            const response = await fetch(apiURL);

            if (response.ok) {
                const data = await response.json();
                if (!ignore) {
                    setProduct(data);
                }
            } else {
                setProduct(null);
            }
        }

        let ignore = false;
        fetchData();
        return () => {
            ignore = true;
        }
    }, []);

    return(
        <div className="background">
        <h1 className="text-center mb-4 fs-2 fw-bold pt-5">All Products</h1>
      
        <div className="container">
            <div className="row justify-content-center">
                {product.length > 0 ? (
                    product.map(product => (
                        <div className="col-md-6 col-lg-6 mb-3" key={product.product_id}>
                            <Card product={product} apiHost={apiHost} showLinks={true} />
                        </div>
                    ))
                ) : (
                    <p>No items found.</p>
                )}
            </div>
        </div>
    </div>
);
}
  


