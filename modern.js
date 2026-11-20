(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('portfolio-motion') === 'off';
  if (reduceMotion) document.body.classList.add('reduce-motion');

  const themeButton = document.getElementById('themeToggle');
  const themeIcon = themeButton?.querySelector('.theme-icon');
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('dp-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080b14' : '#f0f4ff');
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☼' : '☾';
    themeButton?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  applyTheme(localStorage.getItem('dp-theme') || 'dark');
  themeButton?.addEventListener('click', () => {
    themeButton.classList.add('theme-animating');
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => themeButton.classList.remove('theme-animating'), 500);
  });

  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => setTimeout(() => loader?.classList.add('hidden'), 350), { once: true });

  const progress = document.getElementById('scrollProgress');
  const topButton = document.getElementById('scrollTop');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
    topButton?.classList.toggle('visible', scrollY > 400);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  topButton?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' }));

  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('siteNav');
  const menu = document.getElementById('menuButton');
  menu?.addEventListener('click', () => {
    const opened = menu.classList.toggle('open');
    nav?.classList.toggle('open', opened);
    menu.setAttribute('aria-expanded', String(opened));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menu?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false');
  }));
  let previousY = 0;
  addEventListener('scroll', () => {
    if (!header || innerWidth < 650) return;
    const y = scrollY;
    header.style.transform = y > 220 && y > previousY + 4 ? 'translateY(-115%)' : 'translateY(0)';
    previousY = y;
  }, { passive: true });

  const revealNodes = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.1 });
    revealNodes.forEach(el => revealObserver.observe(el));
  } else revealNodes.forEach(el => el.classList.add('visible'));

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, end = Number(el.dataset.count || 0), start = performance.now(), duration = 1350;
      const step = now => { const p = Math.min((now - start) / duration, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); countObserver.unobserve(el);
    }), { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));
  } else document.querySelectorAll('[data-count]').forEach(el => el.textContent = Number(el.dataset.count).toLocaleString());

  const role = document.getElementById('typedRole');
  if (role && !reduceMotion) {
    let roles = JSON.parse(role.dataset.roles || '[]'); let index = 0, deleting = false, pos = roles[0]?.length || 0;
    addEventListener('portfolio:roles', e => { roles = e.detail || roles; index = 0; deleting = true; });
    const tick = () => {
      const word = roles[index] || ''; pos += deleting ? -1 : 1; role.textContent = word.slice(0, pos);
      let delay = deleting ? 36 : 72;
      if (!deleting && pos >= word.length) { deleting = true; delay = 1450; }
      else if (deleting && pos <= 0) { deleting = false; index = (index + 1) % roles.length; delay = 280; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1300);
  }

  const dot = document.getElementById('cursorDot'), outline = document.getElementById('cursorOutline');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && localStorage.getItem('portfolio-cursor') !== 'off') {
    document.body.classList.add('cursor-enabled');
    let dotX = -100, dotY = -100, outX = dotX, outY = dotY;
    const trails = [];
    if (innerWidth >= 992 && !reduceMotion) {
      for (let i=0;i<12;i++) { const el=document.createElement('i'); el.className='mouse-trail-dot'; el.style.opacity=String((1-i/12)*.42); el.style.width=el.style.height=`${Math.max(2,6-i*.4)}px`; document.body.appendChild(el); trails.push({el,x:0,y:0}); }
    }
    addEventListener('mousemove', e => {
      if (localStorage.getItem('portfolio-cursor') === 'off') return;
      dotX=e.clientX;dotY=e.clientY;dot?.classList.add('visible');outline?.classList.add('visible');
      const over=e.target.closest('a,button,input,textarea,select');outline?.classList.toggle('cursor-hover',!!over);
    }, { passive: true });
    const draw = () => {
      if (dot) dot.style.transform=`translate(${dotX}px,${dotY}px) translate(-50%,-50%)`;
      outX+=(dotX-outX)*.12;outY+=(dotY-outY)*.12;
      if (outline) outline.style.transform=`translate(${outX}px,${outY}px) translate(-50%,-50%)`;
      let px=dotX,py=dotY;
      trails.forEach((trail,i)=>{const speed=.3-i*.02;trail.x+=(px-trail.x)*speed;trail.y+=(py-trail.y)*speed;trail.el.style.left=`${trail.x}px`;trail.el.style.top=`${trail.y}px`;px=trail.x;py=trail.y;});
      requestAnimationFrame(draw);
    };
    draw();
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.toggle('selected', b === button));
    const category = button.dataset.filter;
    document.querySelectorAll('#projectGrid [data-category]').forEach(card => { card.hidden = category !== 'All' && card.dataset.category !== category; });
  }));

  const motionSetting = document.getElementById('reduceMotion');
  const cursorSetting = document.getElementById('customCursor');
  if (motionSetting) { motionSetting.checked = localStorage.getItem('portfolio-motion') === 'off'; motionSetting.addEventListener('change', () => { localStorage.setItem('portfolio-motion', motionSetting.checked ? 'off' : 'on'); document.body.classList.toggle('reduce-motion', motionSetting.checked); setTimeout(()=>location.reload(),180); }); }
  if (cursorSetting) { cursorSetting.checked = localStorage.getItem('portfolio-cursor') !== 'off'; cursorSetting.addEventListener('change', () => { localStorage.setItem('portfolio-cursor', cursorSetting.checked ? 'on' : 'off'); if (!cursorSetting.checked) { dot?.classList.remove('visible'); outline?.classList.remove('visible'); document.querySelectorAll('.mouse-trail-dot').forEach(el=>el.remove()); } setTimeout(()=>location.reload(),180); }); }
  document.getElementById('resetSettings')?.addEventListener('click', () => { localStorage.removeItem('portfolio-motion'); localStorage.removeItem('portfolio-cursor'); location.reload(); });

  initPhysics();

  function initPhysics() {
    const canvas = document.getElementById('physicsCanvas'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const wrap = canvas.parentElement, hint = document.getElementById('physicsHint');
    const items = [
      ['Python','🐍',[6,182,212]],['React','⚛',[96,165,250]],['Flask','🧪',[167,139,250]],['SQL','🗄',[52,211,153]],
      ['JS','⚡',[251,191,36]],['API','🔗',[244,114,182]],['Git','🌿',[74,222,128]],['CSS','🎨',[192,132,252]],
      ['Node','📦',[6,182,212]],['ML','🤖',[167,139,250]],['Docker','🐳',[96,165,250]],['Linux','🐧',[52,211,153]],
    ];
    let w=0,h=0,raf=0,grab=null,last={x:0,y:0},vel=[]; let blocks=[]; let hintHidden=false;
    const resize=()=>{const r=wrap.getBoundingClientRect(),dpr=devicePixelRatio||1;w=r.width;h=r.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(!blocks.length)spawn();};
    const spawn=()=>{blocks=items.map((it,i)=>{const col=i%4,row=Math.floor(i/4),bw=92+it[0].length*5;return{x:24+col*((w-48)/4)+(Math.random()-.5)*16,y:h-56-row*60-Math.random()*8,vx:(Math.random()-.5)*.8,vy:-Math.random()*.4,w:bw,h:46,rot:(Math.random()-.5)*.08,rv:(Math.random()-.5)*.004,item:it,glow:Math.random(),dir:1,trail:[]};});};
    const xy=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
    const down=e=>{e.preventDefault();const p=xy(e);for(let i=blocks.length-1;i>=0;i--){const b=blocks[i];if(Math.abs(p.x-(b.x+b.w/2))<b.w/2+8&&Math.abs(p.y-(b.y+b.h/2))<b.h/2+8){grab=b;b.ox=b.x-p.x;b.oy=b.y-p.y;b.vx=0;b.vy=0;blocks.splice(i,1);blocks.push(b);vel=[];last=p;if(!hintHidden){hint.style.opacity='0';hintHidden=true;}break;}}};
    const move=e=>{if(!grab)return;e.preventDefault();const p=xy(e);grab.x=p.x+grab.ox;grab.y=p.y+grab.oy;grab.rot*=.85;vel.push({x:p.x-last.x,y:p.y-last.y});if(vel.length>6)vel.shift();last=p;};
    const up=()=>{if(!grab)return;const n=vel.length||1,v=vel.reduce((a,p)=>({x:a.x+p.x,y:a.y+p.y}),{x:0,y:0});grab.vx=v.x/n*2.6;grab.vy=v.y/n*2.6;grab.rv=v.x/n*.06;grab=null;};
    const collide=(a,b)=>{const dx=b.x+b.w/2-a.x-a.w/2,dy=b.y+b.h/2-a.y-a.h/2,d=Math.hypot(dx,dy)||.001,min=(a.w/2+b.w/2+a.h/2+b.h/2)*.4;if(d>=min)return;const nx=dx/d,ny=dy/d,ov=(min-d)*.5;a.x-=nx*ov;a.y-=ny*ov;b.x+=nx*ov;b.y+=ny*ov;const dot=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(dot<0){a.vx+=dot*1.25*nx;a.vy+=dot*1.25*ny;b.vx-=dot*1.25*nx;b.vy-=dot*1.25*ny;}};
    const draw=()=>{raf=requestAnimationFrame(draw);if(!w||!h)return;ctx.clearRect(0,0,w,h);for(let i=0;i<blocks.length-1;i++)for(let j=i+1;j<blocks.length;j++)collide(blocks[i],blocks[j]);
      blocks.forEach(b=>{b.glow+=b.dir*.018;if(b.glow>1){b.glow=1;b.dir=-1}if(b.glow<0){b.glow=0;b.dir=1}if(b!==grab){b.vy+=.38;b.vx*=.997;b.x+=b.vx;b.y+=b.vy;b.rot+=b.rv;b.rv*=.994;if(Math.hypot(b.vx,b.vy)>3)b.trail.push([b.x+b.w/2,b.y+b.h/2]);if(b.trail.length>8)b.trail.shift();if(b.y+b.h>h){b.y=h-b.h;b.vy*= -.5;b.vx*=.82}if(b.y<0){b.y=0;b.vy=Math.abs(b.vy)*.4}if(b.x<0){b.x=0;b.vx=Math.abs(b.vx)*.7}if(b.x+b.w>w){b.x=w-b.w;b.vx=-Math.abs(b.vx)*.7}}
        const [r,g,bl]=b.item[2],cx=b.x+b.w/2,cy=b.y+b.h/2;ctx.save();ctx.translate(cx,cy);ctx.rotate(b.rot);ctx.shadowColor=`rgba(${r},${g},${bl},${b===grab ? .8 : .2+b.glow*.12})`;ctx.shadowBlur=b===grab?30:17;const grad=ctx.createLinearGradient(-b.w/2,-b.h/2,b.w/2,b.h/2);grad.addColorStop(0,`rgba(${r},${g},${bl},.25)`);grad.addColorStop(1,`rgba(${r},${g},${bl},.06)`);ctx.fillStyle=grad;ctx.strokeStyle=`rgba(${r},${g},${bl},${b===grab?1:.62})`;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(-b.w/2,-b.h/2,b.w,b.h,10);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 12px JetBrains Mono,monospace';ctx.fillStyle=`rgb(${r},${g},${bl})`;ctx.fillText(`${b.item[1]} ${b.item[0]}`,0,1);ctx.restore();});
      const fg=ctx.createLinearGradient(0,h-3,0,h);fg.addColorStop(0,'rgba(34,211,238,0)');fg.addColorStop(1,'rgba(34,211,238,.25)');ctx.fillStyle=fg;ctx.fillRect(0,h-3,w,3);};
    resize();addEventListener('resize',resize);canvas.addEventListener('mousedown',down);addEventListener('mousemove',move);addEventListener('mouseup',up);canvas.addEventListener('touchstart',down,{passive:false});addEventListener('touchmove',move,{passive:false});addEventListener('touchend',up);draw();
    addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
  }
})();
