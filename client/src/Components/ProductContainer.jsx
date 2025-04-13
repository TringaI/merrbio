import React from 'react';
import './Components.scss';
import { Link } from 'react-router-dom';

function ProductContainer(props) {
  // Limit description to 100 characters
  const shortDescription = props.desc && props.desc.length > 100 
    ? props.desc.substring(0, 100) + '...' 
    : props.desc;

  return (
    <div className='w-full p-3 rounded-md product-containers bg-white'>
<<<<<<< Updated upstream
      <img 
        src={`/images/product-images/${props.image}`} 
        className='w-full object-cover h-[200px] rounded-md' 
        alt={props.product} 
      />
      
      <h1 className="poppins text-2xl font-medium mt-3">{props.product}</h1>
      <h2 className="poppins text-base mt-1 text-gray-500">{props.farmer}</h2>
      <p className="text-sm mt-3 poppins font-light text-gray-500">
        {shortDescription}
      </p>
      <p className="text-sm mt-3 poppins font-medium">
        {props.price}$
      </p>
      <hr className="my-3" />
      <Link 
        to={`/detajet?id=${props.id}`} 
        className="mt-5 light-green-bg px-3 py-2 rounded-md poppins inline-block"
      >
        Shiko Produktin
      </Link>
=======
        <img src={`/images/product-images/${props.image}`} className='w-full object-cover h-[150px] md:h-[200px] rounded-md' alt="" />
        
        <h1 className="poppins text-xl md:text-2xl font-medium mt-3 ">{props.product}</h1>
        <h2 className="poppins text-base mt-1 text-gray-500">{props.farmer}</h2>
        <p className="text-sm mt-3 poppins font-light text-gray-500">
            {props.desc}
        </p>
        <p className="text-sm mt-3 poppins font-light text-gray-500">
            {props.price}$
        </p>
        <hr />
        <button className="mt-5 light-green-bg px-3 py-2 rounded-md">
                <a href="/detajet" className="poppins">Shiko Produktin</a>
        </button>
>>>>>>> Stashed changes
    </div>
  );
}

export default ProductContainer;