export const correctionLabels = {
  said: 'Sí lo dije; no se detectó.',
  equivalent: 'Usé una equivalencia válida.',
  transcript: 'La transcripción quedó incorrecta.',
};
export const resultLabel = row => row.status === 'matched'
  ? (row.reviewReason ? '✓ Correcto' : '✓ Encontrado')
  : row.status === 'critical' ? '✕ Cambio de sentido' : '✕ No se encontró';

export default function JudicialReviewMenu({ row, onChange }) {
  const value = row.status === 'matched' ? (row.reviewReason || 'matched')
    : row.status === 'critical' ? 'critical' : 'review';
  return <select aria-label={`Revisar ${row.label}`} value={value}
    onChange={e => {
      const choice = e.target.value;
      onChange(correctionLabels[choice] ? 'matched' : choice, correctionLabels[choice] ? choice : null);
    }} style={{padding:10,fontSize:16,maxWidth:'100%',width:'100%'}}>
    <option value="review">✕ No se encontró</option>
    {value==='matched'&&<option value="matched">✓ Encontrado</option>}
    {Object.entries(correctionLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}
    <option value="critical">✕ Cambio de sentido</option>
  </select>;
}
