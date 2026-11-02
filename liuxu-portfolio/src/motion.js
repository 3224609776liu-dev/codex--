import {useLayoutEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const clear='transform,opacity,visibility,clipPath,willChange';
const openMask='inset(0% 0% 0% 0%)';

export function useEditorialMotion(){
  useLayoutEffect(()=>{
    const mm=gsap.matchMedia();
    let refreshTimer;
    let openingPlayed=false;
    const refresh=()=>{clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>ScrollTrigger.refresh(),160)};
    mm.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width: 900px)'},context=>{
      if(!context.conditions.motion)return;
      const desktop=context.conditions.desktop;
      const hero=document.querySelector('#home');
      const shutters=hero.querySelectorAll('.opening-shutter');
      if(window.scrollY<100 && !openingPlayed){
        openingPlayed=true;
        gsap.set('.opening-shutters',{display:'grid'});
        gsap.set(shutters,{scaleY:1,transformOrigin:'top'});
        const intro=gsap.timeline({defaults:{ease:'expo.out'},onComplete:()=>gsap.set('.opening-shutters',{display:'none'})});
        intro.to(shutters,{scaleY:0,duration:1.8,stagger:.18,ease:'power4.inOut'},.1)
          .fromTo('.wordmark-cross',{yPercent:160,rotation:-70,scale:.4},{yPercent:0,rotation:0,scale:1,duration:2,clearProps:clear},1)
          .fromTo('header nav > *',{y:-35,clipPath:'inset(0% 0% 100% 0%)'},{y:0,clipPath:openMask,duration:1.2,stagger:.12,clearProps:clear},.9)
          .fromTo('.hero-topline span',{y:30,clipPath:'inset(0% 0% 100% 0%)'},{y:0,clipPath:openMask,duration:1.5,stagger:.1,clearProps:clear},1.1)
          .fromTo('.hero-caption',{y:45,clipPath:'inset(0% 100% 0% 0%)'},{y:0,clipPath:openMask,duration:1.65,clearProps:clear},1.45)
          .fromTo('.hero-stage',{scale:.82,rotation:-8,opacity:0},{scale:1,rotation:0,opacity:1,duration:2.3,clearProps:clear},.6)
          .fromTo('.hero-lower > *',{y:70,clipPath:'inset(0% 0% 100% 0%)'},{y:0,clipPath:openMask,duration:1.65,stagger:.18,clearProps:clear},1.7)
          .fromTo('.hero-footer',{scaleX:.5,opacity:0,transformOrigin:'left'},{scaleX:1,opacity:1,duration:1.5,clearProps:clear},2);
      }
      gsap.utils.toArray('.below-hero section').forEach(section=>{
        const display=section.querySelector('.section-display');
        const heading=section.querySelector('.section-head h2, .contact-inner > h2');
        const label=section.querySelector('.section-label .eyebrow');
        const tl=gsap.timeline({scrollTrigger:{trigger:section,start:'top 82%',once:true},defaults:{ease:'expo.out'}});
        if(display)tl.fromTo(display,{xPercent:-28,yPercent:110,scaleX:1.2,skewY:5,willChange:'transform'},{xPercent:0,yPercent:0,scaleX:1,skewY:0,duration:1.85,clearProps:clear},0);
        if(label)tl.fromTo(label,{x:-35,clipPath:'inset(0% 100% 0% 0%)'},{x:0,clipPath:openMask,duration:1.3,clearProps:clear},.15);
        if(heading)tl.fromTo(heading,{y:60,clipPath:'inset(0% 0% 100% 0%)'},{y:0,clipPath:openMask,duration:1.6,clearProps:clear},.38);
      });
      gsap.utils.toArray('.portrait').forEach(portrait=>{
        gsap.fromTo(portrait,{clipPath:'inset(15% 0% 85% 0%)'},{clipPath:openMask,duration:1.9,ease:'expo.inOut',clearProps:'clipPath',scrollTrigger:{trigger:portrait,start:'top 86%',once:true}});
        // Only the large portrait gets a scrubbed transform; card galleries stay light.
        if(desktop)gsap.fromTo(portrait.querySelector('img'),{yPercent:-5,scale:1.1},{yPercent:5,scale:1.1,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:1.8}});
      });
      ['.profile-copy > *','.stats > div','.timeline > div','.skill-grid > article','.contact-row, .contact-inner > .email'].forEach(selector=>{
        ScrollTrigger.batch(selector,{start:'top 89%',once:true,interval:.16,batchMax:4,onEnter:items=>gsap.fromTo(items,{y:desktop?65:38,clipPath:'inset(0% 0% 100% 0%)'},{y:0,clipPath:openMask,duration:1.45,stagger:.16,ease:'power4.out',clearProps:clear,overwrite:'auto'})});
      });
      // Avoid hiding focusable content and respect native scrolling / anchor navigation.
      return ()=>gsap.set('.opening-shutters',{display:'none'});
    });
    const resize=new ResizeObserver(refresh);
    document.querySelectorAll('.page-container, .contact-inner').forEach(el=>resize.observe(el));
    document.addEventListener('load',refresh,true);
    document.fonts?.ready.then(refresh);
    return ()=>{mm.revert();resize.disconnect();document.removeEventListener('load',refresh,true);clearTimeout(refreshTimer)};
  },[]);
}

export function useCardMotion(selector,key){
  useLayoutEffect(()=>{
    const container=document.querySelector(selector);
    if(!container)return;
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const cards=Array.from(container.children);
      const entered=new WeakSet();
      ScrollTrigger.batch(cards,{start:'top 93%',once:true,interval:.15,batchMax:4,onEnter:batch=>{
        const fresh=batch.filter(card=>!entered.has(card));
        fresh.forEach(card=>entered.add(card));
        gsap.fromTo(fresh,{y:80,scale:.93,rotation:1.2,transformOrigin:'center bottom',clipPath:'inset(0% 0% 100% 0% round 18px)',willChange:'transform'},
          {y:0,scale:1,rotation:0,clipPath:'inset(0% 0% 0% 0% round 18px)',duration:1.6,stagger:.16,ease:'expo.out',clearProps:clear,overwrite:'auto'});
        fresh.forEach((card,index)=>{
          const img=card.querySelector('img');
          if(img)gsap.fromTo(img,{scale:1.12},{scale:1,duration:2.1,delay:index*.16,ease:'power3.out',clearProps:'transform',overwrite:'auto'});
        });
      }});
      const revealFocus=e=>{const card=cards.find(c=>c.contains(e.target));if(card){entered.add(card);gsap.killTweensOf(card);gsap.set(card,{clearProps:clear})}};
      container.addEventListener('focusin',revealFocus);
      return ()=>{container.removeEventListener('focusin',revealFocus);cards.forEach(c=>{gsap.killTweensOf(c);gsap.killTweensOf(c.querySelectorAll('img'))})};
    });
    const tick=requestAnimationFrame(()=>ScrollTrigger.refresh());
    return ()=>{cancelAnimationFrame(tick);mm.revert()};
  },[selector,key]);
}
