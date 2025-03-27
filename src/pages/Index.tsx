
import React from 'react';
import SwipeFeed from '../components/SwipeFeed';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="sticky top-0 z-30 w-full backdrop-blur-sm bg-white/80 border-b border-gray-200">
        <div className="container max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            ScienceSwipe
          </h1>
          <div className="text-sm text-gray-500">Latest Research</div>
        </div>
      </header>

      <main className="container max-w-md mx-auto px-0 py-4">
        <SwipeFeed />
      </main>
    </div>
  );
};

export default Index;
