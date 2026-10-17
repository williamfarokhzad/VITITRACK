import VitiApp from '../viti-app';
import {getChatGPTUser} from '../chatgpt-auth';
export const dynamic='force-dynamic';
export default async function Page(){const u=await getChatGPTUser();return <VitiApp initialPage='terms' signedIn={!!u} displayName={u?.fullName||''}/>;}
