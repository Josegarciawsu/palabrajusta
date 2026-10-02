import characters from '../../assets/judicial-characters.webp';
import './JudicialScene.css';
import { InterpreterPortrait } from './JudicialInterpreters.jsx';

const frames = [
  ['0%', '0%'], ['50%', '0%'], ['100%', '0%'],
  ['0%', '50%'], ['50%', '50%'], ['100%', '50%'],
  ['0%', '100%'], ['50%', '100%'], ['100%', '100%'],
];
function Portrait({ frame, className = '' }) {
  return <span className={`judicial-portrait ${className}`} style={{
    backgroundImage: `url(${characters})`,
    backgroundPosition: frames[frame].join(' '),
  }} />;
}

export default function JudicialScene({ phase, remaining, language, speaking, evaluated, interpreter='sofia' }) {
  const waiting = phase === 'ready';
  const recording = phase === 'recording';
  const evaluator = waiting || phase === 'evaluating' || evaluated;
  const source = language === 'en' ? 1 : 3;
  const frame = waiting ? (remaining >= 3 ? 4 : remaining === 2 ? 5 : 6)
    : recording || phase === 'evaluating' ? 8 : evaluator ? 7 : source;
  const person = evaluator ? 'Evaluador' : recording ? 'Intérprete'
    : language === 'en' ? 'Defensor público' : 'Acusado';
  const label = phase === 'ready' ? 'Prepárate' : recording ? 'Tu turno'
    : phase === 'listening' ? 'Escuchando' : phase === 'preparing' ? 'Preparando…'
    : phase === 'evaluating' ? 'Evaluando…' : evaluated ? 'Evaluación' : person;
  return <div className={`judicial-scene${phase === 'evaluating' ? ' judicial-blur' : ''}`}>
    <div className="judicial-character" role="img" aria-label={person}>
      {recording || phase==='evaluating' ? <InterpreterPortrait interpreter={interpreter}/> : <Portrait frame={frame} />}
    </div>
    <div className="judicial-scene-status" role="status" aria-live="polite" aria-atomic="true">
      <strong>{label}</strong>
      {['listening', 'ready', 'recording'].includes(phase) &&
        <span className="judicial-scene-time">{remaining}<small> s</small></span>}
    </div>
  </div>;
}
