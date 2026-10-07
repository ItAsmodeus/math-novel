'use strict';
(()=>{
const PAIRS=[[0,1],[0,2],[1,2]];
function accel(s,m,e2,ax,ay){
  ax[0]=ax[1]=ax[2]=ay[0]=ay[1]=ay[2]=0;
  for(const[i,j]of PAIRS){const dx=s.x[j]-s.x[i],dy=s.y[j]-s.y[i],r2=dx*dx+dy*dy+e2,k=1/(r2*Math.sqrt(r2));
    ax[i]+=m[j]*dx*k;ay[i]+=m[j]*dy*k;ax[j]-=m[i]*dx*k;ay[j]-=m[i]*dy*k}
}
function step(s,m,e2,h,ax,ay){
  accel(s,m,e2,ax,ay);for(let i=0;i<3;i++){s.vx[i]+=ax[i]*h/2;s.vy[i]+=ay[i]*h/2;s.x[i]+=s.vx[i]*h;s.y[i]+=s.vy[i]*h}
  accel(s,m,e2,ax,ay);for(let i=0;i<3;i++){s.vx[i]+=ax[i]*h/2;s.vy[i]+=ay[i]*h/2}
}
function dmin(s){let d=1e9;for(const[i,j]of PAIRS)d=Math.min(d,Math.hypot(s.x[j]-s.x[i],s.y[j]-s.y[i]));return d}
function energy(s,m,e2){let E=0;for(let i=0;i<3;i++)E+=.5*m[i]*(s.vx[i]**2+s.vy[i]**2);
  for(const[i,j]of PAIRS)E-=m[i]*m[j]/Math.sqrt((s.x[j]-s.x[i])**2+(s.y[j]-s.y[i])**2+e2);return E}
const PRESET_M=[[1,1,1],[1,1,1],[3,4,5],[10,1,.1]];
const NOTE=['Хореография «восьмёрка»: устойчива только при равных массах','Треугольник Лагранжа: точное, но неустойчивое решение','Пифагорова задача (Буррау, 1913): тесные сближения и выброс тела','Иерархическая система: луна внутри сферы Хилла планеты'];

QL.add({id:'threebody',sec:'Небесная механика и хаос',icon:'',title:'Задача трёх тел',year:'Ньютон, 1687 · Пуанкаре, 1890',
  lead:'Два тела движутся по коническим сечениям. Добавь третье — и общего решения не существует: система становится хаотической.',
  mission:'Включи теневую систему и дождись, пока расхождение траекторий |δ|/|δ₀| превысит 1000.',
  controls:[
    {id:'preset',type:'select',label:'Начальные условия',options:['Восьмёрка','Треугольник Лагранжа','Пифагорова 3-4-5','Звезда — планета — луна'],value:0},
    {id:'m1',type:'range',label:'Масса m₁',min:.1,max:10,step:.1,value:1},{id:'m2',type:'range',label:'Масса m₂',min:.1,max:10,step:.1,value:1},{id:'m3',type:'range',label:'Масса m₃',min:.1,max:10,step:.1,value:1},
    {id:'sp',type:'range',label:'Темп времени',min:.1,max:4,step:.1,value:1},
    {id:'eps',type:'range',label:'Смягчение потенциала ε',min:0,max:.2,step:.005,value:.01},
    {id:'k',type:'range',label:'Возмущение тени |δ₀|',min:2,max:10,step:1,value:6,fmt:v=>'10⁻'+String(v).replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c])},
    {id:'tl',type:'range',label:'Длина следа',min:50,max:1500,step:50,value:600},
    {id:'sh',type:'toggle',label:'Теневая система',value:false},
    {id:'reset',type:'button',label:'Перезапуск'}],
  text:`<h3>Постановка</h3><p>Три точечные массы притягиваются по закону Ньютона. Модель интегрирует уравнения движения симплектической схемой leapfrog с адаптивным шагом; в углу — контроль сохранения энергии. Начальные условия, массы и смягчение потенциала задаются ползунками.</p>
  <h3>Почему нет формулы</h3><p>У задачи двух тел достаточно интегралов движения, чтобы свести её к квадратурам. Для трёх тел есть лишь 10 классических интегралов (энергия, импульс, момент импульса, движение центра масс) на 18 переменных. Брунс и Пуанкаре доказали, что других алгебраических интегралов нет. Ряд Зундмана (1912) формально решает задачу, но сходится настолько медленно, что бесполезен.</p>
  <h3>Хаос</h3><p>Включи «теневую систему» — копию, в которой одно тело сдвинуто на |δ₀|. График показывает lg(|δ|/|δ₀|): прямая линия означает экспоненциальный рост, её наклон — показатель Ляпунова λ. Через время порядка (1/λ)·ln(1/δ₀) прогноз теряет смысл, какой бы точной ни была начальная информация.</p>
  <div class="key">Детерминизм не означает предсказуемость. Уравнения однозначно задают будущее, но ошибка начальных данных растёт экспоненциально. Именно в задаче трёх тел Пуанкаре открыл то, что позже назвали динамическим хаосом.</div>
  <h3>Островки порядка</h3><p>Частные решения существуют: коллинеарные решения Эйлера, треугольник Лагранжа (троянские астероиды Юпитера находятся в точках L4 и L5), «восьмёрка» Мура — Шансине — Монтгомери. Иерархические системы вроде Солнце — Земля — Луна устойчивы на долгих временах по теории КАМ. Измени одну массу в «восьмёрке» на 0.1 — и хореография разрушится.</p>`,
  quiz:[
    {q:'Почему задача трёх тел не имеет общего аналитического решения?',a:['Не хватает вычислительной мощности','Недостаточно интегралов движения — система неинтегрируема','Закон тяготения неточен'],c:1,why:'10 интегралов на 18 фазовых переменных; дополнительных алгебраических интегралов не существует (Брунс, Пуанкаре).'},
    {q:'Что означает положительный показатель Ляпунова?',a:['Энергия не сохраняется','Близкие траектории расходятся экспоненциально','Система периодична'],c:1,why:'|δ(t)| ≈ |δ₀|·e^{λt}: горизонт предсказуемости растёт лишь логарифмически с точностью начальных данных.'},
    {q:'Где находятся троянские астероиды Юпитера?',a:['В точках Лагранжа L4 и L5','В точке L1','На орбите Сатурна'],c:0,why:'L4 и L5 — вершины равносторонних треугольников Лагранжа; они устойчивы при большом отношении масс.'}],
  init(S){S.d={sc:0};this.start(S)},
  on(id,S){
    if(id==='preset'){PRESET_M[S.p.preset].forEach((v,i)=>S.set('m'+(i+1),v))}
    if(id!=='sp'&&id!=='eps'&&id!=='tl')this.start(S);
  },
  start(S){
    const p=S.p,d=S.d,m=[p.m1,p.m2,p.m3];let b;
    if(p.preset===0)b=[[.97000436,-.24308753,.466203685,.43236573],[-.97000436,.24308753,.466203685,.43236573],[0,0,-.93240737,-.86473146]];
    else if(p.preset===1)b=[0,1,2].map(i=>{const a=i*TAU/3+Math.PI/2,v=.7598;return[Math.cos(a),Math.sin(a),-v*Math.sin(a),v*Math.cos(a)]});
    else if(p.preset===2)b=[[1,3,0,0],[-2,-1,0,0],[1,-1,0,0]];
    else{const vp=Math.sqrt((m[0]+m[1])/2);b=[[0,0,0,0],[2,0,0,vp],[2.12,0,0,vp+Math.sqrt((m[1]+m[2])/.12)]]}
    const M=m[0]+m[1]+m[2],c=[0,1,2,3].map(k=>b.reduce((s,q,i)=>s+q[k]*m[i],0)/M);
    const mk=()=>({x:b.map(q=>q[0]-c[0]),y:b.map(q=>q[1]-c[1]),vx:b.map(q=>q[2]-c[2]),vy:b.map(q=>q[3]-c[3])});
    d.A=mk();d.B=mk();d.d0=Math.pow(10,-p.k);d.B.x[2]+=d.d0;
    d.m=m;d.t=0;d.tr=[[],[],[]];d.trB=[[],[],[]];d.hist=[];d.E0=energy(d.A,m,p.eps*p.eps);d.ax=[0,0,0];d.ay=[0,0,0];d.ratio=1;
  },
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,m=d.m,e2=p.eps*p.eps,A=d.A,B=d.B,mmax=Math.max(...m);
    let left=S.dt*p.sp,it=0;
    while(left>0&&it++<2500){
      const dm=Math.max(p.eps,Math.min(dmin(A),p.sh?dmin(B):1e9)),hh=Math.min(left,U.clamp(.003*Math.pow(dm,1.5)/Math.sqrt(mmax),2e-6,.003));
      step(A,m,e2,hh,d.ax,d.ay);if(p.sh)step(B,m,e2,hh,d.ax,d.ay);d.t+=hh;left-=hh;
    }
    for(let i=0;i<3;i++){d.tr[i].push(A.x[i],A.y[i]);while(d.tr[i].length>p.tl*2)d.tr[i].splice(0,2);
      if(p.sh){d.trB[i].push(B.x[i],B.y[i]);while(d.trB[i].length>p.tl*2)d.trB[i].splice(0,2)}}
    let dd=0;if(p.sh){for(let i=0;i<3;i++)dd+=(A.x[i]-B.x[i])**2+(A.y[i]-B.y[i])**2;dd=Math.sqrt(dd);d.ratio=dd/d.d0;d.hist.push(d.t,Math.log10(Math.max(1e-3,d.ratio)));if(d.hist.length>1200)d.hist.splice(0,2);if(d.ratio>=1000)S.win()}
    let ext=1.5;for(let i=0;i<3;i++)ext=Math.max(ext,Math.abs(A.x[i]),Math.abs(A.y[i])*w/h);
    const target=w/2/(Math.min(ext,14)*1.25);d.sc=d.sc?d.sc+(target-d.sc)*.04:target;
    const X=x=>w/2+x*d.sc,Y=y=>h/2-y*d.sc,cols=[C.cy,C.am,C.mg];
    U.bg(ctx,S);
    const gs=Math.pow(10,Math.round(Math.log10(90/d.sc)));ctx.lineWidth=1;
    for(let g=-Math.ceil(w/2/d.sc/gs)*gs;g*d.sc<w/2;g+=gs)U.line(ctx,X(g),0,X(g),h,g?'rgba(120,135,170,.09)':'rgba(120,135,170,.22)');
    for(let g=-Math.ceil(h/2/d.sc/gs)*gs;g*d.sc<h/2;g+=gs)U.line(ctx,0,Y(g),w,Y(g),g?'rgba(120,135,170,.09)':'rgba(120,135,170,.22)');
    U.line(ctx,w-24-gs*d.sc,h-22,w-24,h-22,C.dim,1.5);U.text(ctx,`${gs} ед.`,w-24-gs*d.sc/2,h-34,C.dim,11,'center');
    const trail=(t,col,dash)=>{const n=t.length;ctx.strokeStyle=col;ctx.lineWidth=dash?1:1.4;ctx.setLineDash(dash?[3,4]:[]);
      for(let q=0;q<4;q++){const a=(n/8*q|0)*2,b=Math.min(n,(n/8*(q+1)|0)*2+2);if(b-a<4)continue;ctx.globalAlpha=(.15+.28*q)*(dash?.7:1);ctx.beginPath();ctx.moveTo(X(t[a]),Y(t[a+1]));for(let i=a+2;i<b;i+=2)ctx.lineTo(X(t[i]),Y(t[i+1]));ctx.stroke()}
      ctx.globalAlpha=1;ctx.setLineDash([])};
    for(let i=0;i<3;i++){if(p.sh)trail(d.trB[i],'#ffffff',true);trail(d.tr[i],cols[i],false)}
    for(let i=0;i<3;i++){const r=2.5+3.2*Math.cbrt(m[i]);
      if(p.sh){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(X(B.x[i]),Y(B.y[i]),r+2,0,TAU);ctx.stroke()}
      U.glow(ctx,X(A.x[i]),Y(A.y[i]),r*3,cols[i],.5);U.dot(ctx,X(A.x[i]),Y(A.y[i]),r,cols[i]);U.text(ctx,`m${'₁₂₃'[i]}`,X(A.x[i])+r+5,Y(A.y[i])-r-4,cols[i],11)}
    if(p.sh){const gx=w*.68,gy=h*.08,gw=w*.29,gh=h*.26,ymax=p.k+1;
      ctx.fillStyle='rgba(8,10,16,.85)';ctx.fillRect(gx-34,gy-16,gw+44,gh+40);ctx.strokeStyle='#2a3040';ctx.strokeRect(gx,gy,gw,gh);
      const n=d.hist.length,t0=n?d.hist[0]:0,t1=Math.max(t0+1,d.t);ctx.beginPath();
      for(let i=0;i<n;i+=2){const x=gx+gw*(d.hist[i]-t0)/(t1-t0),y=gy+gh*(1-U.clamp(d.hist[i+1],0,ymax)/ymax);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
      ctx.strokeStyle=C.gr;ctx.lineWidth=1.5;ctx.stroke();
      U.text(ctx,'lg(|δ|/|δ₀|)',gx,gy-8,C.dim,11);U.text(ctx,String(ymax),gx-6,gy+4,C.dim,10,'right');U.text(ctx,'0',gx-6,gy+gh,C.dim,10,'right');U.text(ctx,'t →',gx+gw,gy+gh+12,C.dim,10,'right')}
    const dE=Math.abs((energy(A,m,e2)-d.E0)/(d.E0||1)),lam=p.sh&&d.t>1&&d.ratio>1?Math.log(d.ratio)/d.t:0;
    S.hud(`${NOTE[p.preset]}<br>t = <b>${d.t.toFixed(1)}</b> · |ΔE/E| = ${dE.toExponential(1)}${p.sh?` · |δ|/|δ₀| = <b>${d.ratio.toExponential(1)}</b> · λ ≈ ${lam.toFixed(2)}`:''}`);
  }});
})();
