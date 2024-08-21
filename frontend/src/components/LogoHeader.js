// src/components/LogoHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

const LogoHeader = () => {
    return (
        <Link to="/" className="flex items-center">
            <img
                src="https://getherlolbucket.s3.eu-central-1.amazonaws.com/assets/gethericon.png"
                alt="Gether Icon"
                className="h-8 w-8 mr-2"
            />
            <img
                src="https://getherlolbucket.s3.eu-central-1.amazonaws.com/assets/gethername.png"
                alt="Gether Name"
                className="h-8 hidden md:block"
            />
        </Link>
    );
};

export default LogoHeader;