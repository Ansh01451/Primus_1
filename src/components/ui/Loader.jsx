import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="loader-dots">
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FDFCFB]/80 flex items-center justify-center z-[9999]">
        {content}
      </div>
    );
  }

  return (
    <div className="loader-container">
      {content}
    </div>
  );
};

export default Loader;
