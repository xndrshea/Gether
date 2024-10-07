// src/components/LogoHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

const LogoHeader = () => {
    return (
        <Link to="/" className="flex items-center">
            <img
                src="https://getherlolbucket.s3.eu-central-1.amazonaws.com/assets/gethericon.png"
                alt="Gether Icon"
                className="h-8 w-8 min-h-[2rem] min-w-[2rem] flex-shrink-0 mr-2"
            />
            <img
                src="https://getherlolbucket.s3.eu-central-1.amazonaws.com/assets/gethername.png"
                alt="Gether Name"
                className="h-8"
            />
        </Link>
    );
};

export default LogoHeader;