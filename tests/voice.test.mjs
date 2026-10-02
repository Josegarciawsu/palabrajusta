import assert from 'node:assert/strict';
import {speechParts,hablar,detener} from '../src/lib/consecutiva/voz.js';
const text='  Hello, sir.  Next sentence!';
const parts=speechParts(text);assert.equal(text.slice(parts[1].start,parts[1].start+parts[1].text.length),'Next sentence!');
let utterance;globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
globalThis.window={speechSynthesis:{cancel(){},speak(u){utterance=u;}}};
const highlights=[];const promise=hablar(text,'en',null,0.95,h=>highlights.push(h));utterance.onstart();assert.equal(text.slice(highlights[0].start,highlights[0].end),'Hello, sir.');utterance.onboundary({name:'word',charIndex:7});assert.equal(text.slice(highlights[1].start,highlights[1].end),'sir.');utterance.onend();utterance.onstart();assert.equal(text.slice(highlights[2].start,highlights[2].end),'Next sentence!');detener();await promise;const count=highlights.length;utterance.onboundary({name:'word',charIndex:0});assert.equal(highlights.length,count);
console.log('Karaoke offsets, sentence fallback, word events and cancellation passed.');
// Mobile playback: one utterance, no start event, missing end event and explicit errors.
const realTimeout=globalThis.setTimeout,realInterval=globalThis.setInterval;
const realClearTimeout=globalThis.clearTimeout,realClearInterval=globalThis.clearInterval;
const timeouts=new Map(),intervals=new Map();let timerId=0;
globalThis.setTimeout=fn=>{const id=++timerId;timeouts.set(id,fn);return id;};
globalThis.setInterval=fn=>{const id=++timerId;intervals.set(id,fn);return id;};
globalThis.clearTimeout=id=>timeouts.delete(id);globalThis.clearInterval=id=>intervals.delete(id);
try{
 let calls=0;window.speechSynthesis.speak=u=>{utterance=u;calls++;};
 const mobile=hablar(text,'en',null,.95,null,{single:true,watchdog:30000});
 assert.equal(utterance.text,text.trim());assert.equal(calls,1);
 utterance.onstart();window.speechSynthesis.speaking=false;window.speechSynthesis.pending=false;
 [...intervals.values()][0]();assert.equal((await mobile).ok,true);assert.equal(timeouts.size,0);assert.equal(intervals.size,0);
 const blocked=hablar(text,'en',null,.95,null,{single:true,watchdog:30000});
 [...timeouts.values()][0]();assert.equal((await blocked).ok,false);assert.equal(timeouts.size,0);
 const failed=hablar(text,'en',null,.95,null,{single:true,watchdog:30000});utterance.onerror({error:'not-allowed'});assert.equal((await failed).ok,false);
 const cancelled=hablar(text,'en',null,.95,null,{single:true,watchdog:30000});detener();assert.equal((await cancelled).cancelled,true);assert.equal(intervals.size,0);
}finally{globalThis.setTimeout=realTimeout;globalThis.setInterval=realInterval;globalThis.clearTimeout=realClearTimeout;globalThis.clearInterval=realClearInterval;}
console.log('Mobile single-utterance playback, blocked start, missing end, errors and cancellation passed.');
