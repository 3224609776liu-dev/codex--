// Pages serves the website. GitHub Releases serves unchanged original media.
const ALLOWED=/^\/assets\/(film-(?:[0-9]|1[0-6])|hero)\.mp4$/;
const RELEASE='https://github.com/3224609776liu-dev/codex--/releases/download/portfolio-media-v1/';
export default {async fetch(request,env){
 const url=new URL(request.url);const match=url.pathname.match(ALLOWED);
 if(!match)return env.ASSETS.fetch(request);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
 return new Response(null,{status:302,headers:{Location:RELEASE+match[1]+'.mp4','Cache-Control':'public, max-age=300'}});
}};
