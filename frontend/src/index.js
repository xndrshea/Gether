import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer'; // Import Buffer polyfill
import process from 'process';   // Import process polyfill


window.Buffer = Buffer; // Add Buffer to the window object
window.process = process; // Add process to the window object

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
