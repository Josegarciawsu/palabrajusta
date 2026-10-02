import turns from '../../content/consecutiva/consulta.js';
import { normalizar } from './match.js';
const legal=(label,accepted,wrong=[],critical=false)=>({label,accepted,wrong,critical,kind:'legal'});
const meaning=(label,accepted,wrong=[],critical=false)=>({label,accepted,wrong,critical,kind:'meaning'});
const units=[
[legal('Public defender',['defensor publico','abogado de oficio']),meaning('Confirm personal information',['nombre completo','fecha de nacimiento','domicilio actual'])],
[meaning('Full name',['luis alberto santos garcia']),meaning('Date of birth',['march 14 1992','14 march 1992']),meaning('Address',['245 madison avenue'])],
[legal('Misdemeanor',['delito menor']),legal('Without a valid license',['sin una licencia valida','sin licencia valida']),legal('Plea options',['opciones de declaracion','opciones para declararse']),meaning('The decision is yours',['decision es suya','usted decide'])],
[legal('Not guilty',['pleading not guilty','plead not guilty'],['pleading guilty'],true),meaning('Officer’s account',['officer says','officer said','officers account'])],
[legal('Not guilty plea',['declaracion de no culpable','declararse no culpable']),legal('Not admitting the charge',['no esta admitiendo el cargo','no admite el cargo','no admite la acusacion'],['esta admitiendo el cargo','admite el cargo'],true),legal('Prosecution must prove the case',['fiscalia pruebe','fiscalia demuestre','fiscal pruebe']),meaning('Time to review evidence',['tiempo para revisar las pruebas','tiempo para examinar las pruebas'])],
[legal('Plead not guilty',['plead not guilty','pleading not guilty'],['plead guilty'],true),legal('Accept an agreement',['accept an agreement','accept a plea agreement','accept a deal']),meaning('Understand consequences',['understanding the consequences','understand the consequences'])],
[legal('Court approval',['aprobacion del tribunal','aprobacion de la corte']),legal('Guilty plea',['se declara culpable','declararse culpable']),legal('Right to a trial',['derecho a un juicio','derecho al juicio']),meaning('Give up rights',['renuncia','renunciar'])],
[legal('No contest',['no contest','nolo contendere']),legal('Not guilty',['not guilty']),legal('Conviction',['conviction'])],
[legal('No contest plea',['no impugnar los cargos','no controvertir los cargos','sin argumento','nolo contendere']),legal('Does not admit guilt',['no admite culpabilidad','no admite su culpabilidad','no esta admitiendo culpabilidad'],['admite culpabilidad'],true),legal('Conviction',['condena','sentencia condenatoria']),meaning('Court approval required',['tribunal debe aprobar','corte debe aprobar','tribunal debe aprobarla','corte debe aprobarla','aprobacion del tribunal'])],
[meaning('License expired',['license had expired','license was expired','expired license']),meaning('Did not realize',['hadnt realized','had not realized','didnt realize','did not realize'],['i knew'],true),legal('Defense',['defense'])],
[legal('Applicable law',['ley aplicable','legislacion aplicable']),legal('Citation',['citacion','boleta de infraccion']),meaning('Renewal notices',['avisos de renovacion','aviso de renovacion','notificaciones de renovacion'])],
[legal('Citation',['citation','ticket']),meaning('Renewal appointment',['appointment to renew','renewal appointment','scheduled an appointment']),meaning('No current license yet',['still dont have a current license','still do not have a current license','dont have a valid license','do not have a valid license'],['i have a valid license'],true)],
[legal('Not guilty',['se declara no culpable','declararse no culpable']),legal('Discovery',['descubrimiento de pruebas','intercambio de pruebas','revelacion de pruebas']),legal('Officer’s report',['informe del agente','informe policial','reporte del agente']),legal('Lawful stop and citation',['fueron legales','fueron licitas','legalidad']),legal('Procedural issues',['cuestiones procesales','problemas procesales','irregularidades procesales'])],
[legal('Trial',['trial']),legal('Hearing',['hearing']),meaning('Missing work',['missing work','miss work','time off work'])],
[legal('Not guilty',['declaracion de no culpable','declararse no culpable']),legal('Prosecutor',['fiscal']),legal('Reduced charge',['reducir','reducido']),legal('Dismissed charge',['desestimar','desestimado','desestimacion']),meaning('Cannot promise result',['no puedo prometer','no puedo garantizar'],['puedo garantizar','puedo prometer'],true)],
[legal('Agreement',['agreement','deal']),legal('Waiving rights',['giving up','waiving']),meaning('Before acceptance',['before i accept','before accepting'])],
[legal('Fine',['multa']),legal('Court costs',['costas judiciales','costos judiciales']),legal('Conditions',['condiciones']),meaning('Payment deadline',['plazo de pago','fecha limite de pago','plazo para pagar']),meaning('Depends on court decision',['decision del tribunal','decision de la corte'])],
[legal('Jail sentence',['jail sentence','jail time','prison sentence','sentence of imprisonment']),legal('Conviction',['conviction']),legal('Immigration status',['immigration status'])],
[legal('Potential penalties',['penas posibles','posibles penas','sanciones posibles']),legal('Conviction',['condena']),legal('Driving privileges',['derecho a conducir','privilegios de conducir']),legal('Immigration advice',['asesoramiento','asesoria']),meaning('No guarantee of no jail',['no puedo garantizar','no le puedo garantizar'],['garantizo que no','garantizar que no habra carcel'],true)],
[legal('Immigration concerns',['immigration concerns','concerns about immigration']),legal('Not guilty',['plead not guilty','pleading not guilty'],['plead guilty'],true),meaning('Before accepting agreement',['before i accept','before accepting'])],
[legal('Right to attorney',['derecho a un abogado','derecho a abogado']),legal('Right to trial',['derecho a un juicio','derecho al juicio']),legal('Right to silence',['derecho a guardar silencio','derecho al silencio']),meaning('More time',['mas tiempo'])],
[legal('Not admitting charge',['not admitting the charge','not admit the charge','not admitting to the charge'],['admitting the charge'],true),legal('Evidence',['evidence']),legal('Change plea',['change my plea','changing my plea']),meaning('Consequences',['consequences'])],
[legal('Sight translate',['traduccion a la vista','traduzca a la vista']),legal('Court document',['documento judicial','documento del tribunal','documento de la corte']),meaning('Before signing',['antes de firmar'])],
[legal('Document translation',['translation of the entire document','entire document translated','whole document translated']),meaning('Before signing',['before signing','before i sign']),meaning('Ask attorney about unclear terms',['ask you','terms i dont understand','term i dont understand'])]
];
export const judicialTurns=turns.map((t,i)=>({...t,units:units[i].map((u,n)=>({...u,id:`${t.id}-u${n}`}))}));
const norm=text=>normalizar((text||'').replace(/['’]/g,''));
const contains=(text,phrase)=>` ${norm(text)} `.includes(` ${norm(phrase)} `);
// Rule-based training assessment. Unknown paraphrases require human review.
// Negated spans are excluded before matching positive phrases.
export function assessTurn(turn,text){
 const normalized=norm(text);

 return turn.units.map(u=>{
  const accepted=u.accepted.find(p=>contains(normalized,p));
  const wrong=u.wrong.find(p=>{
   const phrase=norm(p), match=` ${normalized} `.indexOf(` ${phrase} `);
   if(match<0)return false;
   // A negative accepted phrase contains its affirmative counterpart.
   if(accepted && contains(accepted,p))return false;
   const prefix=normalized.slice(0,match).trim().split(' ').slice(-3).join(' ');
   return !/\b(no|not|dont|doesnt|cannot|cant)\b/.test(prefix);
  });
  return {...u,status:wrong?'critical':accepted?'matched':'review',matched:accepted||null,reason:wrong?`Posible cambio de sentido: «${wrong}».`:accepted?`Equivalencia detectada: «${accepted}».`:'No se detectó una equivalencia. Revisa si fue omisión o una reformulación válida.'};
 });
}
export function scoreUnits(rows){
 const groups={legal:{correct:0,total:0},meaning:{correct:0,total:0}};
 for(const row of rows){groups[row.kind].total++;if(row.status==='matched')groups[row.kind].correct++;}
 const legalScore=groups.legal.total?groups.legal.correct/groups.legal.total:null;
 const meaningScore=groups.meaning.total?groups.meaning.correct/groups.meaning.total:null;
 const available=(legalScore===null?0:60)+(meaningScore===null?0:30);
 const value=available?Math.round(((legalScore??0)*60+(meaningScore??0)*30)/available*100):0;
 return {value,groups,pending:rows.filter(r=>r.status==='review').length,critical:rows.filter(r=>r.status==='critical').length};
}
