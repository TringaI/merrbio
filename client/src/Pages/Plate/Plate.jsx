import React, { useEffect, useState } from 'react';

function Plate() {
    const [rotateDeg, setRotateDeg] = useState(0);
    const [plateVisible, setPlateVisible] = useState(false);

    const [showTitle, setShowTitle] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showButtons, setShowButtons] = useState([false, false, false, false]);

    const [showTomatoes, setShowTomatoes] = useState(false);
    const [showCheese, setShowCheese] = useState(false);
    const [showCucumber, setShowCucumber] = useState(false);
    const [showPear, setShowPear] = useState(false);

    // Entry animation
    useEffect(() => {
        const startAnimation = async () => {
            setTimeout(() => {
                setPlateVisible(true);
                setRotateDeg(10);
            }, 200);

            setTimeout(() => setShowTitle(true), 1000);
            setTimeout(() => setShowDescription(true), 1300);
            setTimeout(() => setShowButtons([true, false, false, false]), 1600);
            setTimeout(() => setShowButtons([true, true, false, false]), 1900);
            setTimeout(() => setShowButtons([true, true, true, false]), 2200);
            setTimeout(() => setShowButtons([true, true, true, true]), 2500);
        };

        startAnimation();
    }, []);

    const handleClick = (setter) => {
        setter(true);
        setRotateDeg(prev => prev + 10);
    };

    return (
        <div className='w-full mt-20 flex items-center justify-center'>
            <div className="w-[80vw] grid grid-cols-12">
                {/* Plate Section */}
                <div
                    className="col-span-12 order-2 md:order-1 md:col-span-6 relative transition-all duration-700 ease-in-out"
                    style={{
                        transform: `rotate(${rotateDeg}deg)`,
                        opacity: plateVisible ? 1 : 0,
                        transition: 'transform 1s ease, opacity 1s ease'
                    }}
                >
                    <div className="relative w-full h-full">
                        <img src="/images/plate/plate.webp" alt="plate" />
                        <img
                            src="/images/plate/tomatoes.png"
                            className={`absolute top-[5%] w-[50%] left-[25%] transition-opacity duration-500 ${showTomatoes ? 'opacity-100' : 'opacity-0'}`}
                            alt="tomatoes"
                        />
                        <img
                            src="/images/plate/cheese.png"
                            className={`absolute top-[45%] w-[45%] left-[25%] transition-opacity duration-500 ${showCheese ? 'opacity-100' : 'opacity-0'}`}
                            alt="cheese"
                        />
                        <img
                            src="/images/plate/cucumber.png"
                            className={`absolute top-[30%] w-[45%] left-[48%] transition-opacity duration-500 ${showCucumber ? 'opacity-100' : 'opacity-0'}`}
                            alt="cucumber"
                        />
                        <img
                            src="/images/plate/pear.png"
                            className={`absolute top-[30%] w-[45%] left-[5%] transition-opacity duration-500 ${showPear ? 'opacity-100' : 'opacity-0'}`}
                            alt="pear"
                        />
                    </div>
                </div>

                {/* Text and Buttons */}
                <div className="col-span-12 order-1 md:order-2 md:col-span-6 flex flex-col items-center md:items-start justify-center">
                    <h1
                        className={`moret text-4xl md:text-5xl transition-opacity duration-500 ${showTitle ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Krijoni pjaten tuaj
                    </h1>
                    <p
                        className={`poppins text-base md:text-xl text-center md:text-left text-gray-500 mt-5 md:ml-10 transition-opacity duration-500 ${showDescription ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Shfrytezoni rastin dhe shikoni se si do dukej
                        pjata juaj e mbushur me ushqime bio!
                    </p>

                    {[
                        { label: 'Shtoni domate bio +', onClick: () => handleClick(setShowTomatoes), ml: 'ml-20' },
                        { label: 'Shtoni djathin bio +', onClick: () => handleClick(setShowCheese), ml: 'ml-20' },
                        { label: 'Shtoni trangujt bio +', onClick: () => handleClick(setShowCucumber), ml: 'ml-10' },
                        { label: 'Shtoni dardha bio +', onClick: () => handleClick(setShowPear), ml: '' }
                    ].map((btn, idx) => (
                        <button
                            key={idx}
                            onClick={btn.onClick}
                            className={`poppins text-base md:text-xl font-medium underline-wavy-green w-fit mt-5 md:${btn.ml} transition-opacity duration-500 ${showButtons[idx] ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Plate;
