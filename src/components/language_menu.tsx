import React, { useState } from 'react';
import "./language_menu.css"

//TO-DO: actually translate the pages given the selectedLanguage
const LanguageMenu = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = ['English', 'Espanol']; // Add your language options here

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
    document.documentElement.lang = language == "English" ? "en" : "es";
  };

  return (
    <div className="language-dropdown">
        <div
            className={`selected-language ${isDropdownOpen ? 'open' : ''}`}
            onMouseOver={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            {selectedLanguage}
        </div>
      {isDropdownOpen && (
        <ul className="language-list">
          {languages.map((language, index) => (
            <li key={index} onClick={() => handleLanguageSelect(language)}>
              {language}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageMenu;



