import { useState, useEffect, useRef } from 'react'
import './AutocompleteInput.css'

const AutocompleteInput = ({ options, onSubmit, disabled, placeholder }) => {
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (inputValue.trim().length >= 3) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 8) // Limit to 8 suggestions for performance
      
      setFilteredOptions(filtered)
      setShowDropdown(filtered.length > 0)
      setSelectedIndex(-1)
    } else {
      setFilteredOptions([])
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }, [inputValue, options])

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  const handleInputChange = (e) => {
    if (disabled) return
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (disabled) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }

  const handleSubmit = () => {
    if (disabled) return

    let answerToSubmit = inputValue.trim()
    
    if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
      answerToSubmit = filteredOptions[selectedIndex]
    }

    if (answerToSubmit) {
      onSubmit(answerToSubmit)
      setInputValue('')
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }

  const handleOptionClick = (option) => {
    if (disabled) return
    
    setInputValue(option)
    setShowDropdown(false)
    setSelectedIndex(-1)
    onSubmit(option)
    setInputValue('')
  }

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="autocomplete-container" ref={dropdownRef}>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`autocomplete-input ${disabled ? 'disabled' : ''}`}
        />
        <button 
          onClick={handleSubmit}
          disabled={disabled || !inputValue.trim()}
          className="submit-button"
        >
          Submit
        </button>
      </div>

      {showDropdown && (
        <div className="suggestions-list">
          {filteredOptions.map((option, index) => (
            <div
              key={option}
              className={`suggestion-item ${index === selectedIndex ? 'highlighted' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AutocompleteInput 