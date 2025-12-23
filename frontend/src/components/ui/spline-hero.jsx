import React from 'react';

export const SplineHero = ({ className = "" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/80 z-10 pointer-events-none" />
      <iframe 
        src='https://my.spline.design/claritystream-tn9rzz5qkhGz0GqrLtefiGoO/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        className="w-full h-full pointer-events-none"
        loading="lazy"
        title="Thrift Earth 3D Clarity Stream"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />
    </div>
  );
};