
import { useState, useEffect } from 'react';
import { create } from 'zustand';

interface MindBlowAnimation {
  id: string;
  x: number;
  y: number;
  type: 'smile' | 'mindblown' | 'heart' | 'fire' | 'sparkle' | 'zap';
  scale?: number;
  duration?: number;
}

interface MindBlowTrackerState {
  animations: MindBlowAnimation[];
  increment: () => void;
  triggerBurst: (count: number) => void;
  remove: (id: string) => void;
  // Adding missing properties for donation prompt functionality
  lastPromptTimestamp: number;
  shouldShowDonationPrompt: () => boolean;
  markDonationPromptSeen: () => void;
  resetPromptTimestamp: () => void;
}

export const useMindBlowTracker = create<MindBlowTrackerState>()((set, get) => ({
  animations: [],
  lastPromptTimestamp: 0,
  
  increment: () => {
    const id = Math.random().toString(36).substring(2, 9);
    // Random position within viewport
    const x = Math.random() * (window.innerWidth * 0.8);
    const y = Math.random() * (window.innerHeight * 0.8);
    
    // Random animation type
    const types: ('smile' | 'mindblown' | 'heart' | 'fire' | 'sparkle' | 'zap')[] = 
      ['smile', 'mindblown', 'heart', 'fire', 'sparkle', 'zap'];
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
  
  triggerBurst: (count: number = 50) => {
    const newAnimations: MindBlowAnimation[] = [];
    
    // Create a burst of animations
    for (let i = 0; i < count; i++) {
      const id = Math.random().toString(36).substring(2, 9);
      
      // Center around the viewport center with some randomness
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Random position in a circle pattern from center
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (window.innerWidth * 0.4);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Random animation type with preference for mindblown
      const types: ('mindblown' | 'sparkle' | 'zap')[] = ['mindblown', 'sparkle', 'zap'];
      const typeIndex = Math.floor(Math.random() * types.length);
      const type = Math.random() < 0.7 ? 'mindblown' : types[typeIndex];
      
      // Random scale and duration
      const scale = 0.5 + Math.random() * 2;
      const duration = 1 + Math.random() * 3;
      
      newAnimations.push({ id, x, y, type, scale, duration });
    }
    
    set(state => ({
      animations: [...state.animations, ...newAnimations]
    }));
    
    // Remove the animations after their duration
    newAnimations.forEach(anim => {
      setTimeout(() => {
        set(state => ({
          animations: state.animations.filter(a => a.id !== anim.id)
        }));
      }, (anim.duration || 2) * 1000);
    });
  },
  
  remove: (id: string) => set(state => ({
    animations: state.animations.filter(animation => animation.id !== id)
  })),
  
  // Donation prompt utility functions
  shouldShowDonationPrompt: () => {
    const { lastPromptTimestamp } = get();
    const now = Date.now();
    // Show prompt every 24 hours (86400000 milliseconds)
    return now - lastPromptTimestamp > 86400000;
  },
  
  markDonationPromptSeen: () => {
    set({ lastPromptTimestamp: Date.now() });
  },
  
  resetPromptTimestamp: () => {
    set({ lastPromptTimestamp: 0 });
  }
}));

export const MindBlowAnimations = () => {
  const animations = useMindBlowTracker(state => state.animations);
  const remove = useMindBlowTracker(state => state.remove);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {animations.map(anim => {
        const scale = anim.scale || 1;
        const duration = anim.duration || 2;
        
        return (
          <div
            key={anim.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${anim.x}px`, 
              top: `${anim.y}px`,
              animation: `float ${duration}s ease-out forwards, fade-out ${duration}s ease-out forwards`,
              transformOrigin: 'center center',
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
            onAnimationEnd={() => remove(anim.id)}
          >
            <div className={`text-${Math.floor(3 + scale)}xl`}>
              {anim.type === 'smile' && '😊'}
              {anim.type === 'mindblown' && '🤯'}
              {anim.type === 'heart' && '❤️'}
              {anim.type === 'fire' && '🔥'}
              {anim.type === 'sparkle' && '✨'}
              {anim.type === 'zap' && '⚡'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default useMindBlowTracker;
