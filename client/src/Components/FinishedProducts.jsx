import React from 'react';
import './Components.scss';
import { Link } from 'react-router-dom';

function FinishedProducts(props) {
  // Determine background color based on status
  const getBackgroundColor = () => {
    switch(props.status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 border'; // Yellowish background for pending
      case 'accepted':
        return 'bg-green-50 border-green-200 border'; // Greenish background for accepted
      case 'completed':
        return 'bg-gray-50'; // Gray for completed
      case 'rejected':
        return 'bg-red-50 border-red-200 border'; // Red for rejected
      case 'cancelled':
        return 'bg-gray-100'; // Dark gray for cancelled
      default:
        return 'bg-white'; // Default white background
    }
  };

  // Determine status text and color
  const getStatusDisplay = () => {
    let text, textColor;
    
    switch(props.status) {
      case 'pending':
        text = 'Në pritje';
        textColor = 'text-yellow-700';
        break;
      case 'accepted':
        text = 'Pranuar';
        textColor = 'text-green-700';
        break;
      case 'completed':
        text = 'Kompletuar';
        textColor = 'text-gray-700';
        break;
      case 'rejected':
        text = 'Refuzuar';
        textColor = 'text-red-700';
        break;
      case 'cancelled':
        text = 'Anuluar';
        textColor = 'text-gray-700';
        break;
      default:
        text = props.status || 'N/A';
        textColor = 'text-gray-700';
    }
    
    return (
      <span className={`text-xs font-medium ${textColor} py-1 px-2 rounded-full`}>
        {text}
      </span>
    );
  };

  // Get link to product details
  const getProductLink = () => {
    if (props.productId) {
      return `/detajet?id=${props.productId}`;
    }
    return '/produktet'; // Fallback to products page
  };

  return (
    <div className={`w-full p-3 rounded-md product-containers ${getBackgroundColor()}`}>
      <img 
        src={`/images/product-images/${props.image}`} 
        className='w-full object-cover h-[100px] rounded-md' 
        alt={props.product} 
      />
      
      <div className="flex justify-between items-center mt-3">
        <h1 className="poppins text-xl font-medium">{props.product}</h1>
        {getStatusDisplay()}
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-gray-700">
          Sasia: <span className="font-medium">{props.quantity}</span>
        </p>
        <p className="text-sm text-gray-700">
          Çmimi total: <span className="font-medium">${props.total}</span>
        </p>
      </div>
      
      <hr className="my-3" />
      
      <Link 
        to={getProductLink()} 
        className="mt-2 light-green-bg px-3 py-1 rounded-md inline-block"
      >
        <span className="poppins text-sm">Shiko</span>
      </Link>
    </div>
  );
}

export default FinishedProducts;