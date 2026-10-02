import { useEffect, useRef, useState } from 'react';
import { judicialTurns, assessTurn, scoreUnits } from '../../lib/consecutiva/judicial.js';
import { cargarVoces, leerPreferencias, guardarPreferencias, hablar, detener } from '../../lib/consecutiva/voz.js';
import { useRecorder } from './useRecorder.js';
import { C, F } from '../../lib/consecutiva/tokens.js';
import { Boton, Tarjeta, Titulo } from './ui.jsx';
import JudicialScene from './JudicialScene.jsx';
import JudicialReport from './JudicialReport.jsx';
import JudicialReviewMenu, { resultLabel } from './JudicialReviewMenu.jsx';
import JudicialInterpreters from './JudicialInterpreters.jsx';
import { judicialVoice, judicialVoices } from '../../lib/consecutiva/judicialVoice.js';
const KEY='pj-judicial-attempts-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[];}catch{return [];}};
export default function JudicialTrainer({onBack}){
 const [direction,setDirection]=useState(null),[mode]=useState('practice'),[idx,setIdx]=useState(0);
 const turns=judicialTurns.filter(t=>direction==='both'||t.language===direction),turn=turns[idx];
 const [text,setText]=useState(''),[notes,setNotes]=useState(''),[rows,setRows]=useState(null),[shown,setShown]=useState(false),[listened,setListened]=useState(false);
 const [speaking,setSpeaking]=useState(false),[voices,setVoices]=useState([]),[audio,setAudio]=useState(null),[error,setError]=useState(''),[transcribing,setTranscribing]=useState(false);
 const [history,setHistory]=useState(read),[session,setSession]=useState({}),[finished,setFinished]=useState(false),[saved,setSaved]=useState(false),[integrity,setIntegrity]=useState(null);
 const [prefs,setPrefs]=useState(leerPreferencias);
 const [interpreter,setInterpreter]=useState(null);
 const [highlight,setHighlight]=useState(null);
 const [phase,setPhase]=useState('idle'),[remaining,setRemaining]=useState(0);
 const timer=useRef(null),prepared=useRef(null);
 const clearTimer=()=>{clearInterval(timer.current);timer.current=null;};
 function countdown(seconds,done){clearTimer();setRemaining(Math.ceil(seconds));const end=Date.now()+seconds*1000;timer.current=setInterval(()=>{const left=Math.max(0,Math.ceil((end-Date.now())/1000));setRemaining(left);if(left===0){clearTimer();done?.();}},200);}
 const releasePrepared=()=>{prepared.current?.getTracks().forEach(t=>t.stop());prepared.current=null;};
 const activeWord=useRef(null);
 useEffect(()=>{if(shown&&highlight)activeWord.current?.scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});},[shown,highlight]);
 const recognition=useRef(null),textRef=useRef(''),urlRef=useRef(null),generation=useRef(0);
 const recorder=useRecorder();const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 useEffect(()=>{if(audio&&text.trim()&&!recorder.grabando&&!transcribing){const result=assessTurn(turn,text);setRows(result);setSession(prev=>({...prev,[turn.id]:{id:turn.id,text,rows:result}}));setSaved(false);}},[audio,text,transcribing,recorder.grabando]);
 useEffect(()=>{cargarVoces().then(setVoices);return()=>{clearTimer();releasePrepared();generation.current++;detener();recognition.current?.abort();if(urlRef.current)URL.revokeObjectURL(urlRef.current);};},[]);
 const allRows=Object.values(session).flatMap(x=>x.rows),totalScore=scoreUnits(allRows);
 const segmentScores=Object.values(session).map(x=>scoreUnits(x.rows,x.integrity));
 if(segmentScores.length)totalScore.value=Math.round(segmentScores.reduce((n,x)=>n+x.value,0)/segmentScores.length);
 const reportRef=useRef(null);
 useEffect(()=>{if(rows)reportRef.current?.scrollIntoView({block:'start',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});},[!!rows]);
 function reset(){clearTimer();releasePrepared();setPhase('idle');setRemaining(0);setIntegrity(null);setHighlight(null);generation.current++;detener();recognition.current?.abort();recognition.current=null;setTranscribing(false);setSpeaking(false);setText('');textRef.current='';setNotes('');setRows(null);setShown(false);setListened(false);setSaved(false);setError('');if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=null;setAudio(null);}
 async function cancel(){generation.current++;clearTimer();releasePrepared();detener();recognition.current?.abort();if(recorder.grabando)await recorder.detener();setTranscribing(false);setSpeaking(false);setHighlight(null);setPhase('idle');setRemaining(0);}
 async function listen(){
  setError('');if(!window.speechSynthesis){setError('Audio no disponible.');return;}
  const g=++generation.current;setPhase('preparing');
  let acquired;try{acquired=await navigator.mediaDevices.getUserMedia({audio:true});}catch{if(g===generation.current){setPhase('idle');setError('Permite el micrófono para empezar.');}return;}
  if(g!==generation.current){acquired.getTracks().forEach(t=>t.stop());return;}
  prepared.current=acquired;
  setText('');textRef.current='';setRows(null);setIntegrity(null);if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=null;setAudio(null);
  const estimate=Math.ceil((turn.source.trim().split(/\s+/).length/(turn.language==='en'?170:155))*60/(prefs.velocidad||0.95));
  const started=Date.now();setPhase('listening');setSpeaking(true);setListened(true);countdown(estimate);
  await hablar(turn.source,turn.language,judicialVoice(voices,turn.language,prefs),prefs.velocidad,pos=>{if(g===generation.current)setHighlight(pos);});
  if(g!==generation.current)return;
  clearTimer();setSpeaking(false);setHighlight(null);
  const duration=(Date.now()-started)/1000;
  const extra=Math.max(10,duration*(turn.language==='en'?0.30:0.25));
  setPhase('ready');countdown(3,async()=>{
   if(g!==generation.current)return;
   const stream=prepared.current;prepared.current=null;
   const ok=await recorder.iniciar(stream);
   if(g!==generation.current){stream?.getTracks().forEach(t=>t.stop());return;}
   if(!ok){setPhase('idle');return;}
   setPhase('recording');countdown(Math.ceil(duration+extra),()=>stop());
  });
 }
 // Start speech recognition only once the recorder successfully acquired the microphone.
 useEffect(()=>{if(!recorder.grabando||!Recognition)return;let r;try{r=new Recognition();recognition.current=r;r.lang=turn.language==='en'?'es-MX':'en-US';r.continuous=true;r.interimResults=false;r.onresult=e=>{let addition='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)addition+=e.results[i][0].transcript+' ';textRef.current=(textRef.current+' '+addition).trim();setText(textRef.current);setRows(null);};r.onerror=e=>{if(e.error!=='aborted')setError('La transcripción no está disponible. Escucha tu grabación y escribe lo que dijiste.');};r.onend=()=>setTranscribing(false);r.start();setTranscribing(true);}catch{setError('No fue posible transcribir. La grabación sigue activa; puedes escribir tu respuesta después.');}return()=>{r?.stop();};},[recorder.grabando]);
 async function stop(){
  clearTimer();setPhase('evaluating');const g=generation.current;
  const r=recognition.current;
  const finalText=r?new Promise(resolve=>{const previous=r.onend;let timeout;const finish=()=>{clearTimeout(timeout);previous?.();resolve();};r.onend=finish;timeout=setTimeout(finish,1500);try{r.stop();}catch{finish();}}):Promise.resolve();
  const blob=await recorder.detener();await Promise.all([finalText,new Promise(resolve=>setTimeout(resolve,950))]);
  if(g!==generation.current)return;
  setTranscribing(false);setPhase('idle');setRemaining(0);
  if(blob){if(urlRef.current)URL.revokeObjectURL(urlRef.current);const url=URL.createObjectURL(blob);urlRef.current=url;setAudio(url);}
 }

 async function evaluate(){const g=generation.current;setRows(null);setPhase('evaluating');await new Promise(resolve=>setTimeout(resolve,950));if(g!==generation.current)return;setPhase('idle');setIntegrity(null);const result=assessTurn(turn,text);setRows(result);setSession(s=>({...s,[turn.id]:{id:turn.id,text,rows:result}}));setSaved(false);}
 function revise(id,status,reviewReason=null){const result=rows.map(r=>r.id===id?{...r,status,reviewReason}:r);setRows(result);setSession(s=>({...s,[turn.id]:{id:turn.id,text,rows:result,integrity}}));setSaved(false);}
 function updateIntegrity(value){setIntegrity(value);setSession(s=>({...s,[turn.id]:{...s[turn.id],integrity:value}}));setSaved(false);}
 function next(){const last=idx===turns.length-1;if(last){detener();setFinished(true);}else{reset();setIdx(i=>i+1);}requestAnimationFrame(()=>document.getElementById(last?'judicial-result':'judicial-practice')?.scrollIntoView({block:'start',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));}
 function save(single=false){const segments=single?[{id:turn.id,text,rows,integrity}]:Object.values(session);const data={id:Date.now(),date:new Date().toISOString(),direction,mode,segments,score:single?scoreUnits(rows,integrity).value:totalScore.value};try{const h=[data,...read()].slice(0,60);localStorage.setItem(KEY,JSON.stringify(h));setHistory(h);setSaved(true);}catch{setError('No se pudo guardar el intento.');}}
 const busy=phase!=='idle'||recorder.grabando||speaking||transcribing;
 const latest=new Map();for(const s of [...Object.values(session),...history.flatMap(h=>h.segments)])if(!latest.has(s.id))latest.set(s.id,s);
 const reviewList=[...latest.values()].flatMap(s=>s.rows.filter(r=>r.status!=='matched').map(r=>({...r,segment:s.id})));
 const prior=history.flatMap(h=>h.segments).find(s=>s.id===turn?.id);
 function practiceSegment(id){const target=judicialTurns.find(t=>t.id===id);if(!target)return;reset();setDirection(target.language);setIdx(judicialTurns.filter(t=>t.language===target.language).findIndex(t=>t.id===id));setFinished(false);}
 return <div style={{fontFamily:F.cuerpo,color:C.tinta,display:'grid',gap:18,fontSize:16,lineHeight:1.6}}>
 <Boton variante="fantasma" disabled={busy} onClick={()=>{reset();onBack();}}>Volver al inicio</Boton>
 <div><Titulo>Escucha e interpreta</Titulo>{!direction&&<p style={{margin:0}}>Escucha. Tras 3 segundos, interpreta: se grabará y evaluará automáticamente.</p>}</div>
 {!interpreter&&<JudicialInterpreters onChoose={setInterpreter}/>}
 {interpreter&&!finished&&<>
 <div role="group" aria-label="Dirección de interpretación" style={{display:'flex',gap:10,flexWrap:'wrap'}}>{[['en','Inglés → Español'],['es','Español → Inglés']].map(([value,label])=><Boton key={value} aria-pressed={direction===value} disabled={busy} variante={direction===value?'primario':'secundario'} onClick={()=>{reset();setDirection(value);setIdx(0);setSession({});setIntegrity(null);}}>{label}</Boton>)}</div>
 {direction&&<>
 <Tarjeta id="judicial-practice" style={{display:'grid',gap:14,scrollMarginTop:100}}><strong>{direction==='en'?'Inglés → Español':'Español → Inglés'}</strong><span>Segmento {idx+1} de {turns.length} · {turn.speaker}</span><Titulo nivel={2}>{turn.title}</Titulo><strong>Interpreta al {turn.language==='en'?'español':'inglés'}</strong><JudicialScene phase={phase} remaining={remaining} language={turn.language} speaking={speaking&&!!highlight} evaluated={!!rows} interpreter={interpreter}/><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Boton onClick={listen} disabled={busy}>Escuchar</Boton>{busy&&<Boton variante="secundario" onClick={cancel}>Cancelar</Boton>}{<Boton variante="secundario" aria-pressed={shown} aria-controls="judicial-source" onClick={()=>{setShown(!shown);setListened(true);}}>{shown?'Ocultar texto':'Mostrar texto'}</Boton>}</div>{shown&&<blockquote id="judicial-source" style={{margin:0,padding:16,borderLeft:`4px solid ${C.azul}`}} lang={turn.language}>{highlight?<>{turn.source.slice(0,highlight.start)}<mark ref={activeWord} style={{background:"#FFE08A",color:"#18334D",borderRadius:4,padding:"2px 0"}}>{turn.source.slice(highlight.start,highlight.end)}</mark>{turn.source.slice(highlight.end)}</>:turn.source}</blockquote>}
 <details><summary>Tomar notas</summary><label>Notas<textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} style={{display:'block',width:'100%',padding:12,fontSize:16,boxSizing:'border-box'}}/></label></details>
 {phase==='recording'&&<Boton onClick={stop}>Terminar y evaluar</Boton>}
 <details style={{fontSize:14,color:C.suave}}><summary>Privacidad</summary><p style={{margin:0}}>{Recognition?'La transcripción puede enviar tu voz al proveedor del navegador.':'Escribe tu respuesta después de grabar.'}</p></details>
 {audio&&!text.trim()&&<p>Escribe tu respuesta para evaluar.</p>}{audio&&<div><strong>Escucha tu interpretación</strong><audio controls src={audio} style={{width:'100%'}}/></div>}
 <details><summary>Ajustar voz</summary><div style={{display:'grid',gap:12,marginTop:12}}><label>Voz<select disabled={busy} value={judicialVoice(voices,turn.language,prefs)?.name||''} onChange={e=>{const p={...prefs,[turn.language]:e.target.value};setPrefs(p);guardarPreferencias(p);}} style={{display:'block',maxWidth:'100%',width:'100%',fontSize:16,padding:10}}>{judicialVoices(voices,turn.language).map(({voz},i)=><option key={voz.name+voz.lang} value={voz.name}>{voz.name}{i===0?' · recomendada':''}</option>)}</select></label><label>Velocidad<select disabled={busy} value={prefs.velocidad||0.95} onChange={e=>{const p={...prefs,velocidad:Number(e.target.value)};setPrefs(p);guardarPreferencias(p);}} style={{display:'block',fontSize:16,padding:10}}><option value={0.85}>Lenta</option><option value={0.95}>Normal</option><option value={1.05}>Rápida</option></select></label><p style={{fontSize:14,margin:0}}>Voces disponibles en tu teléfono.</p></div></details><label>Tu respuesta<textarea lang={turn.language==='en'?'es':'en'} rows={5} value={text} disabled={recorder.grabando||transcribing} onChange={e=>{textRef.current=e.target.value;setText(e.target.value);setRows(null);setIntegrity(null);setSession(s=>{const n={...s};delete n[turn.id];return n;});}} placeholder="Escribe o revisa tu respuesta." style={{display:'block',width:'100%',padding:12,fontSize:16,boxSizing:'border-box'}}/></label>
 <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Boton onClick={evaluate} disabled={busy||!text.trim()}>{rows?'Actualizar evaluación':'Terminar'}</Boton><Boton variante="secundario" disabled={busy||!rows} onClick={next}>{idx===turns.length-1?'Ver resultado de la sesión':'Siguiente segmento'}</Boton></div>
 {(error||recorder.error)&&<p role="alert" style={{color:C.coral}}>{error||recorder.error}</p>}</Tarjeta>
 {rows&&phase!=='evaluating'&&mode==='practice'&&<div ref={reportRef} style={{scrollMarginTop:100}}><JudicialReport turn={turn} text={text} rows={rows} integrity={integrity} revise={revise} setIntegrity={updateIntegrity} repeat={()=>{reset();setSession(s=>{const n={...s};delete n[turn.id];return n;});}} save={()=>save(true)} saved={saved} previous={prior?scoreUnits(prior.rows,prior.integrity).value:null} next={next} last={idx===turns.length-1}/></div>}
 </>} </>}
 {finished&&<Tarjeta id="judicial-result" style={{display:'grid',gap:12,scrollMarginTop:100}}><Titulo nivel={2}>Resultado de entrenamiento</Titulo><strong style={{fontSize:32}}>{totalScore.value}%</strong><p>Jurídicas: {totalScore.groups.legal.correct}/{totalScore.groups.legal.total} · Sentido: {totalScore.groups.meaning.correct}/{totalScore.groups.meaning.total}</p><p>{totalScore.pending} pendientes de revisión y {totalScore.critical} posibles errores críticos.</p><p style={{fontSize:14}}>Términos 60% · Contexto 30% · Integridad 10%</p><p style={{fontSize:14}}>Evaluación preliminar · {segmentScores.filter(x=>x.integrity===null).length} segmentos con integridad por revisar.</p>
 {Object.values(session).map(s=><details key={s.id}><summary>{judicialTurns.find(t=>t.id===s.id).title} · {s.id}</summary><p>Tu respuesta: {s.text}</p><p>Modelo: {judicialTurns.find(t=>t.id===s.id).reference}</p>{s.rows.map(r=><div key={r.id}><strong>{r.label}</strong>: {resultLabel(r)} · {r.accepted.join(' / ')}<JudicialReviewMenu row={r} onChange={(status,reviewReason)=>{setSession(prev=>({...prev,[s.id]:{...prev[s.id],rows:prev[s.id].rows.map(x=>x.id===r.id?{...x,status,reviewReason}:x)}}));setSaved(false);}}/></div>)}</details>)}
 <Boton disabled={saved} onClick={()=>save()}>{saved?'Intento guardado':'Guardar intento'}</Boton>{error&&<p role="alert">{error}</p>}<Boton variante="secundario" onClick={()=>{reset();setFinished(false);setIdx(0);setSession({});setIntegrity(null);}}>Nueva sesión</Boton></Tarjeta>}
 {interpreter&&<details><summary>Historial y repaso ({history.length} intentos)</summary>{history.map(h=><p key={h.id}>{new Date(h.date).toLocaleString('es')} · {h.score}% · {h.segments.length} segmentos</p>)}{reviewList.length>0&&<><h3>Repasar errores</h3>{[...new Set(reviewList.map(r=>r.segment))].map(id=><div key={id} style={{marginBottom:12}}><Boton disabled={busy} variante="secundario" onClick={()=>practiceSegment(id)}>{judicialTurns.find(t=>t.id===id)?.title} · {judicialTurns.find(t=>t.id===id)?.language==='en'?'Inglés → Español':'Español → Inglés'}</Boton><p style={{margin:'4px 0'}}>{reviewList.filter(r=>r.segment===id).map(r=>r.label).join(' · ')}</p></div>)}</>}</details>}

 </div>;
}
