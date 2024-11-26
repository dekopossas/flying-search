import React, { useState, useEffect } from "react";
import { getAirports } from "../Services/requests";

export default function AutoComplete({ placeholder, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await getAirports(
        `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${query}`
      );
      console.log(data);
      if (data.data && Array.isArray(data.data)) {
        const formattedSuggestions = data.data.map((item) => ({
          id: item.presentation.skyId,
          title: item.presentation.title,
          suggestionTitle: item.presentation.suggestionTitle,
          subtitle: item.presentation.subtitle,
        }));
        setSuggestions(formattedSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching airport suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (value) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.suggestionTitle);
    setShowSuggestions(false);
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.suggestionTitle} - {suggestion.subtitle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
