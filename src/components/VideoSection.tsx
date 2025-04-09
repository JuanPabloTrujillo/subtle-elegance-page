
import React from 'react';
import { Play } from 'lucide-react';

export function VideoSection() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="relative aspect-video bg-white rounded-2xl shadow-xl overflow-hidden group">
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80"
          alt="Video placeholder"
          className="w-full h-full object-cover rounded-2xl brightness-[0.9] group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="p-4 md:p-6 rounded-full bg-white/90 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-white group-hover:scale-105 z-10">
            <Play className="w-6 h-6 md:w-8 md:h-8 text-sage-500 fill-sage-500" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white z-10">
          <h3 className="text-xl md:text-2xl font-bold mb-2">Watch Demo Video</h3>
          <p className="text-sm md:text-base text-white/80 max-w-md">Discover how our platform can transform your business operations</p>
        </div>
      </div>
    </div>
  );
}
