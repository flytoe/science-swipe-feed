
import { useState, useEffect } from 'react';
import { create } from 'zustand';

interface MindBlowAnimation {
  id: string;
  x: number;
  y: number;
  type: 'smile' | 'mindblown' | 'heart' | 'fire';
}

interface MindBlowTrackerState {
  animations: MindBlowAnimation[];
  increment: () => void;
  remove: (id: string) => void;
}

export const useMindBlowTracker = create<MindBlowTrackerState>()((set) => ({
  animations: [],
  increment: () => {
    const id = Math.random().toString(36).substring(2, 9);
    // Random position within viewport
    const x = Math.random() * (window.innerWidth * 0.8);
    const y = Math.random() * (window.innerHeight * 0.8);
    
    // Random animation type
    const types: ('smile' | 'mindblown' | 'heart' | 'fire')[] = ['smile', 'mindblown', 'heart', 'fire'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    set(state => ({
      animations: [...state.animations, { id, x, y, type }]
    }));
    
    // Remove the animation after 2 seconds
    setTimeout(() => {
      set(state => ({
        animations: state.animations.filter(anim => anim.id !== id)
      }));
    }, 2000);
  },
  remove: (id: string) => set(state => ({
    animations: state.animations.filter(animation => animation.id !== id)
  }))
}));

export const MindBlowAnimations = () => {
  const animations = useMindBlowTracker(state => state.animations);
  const remove = useMindBlowTracker(state => state.remove);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {animations.map(anim => (
        <div
          key={anim.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-float"
          style={{ 
            left: `${anim.x}px`, 
            top: `${anim.y}px`,
            animation: `float 2s ease-out forwards, fade-out 2s ease-out forwards`,
          }}
          onAnimationEnd={() => remove(anim.id)}
        >
          <div className="text-4xl">
            {anim.type === 'smile' && '😊'}
            {anim.type === 'mindblown' && '🤯'}
            {anim.type === 'heart' && '❤️'}
            {anim.type === 'fire' && '🔥'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default useMindBlowTracker;
