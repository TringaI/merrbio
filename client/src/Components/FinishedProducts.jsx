import React, { useState } from 'react';
import './Components.scss';
import { Link } from 'react-router-dom';

function FinishedProducts(props) {
  const [showTrackingModal, setShowTrackingModal] = useState(false);

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

  // Open tracking modal
  const handleOpenTracking = (e) => {
    e.preventDefault();
    setShowTrackingModal(true);
  };

  return (
    <>
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
        
        {/* Only show Shiko button for accepted orders */}
        {props.status === 'accepted' && (
          <button 
            onClick={handleOpenTracking}
            className="mt-2 light-green-bg px-3 py-1 rounded-md inline-block"
          >
            <span className="poppins text-sm">Shiko</span>
          </button>
        )}
      </div>

      {/* Order Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="moret text-2xl">Gjurmimi i Porosisë</h2>
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="poppins text-xl font-semibold">{props.product}</h3>
              <p className="text-sm text-gray-600">ID: {props.productId || '123456789'}</p>
            </div>
            
            <div className="border-l-2 border-green-500 pl-4 py-2 ml-4">
              <div className="mb-6 relative">
                <div className="w-4 h-4 rounded-full bg-green-500 absolute -left-6 top-0"></div>
                <p className="poppins font-medium">Porosia juaj është pranuar</p>
                <p className="text-sm text-gray-500">12 Prill, 2025 - 15:30</p>
              </div>
              
              <div className="mb-6 relative">
                <div className="w-4 h-4 rounded-full bg-green-500 absolute -left-6 top-0"></div>
                <p className="poppins font-medium">Porosia juaj është në përgatitje</p>
                <p className="text-sm text-gray-500">12 Prill, 2025 - 16:45</p>
              </div>
              
              <div className="mb-6 relative">
                <div className="w-4 h-4 rounded-full bg-green-500 absolute -left-6 top-0"></div>
                <p className="poppins font-medium">Porosia juaj është nisur</p>
                <p className="text-sm text-gray-500">13 Prill, 2025 - 09:20</p>
              </div>
              
              <div className="mb-6 relative">
                <div className="w-4 h-4 rounded-full bg-gray-300 absolute -left-6 top-0"></div>
                <p className="poppins font-medium text-gray-500">Porosia juaj është në rrugë</p>
                <p className="text-sm text-gray-500">Koha e pritshme e mbërritjes: 13 Prill, 2025</p>
              </div>
              
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-gray-300 absolute -left-6 top-0"></div>
                <p className="poppins font-medium text-gray-500">Porosia juaj është dorëzuar</p>
                <p className="text-sm text-gray-500">-</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="poppins font-medium mb-2">Detajet e porosisë</h4>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm">Produkt: <span className="font-medium">{props.product}</span></p>
                <p className="text-sm">Sasia: <span className="font-medium">{props.quantity}</span></p>
                <p className="text-sm">Çmimi total: <span className="font-medium">${props.total}</span></p>
                <p className="text-sm">Metoda e pagesës: <span className="font-medium">Para në dorë</span></p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="px-4 py-2 border rounded"
              >
                Mbyll
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FinishedProducts;