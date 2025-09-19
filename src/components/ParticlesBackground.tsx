import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  gravity: number;
  mouseAttraction: number;
}

interface GravityParticlesBackgroundProps {
  isMobileMenu?: boolean;
}

const FloatingParticlesBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Initialize particles
    const initParticles = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1, // 1-5px
      speedX: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25
      speedY: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25
      opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
      color: Math.random() > 0.7 ? '#8B5CF6' : Math.random() > 0.4 ? '#3B82F6' : '#06B6D4', // Purple, Blue, Cyan
      life: 0,
      maxLife: Math.random() * 1000 + 500, // 500-1500 frames
      gravity: Math.random() * 0.02 + 0.01,
      mouseAttraction: Math.random() * 0.5 + 0.1,
    }));

    setParticles(initParticles);

    // Animation loop
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          let newLife = particle.life + 1;

          // Wrap around screen edges
          if (newX < 0) newX = window.innerWidth;
          if (newX > window.innerWidth) newX = 0;
          if (newY < 0) newY = window.innerHeight;
          if (newY > window.innerHeight) newY = 0;

          // Reset particle if it exceeds max life
          if (newLife > particle.maxLife) {
            return {
              ...particle,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              life: 0,
              speedX: (Math.random() - 0.5) * 0.5,
              speedY: (Math.random() - 0.5) * 0.5,
              opacity: Math.random() * 0.6 + 0.2,
            };
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            life: newLife,
            opacity: Math.max(0.1, particle.opacity - 0.0001), // Slowly fade
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-purple-900/20" />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full shadow-sm"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
            transform: `scale(${1 + Math.sin(particle.life * 0.01) * 0.2})`, // Gentle pulsing
          }}
        />
      ))}

      {/* Additional floating orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-2/3 left-1/2 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};

// Enhanced Gravity Particles Background with mouse interaction
export const GravityParticlesBackground: React.FC<GravityParticlesBackgroundProps> = ({ isMobileMenu = false }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Initialize particles with gravity properties
    const initParticles = Array.from({ length: isMobileMenu ? 80 : 150 }, (_, i) => ({
      id: i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 6 + 2, // 2-8px for more visibility
      speedX: (Math.random() - 0.5) * 1.5, // -0.75 to 0.75
      speedY: (Math.random() - 0.5) * 1.5, // -0.75 to 0.75
      opacity: Math.random() * 0.8 + 0.3, // 0.3-1.1 (will be clamped)
      color: Math.random() > 0.8 ? '#F59E0B' : Math.random() > 0.6 ? '#EF4444' : Math.random() > 0.4 ? '#8B5CF6' : Math.random() > 0.2 ? '#3B82F6' : '#06B6D4', // Gold, Red, Purple, Blue, Cyan
      life: 0,
      maxLife: Math.random() * 800 + 400, // 400-1200 frames
      gravity: Math.random() * 0.05 + 0.02,
      mouseAttraction: Math.random() * 0.8 + 0.2,
    }));

    setParticles(initParticles);

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    // Touch movement handler for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        setMousePos({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove);

    // Animation loop with gravity and mouse interaction
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          const rect = container.getBoundingClientRect();
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          let newLife = particle.life + 1;

          // Mouse attraction force
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            const force = particle.mouseAttraction / (distance * distance + 100); // Add small constant to avoid division by zero
            particle.speedX += (dx / distance) * force;
            particle.speedY += (dy / distance) * force;
          }

          // Apply gravity (particles fall down)
          particle.speedY += particle.gravity;

          // Damping to prevent particles from moving too fast
          particle.speedX *= 0.99;
          particle.speedY *= 0.99;

          // Bounce off edges
          if (newX < 0) {
            newX = 0;
            particle.speedX *= -0.8; // Energy loss on bounce
          }
          if (newX > rect.width) {
            newX = rect.width;
            particle.speedX *= -0.8;
          }
          if (newY < 0) {
            newY = 0;
            particle.speedY *= -0.8;
          }
          if (newY > rect.height) {
            newY = rect.height;
            particle.speedY *= -0.8;
          }

          // Reset particle if it exceeds max life or goes out of bounds
          if (newLife > particle.maxLife || newX < -50 || newX > rect.width + 50 || newY < -50 || newY > rect.height + 50) {
            return {
              ...particle,
              x: Math.random() * rect.width,
              y: Math.random() * rect.height,
              life: 0,
              speedX: (Math.random() - 0.5) * 1.5,
              speedY: (Math.random() - 0.5) * 1.5,
              opacity: Math.random() * 0.8 + 0.3,
            };
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            life: newLife,
            opacity: Math.max(0.1, Math.min(1, particle.opacity - 0.0002)), // Slowly fade but stay visible
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 16); // ~60fps

    return () => {
      clearInterval(interval);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mousePos, isMobileMenu]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${isMobileMenu ? 'z-10' : 'z-0'}`}
      style={{ zIndex: isMobileMenu ? 10 : 0 }}
    >
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-purple-900/30" />

      {/* Gravity particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full shadow-lg"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}60, 0 0 ${particle.size * 6}px ${particle.color}30`,
            transform: `scale(${1 + Math.sin(particle.life * 0.02) * 0.3}) rotate(${particle.life * 0.5}deg)`, // Enhanced pulsing and rotation
            filter: `blur(${Math.sin(particle.life * 0.01) * 0.5}px)`, // Subtle blur effect
          }}
        />
      ))}

      {/* Additional floating orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-2/3 left-1/2 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/6 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
};

export default FloatingParticlesBackground;