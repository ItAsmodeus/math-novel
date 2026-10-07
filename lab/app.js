'use strict';
const QL={chapters:[],add(c){this.chapters.push(c)}};
const TAU=Math.PI*2,RAD=Math.PI/180;
const FONT='"SF Pro Display",-apple-system,"Segoe UI",Roboto,sans-serif';
const C={bg:'#05060f',cy:'#7cc4dc',mg:'#d58ab8',vi:'#9a98d6',am:'#d9ae5c',gr:'#86c79a',rd:'#d9776f',tx:'#dfe3ea',dim:'#8a93a6'};

const U={
  rnd:(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),
  gauss(){let u=0;while(!u)u=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*Math.random())},
  clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),
  lerp:(a,b,t)=>a+(b-a)*t,
  bg(ctx,S,a=1){ctx.fillStyle=`rgba(5,6,15,${a})`;ctx.fillRect(0,0,S.w,S.h)},
  glow(ctx,x,y,r,col,a=1){
    const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=a*.7;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.globalAlpha=1;
  },
  dot(ctx,x,y,r,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()},
  line(ctx,x1,y1,x2,y2,col,lw=1,dash){
    ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.setLineDash(dash||[]);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);
  },
  arrow(ctx,x1,y1,x2,y2,col,lw=2){
    U.line(ctx,x1,y1,x2,y2,col,lw);const a=Math.atan2(y2-y1,x2-x1),s=5+lw*2;
    ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-s*Math.cos(a-.45),y2-s*Math.sin(a-.45));ctx.lineTo(x2-s*Math.cos(a+.45),y2-s*Math.sin(a+.45));ctx.fill();
  },
  text(ctx,s,x,y,col=C.tx,size=13,align='left',weight=500){
    ctx.fillStyle=col;ctx.font=`${weight} ${size}px ${FONT}`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);
  },
  rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)},
  stars(ctx,S,n=120){
    if(!S._st||S._st.length!==n)S._st=Array.from({length:n},()=>[Math.random(),Math.random(),Math.random()]);
    ctx.fillStyle='#cfd8ff';
    for(const s of S._st){ctx.globalAlpha=.15+.55*s[2]*Math.abs(Math.sin(S.t*.5+s[2]*40));const z=1+s[2]*1.3;ctx.fillRect(s[0]*S.w,s[1]*S.h,z,z)}
    ctx.globalAlpha=1;
  },
  pct:(a,b)=>b?Math.round(100*a/b)+'%':'—',
};

const App=(()=>{
  const KEY='quantum-lab-v1';
  const prog={xp:0,mission:{},quiz:{}};
  try{Object.assign(prog,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(prog))}catch(e){}};
  const RANKS=[[0,'Наблюдатель'],[200,'Лаборант'],[500,'Экспериментатор'],[900,'Теоретик'],[1400,'Квантовый инженер'],[1900,'Повелитель волновой функции']];
  const MISSION_XP=50,QUIZ_XP=25,QUIZ_XP_RETRY=10;
  let side,main,raf=0,ro=null,cur=null;

  const el=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild};
  const quizDone=c=>(c.quiz||[]).every((_,i)=>prog.quiz[c.id]&&prog.quiz[c.id][i]!==undefined);
  const status=c=>{const m=!!prog.mission[c.id],q=quizDone(c);return m&&q?'done':(m||(prog.quiz[c.id]&&Object.keys(prog.quiz[c.id]).length))?'half':''};
  const maxXp=()=>QL.chapters.reduce((s,c)=>s+MISSION_XP+(c.quiz||[]).length*QUIZ_XP,0);
  const rank=()=>{let i=0;RANKS.forEach((r,k)=>{if(prog.xp>=r[0])i=k});return i};
  const mark=s=>s==='done'?'✓':s==='half'?'◐':'';
  const plain=s=>s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{23E9}-\u{23FA}️‍]/gu,'').trim();
  const deep=c=>(QL.deep||{})[c.id];
  const sym=c=>(deep(c)||{}).sym||'·';
  const num=c=>{const secs=[...new Set(QL.chapters.map(x=>x.sec))];return `${secs.indexOf(c.sec)+1}.${QL.chapters.filter(x=>x.sec===c.sec).indexOf(c)+1}`};
  const deepHtml=c=>{const d=deep(c);if(!d)return'';
    return `<h3>Формализм</h3><div class="eqs">${d.eq.map(e=>`<div class="eq"><span class="f">${e[0]}</span><span class="n">${e[1]}</span></div>`).join('')}</div>
      <h3>Термины</h3><dl class="terms">${d.terms.map(t=>`<dt>${t[0]}</dt><dd>${t[1]}</dd>`).join('')}</dl>`};

  function toast(msg){
    const t=el(`<div class="toast">${msg}</div>`);document.getElementById('toasts').append(t);
    setTimeout(()=>t.remove(),3200);
  }
  function gain(xp,msg){
    const before=rank();prog.xp+=xp;save();toast(`+${xp} XP · ${msg}`);
    if(rank()>before)setTimeout(()=>toast(`Новый ранг: ${RANKS[rank()][1]}`),600);
    renderSide();
  }

  function renderSide(){
    const id=location.hash.replace(/^#\/?/,''),r=rank(),next=RANKS[r+1],total=maxXp();
    const done=QL.chapters.filter(c=>status(c)==='done').length;
    let html=`<a class="logo" href="#/"><span class="atom">ψ</span>Квантовая лаборатория</a>
      <div class="rank"><small>Ранг</small><b>${RANKS[r][1]}</b>
      <div class="xpbar"><i style="width:${Math.min(100,100*prog.xp/total)}%"></i></div>
      <div class="num"><span>${prog.xp} / ${total} XP</span><span>${next?`до «${next[1]}»: ${next[0]-prog.xp}`:'максимум'}</span></div>
      <div class="num"><span>Пройдено глав: ${done} из ${QL.chapters.length}</span></div></div>`;
    let sec='';
    for(const c of QL.chapters){
      if(c.sec!==sec){sec=c.sec;html+=`<div class="sec-t">${sec}</div>`}
      const s=status(c);
      html+=`<a class="nav-i ${s} ${c.id===id?'on':''}" href="#/${c.id}"><span class="ic">${num(c)}</span><span>${c.title}</span><span class="st">${mark(s)}</span></a>`;
    }
    side.innerHTML=html;
    const b=el('<button class="reset">Сбросить прогресс</button>');
    b.onclick=()=>{if(confirm('Сбросить весь прогресс и опыт?')){prog.xp=0;prog.mission={};prog.quiz={};save();route()}};
    side.append(b);
  }

  function stop(){cancelAnimationFrame(raf);raf=0;if(ro){ro.disconnect();ro=null}cur=null}

  function mount(canvas,scene,S){
    const ctx=canvas.getContext('2d');
    const fit=()=>{
      const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
      canvas.width=Math.max(2,Math.round(r.width*dpr));canvas.height=Math.max(2,Math.round(r.height*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);S.w=r.width||800;S.h=r.height||450;
      ctx.fillStyle=C.bg;ctx.fillRect(0,0,S.w,S.h);
    };
    fit();ro=new ResizeObserver(fit);ro.observe(canvas);
    cur={scene,S,ctx};
    let last=performance.now();
    const tick=now=>{
      S.dt=Math.min(.05,(now-last)/1000);last=now;S.t+=S.dt;
      ctx.save();
      try{scene.draw(ctx,S.w,S.h,S)}catch(e){console.error('[QuantumLab]',scene.id,e);ctx.restore();return}
      ctx.restore();
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
  }

  function buildControls(c,S,box){
    for(const k0 of c.controls||[]){
      const k={...k0,label:plain(k0.label)};
      if(k.type==='range'){
        S.p[k.id]=k.value;
        const n=el(`<label class="ctl"><span>${k.label}<b></b></span><input type="range" min="${k.min}" max="${k.max}" step="${k.step}" value="${k.value}"></label>`);
        const inp=n.querySelector('input'),b=n.querySelector('b');
        const show=()=>{b.textContent=k.fmt?k.fmt(S.p[k.id]):S.p[k.id]};
        inp.oninput=()=>{S.p[k.id]=+inp.value;show();c.on&&c.on(k.id,S)};
        S._set[k.id]=v=>{S.p[k.id]=v;inp.value=v;show()};
        show();box.append(n);
      }else if(k.type==='toggle'){
        S.p[k.id]=!!k.value;
        const n=el(`<button class="tgl" aria-pressed="${S.p[k.id]}">${k.label}</button>`);
        n.onclick=()=>{S.p[k.id]=!S.p[k.id];n.setAttribute('aria-pressed',S.p[k.id]);c.on&&c.on(k.id,S)};
        box.append(n);
      }else if(k.type==='select'){
        S.p[k.id]=k.value||0;
        const n=el(`<div class="seg"><span>${k.label}</span></div>`);
        k.options.forEach((o,i)=>{
          const b=el(`<button class="${i===S.p[k.id]?'on':''}">${o}</button>`);
          b.onclick=()=>{S.p[k.id]=i;n.querySelectorAll('button').forEach((x,j)=>x.classList.toggle('on',j===i));c.on&&c.on(k.id,S)};
          n.append(b);
        });
        box.append(n);
      }else{
        const n=el(`<button class="btn">${k.label}</button>`);
        n.onclick=()=>c.on&&c.on(k.id,S);
        box.append(n);
      }
    }
  }

  function buildQuiz(c,box){
    (c.quiz||[]).forEach((q,i)=>{
      const solved=prog.quiz[c.id]&&prog.quiz[c.id][i]!==undefined;
      const n=el(`<div class="q ${solved?'solved':''}"><h4>${i+1}. ${q.q}</h4><div class="why">${q.why}</div></div>`);
      const why=n.querySelector('.why');let tried=false;
      q.a.forEach((a,j)=>{
        const b=el(`<button>${a}</button>`);
        if(solved){b.disabled=true;if(j===q.c)b.classList.add('ok')}
        b.onclick=()=>{
          if(j!==q.c){b.classList.add('bad');b.disabled=true;tried=true;return}
          b.classList.add('ok');n.classList.add('solved');n.querySelectorAll('button').forEach(x=>x.disabled=true);
          (prog.quiz[c.id]=prog.quiz[c.id]||{})[i]=tried?0:1;
          gain(tried?QUIZ_XP_RETRY:QUIZ_XP,tried?'верно со второй попытки':'верный ответ');
          if(status(c)==='done')toast(`Глава «${c.title}» пройдена`);
        };
        n.insertBefore(b,why);
      });
      box.append(n);
    });
  }

  function renderChapter(c){
    const i=QL.chapters.indexOf(c),prev=QL.chapters[i-1],next=QL.chapters[i+1],done=!!prog.mission[c.id];
    main.innerHTML=`<div class="ch">
      <div class="kicker">§ ${num(c)} · ${c.sec} · ${c.year}</div><h1>${c.title}</h1><p class="lead">${c.lead}</p>
      <div class="stage"><canvas></canvas><div class="hud"></div></div>
      <div class="figcap">Рис. ${num(c)}. Численная модель «${c.title}». Параметры задаются ползунками ниже; величины — в условных единицах, если не указано иное.</div>
      <div class="controls"></div>
      <div class="mission ${done?'done':''}"><span><b>Задача.</b> ${c.mission}</span><span class="xp">${done?'✓ выполнено':'+'+MISSION_XP+' XP'}</span></div>
      <div class="cols"><article class="explain">${c.text}${deepHtml(c)}</article><aside class="quiz"></aside></div>
      <div class="pn">${prev?`<a href="#/${prev.id}">← ${prev.title}</a>`:'<span></span>'}${next?`<a href="#/${next.id}">${next.title} →</a>`:'<a href="#/">К карте лаборатории →</a>'}</div>
    </div>`;
    const hud=main.querySelector('.hud'),mis=main.querySelector('.mission');let hudText='';
    const S={p:{},d:{},t:0,dt:0,w:800,h:450,_set:{},
      set(id,v){this._set[id]&&this._set[id](v)},
      hud(html){if(html!==hudText){hudText=html;hud.innerHTML=html}},
      win(){
        if(prog.mission[c.id])return;prog.mission[c.id]=1;
        mis.classList.add('done');mis.querySelector('.xp').textContent='✓ выполнено';
        gain(MISSION_XP,'миссия выполнена');
        if(status(c)==='done')toast(`Глава «${c.title}» пройдена`);
      }};
    buildControls(c,S,main.querySelector('.controls'));
    if(!(c.controls||[]).length)main.querySelector('.controls').remove();
    buildQuiz(c,main.querySelector('.quiz'));
    c.init&&c.init(S);
    mount(main.querySelector('canvas'),c,S);
  }

  const hero={id:'hero',draw(ctx,w,h,S){
    U.bg(ctx,S);U.stars(ctx,S,170);
    for(let k=0;k<8;k++){
      ctx.beginPath();
      for(let x=0;x<=w;x+=5){
        const u=x/w,env=Math.exp(-Math.pow(u-.5-.28*Math.sin(S.t*.22+k*.9),2)*9);
        const y=h*.48+Math.sin(u*24+S.t*(1.1+k*.17)+k)*env*h*(.07+.022*k);
        x?ctx.lineTo(x,y):ctx.moveTo(x,y);
      }
      ctx.strokeStyle=`hsla(${188+k*17},100%,70%,${.55-k*.05})`;ctx.lineWidth=1.6;ctx.stroke();
    }
    for(let k=0;k<2;k++){const x=w*(.5+(k?1:-1)*(.18+.1*Math.sin(S.t*.4))),y=h*.48+Math.sin(S.t*1.3)*h*.05*(k?1:-1);U.glow(ctx,x,y,34,k?C.mg:C.cy,.8);U.dot(ctx,x,y,3,'#fff')}
  }};

  function renderHome(){
    const first=QL.chapters.find(c=>status(c)!=='done')||QL.chapters[0];
    let html=`<section class="hero"><canvas></canvas><div class="in">
      <h1>Квантовая лаборатория</h1>
      <p>Интерактивный учебник: время, пространство-время, чёрные дыры, квазары, Вселенная и квантовые парадоксы — ${QL.chapters.length} глав с живыми симуляциями. Крути ручки, выполняй миссии, отвечай на вопросы — и собирай опыт.</p>
      <a class="cta" href="#/${first.id}">${prog.xp?'Продолжить':'Начать'}: ${first.title} →</a></div></section>`;
    let sec='';
    for(const c of QL.chapters){
      if(c.sec!==sec){if(sec)html+='</div>';sec=c.sec;html+=`<h2 class="grid-t">${sec}</h2><div class="grid">`}
      const s=status(c);
      html+=`<a class="card ${s}" href="#/${c.id}"><span class="st">${s==='done'?'✓ пройдено':s==='half'?'◐ в процессе':''}</span><div class="ic">${sym(c)}</div><span class="no">§ ${num(c)}</span><h3>${c.title}</h3><p>${c.lead}</p></a>`;
    }
    main.innerHTML=html+'</div>';
    mount(main.querySelector('canvas'),hero,{p:{},d:{},t:0,dt:0,w:800,h:400});
  }

  function route(){
    const id=location.hash.replace(/^#\/?/,''),c=QL.chapters.find(x=>x.id===id);
    stop();c?renderChapter(c):renderHome();renderSide();
    main.scrollTop=0;side.classList.remove('open');
  }

  return{
    start(){
      side=document.getElementById('side');main=document.getElementById('main');
      document.getElementById('menu').onclick=()=>side.classList.toggle('open');
      addEventListener('hashchange',route);route();
    },
    cur:()=>cur,
  };
})();
