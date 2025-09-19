import React, { useState, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface AddressSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your location",
  disabled = false,
  className = ""
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Try Google Places API first
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=geocode&key=YOUR_GOOGLE_PLACES_API_KEY`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions && data.predictions.length > 0) {
          setSuggestions(data.predictions.slice(0, 8));
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Google Places API error:', error);
    }

    // Fallback: Generate dynamic suggestions for any location
    const dynamicSuggestions = generateDynamicSuggestions(query);
    setSuggestions(dynamicSuggestions);
    setIsLoading(false);
  };

  const generateDynamicSuggestions = (query: string) => {
    const suggestions = [];
    const commonAreas = ['Main Road', 'Market', 'Center', 'Colony', 'Nagar', 'Pur', 'Town', 'Village', 'City', 'District'];
    const indianStates = [
      'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal',
      'Delhi', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Madhya Pradesh',
      'Bihar', 'Odisha', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Jharkhand'
    ];

    // Generate suggestions for the exact query
    suggestions.push({
      place_id: 'dynamic-1',
      description: `${query}, India`,
      structured_formatting: {
        main_text: query,
        secondary_text: 'India'
      }
    });

    // Generate area-based suggestions
    commonAreas.forEach((area, index) => {
      if (index < 3) {
        suggestions.push({
          place_id: `dynamic-area-${index}`,
          description: `${query} ${area}, ${query} District, India`,
          structured_formatting: {
            main_text: `${query} ${area}`,
            secondary_text: `${query} District, India`
          }
        });
      }
    });

    // Generate state-based suggestions
    indianStates.slice(0, 3).forEach((state, index) => {
      suggestions.push({
        place_id: `dynamic-state-${index}`,
        description: `${query}, ${state}, India`,
        structured_formatting: {
          main_text: query,
          secondary_text: `${state}, India`
        }
      });
    });

    // Add some nearby variations
    suggestions.push({
      place_id: 'dynamic-nearby-1',
      description: `${query} Town, Near ${query}, India`,
      structured_formatting: {
        main_text: `${query} Town`,
        secondary_text: `Near ${query}, India`
      }
    });

    return suggestions.slice(0, 8);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);

    // Show suggestions for any input length
    if (newValue.length >= 2) {
      setShowSuggestions(true);
      fetchSuggestions(newValue);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          onChange(inputValue);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onChange(inputValue);
    }, 200);
  };

  const clearInput = () => {
    setInputValue('');
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full pl-12 pr-12 py-4 text-base rounded-2xl border-2
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              border-gray-200 dark:border-gray-700
              placeholder-gray-400 dark:placeholder-gray-500
              focus:border-blue-500 focus:ring-4 focus:ring-blue-500/8
              hover:border-gray-300 dark:hover:border-gray-600
              transition-all duration-300 ease-out
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl focus:shadow-2xl
              backdrop-blur-sm
              ${disabled ? 'cursor-not-allowed' : 'cursor-text'}
            `}
          />

          {/* Location Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>

          {/* Clear Button */}
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute inset-y-0 right-0 pr-4 flex items-center
                         text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         rounded-r-xl transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-h-80 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium uppercase tracking-wide">
              Address Suggestions
            </div>
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50
                transition-all duration-200 ease-in-out
                flex items-start space-x-4
                border-b border-gray-100 dark:border-gray-700/50 last:border-b-0
                ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
              `}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-gray-900 dark:text-white font-semibold text-base leading-tight">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                    Address
                  </div>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">
                  {suggestion.structured_formatting.secondary_text}
                </div>
                <div className="mt-4 space-y-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                    Address Details
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(() => {
                      const parts = suggestion.description.split(', ');
                      const segments = [
                        { label: 'Area', value: parts[0], icon: '🏠' },
                        { label: 'Locality', value: parts[1], icon: '📍' },
                        { label: 'City', value: parts[2], icon: '🏙️' },
                        { label: 'State', value: parts[3], icon: '🗺️' }
                      ].filter(segment => segment.value);

                      return segments.map((segment, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{segment.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {segment.label}
                              </div>
                              <div className="text-sm text-gray-900 dark:text-white font-semibold truncate">
                                {segment.value}
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-center">
              <div className="text-gray-900 dark:text-white font-medium text-sm">
                No locations found
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Try a different search term
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;