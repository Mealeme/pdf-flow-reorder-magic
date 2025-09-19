import React from 'react';

const ThreeDCube: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 perspective-1000">
        <div className="relative w-full h-full transform-style-preserve-3d animate-spin-slow">
          {/* Front face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm transform translate-z-16"></div>
          {/* Back face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm transform translate-z--16 rotate-y-180"></div>
          {/* Right face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-400/30 backdrop-blur-sm transform translate-x-16 rotate-y-90"></div>
          {/* Left face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-400/30 backdrop-blur-sm transform translate-x--16 rotate-y--90"></div>
          {/* Top face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 backdrop-blur-sm transform translate-y--16 rotate-x-90"></div>
          {/* Bottom face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm transform translate-y-16 rotate-x--90"></div>
        </div>
      </div>

      <div className="absolute top-3/4 right-1/4 w-24 h-24 perspective-1000">
        <div className="relative w-full h-full transform-style-preserve-3d animate-spin-reverse-slow">
          {/* Front face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-400/30 backdrop-blur-sm transform translate-z-12"></div>
          {/* Back face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 backdrop-blur-sm transform translate-z--12 rotate-y-180"></div>
          {/* Right face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 backdrop-blur-sm transform translate-x-12 rotate-y-90"></div>
          {/* Left face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-lime-500/20 to-green-500/20 border border-lime-400/30 backdrop-blur-sm transform translate-x--12 rotate-y--90"></div>
          {/* Top face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-400/30 backdrop-blur-sm transform translate-y--12 rotate-x-90"></div>
          {/* Bottom face */}
          <div className="absolute w-full h-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-400/30 backdrop-blur-sm transform translate-y-12 rotate-x--90"></div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDCube;