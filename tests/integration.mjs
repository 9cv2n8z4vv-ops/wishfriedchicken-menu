import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
const cwd=fileURLToPath(new URL('../', import.meta.url));
const db=await PGlite.create();
await db.exec('create role anon; create role authenticated;');
const server=new PGLiteSocketServer({db,port:55433,host:'127.0.0.1'}); await server.start();
const password=randomBytes(20).toString('hex');
const env={...process.env,DATABASE_URL:'postgresql://postgres:local@127.0.0.1:55433/postgres',DATABASE_SSL:'false',ADMIN_SEED_USERNAME:'wishfc',ADMIN_SEED_PASSWORD:password,SITE_URL:'http://localhost:3000'};
function run(args){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,args,{cwd,env,stdio:'inherit'});p.on('exit',c=>c===0?resolve():reject(new Error('Process exited '+c)));});}
await run(['--import','tsx','scripts/migrate.ts']);
await run(['--import','tsx','scripts/seed.ts']);
await db.exec('set role anon');
try { await db.query('select * from admin_users'); throw new Error('Public role can read admin users!'); } catch (error) { if (error.code !== '42501') throw error; } finally { await db.exec('reset role'); }
const counts=await db.query('select (select count(*) from categories)::int categories,(select count(*) from products)::int products,(select count(*) from product_price_options)::int options'); console.log('SEED',counts.rows);
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1'],{cwd,env,stdio:'inherit'});
let ready=false;
for(let i=0;i<50;i++){try {const r=await fetch('http://localhost:3000'); if(r.ok){ready=true;break;}}catch{} await new Promise(r=>setTimeout(r,300));}
if(!ready)throw new Error('App did not start');
console.log('APP READY');

// Keep database and application in this process tree for the verification run.
try {
await import('./verify-api.mjs').then(m=>m.verify({db,password,cwd}));

} finally {
app.kill('SIGTERM'); await server.stop(); await db.close();
}
