'use strict';
(()=>{
const SEC='Основы квантового мира';

QL.add({id:'double-slit',sec:SEC,icon:'〰️',title:'Двухщелевой эксперимент',year:'Юнг, 1801 · Йонссон, 1961',
  lead:'Частицы, летящие по одной, рисуют волновую картину — но только пока никто не подсматривает, через какую щель они прошли.',
  mission:'Накопи 300 частиц без детектора, затем включи детектор у щелей и накопи ещё 300.',
  controls:[{id:'obs',type:'toggle',label:'👁 Детектор у щелей',value:false},{id:'lam',type:'range',label:'Длина волны',min:.5,max:2,step:.1,value:1},{id:'d',type:'range',label:'Расстояние между щелями d',min:.5,max:2,step:.1,value:1},{id:'a',type:'range',label:'Ширина щели a',min:.5,max:2,step:.1,value:1},{id:'rate',type:'range',label:'Частиц в секунду',min:5,max:300,step:5,value:60}],
  text:`<h3>Что происходит</h3><p>Источник выпускает электроны по одному. Каждый оставляет на экране одну точку — как частица. Но точки складываются в полосы: в одни места электроны попадают часто, в другие — никогда. Полосы — признак интерференции волн, прошедших через <b>обе</b> щели.</p>
  <h3>Подсматривание всё меняет</h3><p>Поставь детектор, выясняющий, через какую щель прошёл электрон, — и полосы исчезают. Остаются два пятна, как от обычных шариков. Дело не в «толчке» от прибора: достаточно, чтобы информация о пути в принципе существовала.</p>
  <div class="key">Пока путь неизвестен, электрон описывается волной вероятности, проходящей через обе щели сразу. Измерение пути уничтожает суперпозицию. По словам Фейнмана, в этом опыте — «вся тайна квантовой механики».</div>
  <p>Опыт повторён с электронами, атомами и даже молекулами из двух тысяч атомов.</p>`,
  quiz:[
    {q:'Электроны летят по одному. Откуда берётся интерференция?',a:['Электроны сталкиваются друг с другом','Каждый электрон интерферирует сам с собой','Это дефект экрана'],c:1,why:'Волна вероятности одного электрона проходит через обе щели и складывается сама с собой.'},
    {q:'Что будет, если узнать, через какую щель прошёл электрон?',a:['Полосы станут ярче','Интерференция исчезнет','Ничего не изменится'],c:1,why:'Информация о пути несовместима с интерференцией — принцип дополнительности.'}],
  init(S){S.d={hits:[],bins:new Array(100).fill(0),fl:[],acc:0,na:0,nb:0}},
  on(id,S){if(id!=='rate'){const d=S.d;d.hits=[];d.bins.fill(0);d.fl=[]}},
  sample(p){
    for(;;){const y=U.rnd(-1,1);let I;
      if(p.obs){const s=.2,o=.17*p.d;I=.5*(Math.exp(-((y-o)**2)/(2*s*s))+Math.exp(-((y+o)**2)/(2*s*s)))}
      else{const q=Math.PI*y*1.1*p.a/p.lam,e=q?Math.sin(q)/q:1;I=e*e*Math.cos(Math.PI*y*3*p.d/p.lam)**2}
      if(Math.random()<I)return y}
  },
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,cy=h/2,sx=w*.06,bx=w*.36,scx=w*.78,scw=w*.09,gap=h*.045*p.d+8,Y=y=>cy+y*h*.45;
    U.bg(ctx,S,.4);
    d.acc+=S.dt*p.rate;while(d.acc>=1){d.acc--;if(d.fl.length<400)d.fl.push({u:0,y:this.sample(p),s:Math.random()<.5?-1:1,j:Math.random()})}
    if(!p.obs){ctx.save();ctx.beginPath();ctx.rect(bx,0,scx-bx,h);ctx.clip();ctx.lineWidth=1;const sp=26*p.lam;
      for(const s of[-1,1])for(let k=0;k*sp<w*.5;k++){const r=(S.t*50)%sp+k*sp;ctx.strokeStyle=`rgba(94,231,255,${.16*(1-r/(w*.5))})`;ctx.beginPath();ctx.arc(bx,cy+s*gap,r,-Math.PI/2,Math.PI/2);ctx.stroke()}
      ctx.restore()}
    ctx.fillStyle='#2b3060';for(const[a,b]of[[0,cy-gap-5],[cy-gap+5,cy+gap-5],[cy+gap+5,h]])ctx.fillRect(bx-4,a,8,b-a);
    if(p.obs)for(const s of[-1,1]){U.glow(ctx,bx+16,cy+s*gap,12,C.rd,.6+.3*Math.sin(S.t*8));U.text(ctx,'D',bx+16,cy+s*gap,'#fff',11,'center',700)}
    U.glow(ctx,sx,cy,22,C.cy,.8);U.dot(ctx,sx,cy,4,'#fff');
    d.fl=d.fl.filter(f=>{f.u+=S.dt*.95;
      if(f.u>=1){d.hits.push(f.j,f.y);if(d.hits.length>12000)d.hits.splice(0,2);d.bins[Math.min(99,(f.y+1)*50|0)]++;p.obs?d.nb++:d.na++;return false}
      const tx=scx+f.j*scw,ty=Y(f.y);
      for(const s of p.obs?[f.s]:[-1,1]){const gy=cy+s*gap;let x,y;
        if(f.u<.4){const t=f.u/.4;x=U.lerp(sx,bx,t);y=U.lerp(cy,gy,t)}else{const t=(f.u-.4)/.6;x=U.lerp(bx,tx,t);y=U.lerp(gy,ty,t)}
        U.glow(ctx,x,y,p.obs?7:9,p.obs?C.am:C.cy,p.obs?1:.5)}
      return true});
    ctx.fillStyle='#0c1030';ctx.fillRect(scx,0,scw,h);
    ctx.fillStyle='rgba(190,240,255,.85)';for(let i=0;i<d.hits.length;i+=2)ctx.fillRect(scx+d.hits[i]*scw,Y(d.hits[i+1]),1.6,1.6);
    const mx=Math.max(8,...d.bins),hx=scx+scw+6,hw=w-hx-8;ctx.fillStyle=C.bg;ctx.fillRect(hx,0,w-hx,h);
    ctx.fillStyle=p.obs?C.am:C.cy;for(let i=0;i<100;i++){const y=Y(-1+i/50);ctx.fillRect(hx,y,hw*d.bins[i]/mx,h*.009-1)}
    if(d.na>=300&&d.nb>=300)S.win();
    S.hud(`Без детектора: <b>${d.na}</b> · с детектором: <b>${d.nb}</b>`);
  }});

QL.add({id:'photoelectric',sec:SEC,icon:'🔦',title:'Фотоэффект',year:'Эйнштейн, 1905',
  lead:'Свет выбивает электроны из металла — но только если каждый фотон несёт достаточно энергии. Яркость тут не поможет.',
  mission:'Выбей электроны из цинка (работа выхода 4.3 эВ).',
  controls:[{id:'E',type:'range',label:'Энергия фотона',min:1.6,max:6,step:.1,value:2,fmt:v=>`${v.toFixed(1)} эВ · ${Math.round(1240/v)} нм`},{id:'I',type:'range',label:'Интенсивность',min:1,max:10,step:1,value:4},{id:'Us',type:'range',label:'Задерживающее напряжение',min:0,max:4,step:.1,value:0,fmt:v=>v.toFixed(1)+' В'},{id:'metal',type:'select',label:'Металл',options:['Цезий (2.1 эВ)','Натрий (2.3 эВ)','Цинк (4.3 эВ)'],value:0}],
  text:`<h3>Загадка</h3><p>Волновая теория предсказывала: чем ярче свет, тем сильнее он раскачает электроны и рано или поздно вырвет их. Опыт показал другое: красный свет не выбивает электроны при любой яркости, а слабый ультрафиолет — выбивает мгновенно.</p>
  <h3>Решение Эйнштейна</h3><p>Свет состоит из порций — фотонов с энергией <b>E = hν</b>. Один фотон отдаёт энергию одному электрону. Если её меньше работы выхода W — электрон остаётся в металле. Если больше — вылетает с энергией <b>hν − W</b>.</p>
  <div class="key">Яркость — это число фотонов, а не энергия каждого. Больше фотонов — больше электронов, но только если каждый фотон «проходит порог». За это объяснение Эйнштейн получил Нобелевскую премию.</div>`,
  quiz:[
    {q:'Красный свет не выбивает электроны из цинка. Что будет, если сделать его в 100 раз ярче?',a:['Электроны полетят','По-прежнему ничего','Металл станет прозрачным'],c:1,why:'Энергия каждого фотона осталась ниже работы выхода — количество фотонов не помогает.'},
    {q:'От чего зависит энергия вылетевшего электрона?',a:['От яркости света','От частоты света','От размера пластины'],c:1,why:'K = hν − W: энергия растёт с частотой, а яркость задаёт лишь число электронов.'}],
  init(S){S.d={ph:[],el:[],acc:0,cnt:0,cur:0}},
  on(id,S){S.d.cnt=0},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,W=[2.1,2.3,4.3][p.metal],K=Math.max(0,p.E-W),px=w*.26,dt=S.dt;
    const lam=1240/p.E,col=lam<400?'#d9c9ff':`hsl(${U.clamp(270*(700-lam)/300,0,270)},100%,65%)`;
    U.bg(ctx,S,.45);
    ctx.fillStyle='#39406e';ctx.fillRect(px-10,h*.18,10,h*.64);ctx.fillStyle='#232850';ctx.fillRect(w*.9,h*.18,8,h*.64);
    U.text(ctx,'металл',px-5,h*.13,C.dim,12,'center');U.text(ctx,'коллектор',w*.9,h*.13,C.dim,12,'center');
    d.acc+=dt*p.I*4;while(d.acc>=1){d.acc--;d.ph.push({u:0,ty:U.rnd(.24,.76)*h})}
    const dx=Math.cos(.5),dy=Math.sin(.5),L=w*.28;
    d.ph=d.ph.filter(f=>{f.u+=dt*1.6;
      if(f.u>=1){if(K>0)d.el.push({x:px+2,y:f.ty,vx:170*Math.sqrt(K*U.rnd(.25,1))*w/800,vy:U.gauss()*18});else U.glow(ctx,px,f.ty,10,'#ff9a6b',.5);return false}
      const bx=px-(1-f.u)*L*dx,by=f.ty-(1-f.u)*L*dy;ctx.beginPath();
      for(let j=0;j<=14;j++){const s=j*2.2,o=Math.sin(j*1.1+S.t*30)*3.5;const x=bx-s*dx-o*dy,y=by-s*dy+o*dx;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}
      ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();return true});
    const acc=p.Us*28900*(w/800)*(w/800)/(2*(w*.9-px));
    d.el=d.el.filter(e=>{e.vx-=acc*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.x<px)return false;if(e.x>=w*.9){d.cnt++;d.cur+=1;return false}U.glow(ctx,e.x,e.y,8,C.cy,.9);U.dot(ctx,e.x,e.y,2,'#fff');return true});
    d.cur*=Math.pow(.3,dt);
    if(p.metal===2&&K>0&&d.cnt>=5)S.win();
    const bxp=w*.04,by0=h*.92,bh=h*.3,sc=bh/6;
    U.line(ctx,bxp,by0,bxp+60,by0,'#566');ctx.fillStyle=col;ctx.fillRect(bxp+8,by0-p.E*sc,18,p.E*sc);
    U.line(ctx,bxp,by0-W*sc,bxp+60,by0-W*sc,C.rd,2,[4,3]);U.text(ctx,'W',bxp+64,by0-W*sc,C.rd,12);U.text(ctx,'hν',bxp+17,by0-p.E*sc-10,col,12,'center');
    S.hud(K>0?`hν = ${p.E.toFixed(1)} эВ &gt; W = ${W} эВ → K<sub>max</sub> = <b>${K.toFixed(1)} эВ</b> · U<sub>з</sub> = ${K.toFixed(1)} В${p.Us>=K?' — ток <b>заперт</b>':''}`:`hν = ${p.E.toFixed(1)} эВ &lt; W = ${W} эВ → <b>тока нет</b>, какой бы яркой ни была лампа`);
  }});

const SG=[
  {mag:[[.3,.5,'Z']],block:[],ends:[[.9,.25],[.9,.75]]},
  {mag:[[.2,.55,'Z'],[.55,.4,'θ']],block:[[.38,.75]],ends:[[.9,.2],[.9,.6]]},
  {mag:[[.15,.6,'Z'],[.42,.46,'X'],[.69,.32,'Z']],block:[[.27,.76],[.54,.62]],ends:[[.92,.17],[.92,.47]]}];

QL.add({id:'stern-gerlach',sec:SEC,icon:'🧲',title:'Опыт Штерна — Герлаха',year:'Штерн и Герлах, 1922',
  lead:'Пучок атомов в магнитном поле расщепляется ровно на два: спин квантуется. А цепочка магнитов показывает, что измерение стирает прошлое знание.',
  mission:'Собери цепочку Z → X → Z и пропусти 100 атомов до экрана: спин «забыл», что был «вверх».',
  controls:[{id:'mode',type:'select',label:'Схема',options:['Один магнит','Z → θ','Z → X → Z'],value:0},{id:'th',type:'range',label:'Угол второго магнита θ',min:0,max:180,step:5,value:90,fmt:v=>v+'°'},{id:'cl',type:'toggle',label:'Классическое ожидание',value:false}],
  text:`<h3>Два пятна вместо полосы</h3><p>Атомы серебра — крошечные магнитики. Если бы они были ориентированы как попало (включи «классическое ожидание»), неоднородное поле размазало бы пучок в полосу. Вместо этого на экране два пятна: проекция спина принимает только два значения, «вверх» или «вниз».</p>
  <h3>Цепочка магнитов</h3><p>Возьмём только атомы «Z-вверх» и измерим у них спин вдоль X. Половина окажется «X-вверх». Теперь снова измерим Z — и, вопреки логике, опять получим 50/50! Измерение X полностью уничтожило знание о Z.</p>
  <div class="key">Проекции спина на разные оси нельзя знать одновременно — это несовместимые величины, как координата и импульс. При повороте второго магнита на угол θ вероятность «вверх» равна cos²(θ/2).</div>`,
  quiz:[
    {q:'Что показал опыт с одним магнитом?',a:['Атомы не магнитны','Проекция спина принимает только дискретные значения','Атомы летят быстрее света'],c:1,why:'Вместо сплошной полосы — два пятна: пространственное квантование.'},
    {q:'Атомы «Z-вверх» прошли через X-магнит. Что даст повторное измерение Z?',a:['Всегда «вверх»','50% «вверх», 50% «вниз»','Всегда «вниз»'],c:1,why:'Измерение X перевело спин в суперпозицию по Z — прежний результат стёрт.'}],
  init(S){S.d={at:[],hits:[],n:[0,0],acc:0}},
  on(id,S){this.init(S)},
  spawn(S){
    const m=S.p.mode,r=Math.random();
    if(m===0){if(S.p.cl)return{pts:[[.05,.5],[.3,.5],[.9,U.rnd(.25,.75)]],out:2};const up=r<.5;return{pts:[[.05,.5],[.3,.5],[.9,up?.25:.75]],out:up?0:1}}
    if(m===1){if(r<.5)return{pts:[[.05,.55],[.2,.55],[.38,.75]],out:-1};const up=Math.random()<Math.cos(S.p.th*RAD/2)**2;return{pts:[[.05,.55],[.2,.55],[.38,.4],[.55,.4],[.9,up?.2:.6]],out:up?0:1}}
    if(r<.5)return{pts:[[.04,.6],[.15,.6],[.27,.76]],out:-1};
    if(Math.random()<.5)return{pts:[[.04,.6],[.15,.6],[.27,.46],[.42,.46],[.54,.62]],out:-1};
    const up=Math.random()<.5;return{pts:[[.04,.6],[.15,.6],[.27,.46],[.42,.46],[.54,.32],[.69,.32],[.92,up?.17:.47]],out:up?0:1};
  },
  draw(ctx,w,h,S){
    const d=S.d,g=SG[S.p.mode];U.bg(ctx,S,.4);
    d.acc+=S.dt*26;while(d.acc>=1){d.acc--;const a=this.spawn(S);a.seg=0;a.u=0;d.at.push(a)}
    for(const[x,y,l]of g.mag){const X=x*w,Y=y*h;ctx.fillStyle='#1c2150';U.rr(ctx,X-26,Y-34,52,68,8);ctx.fill();ctx.strokeStyle=C.vi;ctx.lineWidth=1.5;ctx.stroke();
      U.text(ctx,'N',X,Y-22,C.rd,11,'center');U.text(ctx,'S',X,Y+23,C.cy,11,'center');U.text(ctx,l,X,Y-46,C.vi,15,'center',700)}
    for(const[x,y]of g.block){ctx.fillStyle='#454b7a';ctx.fillRect(x*w,y*h-12,7,24)}
    const sx=g.ends[0][0]*w+6;ctx.fillStyle='#0c1030';ctx.fillRect(sx,h*.06,14,h*.88);
    ctx.fillStyle='rgba(190,240,255,.8)';for(let i=0;i<d.hits.length;i+=2)ctx.fillRect(sx+d.hits[i]*12,d.hits[i+1]*h,1.8,1.8);
    d.at=d.at.filter(a=>{
      let left=S.dt*.55;
      while(left>0){const A=a.pts[a.seg],B=a.pts[a.seg+1],len=Math.hypot(B[0]-A[0],B[1]-A[1]),rem=(1-a.u)*len;
        if(left<rem){a.u+=left/len;left=0}else{left-=rem;a.seg++;a.u=0;
          if(a.seg>=a.pts.length-1){if(a.out>=0){d.hits.push(Math.random(),B[1]+U.gauss()*.012);if(d.hits.length>3000)d.hits.splice(0,2);if(a.out<2)d.n[a.out]++}return false}}}
      const A=a.pts[a.seg],B=a.pts[a.seg+1];U.glow(ctx,U.lerp(A[0],B[0],a.u)*w,U.lerp(A[1],B[1],a.u)*h,6,C.am,.9);return true});
    const tot=d.n[0]+d.n[1];
    if(!(S.p.mode===0&&S.p.cl))g.ends.forEach(([x,y],i)=>U.text(ctx,`${i?'↓':'↑'} ${U.pct(d.n[i],tot)}`,x*w-12,y*h-18,i?C.mg:C.cy,14,'right',700));
    if(S.p.mode===2&&tot>=100)S.win();
    S.hud(S.p.mode===0?(S.p.cl?'Классика ждала бы сплошную полосу':'Реальность: ровно два пятна'):S.p.mode===1?`Вероятность «вверх» = cos²(θ/2) = <b>${Math.round(100*Math.cos(S.p.th*RAD/2)**2)}%</b>`:`До экрана дошло атомов: <b>${tot}</b> — и снова 50/50`);
  }});

QL.add({id:'uncertainty',sec:SEC,icon:'🎯',title:'Принцип неопределённости',year:'Гейзенберг, 1927',
  lead:'Чем точнее известно, где частица, тем хуже известно, куда она летит. Это не слабость приборов, а свойство самой природы.',
  mission:'Сожми волновой пакет так, чтобы неопределённость импульса Δp стала больше 2.',
  controls:[{id:'s',type:'range',label:'Начальная ширина σ',min:.2,max:2,step:.05,value:1,fmt:v=>v.toFixed(2)},{id:'k0',type:'range',label:'Средний импульс p₀',min:2,max:12,step:.5,value:7},{id:'t',type:'range',label:'Время t (расплывание)',min:0,max:3,step:.1,value:0}],
  text:`<h3>Волновой пакет</h3><p>Сверху — волновая функция частицы в пространстве, снизу — её распределение по импульсам. Импульс связан с длиной волны (p = h/λ). Чтобы «собрать» узкий пакет, нужно сложить много волн разной длины — то есть много разных импульсов.</p>
  <h3>Соотношение</h3><p><b>Δx · Δp ≥ ħ/2</b>. Гауссов пакет на экране — рекордсмен: у него произведение ровно ħ/2. Сжимаешь по координате — расплывается по импульсу, и наоборот.</p>
  <div class="key">У частицы нет одновременно точной координаты и точного импульса — не потому, что мы их не можем узнать, а потому что таких значений не существует. Это свойство любых волн.</div>
  <p>Следствие: электрон не может упасть на ядро. Запертый в малом объёме, он получил бы огромный разброс импульса и энергии — так неопределённость делает атомы устойчивыми.</p>`,
  quiz:[
    {q:'Мы точно измерили положение электрона. Что с импульсом?',a:['Тоже известен точно','Стал сильно неопределённым','Обнулился'],c:1,why:'Δx → 0 требует Δp → ∞.'},
    {q:'В чём причина неопределённости?',a:['Грубые приборы','Волновая природа частиц','Тепловое движение'],c:1,why:'Узкий пакет состоит из множества волн с разными длинами — это математика волн, а не недостаток техники.'}],
  init(S){S.d={}},
  draw(ctx,w,h,S){
    const s=S.p.s,sp=1/(2*s),st=s*Math.sqrt(1+(S.p.t/(2*s*s))**2);if(sp>2)S.win();
    U.bg(ctx,S);
    const panel=(y0,ph,f,env,col,label,xr)=>{
      const base=y0+ph*.5;U.line(ctx,w*.05,base,w*.95,base,'#2c3266');
      ctx.beginPath();for(let i=0;i<=300;i++){const x=-xr+2*xr*i/300,px=w*(.05+.9*i/300),y=base-env(x)*ph*.45;i?ctx.lineTo(px,y):ctx.moveTo(px,y)}
      ctx.lineTo(w*.95,base);ctx.lineTo(w*.05,base);ctx.fillStyle=col.replace('1)','.16)');ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();
      if(f){ctx.beginPath();for(let i=0;i<=600;i++){const x=-xr+2*xr*i/600,px=w*(.05+.9*i/600),y=base-f(x)*ph*.45;i?ctx.lineTo(px,y):ctx.moveTo(px,y)}ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.2;ctx.stroke()}
      U.text(ctx,label,w*.05,y0+4,col,14,'left',700);
    };
    const ex=x=>Math.sqrt(s/st)*Math.exp(-x*x/(4*st*st));
    panel(h*.08,h*.42,x=>ex(x)*Math.cos(S.p.k0*x-S.t*5),ex,'rgba(94,231,255,1)','Координата: ψ(x)',5);
    panel(h*.56,h*.4,null,p=>Math.exp(-p*p/(4*sp*sp)),'rgba(255,94,219,1)','Импульс: φ(p)',6);
    const bar=(y,half,col)=>{U.line(ctx,w/2-half,y,w/2+half,y,col,3);U.line(ctx,w/2-half,y-6,w/2-half,y+6,col,2);U.line(ctx,w/2+half,y-6,w/2+half,y+6,col,2)};
    bar(h*.5,Math.min(st,5)*w*.9/10,C.cy);bar(h*.96,sp*w*.9/12,C.mg);
    S.hud(`Δx(t) = <b>${st.toFixed(2)}</b> · Δp = <b>${sp.toFixed(2)}</b> · Δx·Δp = <b>${(st*sp).toFixed(2)} ħ</b> ${S.p.t?'— пакет расплылся (дисперсия)':'— минимум, меньше не бывает'}`);
  }});

QL.add({id:'tunneling',sec:SEC,icon:'🚇',title:'Туннельный эффект',year:'Гамов, 1928',
  lead:'Частица проходит сквозь стену, на которую ей не хватает энергии. Так светит Солнце и работает флеш-память.',
  mission:'При энергии ниже барьера (E < V) добейся, чтобы сквозь него прошло больше 5% волны.',
  controls:[{id:'E',type:'range',label:'Энергия частицы E',min:.1,max:.5,step:.01,value:.25,fmt:v=>v.toFixed(2)},{id:'V',type:'range',label:'Высота барьера V',min:0,max:.6,step:.01,value:.35,fmt:v=>v.toFixed(2)},{id:'a',type:'range',label:'Ширина барьера a',min:2,max:30,step:1,value:8},{id:'sig',type:'range',label:'Ширина пакета σ',min:10,max:30,step:2,value:22},{id:'dbl',type:'toggle',label:'Двойной барьер (резонанс)',value:false},{id:'gap',type:'range',label:'Зазор между барьерами',min:4,max:40,step:1,value:14}],
  text:`<h3>Настоящее уравнение Шрёдингера</h3><p>Это не мультфильм: волновой пакет на экране эволюционирует по уравнению Шрёдингера, которое решается прямо в браузере. Голубая область — вероятность найти частицу, тонкая линия — сама волна.</p>
  <h3>Сквозь стену</h3><p>Классический мяч с энергией ниже высоты холма всегда откатится назад. Волновая функция внутри барьера не обрывается, а затухает экспоненциально. Если барьер тонкий, за ним остаётся ненулевой «хвост» — шанс найти частицу по ту сторону.</p>
  <div class="key">Вероятность туннелирования падает экспоненциально с шириной барьера и корнем из его высоты. Чуть толще стена — и эффект исчезает. Поэтому мы не проходим сквозь двери.</div>
  <p>Без туннелирования протоны в Солнце не смогли бы сблизиться для синтеза. На нём же основаны альфа-распад, туннельный микроскоп и транзисторы памяти.</p>`,
  quiz:[
    {q:'Что происходит с волновой функцией внутри барьера при E < V?',a:['Она обрывается в ноль','Экспоненциально затухает, но не исчезает','Усиливается'],c:1,why:'Затухающий «хвост» может дотянуться до другой стороны барьера.'},
    {q:'Как увеличить шанс туннелирования?',a:['Сделать барьер тоньше или ниже','Сделать барьер шире','Уменьшить энергию частицы'],c:0,why:'Вероятность ~ exp(−2κa): она экспоненциально чувствительна к ширине a.'}],
  init(S){const N=640;S.d={N,re:new Float32Array(N),im:new Float32Array(N),V:new Float32Array(N),t:0,T:0,R:0,norm:1,pause:0,end:0};this.launch(S)},
  on(id,S){this.launch(S)},
  launch(S){
    const d=S.d,p=S.p,k=Math.sqrt(2*p.E);d.norm=0;
    for(let i=0;i<d.N;i++){const g=Math.exp(-((i-120)**2)/(4*p.sig*p.sig));d.re[i]=g*Math.cos(k*i);d.im[i]=g*Math.sin(k*i);d.norm+=g*g;d.V[i]=(i>=300&&i<300+p.a)||(p.dbl&&i>=300+p.a+p.gap&&i<300+2*p.a+p.gap)?p.V:0}
    d.eb=300+p.a+(p.dbl?p.a+p.gap:0);
    d.re[0]=d.im[0]=d.re[d.N-1]=d.im[d.N-1]=0;d.t=0;d.pause=0;d.end=180/k*1.9;
  },
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,N=d.N,re=d.re,im=d.im,V=d.V,dt=.25;
    if(d.t<d.end){for(let s=0;s<8;s++){
      for(let i=1;i<N-1;i++)re[i]+=dt*(-.5*(im[i+1]-2*im[i]+im[i-1])+V[i]*im[i]);
      for(let i=1;i<N-1;i++)im[i]-=dt*(-.5*(re[i+1]-2*re[i]+re[i-1])+V[i]*re[i]);
      d.t+=dt}}
    else{d.pause+=S.dt;if(d.pause===S.dt&&p.E<p.V&&d.T>.05)S.win();if(d.pause>1.5)this.launch(S)}
    let T=0,R=0;for(let i=0;i<N;i++){const q=re[i]*re[i]+im[i]*im[i];if(i>=d.eb)T+=q;else if(i<300)R+=q}
    d.T=T/d.norm;d.R=R/d.norm;
    U.bg(ctx,S);
    const base=h*.78,X=i=>i/N*w,sc=h*.5/.6;
    for(const b0 of p.dbl?[300,300+p.a+p.gap]:[300]){ctx.fillStyle='rgba(213,138,184,.22)';ctx.fillRect(X(b0),base-p.V*sc,X(p.a),p.V*sc);ctx.strokeStyle=C.mg;ctx.lineWidth=1.5;ctx.strokeRect(X(b0),base-p.V*sc,X(p.a),p.V*sc)}
    U.text(ctx,'V',X(300+p.a)+6,base-p.V*sc,C.mg,13);
    U.line(ctx,0,base-p.E*sc,w,base-p.E*sc,C.am,1,[6,5]);U.text(ctx,'E',8,base-p.E*sc-10,C.am,13);
    ctx.beginPath();ctx.moveTo(0,base);for(let i=0;i<N;i++)ctx.lineTo(X(i),base-(re[i]*re[i]+im[i]*im[i])*h*.5);ctx.lineTo(w,base);
    const g=ctx.createLinearGradient(0,base-h*.5,0,base);g.addColorStop(0,'rgba(94,231,255,.9)');g.addColorStop(1,'rgba(94,231,255,.1)');ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();for(let i=0;i<N;i++){const y=base-re[i]*h*.16;i?ctx.lineTo(X(i),y):ctx.moveTo(X(i),y)}ctx.strokeStyle='rgba(155,123,255,.8)';ctx.lineWidth=1;ctx.stroke();
    U.line(ctx,0,base,w,base,'#2c3266');
    S.hud(`${p.E<p.V?'E &lt; V: классически пройти <b>невозможно</b>':'E ≥ V: частица проходит над барьером'} · прошло: <b>${(d.T*100).toFixed(1)}%</b> · отразилось: ${(d.R*100).toFixed(1)}%${p.E<p.V?`<br>κ = √(2m(V−E))/ħ = ${Math.sqrt(2*(p.V-p.E)).toFixed(2)} · оценка ВКБ e<sup>−2κa</sup> = ${(100*Math.exp(-2*Math.sqrt(2*(p.V-p.E))*p.a)).toFixed(1)}%`:''}`);
  }});

QL.add({id:'cat',sec:SEC,icon:'🐈',title:'Кот Шрёдингера',year:'Шрёдингер, 1935',
  lead:'Кот в закрытом ящике, чья жизнь зависит от распада одного атома. До открытия ящика — жив он или мёртв?',
  mission:'Проведи 10 опытов и посмотри, как складывается статистика.',
  controls:[{id:'open',type:'button',label:'📦 Открыть ящик'},{id:'new',type:'button',label:'Новый опыт'},{id:'hl',type:'range',label:'Период полураспада T½, с',min:2,max:12,step:1,value:5},{id:'td',type:'range',label:'Время декогеренции τ_D, с',min:.2,max:10,step:.2,value:2}],
  text:`<h3>Мысленный эксперимент</h3><p>В ящике — кот, радиоактивный атом, счётчик Гейгера и колба с ядом. Распадётся атом — сработает счётчик, разобьётся колба. Атом — квантовый объект и находится в суперпозиции «распался + не распался». Тогда и кот, по уравнениям, в суперпозиции «жив + мёртв»?</p>
  <h3>Зачем он был придуман</h3><p>Шрёдингер не утверждал, что кот бывает полуживым. Он показывал нелепость: квантовая механика не говорит, где кончается «и то, и другое» и начинается «либо то, либо другое». Это <b>проблема измерения</b>.</p>
  <div class="key">Современный ответ — декогеренция: кот, воздух, счётчик состоят из триллионов частиц и мгновенно «измеряют» атом сами. Суперпозиция больших тёплых объектов разрушается за ничтожные доли секунды — задолго до открытия ящика.</div>
  <p>Но маленьких «котов» создают в лабораториях: в суперпозиции бывали ионы, молекулы и даже механические резонаторы, видимые глазом.</p>`,
  quiz:[
    {q:'Что хотел показать Шрёдингер?',a:['Что коты бессмертны','Что перенос суперпозиции на большие объекты ведёт к абсурду — проблема измерения','Что яд не действует в вакууме'],c:1,why:'Это была критика: теория не объясняет, когда суперпозиция превращается в определённый исход.'},
    {q:'Почему мы не видим суперпозиций котов?',a:['Декогеренция: окружение мгновенно разрушает суперпозицию больших объектов','Коты слишком быстрые','Суперпозиций не существует'],c:0,why:'Взаимодействие с окружением «измеряет» систему и превращает суперпозицию в обычную смесь.'}],
  init(S){S.d={t:0,open:false,alive:true,na:0,nd:0}},
  on(id,S){
    const d=S.d;
    if(id==='open'&&!d.open){d.alive=Math.random()>1-Math.pow(.5,d.t/S.p.hl);d.open=true;d.alive?d.na++:d.nd++;if(d.na+d.nd>=10)S.win()}
    if(id==='new'){d.t=0;d.open=false}
  },
  draw(ctx,w,h,S){
    const d=S.d;if(!d.open)d.t+=S.dt;const pd=1-Math.pow(.5,d.t/S.p.hl),cx=w/2,cy=h*.46,bw=Math.min(w*.5,h*.9),bh=h*.56;
    U.bg(ctx,S);U.stars(ctx,S,60);
    ctx.fillStyle='#11153a';U.rr(ctx,cx-bw/2,cy-bh/2,bw,bh,16);ctx.fill();ctx.strokeStyle=d.open?(d.alive?C.gr:C.rd):C.vi;ctx.lineWidth=2.5;ctx.stroke();
    const face=(e,x,a,col)=>{ctx.globalAlpha=a;U.text(ctx,e,x,cy,col,bh*.12,'center',700);ctx.globalAlpha=1};
    if(d.open){face(d.alive?'|жив⟩':'|мёртв⟩',cx,1,d.alive?C.gr:C.rd);U.text(ctx,d.alive?'Кот жив!':'Кот мёртв…',cx,cy+bh*.38,d.alive?C.gr:C.rd,17,'center',700)}
    else{const o=Math.sin(S.t*3)*bw*.05;face('|жив⟩',cx-bw*.24+o*.2,.2+.8*Math.sqrt(1-pd),C.gr);face('+',cx-bw*.03,.8,C.dim);face('|мёртв⟩',cx+bw*.23-o*.2,.2+.8*Math.sqrt(pd),C.rd);
      U.glow(ctx,cx-bw*.38,cy-bh*.3,14+4*Math.sin(S.t*6),C.gr,.8);U.text(ctx,'α',cx-bw*.38,cy-bh*.3,'#fff',15,'center')}
    const co=d.open?0:Math.sqrt(pd*(1-pd))*Math.exp(-d.t/S.p.td),mv=d.open?[d.alive?1:0,0,0,d.alive?0:1]:[1-pd,co,co,pd],mx0=w*.81,my0=h*.3,cs=Math.min(w*.075,h*.13);
    U.text(ctx,'ρ =',mx0-26,my0+cs,C.dim,15,'center');
    mv.forEach((v,i)=>{const x=mx0+(i%2)*cs,y=my0+(i>>1)*cs;ctx.fillStyle=`rgba(124,196,220,${v*.8})`;ctx.fillRect(x,y,cs-3,cs-3);ctx.strokeStyle='#333b4d';ctx.lineWidth=1;ctx.strokeRect(x,y,cs-3,cs-3);U.text(ctx,v.toFixed(2),x+cs/2-1.5,y+cs/2-1.5,'#fff',12,'center')});
    U.text(ctx,'матрица плотности',mx0+cs,my0+2*cs+14,C.dim,11,'center');
    const by=h*.86,bx=w*.2,bl=w*.6;
    ctx.fillStyle=C.gr;ctx.fillRect(bx,by,bl*(1-pd),12);ctx.fillStyle=C.rd;ctx.fillRect(bx+bl*(1-pd),by,bl*pd,12);
    U.text(ctx,`|жив⟩ ${Math.round((1-pd)*100)}%`,bx,by+26,C.gr,13);U.text(ctx,`|мёртв⟩ ${Math.round(pd*100)}%`,bx+bl,by+26,C.rd,13,'right');
    S.hud(d.open?`Ящик открыт. Опытов: <b>${d.na+d.nd}</b> · жив: ${d.na} · мёртв: ${d.nd}`:`Ящик закрыт ${d.t.toFixed(1)} с · |ψ⟩ = √${(1-pd).toFixed(2)}·|жив⟩ + √${pd.toFixed(2)}·|мёртв⟩ · когерентность |ρ₀₁| = <b>${co.toFixed(2)}</b>`);
  }});

QL.add({id:'zeno',sec:SEC,icon:'🫣',title:'Квантовый эффект Зенона',year:'Мизра и Сударшан, 1977',
  lead:'«Чайник, за которым следят, не закипает»: частые измерения замораживают квантовую систему в исходном состоянии.',
  mission:'Заморозь систему: подбери число измерений, чтобы шанс выживания превысил 90%, и проведи 3 прогона.',
  controls:[{id:'n',type:'range',label:'Измерений за цикл N',min:1,max:40,step:1,value:2},{id:'T',type:'range',label:'Длительность цикла, с',min:1,max:8,step:.5,value:4}],
  text:`<h3>Опыт</h3><p>Стрелка — состояние системы. Предоставленная себе, она плавно поворачивается из |0⟩ («не распалась») в |1⟩ («распалась»). Каждая вспышка — измерение: система обязана ответить «0» или «1» и с этого значения начинает заново.</p>
  <h3>Почему замирает</h3><p>Сразу после измерения вероятность перехода растёт не линейно, а как квадрат времени — то есть сначала очень медленно. Если измерять часто, каждый раз система почти наверняка окажется в |0⟩ и снова начнёт с нуля. Вероятность выжить: <b>cos²ᴺ(π/2N)</b> → 1 при N → ∞.</p>
  <div class="key">Наблюдение — не пассивный взгляд, а физическое воздействие, которое сбрасывает эволюцию. Эффект подтверждён в 1990 году на ионах бериллия (группа Вайнленда).</div>`,
  quiz:[
    {q:'Что происходит при очень частых измерениях?',a:['Система распадается быстрее','Система «замерзает» в начальном состоянии','Ничего не меняется'],c:1,why:'Каждое измерение сбрасывает медленный (квадратичный) рост вероятности перехода.'},
    {q:'Почему эффект возможен?',a:['Вероятность перехода на малых временах растёт как t²','Прибор нагревает систему','Из-за гравитации'],c:0,why:'При малых t вероятность ∝ t², поэтому N коротких шагов дают в N раз меньше, чем один длинный.'}],
  init(S){S.d={u:0,last:0,dec:false,k:0,surv:0,tot:0,tr:[],fl:0}},
  on(id,S){this.init(S)},
  draw(ctx,w,h,S){
    const d=S.d,N=S.p.n,th0=Math.pow(Math.cos(Math.PI/2/N)**2,N);
    d.u+=S.dt/S.p.T;d.fl=Math.max(0,d.fl-S.dt*4);
    while(d.k<N&&d.u>=(d.k+1)/N){d.k++;if(!d.dec){if(Math.random()<Math.sin(Math.PI/2*(d.k/N-d.last))**2)d.dec=true;d.last=d.k/N}d.fl=1}
    const ang=d.dec?Math.PI/2:Math.PI/2*(Math.min(d.u,1)-d.last),P1=Math.sin(ang)**2;
    if(d.u<=1)d.tr.push(d.u,P1);
    if(d.u>=1.2){d.tot++;if(!d.dec)d.surv++;if(th0>=.9&&d.tot>=3)S.win();Object.assign(d,{u:0,last:0,dec:false,k:0,tr:[]})}
    U.bg(ctx,S);
    const cx=w*.2,cy=h*.55,R=Math.min(w*.14,h*.3);
    ctx.strokeStyle='#2c3266';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI/2,0);ctx.stroke();
    U.text(ctx,'|0⟩ цела',cx,cy-R-14,C.cy,13,'center');U.text(ctx,'|1⟩ распалась',cx+R+8,cy+16,C.rd,13);
    if(d.fl>0)U.glow(ctx,cx,cy,R*1.5,'#fff',d.fl*.5);
    U.arrow(ctx,cx,cy,cx+Math.sin(ang)*R,cy-Math.cos(ang)*R,d.dec?C.rd:C.cy,3.5);U.dot(ctx,cx,cy,4,'#fff');
    const gx=w*.44,gy=h*.2,gw=w*.5,gh=h*.56;
    U.line(ctx,gx,gy+gh,gx+gw,gy+gh,'#2c3266');U.line(ctx,gx,gy,gx,gy+gh,'#2c3266');
    ctx.beginPath();for(let i=0;i<=60;i++){const u=i/60,y=gy+gh*(1-Math.sin(Math.PI/2*u)**2);i?ctx.lineTo(gx+u*gw,y):ctx.moveTo(gx,y)}ctx.strokeStyle='rgba(255,255,255,.25)';ctx.setLineDash([4,5]);ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
    for(let k=1;k<=N;k++)U.line(ctx,gx+k/N*gw,gy+gh,gx+k/N*gw,gy+gh+7,k<=d.k?'#fff':'#566',1.5);
    ctx.beginPath();for(let i=0;i<d.tr.length;i+=2){const x=gx+d.tr[i]*gw,y=gy+gh*(1-d.tr[i+1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=d.dec?C.rd:C.cy;ctx.lineWidth=2.5;ctx.stroke();
    U.text(ctx,'вероятность распада',gx+6,gy-10,C.dim,12);U.text(ctx,'без измерений',gx+gw,gy+12,'rgba(255,255,255,.4)',12,'right');U.text(ctx,'↑ моменты измерений',gx,gy+gh+22,C.dim,12);
    S.hud(`Теория: выживает <b>${Math.round(th0*100)}%</b> · в опыте: <b>${d.surv}</b> из ${d.tot}`);
  }});
})();
