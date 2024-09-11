import React, { useState, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../utils/ErrorBoundary';
import SmoothDraggableLogo from '../animations/SmoothDraggableLogo';
import { useIsPhone } from '../../utils/useMediaQuery';
import AnimatedGridPattern from '../animations/AnimatedGridPattern'; // Import the new component
import { cn } from "../../utils/cn";

const Home = () => {
    const navigate = useNavigate();
    const [hasInput, setHasInput] = useState(false);
    const constraintsRef = useRef(null);
    const isPhone = useIsPhone();

    const handleScavenge = () => {
        const tokenAddress = document.getElementById('tokenAddress').value.trim();
        tokenAddress ? navigate(`/tokenpage/${tokenAddress}`) : alert('Please enter a token address.');
    };

    const handleClearSearch = () => {
        document.getElementById('tokenAddress').value = '';
        setHasInput(false);
    };

    return (
        <div className="relative w-screen h-full overflow-hidden" ref={constraintsRef}>
            <ErrorBoundary fallback={<div>Error loading background</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <AnimatedGridPattern
                        numSquares={30}
                        maxOpacity={0.1}
                        duration={3}
                        repeatDelay={1}
                        className={cn(
                            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                            "absolute inset-0 h-full w-full",
                            "dark:opacity-40"
                        )}
                    />
                </Suspense>
            </ErrorBoundary>
            <SmoothDraggableLogo constraintsRef={constraintsRef} />
            <div className={`relative z-20 w-full h-full flex flex-col ${isPhone ? 'justify-between' : 'justify-center'} items-center pointer-events-none tracking-wide`}>
                <div className="text-center w-full max-w-screen-xl mx-auto px-4 pointer-events-auto">
                    <h1 className={`mb-4 ${isPhone ? 'text-5xl mt-8' : 'text-5xl'} leading-tight text-white`}>
                        {isPhone ? (
                            <div className="flex flex-col items-start">
                                <span className="font-semibold mb-1">Where</span>
                                <span className="font-semibold mb-1">Tokens</span>
                                <span className="font-semibold mb-1">become</span>
                                <span className="text-blue-600 font-bold">Communities</span>
                            </div>
                        ) : (
                            <>
                                <span className="first-line font-semibold inline-block -ml-[5.5em] mb-0">Where Tokens</span><br />
                                <span className="second-line font-semibold inline-block ml-[2em]">become <span className="text-blue-600 font-bold">Communities</span></span>
                            </>
                        )}
                    </h1>
                    {!isPhone && (
                        <>
                            <div className="search-container relative mt-2 max-w-2xl mx-auto">
                                <input 
                                    type="text" 
                                    id="tokenAddress" 
                                    placeholder="Enter TON Token Address..." 
                                    onChange={(e) => setHasInput(e.target.value.trim().length > 0)} 
                                    className="w-full py-3 px-5 rounded-full border-none text-base bg-white text-black" 
                                />
                                {hasInput && <button id="clearSearch" onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xl text-gray-500 cursor-pointer">&times;</button>}
                            </div>
                            <div className="flex justify-center items-center gap-5 mt-6 max-w-xl mx-auto">
                                <button 
                                    id="scavenge" 
                                    className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white"
                                    onClick={handleScavenge}
                                >
                                    Scavenge
                                </button>
                                <span className="text-3xl text-white">/</span>
                                <button 
                                    id="browseAll" 
                                    className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-white text-blue-600"
                                    onClick={() => navigate('/browse')}
                                >
                                    Browse All
                                </button>
                            </div>
                        </>
                    )}
                </div>
                {isPhone && (
                    <div className="w-full pointer-events-auto px-4 mb-16">
                        <div className="search-container relative max-w-full mx-auto mb-6">
                            <input 
                                type="text" 
                                id="tokenAddress" 
                                placeholder="Enter TON Token Address..." 
                                onChange={(e) => setHasInput(e.target.value.trim().length > 0)} 
                                className="w-full py-3 px-5 rounded-full border-none text-base bg-white text-black" 
                            />
                            {hasInput && <button id="clearSearch" onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xl text-gray-500 cursor-pointer">&times;</button>}
                        </div>
                        <div className="flex justify-center items-center gap-5 max-w-xs mx-auto">
                            <button 
                                id="scavenge" 
                                className="py-2 px-5 rounded-full text-sm font-semibold cursor-pointer bg-blue-600 text-white"
                                onClick={handleScavenge}
                            >
                                Scavenge
                            </button>
                            <span className="text-3xl text-white">/</span>
                            <button 
                                id="browseAll" 
                                className="py-2 px-5 rounded-full text-sm font-semibold cursor-pointer bg-white text-blue-600"
                                onClick={() => navigate('/browse')}
                            >
                                Browse All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;