'use strict';
(()=>{
const SEC='Чёрные дыры и Вселенная';

function trace(b){
  let x=-40,y=b,vx=1,vy=0,pa=Math.atan2(y,x),sw=0,cap=false;const pts=[x,y],h2=b*b,ds=.02;
  for(let i=0;i<40000;i++){
    const r2=x*x+y*y;if(r2<1){cap=true;break}if(r2>1700)break;
    const k=-1.5*h2/(r2*r2*Math.sqrt(r2))*ds;vx+=k*x;vy+=k*y;x+=vx*ds;y+=vy*ds;
    if(i%4===0)pts.push(x,y);
    const a=Math.atan2(y,x);let da=a-pa;if(da>Math.PI)da-=TAU;if(da<-Math.PI)da+=TAU;sw+=da;pa=a;
  }
  return{pts,cap,sw:Math.abs(sw)};
}

QL.add({id:'blackhole',sec:SEC,icon:'🕳',title:'Чёрная дыра',year:'Шварцшильд, 1916',
  lead:'Область, где пространство-время искривлено настолько, что даже свет не может выбраться наружу.',
  mission:'Подбери прицельный параметр так, чтобы фотон сделал полный оборот вокруг чёрной дыры (подсказка: около 2.6 rₛ).',
  controls:[{id:'b',type:'range',label:'Прицельный параметр фотона',min:0,max:8,step:.01,value:4,fmt:v=>v.toFixed(2)+' rₛ'},{id:'m',type:'range',label:'Масса чёрной дыры',min:10,max:40,step:1,value:20,fmt:v=>v+' M☉'},{id:'fan',type:'toggle',label:'Веер лучей',value:true}],
  text:`<h3>Лучи света</h3><p>Здесь честно посчитаны траектории фотонов в геометрии Шварцшильда. Далёкие лучи слегка отклоняются — это гравитационное линзирование. Близкие закручиваются и падают за горизонт.</p>
  <h3>Три границы</h3><p><b>Горизонт событий</b> (rₛ) — точка невозврата. <b>Фотонная сфера</b> (1.5 rₛ, пунктир) — здесь свет может кружить по орбите. <b>Критический прицельный параметр</b> ≈ 2.6 rₛ: всё, что целится ближе, будет поглощено. Поэтому на снимках Event Horizon Telescope «тень» дыры в 2.6 раза больше горизонта.</p>
  <div class="key">Внутри горизонта пространство и время меняются ролями: движение к центру становится таким же неизбежным, как движение в будущее. Сингулярность — не место, а момент времени.</div>
  <p>Для далёкого наблюдателя часы падающего зонда замедляются и замирают у горизонта, а его свет краснеет и гаснет. Сам зонд пересекает горизонт, ничего особенного не заметив.</p>`,
  quiz:[
    {q:'Что такое горизонт событий?',a:['Твёрдая поверхность чёрной дыры','Граница, из-за которой ничто, даже свет, не возвращается','Край аккреционного диска'],c:1,why:'Горизонт — не вещество, а граница в пространстве-времени, точка невозврата.'},
    {q:'Что происходит со светом на фотонной сфере (1.5 rₛ)?',a:['Он останавливается','Он может двигаться по круговой орбите','Он ускоряется'],c:1,why:'На 1.5 rₛ гравитация искривляет путь фотона ровно в окружность, но эта орбита неустойчива.'}],
  init(S){S.d={fan:[],cur:null,b:-1,i:0,hold:0};for(let b=.5;b<=8;b+=.5)S.d.fan.push(trace(b))},
  draw(ctx,w,h,S){
    const d=S.d,p=S.p,sc=Math.min(w/36,h/17)*p.m/20,cx=w*.52,cy=h*.5;
    if(d.b!==p.b){d.b=p.b;d.cur=trace(p.b);d.i=0;d.hold=0}
    U.bg(ctx,S);U.stars(ctx,S,150);
    const path=(pts,n,sy)=>{ctx.beginPath();for(let i=0;i<n;i+=2)i?ctx.lineTo(cx+pts[i]*sc,cy-sy*pts[i+1]*sc):ctx.moveTo(cx+pts[i]*sc,cy-sy*pts[i+1]*sc);ctx.stroke()};
    if(p.fan){ctx.lineWidth=1;
      d.fan.forEach((f,k)=>{for(const sy of[1,-1]){
        ctx.strokeStyle=f.cap?'rgba(255,107,107,.28)':'rgba(94,231,255,.25)';path(f.pts,f.pts.length,sy);
        const j=((S.t*90+k*37)|0)*2%f.pts.length&~1;U.dot(ctx,cx+f.pts[j]*sc,cy-sy*f.pts[j+1]*sc,1.6,f.cap?'#ffb0b0':'#c9f6ff');
      }});
    }
    U.glow(ctx,cx,cy,sc*4.2,'rgba(255,150,60,.55)',.8);
    ctx.strokeStyle='rgba(255,255,255,.45)';ctx.setLineDash([4,5]);ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,sc*1.5,0,TAU);ctx.stroke();ctx.setLineDash([1,5]);ctx.beginPath();ctx.arc(cx,cy,sc*3,0,TAU);ctx.stroke();ctx.setLineDash([]);
    U.text(ctx,'фотонная сфера 1.5 rₛ',cx+sc*1.1,cy-sc*1.35,C.dim,10);U.text(ctx,'ISCO 3 rₛ',cx+sc*2.2,cy-sc*2.3,C.dim,10);
    U.dot(ctx,cx,cy,sc,'#000');ctx.strokeStyle='rgba(255,200,130,.9)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,sc,0,TAU);ctx.stroke();
    const c=d.cur,n=c.pts.length;
    if(d.i<n)d.i=Math.min(n,d.i+14);else{d.hold+=S.dt;if(d.hold>1.6){d.i=0;d.hold=0}}
    ctx.strokeStyle=C.am;ctx.lineWidth=2.5;path(c.pts,d.i,1);
    const j=Math.max(0,(d.i&~1)-2);U.glow(ctx,cx+c.pts[j]*sc,cy-c.pts[j+1]*sc,14,C.am,1);
    if(c.sw>=TAU)S.win();
    const turns=(c.sw/TAU).toFixed(2);
    S.hud(`Фотон: <b>${c.cap?'захвачен горизонтом':'улетел'}</b> · обошёл вокруг дыры на ${turns} оборота · r<sub>s</sub> = 2GM/c² = <b>${(2.95*p.m).toFixed(0)} км</b> · b<sub>c</sub> ≈ 2.60 rₛ`);
  }});

QL.add({id:'hawking',sec:SEC,icon:'♨️',title:'Излучение Хокинга',year:'Хокинг, 1974',
  lead:'Чёрные дыры не совсем чёрные: квантовые эффекты у горизонта заставляют их медленно испаряться.',
  mission:'Дождись полного испарения чёрной дыры (маленькая испаряется быстрее).',
  controls:[{id:'m',type:'range',label:'Начальная масса',min:.4,max:1,step:.05,value:.6},{id:'k',type:'range',label:'Темп испарения',min:.2,max:4,step:.2,value:1},{id:'reset',type:'button',label:'Создать заново'}],
  text:`<h3>Картинка с парами</h3><p>Вакуум кипит: в нём постоянно рождаются и исчезают пары виртуальных частиц. У горизонта пара может разорваться — одна частица падает внутрь с отрицательной энергией, другая улетает. Дыра теряет массу. Это наглядная метафора; строгий расчёт Хокинга говорит о том, как горизонт искажает квантовые поля.</p>
  <h3>Чем меньше, тем горячее</h3><p>Температура дыры обратно пропорциональна массе. Дыра массой с Солнце холоднее реликтового излучения и пока только растёт. Но крошечная дыра раскаляется, испаряется всё быстрее и заканчивает вспышкой.</p>
  <div class="key">Информационный парадокс: излучение Хокинга выглядит чисто тепловым. Если дыра испарится без остатка, куда денется информация обо всём, что в неё упало? Квантовая механика запрещает её уничтожение — это одна из главных нерешённых загадок физики.</div>`,
  quiz:[
    {q:'Какая чёрная дыра горячее?',a:['Самая массивная','Самая маленькая','Температура у всех одинакова'],c:1,why:'T ∝ 1/M: чем меньше масса, тем выше температура и быстрее испарение.'},
    {q:'В чём суть информационного парадокса?',a:['Дыры слишком тяжёлые','Тепловое излучение, казалось бы, стирает информацию, а квантовая механика это запрещает','Свет не может выйти'],c:1,why:'Унитарность квантовой механики требует сохранения информации — а испарение будто бы её уничтожает.'}],
  init(S){S.d={M:S.p.m,ps:[],vac:[],acc:0,va:0,boom:0}},
  on(id,S){if(id!=='k')this.init(S)},
  draw(ctx,w,h,S){
    const d=S.d,s=h/420,cx=w/2,cy=h/2,dt=S.dt;
    U.bg(ctx,S,.32);U.stars(ctx,S,90);
    if(d.boom>0){d.boom-=dt;U.glow(ctx,cx,cy,(2.6-d.boom)*220*s,'#fff',d.boom/2.5);if(d.boom<=0)d.M=S.p.m}
    const R=(26+95*d.M)*s;
    if(d.boom<=0){
      d.acc+=dt*5*S.p.k/d.M;
      while(d.acc>1){d.acc--;const a=U.rnd(TAU),c=Math.cos(a),sn=Math.sin(a),sp=(55+40/d.M)*s;
        d.ps.push({x:c*R*1.08,y:sn*R*1.08,vx:c*sp+U.gauss()*8,vy:sn*sp+U.gauss()*8,l:1,out:1});
        d.ps.push({x:c*R*1.08,y:sn*R*1.08,vx:-c*22*s,vy:-sn*22*s,l:.45,out:0});d.M-=.0012/d.M}
      if(d.M<.13){d.boom=2.5;S.win();for(let i=0;i<220;i++){const a=U.rnd(TAU),sp=U.rnd(80,420)*s;d.ps.push({x:0,y:0,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:1.4,out:1})}}
      d.va+=dt*14;while(d.va>1){d.va--;d.vac.push({x:U.rnd(-w/2,w/2),y:U.rnd(-h/2,h/2),a:U.rnd(TAU),l:0})}
      U.glow(ctx,cx,cy,R*2,'rgba(255,160,70,.5)',.9);U.dot(ctx,cx,cy,R,'#000');
      ctx.strokeStyle='rgba(255,205,130,.85)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();
    }
    d.vac=d.vac.filter(v=>{v.l+=dt*1.5;if(v.l>=1)return false;if(Math.hypot(v.x,v.y)<R*1.1)return true;
      const sp=Math.sin(Math.PI*v.l)*8,c=Math.cos(v.a)*sp,sn=Math.sin(v.a)*sp;ctx.globalAlpha=.7*Math.sin(Math.PI*v.l);
      U.dot(ctx,cx+v.x+c,cy+v.y+sn,1.5,C.cy);U.dot(ctx,cx+v.x-c,cy+v.y-sn,1.5,C.mg);ctx.globalAlpha=1;return true});
    d.ps=d.ps.filter(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt*(q.out?.4:1.4);if(q.l<=0)return false;
      U.glow(ctx,cx+q.x,cy+q.y,q.out?7:5,q.out?C.am:C.cy,Math.min(1,q.l));return true});
    S.hud(d.boom>0?'<b>Финальная вспышка:</b> дыра испарилась':`Масса: <b>${d.M.toFixed(2)}</b> · температура ∝ 1/M: <b>${(1/d.M).toFixed(2)}</b> · радиус горизонта ∝ M`);
  }});

QL.add({id:'whitehole',sec:SEC,icon:'⚪',title:'Белая дыра',year:'Новиков, 1964',
  lead:'Чёрная дыра, прокрученная назад во времени: из неё всё вылетает, но попасть внутрь нельзя.',
  mission:'Переключись на белую дыру и запусти в неё зонд.',
  controls:[{id:'mode',type:'select',label:'Объект',options:['Чёрная дыра','Белая дыра'],value:0},{id:'probe',type:'button',label:'🚀 Запустить зонд'}],
  text:`<h3>Зеркало во времени</h3><p>Уравнения Эйнштейна симметричны по времени. Если существует решение «всё падает внутрь и не возвращается», то существует и обратное: «всё вылетает наружу, и ничто не может войти». Это и есть белая дыра.</p>
  <h3>Почему зонд не входит</h3><p>Горизонт чёрной дыры лежит в будущем падающего тела. Горизонт белой — в прошлом: пересечь его снаружи так же невозможно, как вернуться во вчера.</p>
  <div class="key">Белые дыры — решение уравнений, но не наблюдаемый объект. Чтобы она возникла, нужны особые начальные условия с крайне низкой энтропией; обычный коллапс звезды её не создаёт.</div>
  <p>Гипотезы всё же есть: в петлевой квантовой гравитации чёрная дыра в конце жизни может «отскочить» и превратиться в белую, а Большой взрыв иногда сравнивают с белой дырой — всё вышло из него, и вернуться туда нельзя.</p>`,
  quiz:[
    {q:'Чем белая дыра отличается от чёрной?',a:['Она просто ярче','Это обращённое во времени решение: из неё только вылетают','У неё нет массы'],c:1,why:'Белая дыра — time-reverse чёрной: горизонт можно пересечь только изнутри наружу.'},
    {q:'Наблюдали ли белые дыры?',a:['Да, в центре каждой галактики','Нет, это пока только математическое решение и гипотезы','Да, это квазары'],c:1,why:'Достоверных наблюдений нет. Квазары — это аккрецирующие чёрные дыры.'}],
  init(S){S.d={ps:[],probe:null,acc:0,msg:''}},
  on(id,S){const d=S.d;if(id==='mode'){d.ps=[];d.probe=null;d.msg=''}if(id==='probe'){d.probe={x:-.46,t:0,st:0};d.msg=''}},
  draw(ctx,w,h,S){
    const d=S.d,wh=S.p.mode===1,s=h/420,R=46*s,cx=w/2,cy=h/2,dt=S.dt,K=9000*s*s;
    U.bg(ctx,S,.3);U.stars(ctx,S,110);
    d.acc+=dt*70;while(d.acc>1){d.acc--;if(d.ps.length<520)d.ps.push(wh?{r:R*1.03,a:U.rnd(TAU)}:{r:R*U.rnd(3.5,5.2),a:U.rnd(TAU)})}
    d.ps=d.ps.filter(q=>{q.r+=(wh?1:-1)*dt*K/q.r;q.a+=dt*(wh?-1:1)*38*s/q.r;if(q.r<R||q.r>R*5.4)return false;
      const f=(q.r-R)/(R*4.4);ctx.globalAlpha=wh?1-f:.25+.75*(1-f);
      U.dot(ctx,cx+Math.cos(q.a)*q.r,cy+Math.sin(q.a)*q.r*.9,1.7,wh?`hsl(${200+f*40},100%,${92-f*25}%)`:`hsl(${25-f*20},100%,${72-f*25}%)`);ctx.globalAlpha=1;return true});
    if(wh){U.glow(ctx,cx,cy,R*2.6,'rgba(190,225,255,.9)',.9);U.glow(ctx,cx,cy,R*1.25,'#fff',1);U.dot(ctx,cx,cy,R*.92,'#fff')}
    else{U.glow(ctx,cx,cy,R*2.1,'rgba(255,150,60,.5)',.9);U.dot(ctx,cx,cy,R,'#000');ctx.strokeStyle='rgba(255,200,130,.9)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke()}
    const pr=d.probe;
    if(pr){pr.t+=dt;const X=pr.x*w,lim=-R*1.35;
      if(!wh){pr.x+=dt*(60+K/Math.max(R,-X)*.9)/w;if(X>-R){d.probe=null;d.msg='Зонд пересёк горизонт чёрной дыры — обратной дороги нет.'}}
      else if(pr.st===0){pr.x+=dt*110*(1-lim/X)/w;if(pr.t>4.5){pr.st=1;d.msg='Зонд не может войти: горизонт белой дыры лежит в его прошлом. Поток уносит его прочь.';S.win()}}
      else{pr.x-=dt*150/w;if(pr.x<-.5)d.probe=null}
      if(d.probe){const px=cx+pr.x*w;U.glow(ctx,px,cy,14,C.gr,.9);ctx.fillStyle='#eafff3';ctx.beginPath();ctx.moveTo(px+9,cy);ctx.lineTo(px-6,cy-5);ctx.lineTo(px-6,cy+5);ctx.fill()}
    }
    S.hud(d.msg||(wh?'Белая дыра: вещество и свет только <b>вылетают</b>':'Чёрная дыра: вещество и свет только <b>падают внутрь</b>'));
  }});

QL.add({id:'quasar',sec:SEC,icon:'✴️',title:'Квазар',year:'Шмидт, 1963',
  lead:'Самые яркие объекты во Вселенной: сверхмассивная чёрная дыра, пожирающая вещество, светит ярче целой галактики.',
  mission:'Зажги квазар на полную: доведи темп аккреции до максимума.',
  controls:[{id:'rate',type:'range',label:'Темп аккреции',min:.05,max:1,step:.05,value:.4},{id:'inc',type:'range',label:'Наклон диска i',min:50,max:86,step:2,value:74,fmt:v=>v+'°'},{id:'eta',type:'range',label:'Эффективность η (спин дыры)',min:.06,max:.42,step:.01,value:.1,fmt:v=>v.toFixed(2)},{id:'jet',type:'range',label:'Мощность джета',min:0,max:1,step:.05,value:.6}],
  text:`<h3>Как работает квазар</h3><p>В центре — чёрная дыра массой в миллионы или миллиарды Солнц. Газ не падает в неё прямо: он закручивается в <b>аккреционный диск</b>. Внутренние слои вращаются быстрее внешних, трение разогревает газ до миллионов градусов, и он сияет — от радио до рентгена.</p>
  <h3>Эффективность</h3><p>Диск превращает в излучение до 10–40% массы падающего вещества. Термоядерный синтез в звёздах — всего 0.7%. Поэтому квазар размером с Солнечную систему затмевает сотни миллиардов звёзд.</p>
  <h3>Джеты</h3><p>Магнитные поля, закрученные диском, выбрасывают часть плазмы вдоль оси вращения узкими струями почти со скоростью света — на миллионы световых лет.</p>
  <div class="key">Сама чёрная дыра не светит. Светит вещество, которое в неё падает. Одна сторона диска ярче: газ там летит к нам, и свет усиливается эффектом Доплера.</div>
  <p>Квазары — маяки ранней Вселенной: их свет шёл к нам миллиарды лет. В центре Млечного Пути тоже есть такая дыра, но сейчас она «голодает».</p>`,
  quiz:[
    {q:'Что именно светится в квазаре?',a:['Сама чёрная дыра','Раскалённый аккреционный диск вокруг неё','Взрывающиеся звёзды'],c:1,why:'Излучает газ диска, разогретый трением при падении в гравитационную яму.'},
    {q:'Почему аккреция эффективнее термоядерного синтеза?',a:['В энергию переходит до 10–40% массы против 0.7%','Газ в диске радиоактивен','Потому что там темнее'],c:0,why:'Падение в глубокую гравитационную яму высвобождает огромную долю энергии покоя.'}],
  init(S){S.d={disk:Array.from({length:1800},()=>({r:U.rnd(1.6,7),a:U.rnd(TAU)})),jet:[]}},
  draw(ctx,w,h,S){
    const d=S.d,rate=S.p.rate,inc=S.p.inc*RAD,ys=Math.cos(inc),js=Math.max(.55,Math.sin(inc)),sc=Math.min(w/17,h/9.5),cx=w/2,cy=h/2,dt=S.dt;
    if(rate>=.95)S.win();
    U.bg(ctx,S,.4);U.stars(ctx,S,120);
    const n=1800*rate|0;
    const part=front=>{for(let i=0;i<n;i++){const q=d.disk[i];if((Math.sin(q.a)>0)!==front)continue;
      const f=(q.r-1.5)/5.5;ctx.globalAlpha=(.35+.65*rate)*(1-.5*Math.cos(q.a))*(1-.4*f);
      U.dot(ctx,cx+q.r*Math.cos(q.a)*sc,cy+q.r*Math.sin(q.a)*sc*ys,1.3+1.5*(1-f),`hsl(${U.lerp(215,12,f)},100%,${U.lerp(88,58,f)}%)`)}ctx.globalAlpha=1};
    for(let i=0;i<n;i++){const q=d.disk[i];q.a-=dt*2.6/Math.pow(q.r,1.5);q.r-=dt*(.05+.3*rate)/q.r;if(q.r<1.5){q.r=7;q.a=U.rnd(TAU)}}
    part(false);
    for(let i=0;i<rate*5;i++)if(Math.random()<rate*S.p.jet*1.6)d.jet.push({z:.3,x:U.gauss()*.14,v:U.rnd(5,9),s:Math.random()<.5?1:-1});
    d.jet=d.jet.filter(j=>{j.z+=j.v*dt;if(j.z>8.5)return false;ctx.globalAlpha=(1-j.z/8.5)*.9;
      U.dot(ctx,cx+j.x*(1+j.z*.22)*sc,cy-j.s*j.z*sc*js*.55,1.8,`hsl(${200+j.z*9},100%,80%)`);ctx.globalAlpha=1;return true});
    U.glow(ctx,cx,cy,sc*(1.5+3*rate),'rgba(210,230,255,.9)',.35+.6*rate);
    U.dot(ctx,cx,cy,sc*.9,'#000');
    part(true);
    const Ls=S.p.eta*rate*10*1.5e13;
    S.hud(`ṁ = <b>${(rate*10).toFixed(1)}</b> M☉/год · η = ${S.p.eta.toFixed(2)} · L = ηṁc² ≈ <b>${(Ls/1e12).toFixed(1)}·10¹² L☉</b> ≈ ${Math.round(Ls/2e10)} галактик типа Млечного Пути`);
  }});

QL.add({id:'expansion',sec:SEC,icon:'🌌',title:'Расширение Вселенной',year:'Хаббл, 1929',
  lead:'Галактики не разлетаются сквозь пространство — растягивается само пространство между ними, и свет краснеет в пути.',
  mission:'Дважды смени галактику-дом и дождись сегодняшнего дня (масштаб > 0.9): убедись, что центра у расширения нет.',
  controls:[{id:'auto',type:'toggle',label:'▶ Время идёт',value:true},{id:'a',type:'range',label:'Масштаб Вселенной',min:.05,max:1,step:.01,value:.05,fmt:v=>v.toFixed(2)},{id:'ol',type:'range',label:'Тёмная энергия Ω_Λ',min:0,max:.95,step:.05,value:.7,fmt:v=>v.toFixed(2)},{id:'home',type:'button',label:'Сменить галактику-дом'}],
  text:`<h3>Закон Хаббла</h3><p>Стрелки показывают скорость удаления галактик от «дома». Чем дальше галактика, тем быстрее она убегает: v = H·d. Смени дом — картина останется той же. У расширения нет центра: каждая галактика видит, как все остальные удаляются от неё.</p>
  <h3>Красное смещение</h3><p>Волна внизу — фотон, летящий сквозь расширяющееся пространство. Его длина волны растягивается вместе с пространством: синий свет становится красным, затем инфракрасным. Так мы и измеряем расстояния до далёких галактик и квазаров.</p>
  <div class="key">Большой взрыв — не взрыв в какой-то точке пространства. Это состояние, когда всё пространство было горячим и плотным. Остывший свет той эпохи — реликтовое излучение с температурой 2.7 К — мы видим до сих пор со всех сторон.</div>
  <p>Возраст Вселенной — 13.8 миллиарда лет. Расширение сейчас ускоряется: его разгоняет тёмная энергия, природа которой неизвестна.</p>`,
  quiz:[
    {q:'Где находится центр расширения Вселенной?',a:['В нашей галактике','Его нет: расширяется всё пространство','В точке Большого взрыва'],c:1,why:'Из любой галактики картина одинакова: все остальные удаляются.'},
    {q:'Почему свет далёких галактик краснеет?',a:['Его длина волны растягивается вместе с пространством','Галактики остывают','Свет теряет скорость'],c:0,why:'Космологическое красное смещение: z = 1/a − 1.'}],
  init(S){S.d={g:Array.from({length:110},()=>[U.rnd(-1.6,1.6),U.rnd(-1.2,1.2),U.rnd(.6,1.6)]),home:0,chg:0,a:.05,hold:0}},
  on(id,S){const d=S.d;if(id==='home'){d.home=1+(Math.random()*109|0);d.chg++}if(id==='a')d.a=S.p.a},
  draw(ctx,w,h,S){
    const d=S.d,cx=w/2,cy=h*.44,sc=h*.95;
    if(S.p.auto){if(d.a<1){d.a=Math.min(1,d.a+S.dt*.1*Math.sqrt((1-S.p.ol)/d.a+S.p.ol*d.a*d.a))}else{d.hold+=S.dt;if(d.hold>3){d.hold=0;d.a=.05}}S.set('a',d.a)}else d.a=S.p.a;
    const a=d.a,hm=d.g[d.home];
    if(d.chg>=2&&a>.9)S.win();
    U.bg(ctx,S);
    U.glow(ctx,cx,cy,Math.max(w,h),'rgba(255,150,70,1)',U.clamp(.85-a*1.5,0,.85));
    for(let i=0;i<d.g.length;i++){
      const g=d.g[i],dx=((g[0]-hm[0]+4.8)%3.2)-1.6,dy=((g[1]-hm[1]+3.6)%2.4)-1.2,dist=Math.hypot(dx,dy)*a;
      const x=cx+dx*a*sc,y=cy+dy*a*sc;if(x<-20||x>w+20||y<-20||y>h*.82)continue;
      const hue=205-Math.min(1,dist/1.1)*205;
      if(i!==d.home&&dist>.02){const k=dist*30/Math.hypot(dx,dy);ctx.globalAlpha=.45;U.arrow(ctx,x,y,x+dx*k,y+dy*k,`hsl(${hue},100%,70%)`,1);ctx.globalAlpha=1}
      U.glow(ctx,x,y,5*g[2]+2,`hsl(${hue},100%,75%)`,.9);U.dot(ctx,x,y,1.4*g[2],'#fff');
    }
    ctx.strokeStyle=C.gr;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,13,0,TAU);ctx.stroke();U.text(ctx,'дом',cx,cy+25,C.gr,12,'center');
    const wy=h*.91,lam=12+78*a;ctx.beginPath();
    for(let x=w*.06;x<=w*.94;x+=2){const y=wy+Math.sin((x-S.t*60)/lam*TAU)*h*.035;x>w*.06?ctx.lineTo(x,y):ctx.moveTo(x,y)}
    ctx.strokeStyle=`hsl(${U.lerp(235,0,a)},100%,68%)`;ctx.lineWidth=2.5;ctx.stroke();
    const om=1-S.p.ol,E2=om/(a*a*a)+S.p.ol,qd=(om/(2*a*a*a)-S.p.ol)/E2;
    S.hud(`a = <b>${a.toFixed(2)}</b> · z = ${(1/a-1).toFixed(2)} · H/H₀ = <b>${Math.sqrt(E2).toFixed(2)}</b> · Ω<sub>m</sub> = ${om.toFixed(2)} · q = ${qd.toFixed(2)}: расширение <b>${qd<0?'ускоряется':'замедляется'}</b>`);
  }});
})();
