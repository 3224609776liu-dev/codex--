// Pages streams both intact originals and separate playback renditions.
const ALLOWED=/^\/assets\/((?:film-(?:[0-9]|1[0-6])|hero)(?:-(480|720|1080)p)?)\.mp4$/;
const RELEASE='https://github.com/3224609776liu-dev/codex--/releases/download/portfolio-media-v1/';
const PLAYBACK_RELEASE='https://github.com/3224609776liu-dev/codex--/releases/download/portfolio-playback-v1/';
export default {async fetch(request,env){
 const url=new URL(request.url);const match=url.pathname.match(ALLOWED);
 if(!match)return env.ASSETS.fetch(request);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
 const headers=new Headers();
 for(const name of ['Range','If-Range','If-None-Match','If-Modified-Since']){
  const value=request.headers.get(name);if(value)headers.set(name,value);
 }
 let upstream;
 try{upstream=await fetch((match[2]?PLAYBACK_RELEASE:RELEASE)+match[1]+'.mp4',{method:request.method,headers,redirect:'follow'});}
 catch{return new Response('Video temporarily unavailable. Please retry.',{status:502,headers:{'Cache-Control':'no-store'}});}
 if(![200,206,304,416].includes(upstream.status)){
  upstream.body?.cancel();
  return new Response('Video temporarily unavailable. Please retry.',{status:502,headers:{'Cache-Control':'no-store'}});
 }
 const responseHeaders=new Headers(upstream.headers);
 responseHeaders.set('Content-Type','video/mp4');
 responseHeaders.set('Content-Disposition','inline');
 responseHeaders.set('Accept-Ranges','bytes');
 responseHeaders.set('Cache-Control','public, max-age=300');
 responseHeaders.delete('Set-Cookie');
 responseHeaders.delete('Location');
 // Stream the original bytes; do not buffer, resize or transcode the video.
 return new Response(request.method==='HEAD'?null:upstream.body,{status:upstream.status,headers:responseHeaders});
}};
