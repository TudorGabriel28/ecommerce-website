import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';

const Header = ({ cartItemCount, onSearch }) => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold">TechShop</Link>
          
          <div className="flex-grow max-w-2xl mx-4">
            <Search onSearch={onSearch} />
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/cart" className="flex items-center hover:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="ml-1">{cartItemCount > 0 && `(${cartItemCount})`}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;