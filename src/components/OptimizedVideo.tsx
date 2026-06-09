import React, { useState, useEffect, useRef } from "react";

interface OptimizedVideoProps {
  src: string;
  posterUrl?: string; // Add optional preview image
  className?: string;
}

export function OptimizedVideo({ src, posterUrl, className }: OptimizedVideoProps) {
  const [inViewport, setInViewport] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
        } else {
          setInViewport(false);
          setIsReady(false); // Reset ready state when unmounted to show poster immediately next time
        }
      },
      {
        rootMargin: "300px", // Moderate buffer to initiate load ahead of viewport entry
        threshold: 0.01,
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden flex items-center justify-center"
    >
      {/* Brand-red pulsing ambient glow background behind preview/video */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(228,0,17,0.06)_0%,transparent_75%)] animate-pulse z-0" />
      
      {/* Poster image that acts as direct preview frame until video elements load */}
      {posterUrl && (
        <img
          src={posterUrl}
          aria-hidden="true"
          alt=""
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${
            isReady ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      )}

      {/* Skeleton overlay that fades out once the first preview frame is ready */}
      <div 
        className={`absolute inset-0 bg-neutral-900/60 z-20 transition-opacity duration-500 pointer-events-none flex items-center justify-center ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-5 h-5 rounded-full border border-neutral-800 border-t-red-500/50 animate-spin opacity-45" />
      </div>

      {inViewport && (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          referrerPolicy="no-referrer"
          onPlaying={() => setIsReady(true)}
          className={`${className} transition-opacity duration-1000 z-0 ${isReady ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* 40% darkening layer for premium aesthetic and text readability */}
      <div className="absolute inset-0 bg-black/40 z-30 pointer-events-none" />
    </div>
  );
}
