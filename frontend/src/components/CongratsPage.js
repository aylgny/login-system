import React from 'react';
import './CongratsPage.css';

const CongratsPage = () => {
  const handleButtonClick = (action) => {
    if (action === 'homepage') {
      window.location.href = '/'; // Anasayfaya yönlendirme
    } else if (action === 'download') {
      // Fatura indirme işlemi
      alert('Downloading invoice...');
    } else if (action === 'view') {
      // Fatura görüntüleme işlemi
      alert('Viewing invoice...');
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
