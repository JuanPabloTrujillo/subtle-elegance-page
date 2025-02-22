
import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-text-heading font-semibold text-lg">
              Brand
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-text-body hover:text-text-heading transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-text-body hover:text-text-heading transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="hidden md:inline-flex text-text-body hover:text-text-heading transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-sage-500 hover:bg-sage-500/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
