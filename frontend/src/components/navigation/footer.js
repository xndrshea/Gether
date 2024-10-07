import React from 'react';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-[rgba(15, 15, 15, 0.9)] border-t border-[rgba(255,255,255,0.2)] flex justify-center items-center z-30 pointer-events-auto">
      <a href="https://x.com/getherlol" target="_blank" rel="noopener noreferrer" className="mx-4 transition-transform duration-200 hover:scale-110">
        <FaXTwitter size={24} color="white" />
      </a>
      <a href="https://github.com/xndrshea/Gether" target="_blank" rel="noopener noreferrer" className="mx-4 transition-transform duration-200 hover:scale-110">
        <FaGithub size={24} color="white" />
      </a>
    </div>
  );
};

export default Footer;