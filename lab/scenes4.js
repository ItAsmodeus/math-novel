'use strict';
(()=>{
const SEC='Парадоксы измерения и вакуума';

const mzGeo=(w,h)=>({sx:.07*w,x1:.25*w,x2:.66*w,y1:.3*h,y2:.74*h,dx:.88*w,dy:.1*h});
function mzPos(g,u,arm,det){
  if(u<.2)return[U.lerp(g.sx,g.x1,u/.2),g.y2];
  if(u<.8){const V=g.y2-g.y1,H=g.x2-g.x1,s=(u-.2)/.6*(V+H);
    if(arm===0)return s<V?[g.x1,g.y2-s]:[g.x1+s-V,g.y1];
    return s<H?[g.x1+s,g.y2]:[g.x2,g.y2-(s-H)]}
  const t=(u-.8)/.2;return det===0?[U.lerp(g.x2,g.dx,t),g.y1]:[g.x2,U.lerp(g.y1,g.dy,t)];
}
function mzDraw(ctx,g,o){
  const pl='rgba(120,130,200,.3)';
  U.line(ctx,g.sx,g.y2,g.x2,g.y2,pl,1.5);U.line(ctx,g.x1,g.y2,g.x1,g.y1,pl,1.5);U.line(ctx,g.x1,g.y1,g.dx,g.y1,pl,1.5);U.line(ctx,g.x2,g.y2,g.x2,g.dy,pl,1.5);
  const diag=(x,y,col,lw,dash)=>U.line(ctx,x-17,y+17,x+17,y-17,col,lw,dash);
  diag(g.x1,g.y2,C.cy,3);U.text(ctx,'BS1',g.x1-12,g.y2+30,C.cy,12,'center');
  diag(g.x1,g.y1,'#cfd8ff',4);diag(g.x2,g.y2,'#cfd8ff',4);
  if(o.bs2){diag(g.x2,g.y1,C.cy,3);U.text(ctx,'BS2',g.x2+26,g.y1+26,C.cy,12,'center')}else{diag(g.x2,g.y1,'rgba(94,231,255,.25)',1.5,[3,4])}
  U.glow(ctx,g.sx,g.y2,18,C.am,.8);
  [[g.dx,g.y1,'D1',o.f[0]],[g.x2,g.dy,'D2',o.f[1]]].forEach(([x,y,n,f])=>{
    U.glow(ctx,x,y,22+34*f,f>.05?C.gr:C.vi,.4+.6*f);ctx.fillStyle='#11153a';ctx.beginPath();ctx.arc(x,y,17,0,TAU);ctx.fill();ctx.strokeStyle=C.vi;ctx.lineWidth=1.5;ctx.stroke();U.text(ctx,n,x,y,'#fff',12,'center',700)});
}
const ghost=(ctx,q,a)=>{U.glow(ctx,q[0],q[1],13,C.am,a);U.dot(ctx,q[0],q[1],2.5,'#fff')};

QL.add({id:'wheeler',sec:SEC,icon:'🔀',title:'Отложенный выбор Уилера',year:'Уилер, 1978 · Жак и др., 2007',
  lead:'Решение, быть ли фотону «волной» или «частицей», принимается уже после того, как он вошёл в прибор. И всё равно срабатывает.',
  mission:'Включи режим отложенного выбора и пропусти 60 фотонов.',
  controls:[{id:'mode',type:'select',label:'Второй светоделитель',options:['Вставлен','Убран','Отложенный выбор'],value:0},{id:'phi',type:'range',label:'Разность фаз плеч',min:0,max:360,step:15,value:0,fmt:v=>v+'°'},{id:'sp',type:'range',label:'Скорость',min:1,max:6,step:1,value:2},{id:'R',type:'range',label:'Коэффициент отражения BS1, R',min:.05,max:.95,step:.05,value:.5,fmt:v=>v.toFixed(2)}],
  text:`<h3>Интерферометр Маха — Цендера</h3><p>Светоделитель BS1 отправляет фотон сразу по двум плечам. Если на выходе стоит BS2, пути смешиваются и интерферируют: при нулевой разности фаз фотон <b>всегда</b> попадает в D1 — значит, он «шёл обоими путями», как волна.</p>
  <p>Уберём BS2. Теперь D1 и D2 показывают, каким путём пришёл фотон: 50/50, как частица, выбравшая одно плечо.</p>
  <h3>Отложенный выбор</h3><p>Уилер предложил решать, ставить ли BS2, когда фотон <b>уже прошёл</b> BS1 и летит внутри. Опыт (2007) показал: статистика всегда соответствует финальной конфигурации.</p>
  <div class="key">Фотон не «решает» на входе, кем быть, и прошлое не переписывается. Просто до измерения нет факта «шёл одним путём» или «обоими» — есть только амплитуды. «Ни одно явление не является явлением, пока оно не наблюдено» — Уилер.</div>`,
  quiz:[
    {q:'BS2 вставлен, разность фаз 0. Куда попадают фотоны?',a:['50/50 в D1 и D2','Всегда в D1','Всегда в D2'],c:1,why:'Интерференция двух путей гасит выход к D2.'},
    {q:'Означает ли отложенный выбор, что мы меняем прошлое фотона?',a:['Да, сигнал идёт назад во времени','Нет: до измерения у фотона просто не было определённого пути','Да, но только на наносекунды'],c:1,why:'Квантовая механика не приписывает фотону путь до измерения — менять нечего.'}],
  init(S){S.d={f:null,in:[0,0],out:[0,0],fl:[0,0],bs2:true,nd:0,note:0}},
  on(id,S){if(id!=='sp')this.init(S)},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,g=mzGeo(w,h);
    if(p.mode<2)d.bs2=p.mode===0;
    if(!d.f)d.f={u:0,arm:Math.random()<p.R?0:1,dec:false,det:-1};
    const f=d.f;f.u+=S.dt*.22*p.sp;
    d.fl[0]=Math.max(0,d.fl[0]-S.dt*3);d.fl[1]=Math.max(0,d.fl[1]-S.dt*3);d.note=Math.max(0,d.note-S.dt);
    if(p.mode===2&&!f.dec&&f.u>=.55){f.dec=true;d.bs2=Math.random()<.5;d.note=1}
    if(f.det<0&&f.u>=.8)f.det=d.bs2?(Math.random()<(1+2*Math.sqrt(p.R*(1-p.R))*Math.cos(p.phi*RAD))/2?0:1):f.arm;
    U.bg(ctx,S,.5);mzDraw(ctx,g,{bs2:d.bs2,f:d.fl});
    if(d.note>0)U.text(ctx,d.bs2?'выбор: BS2 вставлен!':'выбор: BS2 убран!',g.x2+30,g.y1-30,C.am,13,'left',700);
    if(f.u>=1){(d.bs2?d.in:d.out)[f.det]++;d.fl[f.det]=1;if(p.mode===2)d.nd++;d.f=null}
    else if(f.u<.2)ghost(ctx,mzPos(g,f.u,0,0),1);
    else if(f.u<.8){ghost(ctx,mzPos(g,f.u,0,0),.55);ghost(ctx,mzPos(g,f.u,1,0),.55)}
    else ghost(ctx,mzPos(g,f.u,0,f.det),1);
    if(p.mode===2&&d.nd>=60)S.win();
    const r=(a,n)=>`D1 <b>${U.pct(a[0],a[0]+a[1])}</b> / D2 <b>${U.pct(a[1],a[0]+a[1])}</b> (${a[0]+a[1]} ${n})`;
    S.hud(`Видность V = <b>${(2*Math.sqrt(p.R*(1-p.R))).toFixed(2)}</b> · различимость путей D = ${Math.abs(2*p.R-1).toFixed(2)} · V² + D² = 1<br>С BS2 — волна: ${r(d.in,'шт.')} · без BS2 — частица: ${r(d.out,'шт.')}`);
  }});

QL.add({id:'eraser',sec:SEC,icon:'🧽',title:'Квантовый ластик',year:'Скалли и Дрюль, 1982 · Ким и др., 1999',
  lead:'Информацию о пути можно стереть — и интерференция «возвращается». Но только если знать, как рассортировать точки.',
  mission:'Включи сортировку по совпадениям и накопи 400 фотонов: увидишь две спрятанные картины.',
  controls:[{id:'mode',type:'select',label:'Режим',options:['Метки пути','Ластик: все точки','Ластик: сортировка по совпадениям'],value:0},{id:'rate',type:'range',label:'Фотонов в секунду',min:10,max:400,step:10,value:120},{id:'k',type:'range',label:'Пространственная частота полос k',min:1,max:8,step:.5,value:4}],
  text:`<h3>Метки пути</h3><p>В двухщелевом опыте каждому фотону сопоставлен запутанный «близнец», хранящий информацию о щели. Интерференции нет — на экране сплошное пятно.</p>
  <h3>Стирание</h3><p>Близнеца можно измерить так, что информация о пути безвозвратно стирается. Измерение-ластик даёт случайный ответ «+» или «−». Общее пятно на экране при этом <b>не меняется</b>. Но если раскрасить точки по ответу ластика, проявятся две интерференционные картины, сдвинутые на полполосы. Вместе они дают то самое гладкое пятно.</p>
  <div class="key">Интерференция не возвращается «задним числом» — она была спрятана в корреляциях. Без результатов ластика, переданных обычным каналом, её не увидеть. Поэтому даже «отложенный» ластик не позволяет посылать сигналы в прошлое.</div>`,
  quiz:[
    {q:'Что видно на экране после стирания информации о пути, если не сортировать точки?',a:['Чёткие полосы','То же сплошное пятно','Ничего'],c:1,why:'Сумма двух сдвинутых картин — гладкое пятно. Полосы видны только в подвыборках.'},
    {q:'Можно ли ластиком послать сигнал в прошлое?',a:['Да','Нет: картина проявляется только после сравнения с результатами ластика','Только на малых расстояниях'],c:1,why:'Без классической информации о результатах ластика распределение на экране не меняется.'}],
  init(S){S.d={hits:[],b:[new Array(80).fill(0),new Array(80).fill(0)],n:0,prev:S.p.mode,acc:0}},
  on(id,S){if(id==='k')this.init(S);if(id==='mode'){if(S.p.mode===0||S.d.prev===0)this.init(S);S.d.prev=S.p.mode}},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,m=p.mode;
    d.acc+=S.dt*p.rate;
    while(d.acc>=1){d.acc--;const x=U.gauss()*.36;if(Math.abs(x)>=1)continue;const s=Math.random()<Math.cos(Math.PI*x*p.k)**2?0:1;
      d.hits.push(x,Math.random(),s);if(d.hits.length>18000)d.hits.splice(0,3);d.b[s][Math.min(79,(x+1)*40|0)]++;d.n++}
    U.bg(ctx,S);
    const X=x=>w/2+x*w*.45,y0=h*.14,bh=h*.36;
    ctx.fillStyle='#0c1030';U.rr(ctx,w*.05,y0,w*.9,bh,10);ctx.fill();
    for(let i=0;i<d.hits.length;i+=3){ctx.fillStyle=m===2?(d.hits[i+2]?C.mg:C.cy):'rgba(215,225,255,.8)';ctx.fillRect(X(d.hits[i]),y0+6+d.hits[i+1]*(bh-12),1.7,1.7)}
    const gy=h*.94,gh=h*.34,mx=Math.max(10,...d.b[0].map((v,i)=>v+d.b[1][i]));
    const curve=(f,col,lw)=>{ctx.beginPath();for(let i=0;i<80;i++){const x=X(-1+(i+.5)/40),y=gy-f(i)/mx*gh;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke()};
    U.line(ctx,w*.05,gy,w*.95,gy,'#2c3266');
    curve(i=>d.b[0][i]+d.b[1][i],m===2?'rgba(255,255,255,.3)':'#e8ecff',2);
    if(m===2){curve(i=>d.b[0][i],C.cy,2);curve(i=>d.b[1][i],C.mg,2);U.text(ctx,'ластик ответил «+»',w*.06,h*.58,C.cy,13);U.text(ctx,'ластик ответил «−»',w*.94,h*.58,C.mg,13,'right')}
    if(m===2&&d.n>=400)S.win();
    S.hud([`Путь помечен — интерференции нет. Фотонов: <b>${d.n}</b>`,`Путь стёрт, но точки не рассортированы — пятно то же. Фотонов: <b>${d.n}</b>`,`Те же точки, раскрашенные по ответу ластика: <b>две интерференционные картины</b>. Фотонов: ${d.n}`][m]);
  }});

QL.add({id:'bomb',sec:SEC,icon:'💣',title:'Бомба Элицура — Вайдмана',year:'Элицур и Вайдман, 1993',
  lead:'Как убедиться, что сверхчувствительная бомба исправна, не дотронувшись до неё ни одним фотоном? Квантовая механика это позволяет.',
  mission:'Сертифицируй 3 боевые бомбы, не взорвав их (нужен щелчок детектора D2).',
  controls:[{id:'send',type:'button',label:'💡 Послать фотон'},{id:'next',type:'button',label:'Следующая бомба'},{id:'pl',type:'range',label:'Доля боевых бомб',min:.1,max:.9,step:.1,value:.5}],
  text:`<h3>Задача</h3><p>Часть бомб боевые: взрываются от единственного фотона. Остальные — муляжи, пропускающие свет. Классически проверить бомбу можно лишь одним способом — посветить на неё. И потерять.</p>
  <h3>Решение</h3><p>Поставим бомбу в одно плечо интерферометра, настроенного так, что без препятствий фотон всегда идёт в D1. Муляж ничего не меняет: всегда D1. Боевая бомба — это детектор пути. Она разрушает интерференцию: в 50% случаев взрыв, в 25% — D1 (ничего не ясно), и в 25% — <b>щёлкает D2</b>.</p>
  <div class="key">Щелчок D2 невозможен без бомбы. Значит, она боевая. Но фотон пришёл в детектор — следовательно, он шёл по другому плечу и бомбы не касался. Мы получили знание об объекте без взаимодействия с ним.</div>
  <p>С помощью эффекта Зенона эффективность доведена почти до 100%. Опыт подтверждён Цайлингером и Квятом в 1995 году.</p>`,
  quiz:[
    {q:'О чём говорит срабатывание D2?',a:['Бомба — муляж','Бомба боевая, и она цела','Фотон потерялся'],c:1,why:'Без детектора пути в плече интерференция запрещает D2. Щелчок D2 = в плече стоит работающая бомба.'},
    {q:'Какова доля боевых бомб, найденных без взрыва за одну попытку?',a:['0%','25%','100%'],c:1,why:'50% — взрыв, 25% — D1 (неясно), 25% — D2 (успех).'}],
  init(S){S.d={live:Math.random()<(S.p.pl||.5),f:null,fl:[0,0],msg:'Перед тобой бомба. Боевая или муляж — неизвестно. Пошли фотон.',fin:false,cert:0,expl:0,boom:0}},
  on(id,S){
    const d=S.d;
    if(id==='next'){const c=d.cert,e=d.expl;this.init(S);S.d.cert=c;S.d.expl=e;return}
    if(id!=='send'||d.f||d.fin)return;const r=Math.random();
    d.f={u:0,out:!d.live?'D1':r<.5?'boom':r<.75?'D1':'D2'};d.msg='Фотон в интерферометре…';
  },
  draw(ctx,w,h,S){
    const d=S.d,g=mzGeo(w,h),bxp=(g.x1+g.x2)/2,f=d.f;
    d.fl[0]=Math.max(0,d.fl[0]-S.dt*2);d.fl[1]=Math.max(0,d.fl[1]-S.dt*2);d.boom=Math.max(0,d.boom-S.dt);
    U.bg(ctx,S,.5);mzDraw(ctx,g,{bs2:true,f:d.fl});
    
    if(!(d.gone&&d.boom===0)){ctx.fillStyle='#1a1f2b';ctx.fillRect(bxp-15,g.y2-15,30,30);ctx.strokeStyle=d.fin&&d.live?C.rd:C.am;ctx.lineWidth=1.5;ctx.strokeRect(bxp-15,g.y2-15,30,30);U.text(ctx,'B',bxp,g.y2,'#fff',13,'center',700)}
    U.text(ctx,d.fin?(d.live?'боевая':'муляж'):'?',bxp,g.y2+30,d.fin?(d.live?C.rd:C.dim):C.am,14,'center',800);
    if(d.boom>0)U.glow(ctx,bxp,g.y2,(1.2-d.boom)*260,'#ffb347',d.boom);
    if(f){f.u+=S.dt*.45;
      if(f.u<.2)ghost(ctx,mzPos(g,f.u,0,0),1);
      else if(f.u<.8){
        if(!d.live){ghost(ctx,mzPos(g,f.u,0,0),.55);ghost(ctx,mzPos(g,f.u,1,0),.55)}
        else if(f.out==='boom'){const q=mzPos(g,f.u,1,0);ghost(ctx,q,1);if(q[0]>=bxp-6){d.boom=1.2;d.gone=true;d.expl++;d.fin=true;d.f=null;d.msg='Взрыв. Бомба была боевой — и взорвалась. Не повезло: так бывает в половине случаев.'}}
        else ghost(ctx,mzPos(g,f.u,0,0),1);
      }else if(f.u<1)ghost(ctx,mzPos(g,f.u,0,f.out==='D1'?0:1),1);
      else{d.f=null;
        if(f.out==='D1'){d.fl[0]=1;d.msg='Щёлкнул D1. Так бывает и с муляжом, и с боевой — ничего не ясно. Пошли ещё фотон или смени бомбу.'}
        else{d.fl[1]=1;d.cert++;d.fin=true;d.msg='Щёлкнул D2! Без бомбы это невозможно: она <b>боевая и целая</b>. Фотон её не касался.';if(d.cert>=3)S.win()}}
    }
    S.hud(`${d.msg}<br>Сертифицировано: <b>${d.cert}</b> · взорвано: <b>${d.expl}</b>`);
  }});

QL.add({id:'aharonov-bohm',sec:SEC,icon:'🧿',title:'Эффект Ааронова — Бома',year:'Ааронов и Бом, 1959',
  lead:'Электрон чувствует магнитное поле, даже летя там, где поля нет вообще. Потенциал оказывается реальнее поля.',
  mission:'Подбери поток так, чтобы в центре экрана вместо яркой полосы оказалась тёмная (Φ = 0.5 Φ₀).',
  controls:[{id:'flux',type:'range',label:'Магнитный поток в соленоиде',min:0,max:2,step:.05,value:0,fmt:v=>v.toFixed(2)+' Φ₀'},{id:'lam',type:'range',label:'Длина волны де Бройля λ',min:.5,max:2,step:.1,value:1,fmt:v=>v.toFixed(1)}],
  text:`<h3>Опыт</h3><p>Между щелями стоит тонкий длинный соленоид. Магнитное поле заперто строго внутри него; снаружи, где летят электроны, <b>B = 0</b>. Сила Лоренца на электроны не действует. Классическая физика уверена: соленоид ни на что не влияет.</p>
  <h3>Результат</h3><p>Интерференционная картина сдвигается! Сдвиг фазы между двумя путями равен 2π·Φ/Φ₀, где Φ — поток внутри соленоида. При Φ = Φ₀/2 максимумы и минимумы меняются местами, при Φ = Φ₀ картина возвращается.</p>
  <div class="key">Волновая функция «чувствует» векторный потенциал A, который снаружи соленоида не равен нулю. В квантовой физике потенциалы — не математический трюк, а физическая реальность, и фаза зависит от топологии: пути охватывают область с потоком.</div>
  <p>Эффект подтверждён Тономурой в 1986 году с тороидальным магнитом, экранированным сверхпроводником.</p>`,
  quiz:[
    {q:'Какое магнитное поле действует на электроны на их пути?',a:['Сильное','Нулевое','Переменное'],c:1,why:'Поле целиком внутри соленоида; электроны летят там, где B = 0.'},
    {q:'Что тогда сдвигает интерференционную картину?',a:['Векторный потенциал, меняющий фазу волновой функции','Электрическое отталкивание','Гравитация соленоида'],c:0,why:'Разность фаз двух путей определяется потоком, который они охватывают.'}],
  init(S){S.d={}},
  draw(ctx,w,h,S){
    const fx=S.p.flux,cy=h/2,sx=w*.07,bx=w*.3,sol=w*.4,scx=w*.74,gap=h*.14;
    if(Math.abs(fx%1-.5)<.03)S.win();
    U.bg(ctx,S);
    ctx.fillStyle='#2b3060';for(const[a,b]of[[0,cy-gap-6],[cy-gap+6,cy+gap-6],[cy+gap+6,h]])ctx.fillRect(bx-4,a,8,b-a);
    U.glow(ctx,sx,cy,20,C.cy,.8);
    for(const s of[-1,1]){
      ctx.beginPath();ctx.moveTo(sx,cy);ctx.lineTo(bx,cy+s*gap);ctx.quadraticCurveTo(sol+w*.05,cy+s*gap*1.25,scx,cy);ctx.strokeStyle='rgba(94,231,255,.3)';ctx.lineWidth=1.5;ctx.stroke();
      for(let k=0;k<3;k++){const u=(S.t*.35+k/3)%1;let x,y;
        if(u<.35){const t=u/.35;x=U.lerp(sx,bx,t);y=U.lerp(cy,cy+s*gap,t)}
        else{const t=(u-.35)/.65,a=(1-t)*(1-t),b=2*t*(1-t),c=t*t;x=a*bx+b*(sol+w*.05)+c*scx;y=a*(cy+s*gap)+b*(cy+s*gap*1.25)+c*cy}
        U.glow(ctx,x,y,9,C.cy,.6)}
    }
    U.glow(ctx,sol,cy,18+26*fx,C.mg,.25+.35*fx);ctx.fillStyle='#1c2150';ctx.beginPath();ctx.arc(sol,cy,13,0,TAU);ctx.fill();ctx.strokeStyle=C.mg;ctx.lineWidth=2;ctx.stroke();
    U.text(ctx,'B',sol,cy,C.mg,13,'center',800);U.text(ctx,'соленоид: поле только внутри',sol,cy+34,C.mg,12,'center');U.text(ctx,'снаружи B = 0',sol,cy-gap*1.6,C.dim,12,'center');
    const I=y=>Math.exp(-y*y/.4)*Math.cos(Math.PI*3*y/S.p.lam+Math.PI*fx)**2,sw=w*.07,n=160;
    for(let i=0;i<n;i++){const y=-1+2*(i+.5)/n,v=I(y);ctx.fillStyle=`rgba(94,231,255,${v})`;ctx.fillRect(scx,cy+y*h*.46,sw,h*.92/n+1)}
    ctx.strokeStyle='#2c3266';ctx.strokeRect(scx,cy-h*.46,sw,h*.92);
    ctx.beginPath();for(let i=0;i<=n;i++){const y=-1+2*i/n,x=scx+sw+10+I(y)*w*.13;i?ctx.lineTo(x,cy+y*h*.46):ctx.moveTo(x,cy+y*h*.46)}ctx.strokeStyle=C.cy;ctx.lineWidth=2;ctx.stroke();
    U.line(ctx,scx-8,cy,w*.99,cy,'rgba(255,200,87,.6)',1,[4,4]);
    S.hud(`Сдвиг фазы между путями: <b>${(2*fx).toFixed(2)}π</b> · в центре экрана: <b>${I(0)>.5?'яркая':'тёмная'}</b> полоса`);
  }});

QL.add({id:'casimir',sec:SEC,icon:'🧲',title:'Эффект Казимира',year:'Казимир, 1948 · Ламоро, 1997',
  lead:'Две незаряженные пластины в пустоте притягиваются друг к другу — их сдавливает сам вакуум.',
  mission:'Сблизи пластины до расстояния ≤ 0.15 и посмотри, как взлетает сила.',
  controls:[{id:'d',type:'range',label:'Расстояние между пластинами',min:.1,max:1,step:.01,value:.6,fmt:v=>v.toFixed(2)},{id:'free',type:'toggle',label:'Отпустить пластины',value:false}],
  text:`<h3>Вакуум не пуст</h3><p>Из принципа неопределённости следует, что поле не может быть в точности нулевым: даже в идеальной пустоте есть «нулевые колебания» всех возможных длин волн.</p>
  <h3>Пластины-фильтр</h3><p>Между двумя проводящими пластинами помещаются только те волны, у которых на расстоянии укладывается целое число полуволн. Длинные волны внутрь не влезают. Снаружи ограничений нет. Мод снаружи больше, чем внутри, — и вакуум давит на пластины снаружи сильнее.</p>
  <div class="key">Сила Казимира растёт как 1/d⁴. На расстоянии 1 мкм это тысячные доли паскаля, при 100 нм уже около 13 Па, а при 10 нм давление достигает одной атмосферы. Это измеряемое проявление энергии пустого пространства.</div>
  <p>Эффект мешает наномеханизмам: детали микромашин слипаются. Он же — близкий родственник сил Ван-дер-Ваальса.</p>`,
  quiz:[
    {q:'Почему пластины притягиваются?',a:['Они заряжены','Между ними помещается меньше вакуумных мод, чем снаружи','Их тянет гравитация'],c:1,why:'Разница в числе разрешённых колебаний создаёт разницу давлений.'},
    {q:'Расстояние уменьшили в 2 раза. Как изменилась сила?',a:['В 2 раза','В 4 раза','В 16 раз'],c:2,why:'F ∝ 1/d⁴: 2⁴ = 16.'}],
  init(S){S.d={}},
  draw(ctx,w,h,S){
    const p=S.p;if(p.free&&p.d>.1)S.set('d',Math.max(.1,p.d-S.dt*.004/Math.pow(p.d,3)));
    if(p.d<=.15)S.win();
    const D=p.d*w*.5,xl=w/2-D/2,xr=w/2+D/2,Nm=Math.max(1,Math.floor(p.d*10)),F=1/Math.pow(p.d,4);
    U.bg(ctx,S);ctx.lineWidth=1.3;
    for(let r=0;r<8;r++){const y=h*(.2+r*.085),n=1+r%Nm;
      ctx.strokeStyle='rgba(155,123,255,.45)';
      for(const[a,b]of[[0,xl-8],[xr+8,w]]){ctx.beginPath();for(let x=a;x<=b;x+=4){const yy=y+4*Math.sin(x*.021+S.t*1.3+r)+4*Math.sin(x*.053-S.t*2.1+r*2)+3*Math.sin(x*.12+S.t*3.3+r*3);x>a?ctx.lineTo(x,yy):ctx.moveTo(x,yy)}ctx.stroke()}
      ctx.strokeStyle=`hsl(${185+n*22},100%,70%)`;ctx.beginPath();
      for(let x=xl+6;x<=xr-6;x+=2){const yy=y+9*Math.sin(n*Math.PI*(x-xl-6)/(D-12))*Math.cos(S.t*(2+n)+r);x>xl+6?ctx.lineTo(x,yy):ctx.moveTo(x,yy)}ctx.stroke();
    }
    const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#dfe6ff');g.addColorStop(1,'#6f7bc0');ctx.fillStyle=g;
    ctx.fillRect(xl-8,h*.12,8,h*.72);ctx.fillRect(xr,h*.12,8,h*.72);
    const al=Math.min(w*.14,22+Math.log10(F)*22);
    for(const y of[h*.3,h*.5,h*.7]){U.arrow(ctx,xl-14-al,y,xl-14,y,C.am,3);U.arrow(ctx,xr+14+al,y,xr+14,y,C.am,3)}
    U.text(ctx,`разрешённых мод внутри: ${Nm}`,w/2,h*.92,C.cy,13,'center');
    const Pc=1.3e-3*F;
    S.hud(`d = <b>${Math.round(p.d*1000)} нм</b> · давление π²ħc/240d⁴ = <b>${Pc<1?(Pc*1000).toFixed(1)+' мПа':Pc.toFixed(1)+' Па'}</b> · в ${F<100?F.toFixed(1):Math.round(F)} раз больше, чем при 1 мкм`);
  }});

QL.add({id:'wigner',sec:SEC,icon:'🧑‍🔬',title:'Друг Вигнера и многие миры',year:'Вигнер, 1961 · Эверетт, 1957',
  lead:'Друг в лаборатории измерил спин и видит результат. Но для Вигнера снаружи вся лаборатория — в суперпозиции. Кто прав?',
  mission:'Проведи измерение со всех трёх точек зрения (для Вигнера — открой дверь).',
  controls:[{id:'view',type:'select',label:'Точка зрения',options:['Глазами друга','Глазами Вигнера','Многие миры'],value:0},{id:'meas',type:'button',label:'📏 Измерить спин'},{id:'open',type:'button',label:'🚪 Открыть дверь'},{id:'reset',type:'button',label:'Сначала'}],
  text:`<h3>Парадокс</h3><p>Друг измеряет спин и видит определённый результат: для него суперпозиция исчезла. Вигнер стоит за закрытой дверью. По уравнению Шрёдингера изолированная лаборатория перешла в суперпозицию «друг видел ↑» + «друг видел ↓». Коллапс произошёл или нет? Это кот Шрёдингера, в котором кот сам умеет ставить опыты.</p>
  <h3>Варианты ответа</h3><p><b>Копенгаген:</b> квантовое состояние — это знание наблюдателя, у каждого оно своё. <b>Объективный коллапс:</b> большие системы схлопываются сами — и это можно проверить. <b>Многие миры (Эверетт):</b> коллапса нет вообще. Каждое измерение ветвит мир: в одной ветке друг видел ↑, в другой ↓, и обе реальны.</p>
  <div class="key">Все интерпретации дают одинаковые предсказания для опытов, которые мы умеем ставить. Спор идёт о том, что реально: волновая функция, результаты измерений или всё дерево ветвей. Расширенные версии опыта (Фраухигер — Реннер, 2018) показывают, что «объективные факты для всех» — уже слишком сильное требование.</div>`,
  quiz:[
    {q:'Как лаборатория выглядит для Вигнера до открытия двери?',a:['Друг уже видел определённый результат','Суперпозиция обоих вариантов «друг видел ↑» и «друг видел ↓»','Лаборатория пуста'],c:1,why:'Изолированная система эволюционирует по уравнению Шрёдингера без коллапса.'},
    {q:'Что утверждает многомировая интерпретация?',a:['Коллапс происходит мгновенно','Коллапса нет: реализуются все исходы, каждый в своей ветви','Измерений не существует'],c:1,why:'По Эверетту, волновая функция никогда не схлопывается, а наблюдатель ветвится вместе с миром.'}],
  init(S){S.d={meas:false,res:1,open:false,path:[],seen:{}}},
  on(id,S){
    const d=S.d,v=S.p.view;
    if(id==='view'||id==='reset'){d.meas=false;d.open=false;d.path=[];return}
    if(id==='meas'){if(v===2){if(d.path.length<6)d.path.push(Math.random()<.5?0:1);d.seen[2]=1}else if(!d.meas){d.meas=true;d.res=Math.random()<.5?1:-1;if(v===0)d.seen[0]=1}}
    if(id==='open'&&v===1&&d.meas){d.open=true;d.seen[1]=1}
    if(d.seen[0]&&d.seen[1]&&d.seen[2])S.win();
  },
  draw(ctx,w,h,S){
    const d=S.d,v=S.p.view;U.bg(ctx,S);U.stars(ctx,S,70);
    if(v===2){
      const n=d.path.length,X=L=>w*(.08+L*.14),Y=(L,i)=>h*(.14+.74*(i+.5)/(1<<L));let me=0;
      for(let L=0;L<n;L++){const nx=me*2+d.path[L];
        for(let i=0;i<1<<L;i++)for(const c of[0,1]){const mine=i===me&&c===d.path[L];ctx.globalAlpha=mine?1:.4;
          U.line(ctx,X(L),Y(L,i),X(L+1),Y(L+1,i*2+c),mine?'#fff':c?C.mg:C.cy,mine?3:1.3);ctx.globalAlpha=1}
        me=nx}
      for(let i=0;i<1<<n;i++)U.glow(ctx,X(n),Y(n,i),i===me?12:6,i===me?'#fff':C.vi,.9);
      U.text(ctx,'ты здесь',X(n)+16,Y(n,me),'#fff',12);
      S.hud(`Измерений: <b>${n}</b> из 6 · ветвей мира: <b>${1<<n}</b> · в каждой живёт своя версия тебя, уверенная, что исход был случайным`);return;
    }
    const lx=w*.16,ly=h*.2,lw=w*.5,lh=h*.6,sup=v===1&&d.meas&&!d.open,def=d.meas&&!sup,sx=lx+lw*.3,sy=ly+lh*.5;
    ctx.fillStyle='#0e1233';U.rr(ctx,lx,ly,lw,lh,14);ctx.fill();ctx.strokeStyle=sup?`hsl(${270+40*Math.sin(S.t*4)},100%,70%)`:C.vi;ctx.lineWidth=2.5;ctx.stroke();
    U.text(ctx,'лаборатория',lx+14,ly+18,C.dim,12);
    const spin=(dir,col,a)=>{ctx.globalAlpha=a;U.arrow(ctx,sx,sy+dir*34,sx,sy-dir*34,col,4);ctx.globalAlpha=1};
    U.glow(ctx,sx,sy,30,C.vi,.6);
    if(def)spin(d.res,d.res>0?C.cy:C.mg,1);else{spin(1,C.cy,.45+.4*Math.sin(S.t*5));spin(-1,C.mg,.45+.4*Math.cos(S.t*5))}
    const fr=(x,a)=>{ctx.globalAlpha=a;ctx.strokeStyle=C.am;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,sy,lh*.11,0,TAU);ctx.stroke();U.text(ctx,'F',x,sy,C.am,lh*.1,'center',700);ctx.globalAlpha=1},fx=lx+lw*.68;
    if(sup){const o=Math.sin(S.t*3)*10;fr(fx-14+o,.55);fr(fx+14-o,.55);U.text(ctx,'«вижу ↑»',fx-30,sy-lh*.3,C.cy,13,'center');U.text(ctx,'«вижу ↓»',fx+30,sy+lh*.3,C.mg,13,'center')}
    else{fr(fx,1);if(def)U.text(ctx,d.res>0?'«вижу ↑»':'«вижу ↓»',fx,sy-lh*.3,d.res>0?C.cy:C.mg,14,'center',700)}
    if(v===1){ctx.fillStyle=d.open?'rgba(109,255,176,.5)':'#565c8c';ctx.fillRect(lx+lw-4,sy-40,8,80);ctx.strokeStyle=C.gr;ctx.lineWidth=2;ctx.beginPath();ctx.arc(w*.84,sy,lh*.11,0,TAU);ctx.stroke();U.text(ctx,'W',w*.84,sy,C.gr,lh*.1,'center',700);U.text(ctx,'Вигнер',w*.84,sy+lh*.26,C.am,13,'center',700)}
    S.hud(v===0?(d.meas?'Друг: «Результат определённый. Суперпозиции больше нет».':'Спин в суперпозиции ↑ + ↓. Нажми «Измерить».')
      :!d.meas?'Вигнер снаружи. Дверь закрыта. Пусть друг измерит спин.'
      :sup?'Для Вигнера: |↑⟩|друг видел ↑⟩ + |↓⟩|друг видел ↓⟩ — <b>вся лаборатория в суперпозиции</b>. Открой дверь.'
      :'Вигнер открыл дверь и видит один исход. Когда же произошёл коллапс — при измерении друга или сейчас?');
  }});
})();
