import React, { useState } from 'react';

function Prep() {
    const [showTomatoes, setShowTomatoes] = useState(false);
    const [showCheese, setShowCheese] = useState(false);
    const [showCucumber, setShowCucumber] = useState(false);
    const [showPear, setShowPear] = useState(false);
    const [rotateDeg, setRotateDeg] = useState(0);

    const handleClick = (setter) => {
        setter(true);
        setRotateDeg(prev => prev + 10); // rotate +10 degrees on each click
    };

    return (
        <div className='w-full mt-20 flex items-center justify-center'>
            <div className="w-[80vw] grid grid-cols-12">
                <div
                    className="col-span-6 relative transition-transform duration-300"
                    style={{ transform: `rotate(${rotateDeg}deg)` }}
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

                <div className="col-span-6 flex flex-col justify-center">
                    <h1 className='moret text-5xl'>Krijoni  pjaten tuaj</h1>
                    <p className='poppins text-xl  text-gray-500 mt-5 ml-10'>
                        Shfrytezoni rastin dhe shikoni se si do dukej 
                        pjata juaj e mbushur me ushqime bio!
                    </p>
                    <button
                        className="poppins text-xl font-medium underline-wavy-green w-fit mt-5 ml-20"
                        onClick={() => handleClick(setShowTomatoes)}
                    >
                        Shtoni domate bio +
                    </button>
                    <button
                        className="poppins text-xl font-medium underline-wavy-green w-fit mt-5 ml-20"
                        onClick={() => handleClick(setShowCheese)}
                    >
                        Shtoni djathin bio +
                    </button>
                    <button
                        className="poppins text-xl font-medium underline-wavy-green w-fit mt-5 ml-10"
                        onClick={() => handleClick(setShowCucumber)}
                    >
                        Shtoni trangujt bio +
                    </button>
                    <button
                        className="poppins text-xl font-medium underline-wavy-green w-fit mt-3"
                        onClick={() => handleClick(setShowPear)}
                    >
                        Shtoni dardha bio +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Prep;
