import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';

const Search = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch suggestions from the backend API
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) return [];
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/suggestions?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setIsLoading(false);
      return [];
    }
  };

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  // Autosuggest input props
  const inputProps = {
    placeholder: 'Search products...',
    value,
    onChange: (_, { newValue }) => setValue(newValue),
    className: 'w-full p-2 text-gray-800 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500'
  };

  // Get suggestions when input changes
  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestionResults = await fetchSuggestions(value);
    setSuggestions(suggestionResults);
  };

  // Clear suggestions when input is cleared
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Render each suggestion
  const renderSuggestion = (suggestion) => (
    <div className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800">
      {suggestion}
    </div>
  );

  // Get the value for a suggestion
  const getSuggestionValue = (suggestion) => suggestion;

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-grow">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={{
              container: 'relative w-full',
              suggestionsContainer: suggestions.length > 0 ? 'absolute z-50 w-full bg-white shadow-lg rounded-b border border-gray-200' : '',
              suggestionsList: 'list-none p-0 m-0 max-h-60 overflow-y-auto',
              suggestion: 'cursor-pointer'
            }}
          />
        </div>
        <button 
          type="submit" 
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r border-l-0 flex items-center justify-center"
          style={{ minWidth: '44px' }}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default Search;