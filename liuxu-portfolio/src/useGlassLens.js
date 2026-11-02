import {useEffect} from 'react';

// Clone only the heading SVG, not the video or the rest of the page.
export function useGlassLens(rootRef){
  useEffect(()=>{
    const root=rootRef.current;
    if(!root)return;
    const capability=window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
    const lens=document.createElement('span');
    lens.className='title-glass-lens';
    lens.setAttribute('aria-hidden','true');
    lens.innerHTML='<span class="lens-frost"></span><span class="lens-badge">1.22×</span>';
    root.appendChild(lens);
    const radius=91,zoom=1.22;
    let original=null,clone=null,raf=0,active=false,x=0,y=0,tx=0,ty=0,last=0,geometry=null;
    function measure(){
      const svg=root.querySelector(':scope > svg');
      if(!svg)return false;
      const r=root.getBoundingClientRect(),s=svg.getBoundingClientRect();
      original=svg;
      geometry={root:r,x:s.left-r.left,y:s.top-r.top,width:s.width,height:s.height};
      return true;
    }
    function draw(now){
      raf=0;
      if(!active||!clone||!geometry)return;
      const dt=last?Math.min((now-last)/1000,.05):1/60;last=now;
      const blend=reduce.matches?1:1-Math.exp(-dt*20);
      x+=(tx-x)*blend;y+=(ty-y)*blend;
      lens.style.transform=`translate3d(${x-radius}px,${y-radius}px,0) scale(1)`;
      clone.style.left=`${radius+(geometry.x-x)*zoom}px`;
      clone.style.top=`${radius+(geometry.y-y)*zoom}px`;
      if(original){const mask=`radial-gradient(circle ${radius}px at ${x-geometry.x}px ${y-geometry.y}px, transparent 0%, transparent 48%, #000 78%)`;original.style.maskImage=mask;original.style.webkitMaskImage=mask;}
      if(Math.abs(tx-x)+Math.abs(ty-y)>.1)raf=requestAnimationFrame(draw);
    }
    function wake(){if(!raf)raf=requestAnimationFrame(draw)}
    function makeClone(){
      const svg=root.querySelector(':scope > svg');
      if(!svg)return;
      clone?.remove();clone=svg.cloneNode(true);
      // Isolate SVG definition IDs so the magnifier cannot affect the real heading.
      const suffix='-lens-'+Math.random().toString(36).slice(2);
      const ids=new Map();clone.querySelectorAll('[id]').forEach(el=>{ids.set(el.id,el.id+suffix);el.id+=suffix});
      clone.querySelectorAll('*').forEach(el=>{for(const attr of [...el.attributes]){let value=attr.value;for(const [id,newId] of ids)value=value.split(`url(#${id})`).join(`url(#${newId})`);if(value!==attr.value)el.setAttribute(attr.name,value)}});
      clone.querySelectorAll('g[filter]').forEach(el=>el.removeAttribute('filter'));
      clone.classList.add('lens-svg');clone.setAttribute('aria-hidden','true');clone.removeAttribute('role');
      clone.querySelectorAll('.stroke-text__fill').forEach(el=>{el.removeAttribute('clip-path');el.querySelectorAll('tspan').forEach(t=>t.style.opacity='1')});
      clone.querySelectorAll('[data-stroke-char]').forEach(el=>{el.style.strokeDashoffset='0';el.style.strokeOpacity='1'});
      Object.assign(clone.style,{width:geometry.width+'px',height:geometry.height+'px',maxWidth:'none',margin:'0',visibility:'visible',transform:`scale(${zoom})`,transformOrigin:'0 0'});
      lens.insertBefore(clone,lens.lastChild);
    }
    function enter(e){
      if(!capability.matches||e.pointerType==='touch'||!measure())return;
      tx=x=e.clientX-geometry.root.left;ty=y=e.clientY-geometry.root.top;
      active=true;last=0;makeClone();lens.classList.add('is-visible');draw(performance.now());
    }
    function move(e){if(!active)return;const rect=root.getBoundingClientRect();tx=e.clientX-rect.left;ty=e.clientY-rect.top;wake()}
    function leave(){if(original){original.style.removeProperty('mask-image');original.style.removeProperty('-webkit-mask-image')}active=false;lens.classList.remove('is-visible');cancelAnimationFrame(raf);raf=0}
    function resize(){leave();geometry=null}
    root.addEventListener('pointerenter',enter);root.addEventListener('pointermove',move);root.addEventListener('pointerleave',leave);
    window.addEventListener('scroll',leave,{passive:true});window.addEventListener('resize',resize);
    const onVisibility=()=>{if(document.hidden)leave()};document.addEventListener('visibilitychange',onVisibility);
    return()=>{leave();cancelAnimationFrame(raf);root.removeEventListener('pointerenter',enter);root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',leave);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',onVisibility);lens.remove()};
  },[rootRef]);
}
