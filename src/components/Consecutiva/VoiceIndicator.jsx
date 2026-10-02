import { C } from '../../lib/consecutiva/tokens.js';
export default function VoiceIndicator({ level=0 }) {
  const strength=Math.max(0,Math.min(1,Number(level)||0));
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,color:C.suave}}>
    <span aria-hidden="true" style={{display:'flex',alignItems:'center',gap:3,height:18}}>
      {[.4,.7,1,.7,.4].map((scale,i)=><span key={i} style={{display:'block',width:3,height:3+strength*15*scale,borderRadius:3,background:C.verde,transition:'height 80ms linear'}}/>)}
    </span>
    <span role="status" style={{fontSize:12,lineHeight:1.3}}>Grabando tu voz</span>
  </div>;
}
