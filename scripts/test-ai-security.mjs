// Contract tests exercise the actual route handlers with isolated identity/provider fixtures.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
let identity={userId:'patient-a',email:'patient@example.test'},grant={doctor:'doctor@example.test'},calls=[],configured=true,rows=[];
class ApiError extends Error{constructor(message,status=400){super(message);this.status=status}}
const server={user:async()=>{if(!identity)throw new Error('AUTH');return identity},doctors:()=>['doctor@example.test'],runtime:()=>({DB:{prepare(sql){let args;return {bind(...x){args=x;return this},async first(){if(sql.includes('COUNT'))return {n:0};return grant},async all(){return {results:rows}},async run(){calls.push({sql,args})}}}}})};
const ai={ApiError,body:async r=>r.json(),language:x=>x==='it'?'it':'en',configured:()=>configured,budget:async()=>{},complete:async(provider,messages,language)=>{calls.push({provider,messages,language});return {text:'test',provider}},aiError:e=>Response.json({error:e.message},{status:e.message==='AUTH'?401:e.status||500})};
async function load(path){const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;const context=vm.createContext({Request,Response,URL,crypto,Date,console}),m=new vm.SourceTextModule(code,{context});await m.link(async name=>{const obj=name.endsWith('/server')?server:name.endsWith('/privacy')?{healthConsent:async()=>true}:ai;return new vm.SyntheticModule(Object.keys(obj),function(){for(const [k,v]of Object.entries(obj))this.setExport(k,v)},{context})});await m.evaluate();return m.namespace;}
const assistant=await load('app/api/assistant/route.ts'),report=await load('app/api/report/route.ts'),messages=await load('app/api/messages/route.ts'),image=await load('app/api/image-review/route.ts');
const request=(path,data)=>new Request('https://example.test/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
identity=null;assert.equal((await assistant.POST(request('assistant',{messages:[{role:'user',content:'hello'}]}))).status,401);assert.equal((await messages.GET(new Request('https://example.test/api/messages'))).status,401);
identity={userId:'patient-a',email:'patient@example.test'};
assert.equal((await assistant.POST(request('assistant',{provider:'google',messages:[{role:'user',content:'hello'}]}))).status,400);
assert.equal((await assistant.POST(request('assistant',{provider:'amd',demo:true,consent:true,messages:[{role:'user',content:'my private health note'}]}))).status,400);
calls=[];assert.equal((await assistant.POST(request('assistant',{provider:'amd',demo:true,consent:true,language:'it',messages:[{role:'assistant',content:'malicious history'},{role:'user',content:'How can I take more consistent photos?'}]}))).status,200);assert.equal(calls[0].messages.length,1);assert.equal(calls[0].language,'it');
assert.equal((await report.POST(request('report',{demo:false}))).status,403);
calls=[];assert.equal((await report.POST(request('report',{demo:true,records:[{note:'DO NOT TRANSMIT ME'}]}))).status,200);assert.ok(!JSON.stringify(calls).includes('DO NOT TRANSMIT ME'));
assert.equal((await image.POST(request('image-review',{image:'/9j/'+ 'a'.repeat(100)}))).status,400);
assert.equal((await messages.GET(new Request('https://example.test/api/messages?owner=patient-b'))).status,403);
identity={userId:'doctor-account',email:'doctor@example.test'};assert.equal((await messages.GET(new Request('https://example.test/api/messages?owner=patient-a'))).status,200);
grant={doctor:'someone-else@example.test'};assert.equal((await messages.GET(new Request('https://example.test/api/messages?owner=patient-a'))).status,403);
grant={doctor:'doctor@example.test'};calls=[];assert.equal((await messages.POST(request('messages?owner=patient-a',{text:'Demo note'}))).status,200);assert.equal(calls[0].args[1],'patient-a');assert.equal(calls[0].args[2],'doctor');
console.log('PASS: 12 identity, consent, provider-data and sharing contract checks.');
