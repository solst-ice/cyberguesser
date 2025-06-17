import { useState, useEffect, useRef } from 'react'
import './QuizGame.css'
import AutocompleteInput from './AutocompleteInput'
import { getAvailableImages } from '../utils/imageLoader'
import { asciiLoader } from '../utils/asciiLoader'

const QuizGame = ({ mode, score, setScore, lives, setLives, onGameEnd }) => {
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [currentAsciiArt, setCurrentAsciiArt] = useState(null)
  const [availableOptions, setAvailableOptions] = useState([])
  const [usedImages, setUsedImages] = useState([])
  const [timeLeft, setTimeLeft] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [gameInitialized, setGameInitialized] = useState(false)
  const [isLoadingAscii, setIsLoadingAscii] = useState(false)
  
  // Hint system state
  const [showHint, setShowHint] = useState(false)
  const [hintOptions, setHintOptions] = useState([])
  const [hintUsed, setHintUsed] = useState(false)
  
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  // Load available images and options
  useEffect(() => {
    loadAvailableOptions()
    setUsedImages([]) // Reset used images when mode changes
    setGameInitialized(false) // Reset initialization flag
  }, [mode])

  // Start first question only when game is first loaded
  useEffect(() => {
    if (availableOptions.length > 0 && !gameInitialized) {
      setGameInitialized(true)
      startNewQuestion()
    }
  }, [availableOptions, gameInitialized])

  // Handle game over
  useEffect(() => {
    if (lives <= 0) {
      onGameEnd()
    }
  }, [lives, onGameEnd])

  const loadAvailableOptions = async () => {
    try {
      const options = await getAvailableImages(mode)
      setAvailableOptions(options)
    } catch (error) {
      console.error('Error loading options:', error)
      setAvailableOptions([])
    }
  }

  const getUnusedImages = () => {
    return availableOptions.filter(option => !usedImages.includes(option))
  }

  const generateHintOptions = (correctAnswer) => {
    // Get 3 random incorrect options
    const incorrectOptions = availableOptions
      .filter(option => option !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    // Combine with correct answer and shuffle
    const options = [correctAnswer, ...incorrectOptions]
      .sort(() => Math.random() - 0.5)
    
    return options
  }

  const handleHintClick = () => {
    if (hintUsed || isAnswered) return
    
    const options = generateHintOptions(currentAnswer)
    setHintOptions(options)
    setShowHint(true)
    setHintUsed(true)
  }

  const handleHintAnswer = (selectedAnswer) => {
    if (isAnswered) return
    handleAnswer(selectedAnswer)
  }

  const startNewQuestion = async () => {
    const unusedImages = getUnusedImages()
    
    // Check if all images have been used
    if (unusedImages.length === 0) {
      if (availableOptions.length > 0) {
        // All images used - show completion message and end game
        setFeedbackMessage(`[Success] Protocol Complete! ${availableOptions.length} ${mode === 'tools' ? 'Security Tools' : 'Accounts'} Classified!`)
        setShowFeedback(true)
        setTimeout(() => {
          onGameEnd()
        }, 3000)
        return
      } else {
        return
      }
    }

    // Pick a random option from unused images
    const randomIndex = Math.floor(Math.random() * unusedImages.length)
    const selectedAnswer = unusedImages[randomIndex]
    
    setCurrentAnswer(selectedAnswer)
    
    // Add to used images
    setUsedImages(prev => [...prev, selectedAnswer])
    
    // Clear current ASCII art first
    setCurrentAsciiArt(null)
    
    // Load pre-rendered ASCII art
    await loadAsciiArt(selectedAnswer)
    
    setTimeLeft(null)
    setIsAnswered(false)
    setShowFeedback(false)
    
    // Reset hint state
    setShowHint(false)
    setHintOptions([])
    setHintUsed(false)
    
    // Start timer
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setTimeLeft(elapsed)
    }, 1000)
  }

  const handleAnswer = (userAnswer) => {
    if (isAnswered) return

    clearInterval(timerRef.current)
    setIsAnswered(true)

    const elapsed = timeLeft || 0
    const isCorrect = userAnswer.toLowerCase().trim() === currentAnswer.toLowerCase().trim()

    if (isCorrect) {
      let points = 60 // Default "Correct!"
      let message = '[Verified]'

      if (hintUsed) {
        // If hint was used, only award 40 points regardless of time
        points = 40
        message = '[Verified with Hint]'
      } else if (elapsed < 5) {
        points = 100
        message = '[Critical]'
      } else if (elapsed < 20) {
        points = 80
        message = '[Authenticated]'
      }

      setScore(prev => prev + points)
      setFeedbackMessage(`${message} +${points} Score`)
    } else {
      setLives(prev => prev - 1)
      setFeedbackMessage(`[Access Denied] Correct ID: ${currentAnswer}`)
    }

    setShowFeedback(true)

    // Continue to next question after 2 seconds
    setTimeout(() => {
      if (lives > 1 || isCorrect) {
        startNewQuestion()
      }
    }, 2000)
  }

  const loadAsciiArt = async (toolName) => {
    try {
      setIsLoadingAscii(true)
      
      // Load pre-rendered ASCII art
      const asciiData = await asciiLoader.loadAsciiArt(toolName, mode)
      setCurrentAsciiArt(asciiData)
      setIsLoadingAscii(false)
      return true
    } catch (error) {
      console.warn('Failed to load ASCII art:', toolName, error)
      
      // Create fallback ASCII art as structured data
      const fallbackArt = []
      const fallbackLines = [
        '┌─────────────────────┐',
        '│                     │',
        '│    ASCII NOT        │',
        '│    AVAILABLE        │',
        '│                     │',
        '│    [LOAD ERROR]     │',
        '│                     │',
        '└─────────────────────┘'
      ]
      
      fallbackLines.forEach(line => {
        const row = []
        for (let char of line) {
          row.push({ char, color: '#ff4444' })
        }
        fallbackArt.push(row)
      })
      
      setCurrentAsciiArt(fallbackArt)
      setIsLoadingAscii(false)
      return false
    }
  }

  if (availableOptions.length === 0) {
    return (
      <div className="quiz-game">
        <div className="loading">
          <p>Setting up the game...</p>
          <p className="note">Please add images to the public/{mode} folder</p>
          <p className="note">Expected format: kebab-case filenames (e.g., burp-suite.png)</p>
        </div>
      </div>
    )
  }

  const unusedCount = getUnusedImages().length
  const totalCount = availableOptions.length

  return (
    <div className="quiz-game">
      <div className="game-header">
        <div className="top-row">
          <div className="lives">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`heart ${i < lives ? 'alive' : 'dead'}`}>
                {i < lives ? `[${i + 1}]` : '[x]'}
              </span>
            ))}
          </div>
          <div className="score">Score: {score}</div>
          <div className="timer">
            Elapsed: {timeLeft !== null ? `${timeLeft}s` : '0s'}
          </div>
        </div>
        <div className="progress">
          <div 
            className="progress-bar" 
            style={{ width: `${((totalCount - unusedCount) / totalCount) * 100}%` }}
          ></div>
          <div className="progress-text">
            Progress: {totalCount - unusedCount}/{totalCount} Classified
          </div>
        </div>
      </div>

      <div className="question-container">
        <div className="image-container">
          {isLoadingAscii ? (
            <div className="loading-placeholder">
              <p>Loading ASCII art...</p>
            </div>
          ) : currentAsciiArt ? (
            <div className="ascii-art-display">
              <div className="ascii-art-grid">
                {currentAsciiArt.map((row, rowIndex) => (
                  <div key={rowIndex} className="ascii-row">
                    {row.map((pixel, pixelIndex) => (
                      <span 
                        key={pixelIndex} 
                        className="ascii-char"
                        style={{ color: pixel.color }}
                      >
                        {pixel.char}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="loading-placeholder">
              <p>Loading image...</p>
            </div>
          )}
        </div>

        <div className="input-container">
          <AutocompleteInput 
            options={availableOptions}
            onSubmit={handleAnswer}
            disabled={isAnswered}
            placeholder={`Enter the ${mode === 'tools' ? 'tool' : 'account'} name...`}
          />
          
          <div className="hint-section">
            {!showHint && !isAnswered && (
              <button 
                className="hint-button" 
                onClick={handleHintClick}
                disabled={hintUsed}
              >
                {hintUsed ? '[Hint Used]' : '[Get Hint]'}
              </button>
            )}
            
            {showHint && !isAnswered && (
              <div className="hint-options">
                <div className="hint-label">[Multiple Choice - 40 Points]</div>
                <div className="hint-choices">
                  {hintOptions.map((option, index) => (
                    <button
                      key={index}
                      className="hint-choice"
                      onClick={() => handleHintAnswer(option)}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showFeedback && (
          <div className={`feedback ${feedbackMessage.includes('Access Denied') ? 'incorrect' : 'correct'}`}>
            {feedbackMessage}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizGame 