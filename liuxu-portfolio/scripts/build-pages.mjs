import {build} from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(project,'../dist');
await build({root:project,publicDir:false,build:{outDir:output,emptyOutDir:true}});
const source=path.join(project,'public/assets');
let copied=0;
for(const entry of await fs.readdir(source,{withFileTypes:true})){
 if(!entry.isFile()||entry.name.endsWith('.mp4'))continue;
 const input=path.join(source,entry.name);
 if((await fs.stat(input)).size>25*1024*1024)throw Error('Pages image exceeds 25MiB: '+entry.name);
 await fs.copyFile(input,path.join(output,'assets',entry.name));copied++;
}
await fs.copyFile(path.join(project,'scripts/media-worker.js'),path.join(output,'_worker.js'));
await fs.writeFile(path.join(output,'_routes.json'),JSON.stringify({version:1,include:['/assets/*.mp4'],exclude:[]}));
console.log(`Pages bundle ready: ${copied} original image files. Original videos are delivered unchanged from GitHub Releases.`);
