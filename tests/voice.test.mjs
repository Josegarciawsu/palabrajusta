import assert from 'node:assert/strict';
import {speechParts,hablar,detener} from '../src/lib/consecutiva/voz.js';
const text='  Hello, sir.  Next sentence!';
const parts=speechParts(text);assert.equal(text.slice(parts[1].start,parts[1].start+parts[1].text.length),'Next sentence!');
let utterance;globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
globalThis.window={speechSynthesis:{cancel(){},speak(u){utterance=u;}}};
const highlights=[];const promise=hablar(text,'en',null,0.95,h=>highlights.push(h));utterance.onstart();assert.equal(text.slice(highlights[0].start,highlights[0].end),'Hello, sir.');utterance.onboundary({name:'word',charIndex:7});assert.equal(text.slice(highlights[1].start,highlights[1].end),'sir.');utterance.onend();utterance.onstart();assert.equal(text.slice(highlights[2].start,highlights[2].end),'Next sentence!');detener();await promise;const count=highlights.length;utterance.onboundary({name:'word',charIndex:0});assert.equal(highlights.length,count);
console.log('Karaoke offsets, sentence fallback, word events and cancellation passed.');
