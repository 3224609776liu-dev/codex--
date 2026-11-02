import {defineConfig} from 'vite';

// Playback renditions stay in the release store; original local files stay intact.
export default defineConfig({
 server:{proxy:{
  '^/assets/film-[0-9]+-(480|720|1080)p\\.mp4':{
   target:'https://www.lxzuopinji.pages.dev',changeOrigin:true,
  },
 }},
});
