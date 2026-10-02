import image from '../../assets/judicial-interpreters.webp';
import { C } from '../../lib/consecutiva/tokens.js';
export function InterpreterPortrait({ interpreter }) {
  return <span role="img" aria-label={`${interpreter==='daniel'?'Daniel':'Sofía'} · Intérprete`}
    style={{display:'block',width:'100%',aspectRatio:'1',backgroundImage:`url(${image})`,backgroundSize:'200% 100%',backgroundPosition:interpreter==='daniel'?'0% 0%':'100% 0%',borderRadius:12}}/>;
}
export default function JudicialInterpreters({ onChoose }) {
  return <section><h2 style={{fontSize:20,margin:'0 0 12px'}}>Elige tu intérprete</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12,maxWidth:460}}>
      {[['daniel','Daniel'],['sofia','Sofía']].map(([id,name])=><button key={id} onClick={()=>onChoose(id)} aria-label={`Elegir a ${name}`}
        style={{border:`1px solid ${C.borde}`,background:C.superficie,padding:6,borderRadius:14,cursor:'pointer',color:C.tinta,font:'inherit'}}>
        <InterpreterPortrait interpreter={id}/><strong style={{display:'block',padding:6}}>{name}</strong>
      </button>)}
    </div>
  </section>;
}
