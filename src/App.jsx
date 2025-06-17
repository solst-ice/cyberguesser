import { useState } from 'react'
import './App.css'
import ModeSelector from './components/ModeSelector'
import QuizGame from './components/QuizGame'
import GameOver from './components/GameOver'

function App() {
  const [gameState, setGameState] = useState('mode-selection') // 'mode-selection', 'playing', 'game-over'
  const [gameMode, setGameMode] = useState('') // 'tools' or 'x-accounts'
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(5)
  const [gameKey, setGameKey] = useState(0) // Add key to force re-mount

  const startGame = (mode) => {
    setGameMode(mode)
    setGameState('playing')
    setScore(0)
    setLives(5)
    setGameKey(prev => prev + 1) // Increment key to force re-mount
  }

  const endGame = () => {
    setGameState('game-over')
  }

  const resetGame = () => {
    setGameState('mode-selection')
    setGameMode('')
    setScore(0)
    setLives(5)
    setGameKey(prev => prev + 1) // Increment key to force re-mount
  }

  return (
    <div className="app">
      {gameState === 'mode-selection' && (
        <ModeSelector onModeSelect={startGame} />
      )}

      {gameState === 'playing' && (
        <QuizGame 
          key={gameKey}
          mode={gameMode}
          score={score}
          setScore={setScore}
          lives={lives}
          setLives={setLives}
          onGameEnd={endGame}
        />
      )}

      {gameState === 'game-over' && (
        <GameOver 
          score={score}
          mode={gameMode}
          onRestart={resetGame}
        />
      )}
    </div>
  )
}

export default App
