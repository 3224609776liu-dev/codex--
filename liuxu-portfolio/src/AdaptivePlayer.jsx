import React,{forwardRef,useEffect,useRef,useState} from 'react';
import variantsManifest from './video-variants.json';
import './AdaptivePlayer.css';

const LEVELS=[480,720,1080];
function networkQuality(){
 const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
 if(connection?.saveData||/^(slow-2g|2g)$/.test(connection?.effectiveType||''))return 480;
 if(connection?.effectiveType==='3g'||(connection?.downlink>0&&connection.downlink<2.5))return 480;
 if(connection?.downlink>=8)return 1080;
 return 720;
}

export default forwardRef(function AdaptivePlayer({project},externalRef){
 const variants=variantsManifest.videos[project.id];
 const video=useRef(null),pending=useRef({time:0,playing:true}),qualityRef=useRef(networkQuality());
 const modeRef=useRef('auto'),lastChange=useRef(0),stallTimes=useRef([]),waitingAt=useRef(null),stableSince=useRef(0);
 const mounted=useRef(true),playAttempt=useRef(0);
 const [mode,setMode]=useState('auto'),[quality,setQuality]=useState(qualityRef.current);
 const [needsPlay,setNeedsPlay]=useState(false),[mutedNotice,setMutedNotice]=useState(false);
 const [error,setError]=useState(false),[switching,setSwitching]=useState(false);
 const [loading,setLoading]=useState(true);
 const src=variants?.[quality]?.src||`/assets/film-${project.id}.mp4`;

 function attach(node){video.current=node;if(typeof externalRef==='function')externalRef(node);else if(externalRef)externalRef.current=node;}
 async function play(){
  const element=video.current;if(!element)return;
  const attempt=++playAttempt.current;
  try{await element.play();if(mounted.current&&attempt===playAttempt.current)setNeedsPlay(false);}
  catch(e){
   if(!mounted.current||attempt!==playAttempt.current||e.name==='AbortError')return;
   if(e.name==='NotAllowedError'&&!element.muted){
    element.muted=true;
    try{await element.play();if(mounted.current&&attempt===playAttempt.current){setMutedNotice(true);setNeedsPlay(false);}return;}catch{}
   }
   if(mounted.current&&attempt===playAttempt.current)setNeedsPlay(true);
  }
 }
 function switchTo(next){
  const element=video.current;
  if(!element||qualityRef.current===next||!variants?.[next])return;
  // Keep the same video element and preserve its timeline, sound and play state.
  pending.current={time:element.currentTime||pending.current?.time||0,playing:!element.paused||Boolean(pending.current?.playing),muted:element.muted,volume:element.volume,rate:element.playbackRate};
  ++playAttempt.current;qualityRef.current=next;lastChange.current=performance.now();
  waitingAt.current=null;stallTimes.current=[];
  setSwitching(true);setLoading(true);setError(false);setQuality(next);
 }
 function choose(event){
  const nextMode=event.target.value;modeRef.current=nextMode;setMode(nextMode);
  switchTo(nextMode==='auto'?networkQuality():Number(nextMode));
 }
 function downgrade(){
  if(modeRef.current!=='auto'||performance.now()-lastChange.current<12000)return;
  const index=LEVELS.indexOf(qualityRef.current);
  if(index>0)switchTo(LEVELS[index-1]);
 }
 function waiting(){
  setLoading(true);
  if(!video.current||video.current.paused||video.current.seeking)return;
  const now=performance.now();waitingAt.current??=now;
  stallTimes.current=stallTimes.current.filter(time=>now-time<20000);
  stallTimes.current.push(now);
  if(stallTimes.current.length>=2)downgrade();
 }
 function loaded(){
  const element=video.current,snapshot=pending.current;
  if(!element)return;
  if(snapshot){
   if(snapshot.muted!==undefined)element.muted=snapshot.muted;
   if(snapshot.volume!==undefined)element.volume=snapshot.volume;
   if(snapshot.rate!==undefined)element.playbackRate=snapshot.rate;
   if(snapshot.time>0)element.currentTime=Math.min(snapshot.time,Math.max(0,element.duration-.05));
   pending.current=null;
   if(snapshot.playing)play();else element.pause();
  }
  setSwitching(false);
 }
 function playing(){waitingAt.current=null;stableSince.current=performance.now();setLoading(false);setSwitching(false);setNeedsPlay(false);setError(false);}
 function failed(){
  if(modeRef.current==='auto'&&qualityRef.current>480){switchTo(LEVELS[LEVELS.indexOf(qualityRef.current)-1]);return;}
  setLoading(false);setError(true);setSwitching(false);
 }
 function retry(){pending.current={time:video.current?.currentTime||pending.current?.time||0,playing:true};setError(false);setLoading(true);video.current?.load();play();}

 useEffect(()=>{
  mounted.current=true;
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const changed=()=>{if(modeRef.current==='auto')switchTo(networkQuality());};
  connection?.addEventListener?.('change',changed);
  // One low-frequency timer exists only while this player is mounted.
  const timer=setInterval(()=>{
   const element=video.current;if(document.hidden||!element||element.paused||modeRef.current!=='auto')return;
   const now=performance.now();
   if(waitingAt.current&&now-waitingAt.current>5000){downgrade();return;}
   if(!waitingAt.current&&element.buffered.length&&now-stableSince.current>30000&&now-lastChange.current>45000){
    const index=LEVELS.indexOf(qualityRef.current),ahead=element.buffered.end(element.buffered.length-1)-element.currentTime;
    if(index<2&&ahead>15&&LEVELS[index+1]<=networkQuality())switchTo(LEVELS[index+1]);
   }
  },2000);
  return()=>{mounted.current=false;++playAttempt.current;clearInterval(timer);connection?.removeEventListener?.('change',changed);};
 },[]);

 return <div className="adaptive-player">
  <div className="player-toolbar">
   <span className="playback-status" aria-live="polite">{switching?'正在切换清晰度':mode==='auto'?`自动适应网络 · ${quality}p`:`${quality}p · 手动清晰度`}</span>
   <label className="quality-control"><span>清晰度</span><select aria-label="视频清晰度" value={mode} onChange={choose}>
    <option value="auto">自动</option>{LEVELS.map(level=><option key={level} value={String(level)}>{level}p</option>)}
   </select></label>
  </div>
  <div className="player-stage" aria-busy={switching}>
   <video ref={attach} controls autoPlay={Boolean(pending.current?.playing)} playsInline preload="auto" src={src+'?playback=3'}
    onLoadedMetadata={loaded} onLoadedData={()=>setLoading(false)} onSeeked={()=>setLoading(false)} onPlaying={playing} onWaiting={waiting} onCanPlay={()=>setLoading(false)}
    onError={failed}
    webkit-playsinline="true" x5-playsinline="true" x5-video-player-type="h5-page"
    poster={project.poster||`/assets/cover-${project.id}.jpg`}/>
   {loading&&!needsPlay&&!error&&<div className="video-loading" role="status"><i/>{switching?'正在切换…':'视频加载中…'}</div>}
   {needsPlay&&!error&&<button className="video-start" onClick={play}>▶ 点击播放</button>}
  </div>
  {mutedNotice&&<button className="video-sound" onClick={()=>{video.current.muted=false;setMutedNotice(false);play();}}>点击开启声音 ↗</button>}
  {error&&<div className="video-error" role="alert"><span>视频暂未加载成功，请重试或选择较低清晰度。</span><button onClick={retry}>重新播放 ↗</button></div>}
 </div>;
});
