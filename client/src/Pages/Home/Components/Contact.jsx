import React, { useEffect, useRef, useState } from 'react';

function Contact() {
  const contactRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            for (let i = 0; i <= 6; i++) {
              setTimeout(() => {
                setVisibleIndex(i);
              }, i * 250); // Adjust delay for staggered animation
            }
            observer.disconnect(); // Run once
          }
        });
      },
      { threshold: 0.2 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current);
      }
    };
  }, []);

  return (
    <div ref={contactRef} className='w-full flex items-center justify-center mt-20'>
      <div className='w-[80vw] grid grid-cols-12'>
        
        {/* Heading */}
        <div className={`col-span-12 md:col-span-6 flex justify-center items-center transition-opacity duration-700 ${visibleIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-7xl moret underline-wavy-green">Na Kontaktoni</h1>
        </div>

        {/* Form */}
        <div className="col-span-12 md:col-span-6 flex flex-col mt-10 md:mt-0">
          <input
            className={`form-inputs px-4 py-3 poppins transition-opacity duration-700 ${visibleIndex >= 1 ? 'opacity-100' : 'opacity-0'}`}
            type="text"
            placeholder='Emri...'
          />
          <input
            className={`form-inputs px-4 py-3 mt-5 poppins transition-opacity duration-700 ${visibleIndex >= 2 ? 'opacity-100' : 'opacity-0'}`}
            type="text"
            placeholder='Numri Kontaktues...'
          />
          <input
            className={`form-inputs px-4 py-3 mt-5 poppins transition-opacity duration-700 ${visibleIndex >= 3 ? 'opacity-100' : 'opacity-0'}`}
            type="text"
            placeholder='Email...'
          />
          <input
            className={`form-inputs px-4 py-3 mt-5 poppins transition-opacity duration-700 ${visibleIndex >= 4 ? 'opacity-100' : 'opacity-0'}`}
            type="text"
            placeholder='Message...'
          />
          <button
            className={`dark-green-bg text-white py-2 px-4 poppins w-fit mt-5 transition-opacity duration-700 ${visibleIndex >= 5 ? 'opacity-100' : 'opacity-0'}`}
          >
            Dergo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
