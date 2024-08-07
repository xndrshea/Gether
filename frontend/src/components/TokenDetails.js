// src/components/TokenDetails.js

import React from 'react';

const TokenDetails = ({ tokenInfo, currentTokenAddress }) => {
    if (!tokenInfo) {
        return null;
    }

    const { name, symbol, description } = tokenInfo.jetton_content?.data || {};

    return (
        <div className="token-info-component">
            <h3>Token Information</h3>
            <p><strong>Name:</strong> {name || 'N/A'}</p>
            <p><strong>Symbol:</strong> {symbol || 'N/A'}</p>
            <p><strong>Description:</strong> {description || 'N/A'}</p>
            <a href={`https://tonviewer.com/${currentTokenAddress}`} target="_blank" rel="noopener noreferrer">
                View on TonViewer
            </a>
        </div>
    );
};

export default TokenDetails;