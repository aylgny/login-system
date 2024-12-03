// src/components/CongratsPage.jsx
import React from 'react';
import './CongratsPage.css';

const CongratsPage = () => {
  const handleButtonClick = (action) => {
    const url = window.location.href;
    const parsedUrl = new URL(url);

    const filename = parsedUrl.pathname.split('/').pop();
    // Create a URL object
    if (action === 'homepage') {
      window.location.href = '/'; // Redirect to Homepage
    } else if (action === 'download') {
      // Invoice download functionality
      const fileUrl = `${process.env.PUBLIC_URL}/invoices/${filename}`; // Path to the PDF  
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename; // The name of the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (action === 'view') {
      // Invoice view functionality
      const fileUrl = `${process.env.PUBLIC_URL}/invoices/${filename}`; // Path to the PDF
      window.open(fileUrl, '_blank'); // Open PDF in a new tab
    }
  };

  return (
    <div className="congrats-container">
      <div className="congrats-content">
        <div className="icon">
          <span>✔</span>
        </div>
        <h1>Payment Successful!</h1>
        <p>Congratulations, your payment was processed successfully.</p>
        <div className="button-group">
          <button className="btn" onClick={() => handleButtonClick('homepage')}>
            Go to Homepage
          </button>
          <button className="btn" onClick={() => handleButtonClick('download')}>
            Download Invoice
          </button>
          <button className="btn" onClick={() => handleButtonClick('view')}>
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratsPage;
