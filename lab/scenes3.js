'use strict';
(()=>{
const SEC='Запутанность и квантовая информация';

function thread(ctx,x1,x2,y,t,a){
  const g=ctx.createLinearGradient(x1,0,x2,0);g.addColorStop(0,C.cy);g.addColorStop(1,C.mg);
  ctx.strokeStyle=g;ctx.globalAlpha=a;ctx.lineWidth=1.5;
  for(let k=0;k<3;k++){ctx.beginPath();for(let x=x1;x<=x2;x+=4){const u=(x-x1)/(x2-x1||1),yy=y+Math.sin(u*14+t*6+k*2.1)*9*Math.sin(Math.PI*u);x>x1?ctx.lineTo(x,yy):ctx.moveTo(x,yy)}ctx.stroke()}
  ctx.globalAlpha=1;
}
function detector(ctx,x,y,R,ang,col,label,res,fl){
  ctx.fillStyle='#11153a';ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();
  const dx=Math.sin(ang)*R,dy=-Math.cos(ang)*R;U.line(ctx,x-dx,y-dy,x+dx,y+dy,'rgba(255,255,255,.35)',1.5,[4,4]);
  if(fl>0&&res){ctx.globalAlpha=Math.min(1,fl*2);U.arrow(ctx,x-dx*res*.7,y-dy*res*.7,x+dx*res*.7,y+dy*res*.7,res>0?C.cy:C.mg,4);ctx.globalAlpha=1}
  U.text(ctx,label,x,y+R+16,col,13,'center',700);
}

QL.add({id:'epr',sec:SEC,icon:'🔗',title:'Запутанность и парадокс ЭПР',year:'Эйнштейн, Подольский, Розен, 1935',
  lead:'Две частицы с общим состоянием: измерь одну — и мгновенно знаешь результат для другой, как бы далеко она ни улетела.',
  mission:'Поставь детекторам Алисы и Боба одинаковые углы и набери 30 пар — результаты всегда противоположны.',
  controls:[{id:'a',type:'range',label:'Угол Алисы',min:0,max:180,step:15,value:0,fmt:v=>v+'°'},{id:'b',type:'range',label:'Угол Боба',min:0,max:180,step:15,value:60,fmt:v=>v+'°'},{id:'V',type:'range',label:'Видность V (чистота состояния)',min:0,max:1,step:.05,value:1,fmt:v=>v.toFixed(2)}],
  text:`<h3>Запутанная пара</h3><p>Источник рождает пары частиц с суммарным спином ноль. Ни у одной из них нет своего определённого спина — определено только то, что они противоположны. Измерь обе вдоль одной оси: если у Алисы «вверх», у Боба наверняка «вниз».</p>
  <h3>Парадокс</h3><p>Эйнштейн рассуждал: раз результат Боба предсказуем без воздействия на его частицу, значит он был предопределён заранее — «скрытыми параметрами», а квантовая механика неполна. Альтернатива — «жуткое дальнодействие», которое он отвергал.</p>
  <div class="key">Запутанность не передаёт сигналов. Каждый видит у себя случайную последовательность; связь обнаруживается только при сравнении записей — по обычному каналу. Быстрее света не передаётся ничего, кроме корреляции.</div>
  <p>При разных углах доля противоположных исходов равна cos²(Δ/2). Эта зависимость — ключ к следующей главе.</p>`,
  quiz:[
    {q:'Может ли Алиса передать Бобу сообщение через запутанность?',a:['Да, мгновенно','Нет: её результаты случайны, а корреляции видны только при сравнении','Да, но только один бит'],c:1,why:'Управлять исходом измерения нельзя, поэтому сигнал закодировать невозможно.'},
    {q:'Что было у каждой частицы пары до измерения?',a:['Свой определённый спин','Определённого спина не было — только общая корреляция','Нулевой спин'],c:1,why:'Определено лишь состояние пары целиком: спины противоположны.'}],
  init(S){S.d={pairs:[],acc:1,n:0,opp:0,tape:[],fa:0,fb:0,ra:0,rb:0}},
  on(id,S){this.init(S)},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,cy=h*.4,ax=w*.12,bx=w*.88,dt=S.dt;
    U.bg(ctx,S);U.stars(ctx,S,90);
    d.acc+=dt*2.2;if(d.acc>=1){d.acc=0;d.pairs.push({u:0})}
    d.fa=Math.max(0,d.fa-dt);d.fb=Math.max(0,d.fb-dt);
    U.glow(ctx,w/2,cy,26,C.vi,.8);U.text(ctx,'источник',w/2,cy+34,C.dim,12,'center');
    d.pairs=d.pairs.filter(q=>{q.u+=dt*.8;
      if(q.u>=1){const A=Math.random()<.5?1:-1,B=Math.random()<(1-p.V*Math.cos((p.a-p.b)*RAD))/2?A:-A;d.n++;if(A!==B)d.opp++;d.ra=A;d.rb=B;d.fa=d.fb=.5;d.tape.push(A,B);if(d.tape.length>48)d.tape.splice(0,2);return false}
      const x1=w/2-q.u*(w/2-ax-34),x2=w/2+q.u*(bx-34-w/2);thread(ctx,x1,x2,cy,S.t,.75);
      U.glow(ctx,x1,cy,14,C.cy,.9);U.glow(ctx,x2,cy,14,C.mg,.9);U.dot(ctx,x1,cy,3,'#fff');U.dot(ctx,x2,cy,3,'#fff');return true});
    detector(ctx,ax,cy,34,p.a*RAD,C.cy,'Алиса',d.ra,d.fa);detector(ctx,bx,cy,34,p.b*RAD,C.mg,'Боб',d.rb,d.fb);
    const ty=h*.74,cw=Math.min(22,w*.8/24);
    U.text(ctx,'Алиса',w*.1-8,ty,C.dim,12,'right');U.text(ctx,'Боб',w*.1-8,ty+cw+4,C.dim,12,'right');
    for(let i=0;i<d.tape.length;i+=2)for(const k of[0,1]){const v=d.tape[i+k];ctx.fillStyle=v>0?C.cy:C.mg;U.rr(ctx,w*.1+i/2*(cw+2),ty-cw/2+k*(cw+4),cw,cw,4);ctx.fill();U.text(ctx,v>0?'↑':'↓',w*.1+i/2*(cw+2)+cw/2,ty+k*(cw+4),'#05060f',12,'center',800)}
    if(p.a===p.b&&d.n>=30)S.win();
    S.hud(`Пар: <b>${d.n}</b> · противоположных: <b>${U.pct(d.opp,d.n)}</b> · теория (1 + V cos Δ)/2 = ${Math.round(50*(1+p.V*Math.cos((p.a-p.b)*RAD)))}% · E(a,b) = ${(-p.V*Math.cos((p.a-p.b)*RAD)).toFixed(2)}`);
  }});

QL.add({id:'bell',sec:SEC,icon:'🔔',title:'Неравенство Белла',year:'Белл, 1964 · Аспе, 1982',
  lead:'Эксперимент, который отличает «частицы всё знали заранее» от настоящей квантовой запутанности. Природа выбрала второе.',
  mission:'В квантовом режиме набери 400 пар и пробей классический предел: S > 2.4.',
  controls:[{id:'mode',type:'select',label:'Мир',options:['Квантовая запутанность','Скрытые параметры'],value:0},{id:'rate',type:'range',label:'Пар в секунду',min:5,max:300,step:5,value:60},{id:'V',type:'range',label:'Видность V',min:0,max:1,step:.01,value:1,fmt:v=>v.toFixed(2)},{id:'dl',type:'range',label:'Угол Боба β (второй: β + 90°)',min:0,max:90,step:5,value:45,fmt:v=>v+'°'}],
  text:`<h3>Игра CHSH</h3><p>Алиса случайно выбирает один из двух углов детектора (0° или 90°), Боб — из своих двух (45° или 135°). Для каждой из четырёх комбинаций считаем корреляцию E: +1, если результаты всегда совпадают, −1, если всегда противоположны. Из них собираем число <b>S</b>.</p>
  <h3>Предел Белла</h3><p>Джон Белл доказал: если у частиц есть заранее заготовленные ответы и они не влияют друг на друга на расстоянии, то <b>|S| ≤ 2</b>. Всегда, при любой хитрости. Переключись на «скрытые параметры» — S упрётся в 2.</p>
  <p>Квантовая механика предсказывает <b>S = 2√2 ≈ 2.83</b>. Эксперименты Клаузера, Аспе и Цайлингера (Нобелевская премия 2022) подтвердили: предел нарушается.</p>
  <div class="key">Мир не может быть одновременно «локальным» и «реалистичным». Либо у свойств нет значений до измерения, либо есть нелокальные связи. Эйнштейновская мечта о скрытых параметрах закрыта экспериментом.</div>`,
  quiz:[
    {q:'Что означает S > 2 в эксперименте?',a:['Приборы неисправны','Локальные скрытые параметры не могут объяснить результаты','Сигнал идёт быстрее света'],c:1,why:'Любая теория с заготовленными локальными ответами даёт |S| ≤ 2.'},
    {q:'Какой максимум S допускает квантовая механика?',a:['2','2√2 ≈ 2.83','4'],c:1,why:'Это граница Цирельсона, она достигается на запутанных парах при углах через 45°.'}],
  init(S){S.d={n:[0,0,0,0],s:[0,0,0,0],fly:[],acc:0,ia:0,ib:0}},
  on(id,S){if(id!=='rate')this.init(S)},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,cy=h*.26,ax=w*.1,bx=w*.9;
    d.acc+=S.dt*p.rate;
    while(d.acc>=1){d.acc--;const i=Math.random()<.5?0:1,j=Math.random()<.5?0:1,a=[0,90][i]*RAD,b=(p.dl+90*j)*RAD;let A,B;
      if(p.mode===0){A=Math.random()<.5?1:-1;B=Math.random()<(1-p.V*Math.cos(a-b))/2?A:-A}
      else{const l=U.rnd(TAU);A=Math.cos(a-l)>=0?1:-1;B=Math.cos(b-l)>=0?-1:1}
      d.n[i*2+j]++;d.s[i*2+j]+=A*B;d.ia=i;d.ib=j;if(d.fly.length<30)d.fly.push(0)}
    const E=d.n.map((n,k)=>n?d.s[k]/n:0),Sv=Math.abs(E[0]-E[1]+E[2]+E[3]),tot=d.n.reduce((x,y)=>x+y,0);
    U.bg(ctx,S);U.stars(ctx,S,70);
    U.glow(ctx,w/2,cy,22,C.vi,.8);
    d.fly=d.fly.map(u=>u+S.dt*1.6).filter(u=>u<1);
    for(const u of d.fly){const x1=w/2-u*(w/2-ax-30),x2=w/2+u*(bx-30-w/2);ctx.globalAlpha=.6;U.line(ctx,x1,cy,x2,cy,'rgba(155,123,255,.35)',1);U.glow(ctx,x1,cy,9,C.cy,.9);U.glow(ctx,x2,cy,9,C.mg,.9);ctx.globalAlpha=1}
    detector(ctx,ax,cy,28,[0,90][d.ia]*RAD,C.cy,`Алиса: ${[0,90][d.ia]}°`,0,0);detector(ctx,bx,cy,28,(p.dl+90*d.ib)*RAD,C.mg,`Боб: ${p.dl+90*d.ib}°`,0,0);
    const names=['E(a, b)','E(a, b′)','E(a′, b)','E(a′, b′)'],by=h*.6,bh=h*.11;
    E.forEach((e,k)=>{const x=w*(.08+k*.11);U.line(ctx,x-16,by,x+16,by,'#566');ctx.fillStyle=e>=0?C.cy:C.mg;ctx.fillRect(x-11,e>=0?by-e*bh:by,22,Math.abs(e)*bh);
      U.text(ctx,e.toFixed(2),x,by+(e>=0?-e*bh-10:-e*bh+10),C.tx,12,'center');U.text(ctx,names[k],x,by+bh+26,C.dim,10.5,'center')});
    const gx=w*.54,gw=w*.4,gy=h*.62,X=v=>gx+gw*v/3;
    ctx.fillStyle='#161b40';U.rr(ctx,gx,gy-9,gw,18,9);ctx.fill();
    const gr=ctx.createLinearGradient(gx,0,gx+gw,0);gr.addColorStop(0,C.cy);gr.addColorStop(.67,C.vi);gr.addColorStop(1,C.mg);
    ctx.fillStyle=gr;U.rr(ctx,gx,gy-9,Math.max(6,X(Math.min(3,Sv))-gx),18,9);ctx.fill();
    U.line(ctx,X(2),gy-24,X(2),gy+24,'#fff',2);U.text(ctx,'классический предел 2',X(2),gy-34,'#fff',12,'center');
    U.line(ctx,X(2.83),gy-24,X(2.83),gy+24,C.mg,2,[4,3]);U.text(ctx,'квантовый 2√2',X(2.83),gy+36,C.mg,12,'center');
    U.text(ctx,`S = ${Sv.toFixed(2)}`,gx,gy+62,Sv>2.05?C.gr:C.tx,26,'left',800);
    if(p.mode===0&&tot>=400&&Sv>2.4)S.win();
    S.hud(`Пар измерено: <b>${tot}</b> · ${p.mode?'локальные скрытые параметры: |S| ≤ 2':`запутанное состояние · теория S = 2V(cos β + sin β) = <b>${(2*p.V*(Math.cos(p.dl*RAD)+Math.sin(p.dl*RAD))).toFixed(2)}</b>`}`);
  }});

function bloch(ctx,x,y,R,th,ph,label,mode,t){
  ctx.fillStyle='#11153a';ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();
  ctx.strokeStyle=mode==='dead'?'#3a406a':C.vi;ctx.lineWidth=1.5;ctx.stroke();
  U.text(ctx,'|0⟩',x,y-R-10,C.dim,11,'center');U.text(ctx,'|1⟩',x,y+R+10,C.dim,11,'center');
  if(mode==='state'){const col=`hsl(${ph},100%,68%)`,tx=x+Math.sin(th)*R*.85,ty=y-Math.cos(th)*R*.85;U.arrow(ctx,x,y,tx,ty,col,3.5);U.glow(ctx,tx,ty,12,col,.9)}
  else if(mode==='ent'){for(let k=0;k<5;k++){const a=t*2+k*TAU/5;ctx.globalAlpha=.3;U.line(ctx,x,y,x+Math.sin(a)*R*.8,y-Math.cos(a)*R*.8,k%2?C.cy:C.mg,2);ctx.globalAlpha=1}U.text(ctx,'?',x,y,'#fff',18,'center',800)}
  else U.text(ctx,'✕',x,y,'#565c8c',22,'center');
  U.text(ctx,label,x,y+R+28,C.tx,12.5,'center');
}

QL.add({id:'teleport',sec:SEC,icon:'🛸',title:'Квантовая телепортация',year:'Беннетт и др., 1993 · Цайлингер, 1997',
  lead:'Перенос неизвестного квантового состояния на далёкую частицу — без перемещения самой частицы. Оригинал при этом разрушается.',
  mission:'Проведи весь протокол до конца и доставь состояние |ψ⟩ Бобу.',
  controls:[{id:'next',type:'button',label:'Следующий шаг ▶'},{id:'reset',type:'button',label:'Сначала'},{id:'th',type:'range',label:'Состояние: θ',min:0,max:180,step:5,value:55,fmt:v=>v+'°'},{id:'ph',type:'range',label:'Состояние: фаза φ',min:0,max:360,step:10,value:190,fmt:v=>v+'°'}],
  text:`<h3>Задача</h3><p>У Алисы есть кубит в неизвестном состоянии |ψ⟩ (направление стрелки — амплитуды, цвет — фаза). Измерить его и продиктовать нельзя: измерение разрушит состояние, а скопировать запрещает <b>теорема о запрете клонирования</b>.</p>
  <h3>Протокол</h3><p>1. Алиса и Боб заранее делят запутанную пару. 2. Алиса совместно измеряет свой кубит и свою половинку пары — получает два случайных бита. 3. Она отправляет биты Бобу обычной связью. 4. Боб по этим битам поворачивает свой кубит — и получает точную копию |ψ⟩.</p>
  <div class="key">Телепортируется состояние, а не вещество. Оригинал у Алисы уничтожается, поэтому клонирования нет. А без двух классических битов Боб видит только шум — значит, быстрее света ничего не передаётся.</div>
  <p>Рекорд — телепортация между Землёй и спутником «Мо-цзы» на 1400 км (2017).</p>`,
  quiz:[
    {q:'Почему телепортация не позволяет передавать информацию быстрее света?',a:['Запутанность слишком слабая','Бобу необходимы два классических бита, которые идут не быстрее света','Кубиты тяжёлые'],c:1,why:'До получения битов состояние Боба неотличимо от случайного.'},
    {q:'Что происходит с исходным кубитом Алисы?',a:['Остаётся копия','Его состояние разрушается измерением','Он летит к Бобу'],c:1,why:'Измерение Белла стирает |ψ⟩ у Алисы — иначе нарушался бы запрет клонирования.'}],
  init(S){S.d={step:0,bz:0,bx:0,fly:0,k:0}},
  on(id,S){
    const d=S.d;if(id!=='next'){this.init(S);return}
    if(d.step>=3)return;d.step++;
    if(d.step===1){d.bz=Math.random()<.5?1:0;d.bx=Math.random()<.5?1:0}
    if(d.step===2)d.fly=0;if(d.step===3)d.k=0;
  },
  draw(ctx,w,h,S){
    const d=S.d,th=S.p.th*RAD,ph=S.p.ph,R=Math.min(w*.07,h*.13),ax=w*.2,bx=w*.8;
    U.bg(ctx,S);U.stars(ctx,S,80);
    U.text(ctx,'АЛИСА',ax,h*.14,C.cy,14,'center',800);U.text(ctx,'БОБ',bx,h*.14,C.mg,14,'center',800);
    if(d.step===0)thread(ctx,ax+R,bx-R,h*.66,S.t,.8);
    bloch(ctx,ax,h*.32,R,th,ph,'кубит |ψ⟩',d.step?'dead':'state',S.t);
    bloch(ctx,ax,h*.66,R,0,0,'половинка пары',d.step?'dead':'ent',S.t);
    const wth=d.bx?Math.PI-th:th,wph=(ph+(d.bz?180:0))%360;
    if(d.step===3){d.k=Math.min(1,d.k+S.dt*.9);if(d.k>=1)S.win()}
    if(d.step===0)bloch(ctx,bx,h*.66,R,0,0,'половинка пары','ent',S.t);
    else if(d.step<3)bloch(ctx,bx,h*.66,R,wth,wph,'искажённая версия |ψ⟩','state',S.t);
    else bloch(ctx,bx,h*.66,R,U.lerp(wth,th,d.k),U.lerp(wph,ph,d.k),d.k>=1?'= |ψ⟩ ✔':'поворот…','state',S.t);
    const ly=h*.92;U.line(ctx,ax,ly,bx,ly,'#566',1.5,[6,6]);U.text(ctx,'обычный канал связи (не быстрее света)',w/2,ly-14,C.dim,12,'center');
    if(d.step>=1)U.text(ctx,`биты: ${d.bz}${d.bx}`,ax+R+16,h*.49,C.am,15,'left',800);
    if(d.step===2){d.fly=Math.min(1,d.fly+S.dt*.5);const x=U.lerp(ax,bx,d.fly);U.glow(ctx,x,ly,16,C.am,.9);U.text(ctx,`${d.bz}${d.bx}`,x,ly,'#05060f',12,'center',800)}
    S.hud(['<b>Шаг 0.</b> У Алисы неизвестный кубит |ψ⟩; с Бобом её связывает запутанная пара.',
      `<b>Шаг 1.</b> Алиса измерила оба своих кубита вместе. |ψ⟩ у неё разрушен, выпали биты <b>${d.bz}${d.bx}</b>. У Боба — искажённая версия.`,
      '<b>Шаг 2.</b> Биты летят к Бобу по обычному каналу. Без них его кубит бесполезен.',
      `<b>Шаг 3.</b> Боб применяет поправку ${d.bx?'X ':''}${d.bz?'Z ':''}${d.bx||d.bz?'':'«ничего не делать» '}— и получает исходное |ψ⟩.`][d.step]);
  }});

QL.add({id:'bb84',sec:SEC,icon:'🔐',title:'Квантовая криптография BB84',year:'Беннетт и Брассар, 1984',
  lead:'Ключ шифрования, который невозможно подслушать незаметно: любая попытка измерить фотон оставляет следы.',
  mission:'Включи шпионку Еву и набери 100 бит ключа: увидишь, как её выдают ошибки.',
  controls:[{id:'eve',type:'toggle',label:'🕵️ Ева подслушивает',value:false},{id:'sp',type:'range',label:'Фотонов в секунду',min:1,max:25,step:1,value:4},{id:'fr',type:'range',label:'Доля перехвата Евы f',min:.1,max:1,step:.1,value:1},{id:'noise',type:'range',label:'Шум канала, %',min:0,max:10,step:1,value:0}],
  text:`<h3>Протокол</h3><p>Алиса кодирует каждый бит поляризацией фотона, случайно выбирая один из двух базисов: прямой (+) или диагональный (×). Боб измеряет каждый фотон тоже в случайном базисе. Потом они открыто сравнивают базисы (не биты!) и оставляют только совпавшие — это и есть ключ.</p>
  <h3>Почему Ева обречена</h3><p>Ева не знает базис. Измеряя фотон наугад, она в половине случаев выбирает неверный, меняет его состояние и пересылает Бобу «испорченный» фотон. В результате примерно <b>25%</b> битов ключа у Алисы и Боба не совпадут.</p>
  <div class="key">Безопасность гарантируют законы физики, а не сложность вычислений: измерение возмущает состояние, а скопировать неизвестный кубит нельзя. Сравнив часть ключа и увидев ошибки, Алиса и Боб просто выбрасывают его.</div>`,
  quiz:[
    {q:'Какой уровень ошибок выдаёт Еву, перехватывающую все фотоны?',a:['Около 1%','Около 25%','Ровно 100%'],c:1,why:'Ева ошибается с базисом в 50% случаев, и половина таких фотонов даёт Бобу неверный бит.'},
    {q:'Почему Ева не может просто скопировать фотон?',a:['Фотоны слишком быстрые','Теорема о запрете клонирования','У неё нет лазера'],c:1,why:'Неизвестное квантовое состояние нельзя скопировать без искажения оригинала.'}],
  init(S){S.d={f:null,log:[],sift:0,err:0}},
  on(id,S){if(id!=='sp')this.init(S)},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,y=h*.24,ax=w*.1,bx=w*.9,rb=()=>Math.random()<.5?0:1;
    if(!d.f)d.f={u:0,bit:rb(),ba:rb(),bb:rb(),be:rb(),sb:0,sv:0,ev:false,it:Math.random()<p.fr};
    const f=d.f;if(f.u===0){f.sb=f.ba;f.sv=f.bit}
    f.u+=S.dt*p.sp;
    if(p.eve&&f.it&&!f.ev&&f.u>=.5){f.ev=true;const r=f.be===f.sb?f.sv:rb();f.sb=f.be;f.sv=r}
    U.bg(ctx,S);U.stars(ctx,S,60);
    const basis=b=>b?'×':'+';
    const node=(x,name,col,b)=>{U.glow(ctx,x,y,30,col,.5);ctx.fillStyle='#11153a';ctx.beginPath();ctx.arc(x,y,24,0,TAU);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();U.text(ctx,basis(b),x,y,'#fff',24,'center',700);U.text(ctx,name,x,y+40,col,13,'center',700)};
    U.line(ctx,ax,y,bx,y,'rgba(120,130,200,.25)',1,[3,6]);
    node(ax,'Алиса',C.cy,f.ba);node(bx,'Боб',C.mg,f.bb);if(p.eve)node(w/2,'Ева',C.rd,f.be);
    const px=U.lerp(ax+26,bx-26,Math.min(1,f.u)),ang=[0,90,45,135][f.sb*2+f.sv]*RAD;
    U.glow(ctx,px,y,16,C.am,.9);U.line(ctx,px-Math.cos(ang)*13,y+Math.sin(ang)*13,px+Math.cos(ang)*13,y-Math.sin(ang)*13,'#fff',3);
    if(f.u>=1){const res=(f.bb===f.sb?f.sv:rb())^(Math.random()<p.noise/100?1:0),keep=f.ba===f.bb,bad=keep&&res!==f.bit;if(keep){d.sift++;if(bad)d.err++}
      d.log.push([f.bit,f.ba,f.bb,res,keep,bad]);if(d.log.length>16)d.log.shift();d.f=null}
    const rows=['Бит Алисы','Базис Алисы','Базис Боба','Бит Боба','В ключ?'],ty=h*.5,rh=h*.085,cx0=w*.24,cw=(w*.72)/16;
    rows.forEach((r,i)=>U.text(ctx,r,w*.04,ty+i*rh,C.dim,12.5));
    d.log.forEach((e,c)=>{const x=cx0+c*cw+cw/2;
      if(e[4]){ctx.fillStyle=e[5]?'rgba(255,107,107,.2)':'rgba(109,255,176,.1)';ctx.fillRect(x-cw/2+1,ty-rh/2,cw-2,rh*5)}
      U.text(ctx,e[0],x,ty,C.cy,14,'center',700);U.text(ctx,basis(e[1]),x,ty+rh,C.tx,15,'center');U.text(ctx,basis(e[2]),x,ty+2*rh,C.tx,15,'center');
      U.text(ctx,e[3],x,ty+3*rh,e[5]?C.rd:C.mg,14,'center',700);U.text(ctx,e[4]?(e[5]?'✗':'✓'):'·',x,ty+4*rh,e[4]?(e[5]?C.rd:C.gr):C.dim,14,'center',700)});
    if(p.eve&&d.sift>=100)S.win();
    S.hud(`Ключ: <b>${d.sift}</b> бит · ошибок: <b>${U.pct(d.err,d.sift)}</b> ${d.sift>=30?(d.err/d.sift>.11?'— выше порога 11%: ключ отбрасывается':'— ниже порога 11%'):''} · теория QBER ≈ ${Math.round((p.eve?25*p.fr:0)+p.noise)}%`);
  }});

QL.add({id:'hom',sec:SEC,icon:'👯',title:'Эффект Хонга — У — Мандела',year:'Хонг, У, Мандел, 1987',
  lead:'Два неразличимых фотона, встретившись на полупрозрачном зеркале, всегда уходят вместе — в одну и ту же сторону.',
  mission:'Найди «провал»: поставь задержку 0 и пропусти 40 пар — совпадения детекторов исчезнут.',
  controls:[{id:'tau',type:'range',label:'Задержка второго фотона',min:-2,max:2,step:.1,value:1.5,fmt:v=>v.toFixed(1)},{id:'rate',type:'range',label:'Пар в секунду',min:1,max:12,step:1,value:4},{id:'sg',type:'range',label:'Время когерентности σ',min:.2,max:1.5,step:.1,value:.7,fmt:v=>v.toFixed(1)},{id:'pol',type:'range',label:'Угол между поляризациями α',min:0,max:90,step:5,value:0,fmt:v=>v+'°'}],
  text:`<h3>Опыт</h3><p>Два одинаковых фотона падают на светоделитель с разных сторон. Каждый может пройти или отразиться, так что исходов четыре. Детекторы C и D срабатывают одновременно («совпадение»), только когда фотоны разошлись по разным выходам.</p>
  <h3>Провал</h3><p>Варианты «оба прошли» и «оба отразились» ведут к одному и тому же результату, но с противоположными знаками амплитуд — и полностью гасят друг друга. Остаётся только «оба в C» или «оба в D». Совпадений — ноль.</p>
  <div class="key">Интерферируют не фотоны, а неразличимые <b>истории</b>. Стоит сделать фотоны различимыми — например, задержать один, — и интерференция пропадает: совпадения возвращаются к 50%.</div>
  <p>Ширина провала — фемтосекунды: это самый точный «секундомер» для света и основа оптических квантовых компьютеров.</p>`,
  quiz:[
    {q:'Что происходит при нулевой задержке?',a:['Фотоны всегда расходятся','Фотоны всегда выходят вместе, совпадений нет','Фотоны исчезают'],c:1,why:'Амплитуды «оба прошли» и «оба отразились» вычитаются до нуля.'},
    {q:'Почему задержка убирает эффект?',a:['Фотоны становятся различимыми по времени прихода','Светоделитель нагревается','Фотоны теряют энергию'],c:0,why:'Интерферируют только неразличимые альтернативы.'}],
  init(S){S.d={bins:{},pairs:[],acc:1,fc:0,fd:0}},
  on(id,S){if(id==='sg'||id==='pol')S.d.bins={}},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,dt=S.dt,cx=w/2,cy=h*.34,key=Math.round(p.tau*10);
    const I=[[w*.14,h*.08],[w*.14,h*.6]],O=[[w*.86,h*.08],[w*.86,h*.6]];
    d.acc+=dt*p.rate;if(d.acc>=1){d.acc=0;const co=Math.random()<.5*(1-Math.cos(p.pol*RAD)**2*Math.exp(-p.tau*p.tau/(p.sg*p.sg))),a=Math.random()<.5?0:1;d.pairs.push({u:0,co,o:[a,co?1-a:a],key,tau:p.tau})}
    d.fc=Math.max(0,d.fc-dt*3);d.fd=Math.max(0,d.fd-dt*3);
    U.bg(ctx,S,.5);
    for(const q of[...I,...O])U.line(ctx,q[0],q[1],cx,cy,'rgba(120,130,200,.22)',1);
    U.line(ctx,cx,cy-h*.12,cx,cy+h*.12,C.cy,3);U.text(ctx,'светоделитель',cx,cy+h*.12+14,C.dim,12,'center');
    [[O[0],'C',d.fc],[O[1],'D',d.fd]].forEach(([q,n,f])=>{U.glow(ctx,q[0]+14,q[1],24+30*f,f>.05?C.gr:C.vi,.4+.6*f);ctx.fillStyle='#11153a';ctx.beginPath();ctx.arc(q[0]+14,q[1],16,0,TAU);ctx.fill();ctx.strokeStyle=C.vi;ctx.stroke();U.text(ctx,n,q[0]+14,q[1],'#fff',13,'center',700)});
    d.pairs=d.pairs.filter(q=>{q.u+=dt*1.1;
      if(q.u>=2.3){const b=d.bins[q.key]=d.bins[q.key]||[0,0];b[1]++;if(q.co){b[0]++;d.fc=d.fd=1}else q.o[0]?d.fd=1:d.fc=1;return false}
      for(const i of[0,1]){const u=q.u-(i?q.tau*.09:0)-.1;if(u<0||u>2)continue;const A=u<1?I[i]:[cx,cy],B=u<1?[cx,cy]:O[q.o[i]],t=u<1?u:u-1;
        U.glow(ctx,U.lerp(A[0],B[0],t),U.lerp(A[1],B[1],t),13,i?C.mg:C.am,.9)}
      return true});
    const gx=w*.1,gw=w*.8,gy=h*.74,gh=h*.2,X=t=>gx+gw*(t+2)/4,Y=v=>gy+gh*(1-v*2);
    ctx.fillStyle=C.bg;ctx.fillRect(0,gy-14,w,h);U.line(ctx,gx,gy+gh,gx+gw,gy+gh,'#2c3266');
    ctx.beginPath();for(let i=0;i<=80;i++){const t=-2+i/20,y=Y(.5*(1-Math.cos(p.pol*RAD)**2*Math.exp(-t*t/(p.sg*p.sg))));i?ctx.lineTo(X(t),y):ctx.moveTo(X(t),y)}ctx.strokeStyle='rgba(255,255,255,.25)';ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    for(const k in d.bins){const b=d.bins[k];if(b[1]>=4)U.dot(ctx,X(k/10),Y(b[0]/b[1]),4,C.gr)}
    U.line(ctx,X(p.tau),gy,X(p.tau),gy+gh,C.am,1.5);U.text(ctx,'доля совпадений C и D',gx,gy-4,C.dim,12);U.text(ctx,'задержка →',gx+gw,gy+gh+12,C.dim,12,'right');
    const b=d.bins[key]||[0,0];if(key===0&&b[1]>=40)S.win();
    S.hud(`Задержка ${p.tau.toFixed(1)}: пар <b>${b[1]}</b>, совпадений <b>${U.pct(b[0],b[1])}</b>`);
  }});
})();
