import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const project=fileURLToPath(new URL('../',import.meta.url));
if(!process.env.npm_execpath)throw new Error('Please run npm run build from the repository root.');
const install=spawnSync(process.execPath,[process.env.npm_execpath,'ci','--no-audit','--no-fund'],{cwd:project,stdio:'inherit'});
if(install.status!==0)process.exit(install.status||1);
await import('./build-pages.mjs');
