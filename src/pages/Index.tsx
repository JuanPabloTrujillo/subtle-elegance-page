
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { VideoSection } from '@/components/VideoSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-sage-50">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <span className="badge bg-sage-500/10 text-sage-500 mb-4 animate-fade-in-slow">
              Updated Today
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-heading tracking-tight animate-fade-in">
              A pixel-perfect landing page
            </h1>
            <p className="mt-6 text-xl text-text-body max-w-3xl mx-auto animate-fade-in-slow">
              Experience seamless design with modern transitions and exceptional attention to detail.
            </p>
          </div>
          <div className="mt-16 animate-scale-up">
            <VideoSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
