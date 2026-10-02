import image from '../../assets/judicial-interpreters.webp';
import { C } from '../../lib/consecutiva/tokens.js';
export function InterpreterPortrait({ interpreter }) {
  return <span className="judicial-interpreter-portrait" role="img" aria-label={`${interpreter==='daniel'?'Daniel':'Sofía'} · Intérprete`}>
    <img src={image} alt="" style={{position:'absolute',top:0,left:interpreter==='daniel'?0:'-100%',width:'200%',maxWidth:'none',height:'100%',objectFit:'cover'}}/>
  </span>;
}
export default function JudicialInterpreters({ onChoose }) {
  return <section><h2 style={{fontSize:20,margin:'0 0 12px'}}>Elige tu intérprete</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12,maxWidth:460}}>
      {[['daniel','Daniel'],['sofia','Sofía']].map(([id,name])=><button key={id} onClick={()=>onChoose(id)} aria-label={`Elegir a ${name}`}
        style={{display:'block',minWidth:0,width:'100%',alignSelf:'start',border:`1px solid ${C.borde}`,background:C.superficie,padding:6,borderRadius:14,cursor:'pointer',color:C.tinta,font:'inherit'}}>
        <InterpreterPortrait interpreter={id}/><strong style={{display:'block',padding:6}}>{name}</strong>
      </button>)}
    </div>
  </section>;
}
