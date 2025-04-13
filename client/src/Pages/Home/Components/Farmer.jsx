import React, { useEffect, useRef, useState } from 'react';

function Farmer() {
    const containerRef = useRef(null);
    const [visibleIndex, setVisibleIndex] = useState(-1); // Tracks which elements should be shown

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Trigger animations one by one
                        for (let i = 0; i <= 6; i++) {
                            setTimeout(() => {
                                setVisibleIndex(i);
                            }, i * 300); // stagger appearance
                        }
                        observer.disconnect(); // Run only once
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className='w-full flex flex-col mt-20 items-center justify-center'>
            <div className='w-[80vw] grid grid-cols-12 gap-3'>

                {/* Text Section */}
                <div className={`col-span-12 lg:col-span-3 h-full flex flex-col justify-center transition-opacity duration-700 ${visibleIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <h1 className='poppins text-3xl'>Njihuni me </h1>
                    <h1 className='moret text-6xl uppercase font-medium underline-wavy-green mt-2'>Fermeret</h1>
                    <p className='poppins mt-5 text-base'>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae consectetur facere quo perspiciatis, sint aspernatur.
                    </p>
                </div>

                {/* Images */}
                <div className={`col-span-12 lg:col-span-3 flex items-center justify-center transition-opacity duration-700 ${visibleIndex >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <img src="/images/farmers/farmer-1.jpg" className='w-full lg:h-[300px] object-cover' alt="" />
                </div>
                <div className={`col-span-12 lg:col-span-3 transition-opacity duration-700 ${visibleIndex >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <img src="/images/farmers/farmer-2.jpg" className='w-full lg:h-[400px] object-cover' alt="" />
                </div>
                <div className={`col-span-12 lg:col-span-3 flex items-center transition-opacity duration-700 ${visibleIndex >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <img src="/images/farmers/farmer-3.png" className='w-full lg:h-[300px] object-cover' alt="" />
                </div>
            </div>

            {/* Map Section */}
            <div className={`w-[80vw] mt-10 transition-opacity duration-700 ${visibleIndex >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`w-full flex justify-end transition-opacity duration-700 ${visibleIndex >= 5 ? 'opacity-100' : 'opacity-0'}`}>
                    <p className='moret text-4xl'>
                        Gjeni fermerin me te afert
                    </p>
                </div>
                <img
                    src="/images/map.webp"
                    className={`transition-opacity duration-700 w-full mt-5 ${visibleIndex >= 6 ? 'opacity-100' : 'opacity-0'}`}
                    alt=""
                />
            </div>
        </div>
    );
}

export default Farmer;
