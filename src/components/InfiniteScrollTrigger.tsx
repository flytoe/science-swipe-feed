
import React, { useEffect, useRef } from 'react';

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  isLoading?: boolean;
}

const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({ 
  onIntersect,
  isLoading = false 
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoading) {
          onIntersect();
        }
      },
      { threshold: 0.25, rootMargin: '300px 0px' } // Higher threshold and larger rootMargin to trigger earlier
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [onIntersect, isLoading]);

  return (
    <div ref={triggerRef} className="h-40 flex items-center justify-center">
      {isLoading && (
        <div className="loading-spinner border-gray-200 border-t-blue-500" />
      )}
    </div>
  );
};

export default InfiniteScrollTrigger;
