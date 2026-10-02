import { vocesPara } from './voz.js';
// SpeechSynthesisVoice has no standard gender field. Use explicit labels or known names.
const maleName = /\b(male|david|daniel|alex|aaron|mark|guy|christopher|eric|ryan|davis|tony|andrew|thomas|brian|roger|william|james|henry|oliver|george|arthur|paul|tom|matthew|nathan|evan|michael|jorge|juan|carlos|diego|pablo|miguel|antonio|alvaro|gonzalo|raul)\b/i;
const femaleName = /\b(female|samantha|ava|susan|karen|serena|tessa|allison|jenny|aria|michelle|emma|joanna|salli|ivy|kimberly|victoria|zira|hazel|sara|sonia|libby|jane|nancy)\b/i;
export function judicialVoices(voices, language) {
  const ranked = vocesPara(voices, language);
  if(language==='en'){
    const female=ranked.filter(({voz})=>femaleName.test(voz.name));
    return female.length?female:ranked;
  }
  const male = ranked.filter(({voz})=>! /\bfemale\b/i.test(voz.name) && maleName.test(voz.name));
  return male.length ? male : ranked;
}
export function judicialVoice(voices, language, prefs) {
  const options = judicialVoices(voices,language);
  return (options.find(({voz})=>voz.name===prefs[language]) || options[0])?.voz || null;
}
