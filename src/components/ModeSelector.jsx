import './ModeSelector.css'

const ModeSelector = ({ onModeSelect }) => {
  return (
    <div className="mode-selector">
      <div className="ascii-header">
        <div className="ascii-line">╔══════════════════════════════════════════════╗</div>
        <div className="ascii-line">║ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; c y b e r g u e s s e r &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ║</div>
        <div className="ascii-line">║ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by <a href="https://x.com/IceSolst" target="_blank" rel="noopener noreferrer" className="author-link">solst/ICE</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ║</div>
        <div className="ascii-line">╚══════════════════════════════════════════════╝</div>
      </div>
      <div className="description">
        <div className="description-line line-1">
          <span className="content">+ -- --= [ 60 tools ascii logos loaded! ] -- --+</span>
        </div>
        <div className="description-line line-2">
          <span className="content">+ -- --= [ exploits - auxilliary - post ] -- --+</span>
        </div>
        <div className="description-line line-3">
          <span className="content">+ -- --= [ payloads - &nbsp;encoders&nbsp; - nops ] -- --+</span>
        </div>
      </div>
      <div className="start-button-container">
        <button 
          className="start-button"
          onClick={() => onModeSelect('tools')}
        >
          <div className="mode-icon">[START EXPLOITATION]</div>
           <p>[*] Started reverse TCP handler&nbsp;</p>
          <h3>[*] Meterpreter session 1 opened</h3>
          
        </button>
      </div>
    </div>
  )
}

export default ModeSelector 