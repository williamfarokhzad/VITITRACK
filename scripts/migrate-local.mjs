import {spawnSync} from 'node:child_process';
import {existsSync,mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const built=resolve('dist/server/wrangler.json');
if(!existsSync(built))throw new Error('Build the app first with pnpm run build:portable.');
const dir=mkdtempSync(join(tmpdir(),'vititrack-db-'));
try { const config=JSON.parse(readFileSync(built,'utf8'));config.main=resolve('dist/server/index.js');delete config.assets;config.d1_databases=config.d1_databases.map(db=>({...db,migrations_dir:resolve('drizzle')}));const path=join(dir,'wrangler.json');writeFileSync(path,JSON.stringify(config));const r=spawnSync(process.execPath,[resolve('node_modules/wrangler/bin/wrangler.js'),'d1','migrations','apply','DB','--local','--config',path,'--persist-to',resolve('.wrangler/state')],{stdio:'inherit'});if(r.status!==0)process.exitCode=r.status||1;}finally{rmSync(dir,{recursive:true,force:true})}
