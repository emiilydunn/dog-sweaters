import { Link } from 'react-router-dom';

export default function Card(props) {
    // Formatting cost
    const formattedCost = Number(props.product.cost).toFixed(2);

    return (
        <div className="card border-dark mb-3 mt-3 p-2">
            <div className="card-body">
                <div className="d-flex align-items-center position-relative">
                    <img 
                        src={`${props.apiHost}/${props.product.image_filename}`} 
                        className="thumbnail" 
                        alt={props.product.name} 
                    />

                    <div className="item-info">
                        <h5 className="card-title">{props.product.name}</h5>
                        <p className="card-text">
                            ${formattedCost}<br />
                        </p>
                    </div>

                    {props.showLinks && (
                        <div className="position-absolute top-0 end-0">
                            <Link to={`/details/${props.product.product_id}`} className="icon">
                            <i className="bi bi-plus-square-fill fs-3"></i>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
