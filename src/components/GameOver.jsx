import './GameOver.css'

const GameOver = ({ score, mode, onRestart }) => {
  const getScoreMessage = (score) => {
    if (score >= 6001) return "[RANK] CHEATER"
    if (score >= 6000) return "[RANK] The 0racle"
    if (score >= 5500) return "[RANK] 31337 h4x0r"
    if (score >= 5000) return "[RANK] Gh0st in the Shell"
    if (score >= 4500) return "[RANK] UwU-APT"
    if (score >= 4000) return "[RANK] 0day finder"
    if (score >= 3500) return "[RANK] netrunner"
    if (score >= 3000) return "[RANK] DEFCON GOON"
    if (score >= 2500) return "[RANK] Exploit dev"
    if (score >= 2000) return "[RANK] Ransomware dev"
    if (score >= 1500) return "[RANK] Tool Monkey"
    if (score >= 1000) return "[RANK] skid"
    if (score >= 500) return "[RANK] tryhard"
    return "[RANK] noob"
  }

  const getScoreColor = (score) => {
    if (score >= 5000) return "gold"
    if (score >= 3500) return "silver"
    if (score >= 2200) return "bronze"
    if (score >= 1000) return "good"
    return "novice"
  }

  return (
    <div className="game-over">
      <div className="game-over-container">
        <div className="border-title">
          +───────────────────────── PENTEST REPORT ─────────────────────────+
        </div>

        
        <h2>[*] Meterpreter session 1 closed. Reason: Died</h2>
        
        <div className="final-score">
          <div className="ascii-border-score-top">
            ┌─────────────── Score Analysis ───────────────┐
          </div>
          <div className={`score-display ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="score-message">
            {getScoreMessage(score)}
          </div>
          <div className="ascii-border-score-bottom">
            └───────────────────────────────────────────────┘
          </div>
        </div>

        <div className="actions">
          <div className="ascii-border-button-top">
            ┌─────────────── ¿Respawn Shell? ───────────────┐
          </div>
          <button 
            className="restart-button"
            onClick={onRestart}
          >
            [Restart] New Session
          </button>
          <div className="ascii-border-button-bottom">
            └───────────────────────────────────────────────┘
          </div>
        </div>

      </div> 
    </div>
  )
}

export default GameOver 