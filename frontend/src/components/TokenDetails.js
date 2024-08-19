import React, { useState } from 'react';

const TokenDetails = ({ tokenInfo, currentTokenAddress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonText, setButtonText] = useState('View Token Details');

    if (!tokenInfo) {
        return null;
    }

    const { name, symbol, description } = tokenInfo.metadata || {};
    const totalSupply = tokenInfo.total_supply;
    const mintable = tokenInfo.mintable;
    const verification = tokenInfo.verification;

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setTimeout(() => {
            setButtonText(isOpen ? 'View Token Details' : 'Collapse Token Details');
        }, 300); // Delay the text change by 300 milliseconds
    };

    return (
        <div
            className={`${isOpen ? 'w-60' : 'w-40'
                } bg-gray-800 text-white p-5 rounded-lg shadow-md z-1000 transition-width duration-300`}
        >
            <button
                className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded w-full cursor-pointer transition-all duration-300"
                onClick={handleToggle}
            >
                {buttonText}
            </button>
            {isOpen && (
                <div className="mt-4 text-left p-1 space-y-2 leading-relaxed">
                    <p>
                        <strong>Name:</strong> {name || 'N/A'}
                    </p>
                    <p>
                        <strong>Symbol:</strong> {symbol || 'N/A'}
                    </p>
                    <p>
                        <strong>Description:</strong> {description || 'N/A'}
                    </p>
                    <p>
                        <strong>Total Supply:</strong> {totalSupply || 'N/A'}
                    </p>
                    <p>
                        <strong>Mintable:</strong> {mintable ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <strong>Verification:</strong> {verification || 'N/A'}
                    </p>
                    <a
                        href={`https://tonviewer.com/${currentTokenAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        View on TonViewer
                    </a>
                </div>
            )}
        </div>
    );
};

export default TokenDetails;