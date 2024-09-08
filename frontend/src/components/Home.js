import React, { useState, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import ErrorBoundary from './ErrorBoundary';
import RetroGrid from '../utils/RetroGrid';
import SmoothDraggableLogo from './SmoothDraggableLogo';

const Home = () => {
    const navigate = useNavigate();
    const [hasInput, setHasInput] = useState(false);
    const constraintsRef = useRef(null);

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
                    <RetroGrid />
                </Suspense>
            </ErrorBoundary>
            <SmoothDraggableLogo constraintsRef={constraintsRef} />
            <div className="relative z-20 w-full h-full flex flex-col justify-center items-center pointer-events-none">
                <div className="text-center w-full max-w-screen-xl mx-auto px-4 pointer-events-auto">
                    <h1 className="mb-4 text-5xl leading-tight text-white">
                        <span className="first-line font-semibold inline-block -ml-[5.5em]">Where Tokens</span><br />
                        <span className="second-line font-semibold inline-block ml-[2em]">become <span className="text-blue-600 font-bold">Communities</span></span>
                    </h1>
                    <div className="search-container relative mt-2 max-w-2xl mx-auto">
                        <input type="text" id="tokenAddress" placeholder="Enter TON Token Address..." onChange={(e) => setHasInput(e.target.value.trim().length > 0)} className="w-full py-3 px-5 rounded-full border-none text-base bg-white text-black" />
                        {hasInput && <button id="clearSearch" onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xl text-gray-500 cursor-pointer">&times;</button>}
                    </div>
                    <div className="flex justify-center items-center gap-5 mt-6 max-w-xl mx-auto">
                        <button id="scavenge" className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white" onClick={handleScavenge}>Scavenge</button>
                        <span className="text-3xl text-white">/</span>
                        <button id="browseAll" className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-white text-blue-600" onClick={() => navigate('/browse')}>Browse All</button>
                    </div>
                    <div id="searchResult"></div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-[rgba(15,15,15,0.9)] border-t border-[rgba(255,255,255,0.2)] flex justify-center items-center z-30 pointer-events-auto">
                <a href="https://x.com/getherlol" target="_blank" rel="noopener noreferrer" className="mx-4 transition-transform duration-200 hover:scale-110"><FaXTwitter size={24} color="white" /></a>
                <a href="https://github.com/xndrshea/Gether" target="_blank" rel="noopener noreferrer" className="mx-4 transition-transform duration-200 hover:scale-110"><FaGithub size={24} color="white" /></a>
            </div>
        </div>
    );
};

export default Home;