import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
export const runtime = () => env as any;
export async function user(){const u=await getChatGPTUser(); if(!u)throw new Error('AUTH');return u;}
export const doctors=()=>String(runtime().CLINICIAN_EMAILS||'').toLowerCase().split(',').map((s:string)=>s.trim()).filter(Boolean);
export function failure(e:any){return Response.json({error:e.message==='CONSENT'?'Open Profile → Privacy & data and give explicit consent before saving health-related data.':e.message==='AUTH'?'Accedi per continuare.':e.message==='FORBIDDEN'?'Accesso non autorizzato.':'Operazione non riuscita. Riprova.'},{status:e.message==='CONSENT'?403:e.message==='AUTH'?401:e.message==='FORBIDDEN'?403:500});}
