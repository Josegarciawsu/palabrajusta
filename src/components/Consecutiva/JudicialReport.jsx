import { C } from '../../lib/consecutiva/tokens.js';
import { Boton, Tarjeta, Titulo } from './ui.jsx';
import { scoreUnits } from '../../lib/consecutiva/judicial.js';
import JudicialScene from './JudicialScene.jsx';

import JudicialReviewMenu, { resultLabel, correctionLabels } from './JudicialReviewMenu.jsx';
export default function JudicialReport({ turn, text, rows, integrity, revise, setIntegrity, repeat, save, saved, previous, next, last }) {
  const score=scoreUnits(rows,integrity);
  return <Tarjeta className="judicial-report" style={{display:'grid',gap:16}}>
    <JudicialScene phase="idle" evaluated language={turn.language}/>
    <Titulo nivel={2}>{score.value}% · Evaluación preliminar</Titulo>
    {previous != null && <p style={{margin:0}}>Último intento: {previous}% · Ahora: {score.value}%</p>}
    <p style={{margin:0,fontSize:14}}>Términos 60% · Contexto 30% · Integridad 10%</p>
    {integrity==null&&<p style={{margin:0,fontSize:14,color:C.suave}}>No encontrado: sin puntos hasta revisarlo. Integridad pendiente.</p>}
    <details open style={{padding:14,borderRadius:12,background:C.superficie}}><summary>Original y tu interpretación</summary>
      <p style={{padding:14,borderRadius:10,background:C.azulSuave}} lang={turn.language}><strong>{turn.language==='en'?'El abogado':'El acusado'}:</strong> {turn.source}</p>
      <p style={{padding:14,borderRadius:10,background:C.ambarSuave}} lang={turn.language==='en'?'es':'en'}><strong>Tu interpretación:</strong> {text}</p>
      <details><summary>Interpretación sugerida</summary><p>{turn.reference}</p></details>
    </details>
    {['legal','meaning'].map(kind=><section key={kind} style={{padding:14,borderRadius:12,background:kind==='legal'?C.azulSuave:C.verdeSuave}}>
      <h3 style={{fontSize:18,margin:'0 0 8px'}}>{kind==='legal'?'Términos jurídicos clave':'Sentido y contexto'} · {score.groups[kind].correct}/{score.groups[kind].total}</h3>
      {rows.filter(r=>r.kind===kind).map(r=><div key={r.id} style={{borderLeft:`3px solid ${r.status==='matched'?C.verde:r.status==='critical'?C.coral:C.azul}`,padding:'10px 12px',marginBottom:8,background:C.fondo}}>
        <strong>{r.label}</strong><span style={{display:'block',color:r.status==='matched'?C.verde:C.coral}}>{resultLabel(r)}{r.critical?' · Clave crítica':''}</span>
        <p style={{margin:'4px 0',fontSize:14}}>Equivalencias: {r.accepted.join(' · ')}</p>
        {r.status==='matched'&&!r.reviewReason&&r.matched&&<p style={{margin:'4px 0',fontSize:14}}>Detectado: {r.matched}</p>}
        {r.status==='matched'&&r.reviewReason&&<p style={{margin:'4px 0',fontSize:14}}>{correctionLabels[r.reviewReason]}</p>}
        {r.status==='critical'&&<p style={{margin:'4px 0',fontSize:14,color:C.coral}}>{r.reason}</p>}
        <details><summary>Revisar resultado</summary><JudicialReviewMenu row={r} onChange={(status,reason)=>revise(r.id,status,reason)}/></details>
      </div>)}
    </section>)}
    <section style={{padding:14,borderRadius:12,background:C.fondo,border:`1px solid ${C.borde}`}}><h3 style={{fontSize:18,margin:'0 0 8px'}}>Omisiones y añadidos</h3>
      <p style={{margin:'0 0 8px'}}>{rows.filter(r=>r.status!=='matched'&&r.status!=='critical').length} no encontrados · {score.critical} cambios de sentido.</p>
      <label>Otros cambios · revisión manual<select aria-label="Omisiones y añadidos adicionales" value={integrity??''} onChange={e=>setIntegrity(e.target.value===''?null:Number(e.target.value))} style={{display:'block',padding:10,fontSize:16,maxWidth:'100%',width:'100%'}}>
        <option value="">Por revisar</option><option value="100">Sin omisiones ni añadidos adicionales</option><option value="50">Un cambio adicional</option><option value="0">Varios cambios adicionales</option>
      </select></label><p style={{margin:'6px 0 0',fontSize:14,color:C.suave}}>No cuentes errores ya evaluados arriba.</p>
    </section>
    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Boton variante="secundario" onClick={repeat}>Repetir segmento</Boton><Boton disabled={saved} onClick={save}>{saved?'Guardado':'Guardar intento'}</Boton>{saved&&<Boton onClick={next}>{last?'Ver resultado':'Siguiente segmento'}</Boton>}</div>
  </Tarjeta>;
}
