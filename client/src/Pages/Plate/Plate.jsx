import React, { useEffect, useState } from 'react';

function Plate() {
    const [showTomatoes, setShowTomatoes] = useState(false);
    const [showCheese, setShowCheese] = useState(false);
    const [showCucumber, setShowCucumber] = useState(false);
    const [showPear, setShowPear] = useState(false);
    const [rotateDeg, setRotateDeg] = useState(0);
    const [initialAnimationDone, setInitialAnimationDone] = useState(false);

    // Rotate plate on first load
    useEffect(() => {
        const timeout = setTimeout(() => {
            setRotateDeg(10);
            setInitialAnimationDone(true);
        }, 300); // small delay for smoothness
        return () => clearTimeout(timeout);
    }, []);

    // Animate ingredients one by one
    useEffect(() => {
        if (!initialAnimationDone) return;

        const animations = [];

        if (showTomatoes) {
            animations.push(() => setShowTomatoes(true));
        }
        if (showCheese) {
            animations.push(() => setShowCheese(true));
        }
        if (showCucumber) {
            animations.push(() => setShowCucumber(true));
        }
        if (showPear) {
            animations.push(() => setShowPear(true));
        }

        animations.forEach((fn, index) => {
            setTimeout(fn, index * 300); // delay between each item
        });
    }, [showTomatoes, showCheese, showCucumber, showPear, initialAnimationDone]);

    const handleClick = (setter) => {
        setter(true); // this will trigger useEffect which controls animation
        setRotateDeg(prev => prev + 10);
    };

    return (
        <div className='w-full mt-20 flex items-center justify-center'>
            <div className="w-[80vw] grid grid-cols-12">
                <div
                    className="col-span-12 order-2 md:order-1 md:col-span-6 relative transition-transform duration-500"
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

                <div className="col-span-12 order-1 md:order-2 md:col-span-6 flex flex-col items-center md:items-start justify-center">
                    <h1 className='moret text-4xl md:text-5xl'>Krijoni pjaten tuaj</h1>
                    <p className='poppins text-base md:text-xl text-center md:text-left text-gray-500 mt-5 md:ml-10'>
                        Shfrytezoni rastin dhe shikoni se si do dukej
                        pjata juaj e mbushur me ushqime bio!
                    </p>
                    <button
                        className="poppins text-base md:text-xl font-medium underline-wavy-green w-fit mt-5 md:ml-20"
                        onClick={() => handleClick(setShowTomatoes)}
                    >
                        Shtoni domate bio +
                    </button>
                    <button
                        className="poppins text-base md:text-xl font-medium underline-wavy-green w-fit mt-5 md:ml-20"
                        onClick={() => handleClick(setShowCheese)}
                    >
                        Shtoni djathin bio +
                    </button>
                    <button
                        className="poppins text-base md:text-xl font-medium underline-wavy-green w-fit mt-5 md:ml-10"
                        onClick={() => handleClick(setShowCucumber)}
                    >
                        Shtoni trangujt bio +
                    </button>
                    <button
                        className="poppins text-base md:text-xl font-medium underline-wavy-green w-fit mt-3"
                        onClick={() => handleClick(setShowPear)}
                    >
                        Shtoni dardha bio +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Plate;
