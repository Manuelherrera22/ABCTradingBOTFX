// ===== ABC DEL TRADING — Deep Learning Engine =====
const ST={xp:0,streak:0,done:[],modIdx:0,step:0,lxp:0,combo:0};
const RANKS=['Novato','Aprendiz','Trader Jr.','Trader','Pro Trader','Élite'];

const MODS=[
  {id:'m1',title:'¿Qué es Trading?',icon:'fi-sr-chart-mixed-up-circle-dollar',xp:50,steps:[
    {type:'act',icon:'fi-sr-arrow-trend-up',ic:'orange',title:'Haz tu primera operación',
     desc:'Comprar barato, vender caro. Eso es trading. ¿El precio va a subir o bajar?',
     ch:[{t:'Comprar — Gano si sube',k:'A',ok:true},{t:'Vender — Gano si baja',k:'B',ok:false}],
     exp:{t:'Así de simple',p:'Trading = comprar esperando que suba, o vender esperando que baje. BOTFX te dice cuándo.'}},
    {type:'tf',icon:'fi-sr-interrogation',ic:'orange',title:'¿Verdadero o Falso?',
     desc:'Para hacer trading necesitas un título universitario en finanzas.',answer:false,
     exp:{t:'Falso',p:'No necesitas ningún título. Con BOTFX, la inteligencia artificial hace el análisis por ti. Solo necesitas seguir las señales.'}},
    {type:'act',icon:'fi-sr-calculator-money',ic:'orange',title:'¿Cuánto ganaste?',
     desc:'Compraste a $100. Subió a $110. ¿Tu ganancia?',
     ch:[{t:'$5',k:'A',ok:false},{t:'$10',k:'B',ok:true},{t:'$110',k:'C',ok:false}],
     exp:{t:'Venta − Compra = Ganancia',p:'$110 − $100 = $10. BOTFX encuentra cientos de oportunidades como esta cada día.'}},
    {type:'fill',icon:'fi-sr-pencil',ic:'orange',title:'Completa la frase',
     sentence:'En trading, ganas dinero cuando compras a un precio ___ y vendes a un precio ___.',
     blanks:['bajo','alto'],opts:['bajo','alto','igual','cero'],
     exp:{t:'Comprar bajo, vender alto',p:'La base del trading es simple: comprar barato y vender caro. BOTFX te dice cuándo el precio está bajo.'}},
    {type:'info',icon:'fi-sr-bulb',ic:'orange',title:'Lo que aprendiste',
     desc:'Trading es comprar y vender para obtener ganancias. No necesitas ser experto — BOTFX te da la dirección con inteligencia artificial.'}
  ]},
  {id:'m2',title:'Los mercados',icon:'fi-sr-earth-americas',xp:60,steps:[
    {type:'act',icon:'fi-sr-bank',ic:'blue',title:'¿Dónde opera BOTFX?',
     desc:'¿En cuál mercado opera BOTFX?',
     ch:[{t:'Forex (Divisas)',k:'A',ok:true},{t:'Criptomonedas',k:'B',ok:true},{t:'Acciones e Índices',k:'C',ok:true}],allOk:true,
     exp:{t:'En TODOS',p:'BOTFX cubre Forex, Crypto, Acciones e Índices. Una suscripción = cobertura total.'}},
    {type:'tf',icon:'fi-sr-interrogation',ic:'blue',title:'¿Verdadero o Falso?',
     desc:'El mercado de criptomonedas solo funciona de lunes a viernes.',answer:false,
     exp:{t:'Falso',p:'Crypto opera 24/7, incluyendo fines de semana y feriados. BOTFX lo monitorea sin parar.'}},
    {type:'act',icon:'fi-sr-clock-three',ic:'blue',title:'¿Cuántas horas al día?',
     desc:'Forex opera de lunes a viernes. ¿Cuántas horas por día?',
     ch:[{t:'8 horas',k:'A',ok:false},{t:'12 horas',k:'B',ok:false},{t:'24 horas',k:'C',ok:true}],
     exp:{t:'24 horas sin parar',p:'Forex nunca cierra durante la semana. BOTFX escanea oportunidades mientras tú duermes.'}},
    {type:'fill',icon:'fi-sr-pencil',ic:'blue',title:'Completa la frase',
     sentence:'El mercado más grande del mundo es ___ y mueve más de ___ billones de dólares al día.',
     blanks:['Forex','6'],opts:['Forex','Crypto','6','100'],
     exp:{t:'Forex = $6+ billones/día',p:'El mercado Forex es 25x más grande que todas las bolsas de valores combinadas. Es donde opera el dinero institucional.'}},
    {type:'info',icon:'fi-sr-rocket-lunch',ic:'blue',title:'Tu ventaja',
     desc:'Hay mercados que nunca cierran y BOTFX los vigila 24/7 por ti. Eso te da una ventaja real.'}
  ]},
  {id:'m3',title:'Comprar y Vender',icon:'fi-sr-exchange-alt',xp:70,steps:[
    {type:'act',icon:'fi-sr-arrow-up-right',ic:'green',title:'Operación de COMPRA',
     desc:'EUR/USD está en 1.0800 y los datos dicen que subirá. ¿Qué haces?',
     ch:[{t:'COMPRAR (BUY) — Gano si sube',k:'A',ok:true},{t:'VENDER (SELL) — Gano si baja',k:'B',ok:false}],
     exp:{t:'BUY = Apuestas a que sube',p:'Cuando BOTFX indica sesgo alcista, abres compra. Si sube, ganas la diferencia.'}},
    {type:'act',icon:'fi-sr-arrow-down-right',ic:'orange',title:'Operación de VENTA',
     desc:'BOTFX indica sesgo bajista en Bitcoin (82% probabilidad). ¿Qué haces?',
     ch:[{t:'COMPRAR (BUY)',k:'A',ok:false},{t:'VENDER (SELL) — Gano si baja',k:'B',ok:true}],
     exp:{t:'SELL = Ganas cuando baja',p:'En trading puedes ganar cuando el precio baja. BOTFX detecta oportunidades en ambas direcciones.'}},
    {type:'tf',icon:'fi-sr-interrogation',ic:'purple',title:'¿Verdadero o Falso?',
     desc:'Solo puedes ganar dinero cuando el precio de un activo sube.',answer:false,
     exp:{t:'Falso',p:'Puedes ganar cuando sube (BUY) Y cuando baja (SELL). BOTFX te señala ambas oportunidades.'}},
    {type:'fill',icon:'fi-sr-pencil',ic:'purple',title:'Completa la frase',
     sentence:'Si creo que el precio va a subir, abro una operación de ___. Si creo que va a bajar, abro una de ___.',
     blanks:['COMPRA','VENTA'],opts:['COMPRA','VENTA','ESPERA','CIERRE'],
     exp:{t:'BUY si sube, SELL si baja',p:'Dos direcciones = el doble de oportunidades. BOTFX analiza ambas constantemente.'}},
    {type:'info',icon:'fi-sr-lightbulb-on',ic:'purple',title:'Resumen clave',
     desc:'BUY = ganas si sube. SELL = ganas si baja. Con BOTFX puedes capitalizar movimientos en ambas direcciones.'}
  ]},
  {id:'m4',title:'Protege tu capital',icon:'fi-sr-shield-check',xp:80,steps:[
    {type:'act',icon:'fi-sr-bell-ring',ic:'orange',title:'¿Qué es un Stop Loss?',
     desc:'Compraste a $100 pero cae. ¿Cómo proteges tu dinero?',
     ch:[{t:'Esperar a que se recupere',k:'A',ok:false},{t:'Stop Loss en $95 — cierra automáticamente',k:'B',ok:true},{t:'Comprar más para promediar',k:'C',ok:false}],
     exp:{t:'Stop Loss = Tu protección',p:'Cierra tu operación automáticamente si el precio va en tu contra. BOTFX los configura por ti con IA.'}},
    {type:'tf',icon:'fi-sr-interrogation',ic:'green',title:'¿Verdadero o Falso?',
     desc:'Los traders profesionales arriesgan el 50% de su cuenta en una sola operación.',answer:false,
     exp:{t:'Falso — Máximo 2%',p:'Los profesionales arriesgan 1-2% por operación. Así, incluso con 10 pérdidas seguidas, tu cuenta sobrevive.'}},
    {type:'act',icon:'fi-sr-chart-pie-alt',ic:'green',title:'La regla de oro',
     desc:'Tienes $1,000. ¿Cuánto máximo arriesgas en UNA operación?',
     ch:[{t:'$500 (50%)',k:'A',ok:false},{t:'$20 (2%)',k:'B',ok:true},{t:'$200 (20%)',k:'C',ok:false}],
     exp:{t:'Máximo 2% por operación',p:'$1,000 × 2% = $20 de riesgo máximo. BOTFX calcula esto automáticamente.'}},
    {type:'fill',icon:'fi-sr-pencil',ic:'green',title:'Completa la frase',
     sentence:'Un ___ cierra mi operación automáticamente para limitar mis ___.',
     blanks:['Stop Loss','pérdidas'],opts:['Stop Loss','Take Profit','pérdidas','ganancias'],
     exp:{t:'Stop Loss limita pérdidas',p:'Es la herramienta más importante del trader profesional. BOTFX lo configura en cada señal.'}},
    {type:'info',icon:'fi-sr-trophy',ic:'green',title:'Piensas como un PRO',
     desc:'Los amateurs buscan ganancias. Los profesionales controlan pérdidas. Con Stop Loss + Regla del 2%, operas con disciplina institucional.'}
  ]},
  {id:'m5',title:'Tu primera señal',icon:'fi-sr-robot',xp:100,steps:[
    {type:'act',icon:'fi-sr-signal-alt-2',ic:'orange',title:'Lee esta señal de BOTFX',
     desc:'"EUR/USD — Sesgo: COMPRAS 78% — Entrada: 1.0780". ¿Qué haces?',
     ch:[{t:'Buscar compras cerca de 1.0780',k:'A',ok:true},{t:'Vender inmediatamente',k:'B',ok:false},{t:'Ignorar',k:'C',ok:false}],
     exp:{t:'Así se lee una señal',p:'Sesgo 78% COMPRAS = alta probabilidad alcista. Zona 1.0780 = mejor precio para entrar.'}},
    {type:'tf',icon:'fi-sr-interrogation',ic:'orange',title:'¿Verdadero o Falso?',
     desc:'Una señal con 78% de probabilidad garantiza que siempre ganarás.',answer:false,
     exp:{t:'Falso — Es probabilidad, no certeza',p:'78% significa que de cada 100 operaciones, ~78 serán ganadoras. Por eso usamos Stop Loss: para protegernos en el otro 22%.'}},
    {type:'act',icon:'fi-sr-chart-histogram',ic:'orange',title:'¿Qué es GEX Bubbles?',
     desc:'GEX detecta un muro de liquidez institucional en 1.0820. ¿Qué significa?',
     ch:[{t:'El precio reaccionará en esa zona',k:'A',ok:true},{t:'No tiene relevancia',k:'B',ok:false}],
     exp:{t:'GEX = GPS del dinero institucional',p:'Los muros de liquidez muestran dónde están las instituciones. BOTFX + GEX = la combinación definitiva.'}},
    {type:'fill',icon:'fi-sr-pencil',ic:'orange',title:'Completa la frase',
     sentence:'BOTFX me da la ___ de entrada y el ___ de probabilidad para cada operación.',
     blanks:['zona','porcentaje'],opts:['zona','porcentaje','nombre','color'],
     exp:{t:'Zona + Porcentaje = Tu ventaja',p:'Saber DÓNDE entrar y CUÁNTA probabilidad tienes es todo lo que necesitas. BOTFX te lo da en tiempo real.'}},
    {type:'info',icon:'fi-sr-diploma',ic:'orange',title:'Estás listo para BOTFX',
     desc:'Completaste los fundamentos. Sabes qué es trading, cómo operar, cómo proteger tu capital y cómo leer señales. El siguiente paso es real.'}
  ]}
];

// ── Init ──
document.addEventListener('DOMContentLoaded',()=>{
  load();
  if(ST.done.length>=MODS.length){showView('viewFinal');updateFinal()}
  else if(ST.done.length>0)updateHeroBtn();
});

function load(){const d=localStorage.getItem('abc5');if(d)Object.assign(ST,JSON.parse(d))}
function save(){localStorage.setItem('abc5',JSON.stringify(ST))}

function updateHeroBtn(){
  const btn=document.querySelector('.hero-actions .btn-p');
  if(btn&&ST.done.length>0&&ST.done.length<MODS.length)
    btn.innerHTML='<i class="fi fi-sr-play"></i> Continuar módulo '+(ST.done.length+1);
}

function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('topbar').style.display=(id==='viewLesson')?'flex':'none';
}

// ── START ──
function startJourney(){
  ST.modIdx=ST.done.length;
  if(ST.modIdx>=MODS.length){showView('viewFinal');updateFinal();return}
  openModule(ST.modIdx);
}

function openModule(idx){
  ST.modIdx=idx;ST.step=0;ST.lxp=0;ST.combo=0;
  const m=MODS[idx];
  document.getElementById('tModule').textContent='Módulo '+(idx+1)+' / '+MODS.length;
  document.getElementById('tFill').style.width=Math.round((idx/MODS.length)*100)+'%';
  animateCount('tXP',ST.xp);
  document.getElementById('lXP').textContent='0';
  document.getElementById('lDots').innerHTML=m.steps.map((_,i)=>`<div class="l-dot${i===0?' a':''}" id="ld${i}"></div>`).join('');
  renderStep();showView('viewLesson');
}

// ── Step counter pips ──
function pipHTML(m){
  return '<div class="step-count">'+m.steps.map((_,i)=>`<div class="step-pip${i<ST.step?' done':i===ST.step?' active':''}"></div>`).join('')+'</div>';
}

// ── Render ──
function renderStep(){
  const m=MODS[ST.modIdx],s=m.steps[ST.step];
  const slot=document.getElementById('lSlot'),btn=document.getElementById('btnN');
  m.steps.forEach((_,i)=>{const d=document.getElementById('ld'+i);if(d)d.className='l-dot'+(i<ST.step?' d':i===ST.step?' a':'')});
  const ic=s.ic||'orange';
  const pips=pipHTML(m);

  if(s.type==='act'){
    slot.innerHTML=`<div class="lcard">${pips}
      <div class="combo" id="combo"><i class="fi fi-sr-flame"></i> <span id="comboVal">x${ST.combo}</span></div>
      <div class="lcard-icon ${ic}"><i class="fi ${s.icon}"></i></div>
      <h2>${s.title}</h2><p class="lcard-desc">${s.desc}</p>
      <div class="choices">${s.ch.map((c,i)=>`<button class="ch" onclick="pick(${i},this)" id="c${i}"><span class="ch-key">${c.k}</span><span>${c.t}</span></button>`).join('')}</div>
      <div id="expS"></div></div>`;
    btn.className='btn-next wait';btn.textContent='Selecciona una respuesta';

  } else if(s.type==='tf'){
    slot.innerHTML=`<div class="lcard">${pips}
      <div class="combo" id="combo"><i class="fi fi-sr-flame"></i> <span id="comboVal">x${ST.combo}</span></div>
      <div class="lcard-icon ${ic}"><i class="fi ${s.icon}"></i></div>
      <h2>${s.title}</h2><p class="lcard-desc">${s.desc}</p>
      <div class="tf-row">
        <button class="tf yes" onclick="pickTF(true,this)"><i class="fi fi-sr-check-circle"></i>Verdadero</button>
        <button class="tf no" onclick="pickTF(false,this)"><i class="fi fi-sr-cross-circle"></i>Falso</button>
      </div><div id="expS"></div></div>`;
    btn.className='btn-next wait';btn.textContent='Selecciona una respuesta';

  } else if(s.type==='fill'){
    const blanksHTML=s.sentence.replace(/___(.*?)___/g,'<span class="fill-blank" id="fb0">___</span>').replace(/___/g,()=>'<span class="fill-blank" id="fb'+(fillIdx++)+'">___</span>');
    fillIdx=0;
    const sentParts=s.sentence.split('___');
    let sentHTML='';
    for(let i=0;i<sentParts.length;i++){
      sentHTML+=sentParts[i];
      if(i<s.blanks.length)sentHTML+=`<span class="fill-blank" id="fb${i}">___</span>`;
    }
    const optsHTML=shuffle([...s.opts]).map((o,i)=>`<button class="fill-opt" onclick="pickFill('${o}',this)" id="fo${i}">${o}</button>`).join('');
    slot.innerHTML=`<div class="lcard">${pips}
      <div class="combo" id="combo"><i class="fi fi-sr-flame"></i> <span id="comboVal">x${ST.combo}</span></div>
      <div class="lcard-icon ${ic}"><i class="fi ${s.icon}"></i></div>
      <h2>${s.title}</h2>
      <div class="fill-sentence">${sentHTML}</div>
      <div class="fill-opts">${optsHTML}</div>
      <div id="expS"></div></div>`;
    btn.className='btn-next wait';btn.textContent='Completa los espacios';
    fillState={blanks:[...s.blanks],filled:[],correct:0};

  } else {
    slot.innerHTML=`<div class="lcard">${pips}
      <div class="lcard-icon ${ic}"><i class="fi ${s.icon}"></i></div>
      <h2>${s.title}</h2><p class="lcard-desc">${s.desc}</p></div>`;
    const last=ST.step>=m.steps.length-1;
    btn.className='btn-next '+(last?'done':'go');
    btn.innerHTML=last?'Completar módulo <i class="fi fi-sr-check"></i>':'Continuar <i class="fi fi-rr-arrow-right"></i>';
  }
}

let fillIdx=0,fillState={blanks:[],filled:[],correct:0};

// ── Pick multiple choice ──
function pick(i,el){
  const s=MODS[ST.modIdx].steps[ST.step];
  document.querySelectorAll('.ch').forEach(b=>b.style.pointerEvents='none');
  const ok=s.ch[i].ok||s.allOk;
  if(ok){
    el.classList.add('ok');if(s.allOk)document.querySelectorAll('.ch').forEach(b=>b.classList.add('ok'));
    reward(el);
  } else {
    el.classList.add('no');s.ch.forEach((c,j)=>{if(c.ok)document.getElementById('c'+j).classList.add('ok')});
    punish();
  }
  if(s.exp)showExp(s.exp,ok);enableNext();
}

// ── Pick True/False ──
function pickTF(val,el){
  const s=MODS[ST.modIdx].steps[ST.step];
  document.querySelectorAll('.tf').forEach(b=>b.style.pointerEvents='none');
  const ok=val===s.answer;
  if(ok){el.classList.add('ok');reward(el)}
  else{
    el.classList.add('wrong');
    document.querySelectorAll('.tf').forEach(b=>{if((b.classList.contains('yes')&&s.answer)||(b.classList.contains('no')&&!s.answer))b.classList.add('ok')});
    punish();
  }
  if(s.exp)showExp(s.exp,ok);enableNext();
}

// ── Pick Fill blank ──
function pickFill(val,el){
  const s=MODS[ST.modIdx].steps[ST.step];
  const idx=fillState.filled.length;
  if(idx>=fillState.blanks.length)return;
  const expected=fillState.blanks[idx];
  const blank=document.getElementById('fb'+idx);

  if(val===expected){
    el.classList.add('ok');el.style.pointerEvents='none';
    blank.textContent=val;blank.classList.add('filled');
    fillState.filled.push(val);fillState.correct++;
    reward(el);
    if(fillState.filled.length>=fillState.blanks.length){
      document.querySelectorAll('.fill-opt').forEach(b=>b.style.pointerEvents='none');
      if(s.exp)showExp(s.exp,true);enableNext();
    }
  } else {
    el.classList.add('wrong');
    setTimeout(()=>el.classList.remove('wrong'),500);
    punish();
  }
}

// ── Reward/Punish helpers ──
function reward(el){
  ST.combo++;
  const comboEl=document.getElementById('combo'),comboVal=document.getElementById('comboVal');
  if(comboEl&&ST.combo>=2){comboVal.textContent='x'+ST.combo;comboEl.classList.add('show');comboEl.classList.remove('fire');void comboEl.offsetWidth;comboEl.classList.add('fire')}
  const bonus=Math.min(ST.combo-1,3)*5,earned=15+bonus;
  ST.lxp+=earned;animateCount('lXP',ST.lxp);
  floatXP(el,'+'+earned);screenFlash('green');
  document.querySelector('.topbar-xp').classList.add('glow');
  setTimeout(()=>document.querySelector('.topbar-xp').classList.remove('glow'),600);
}

function punish(){
  ST.combo=0;screenFlash('red');
  const c=document.getElementById('combo');if(c)c.classList.remove('show');
}

function showExp(exp,ok){
  setTimeout(()=>{document.getElementById('expS').innerHTML=`<div class="exp"><h4><i class="fi fi-sr-lightbulb-on"></i> ${exp.t}</h4><p>${exp.p}</p></div>`},ok?400:600);
}

function enableNext(){
  const btn=document.getElementById('btnN'),m=MODS[ST.modIdx];
  const last=ST.step>=m.steps.length-1;
  btn.className='btn-next '+(last?'done':'go');
  btn.innerHTML=last?'Completar módulo <i class="fi fi-sr-check"></i>':'Continuar <i class="fi fi-rr-arrow-right"></i>';
}

// ── Navigation ──
function goNext(){
  const btn=document.getElementById('btnN');if(btn.classList.contains('wait'))return;
  if(ST.step<MODS[ST.modIdx].steps.length-1){ST.step++;renderStep()}else completeModule();
}

function completeModule(){
  const m=MODS[ST.modIdx],prev=ST.done.length;
  if(!ST.done.includes(m.id)){ST.done.push(m.id);ST.xp+=m.xp+ST.lxp;ST.streak++}
  save();
  const oldR=RANKS[Math.min(prev,RANKS.length-1)],newR=RANKS[Math.min(ST.done.length,RANKS.length-1)];
  if(ST.done.length>=MODS.length){confetti();showView('viewFinal');updateFinal();if(oldR!==newR)setTimeout(()=>showLevelUp(newR),800);return}
  showTransition(m,ST.modIdx+1,oldR,newR);
}

function showTransition(mod,nextIdx,oldR,newR){
  document.getElementById('transTitle').textContent=mod.title;
  document.getElementById('transXP').textContent='+'+(mod.xp+ST.lxp)+' XP';
  const pct=Math.round((ST.done.length/MODS.length)*100);
  document.getElementById('transPct').textContent=pct+'%';
  document.getElementById('transNextTitle').textContent=MODS[nextIdx].title;
  showView('viewTransition');confetti();
  setTimeout(()=>document.getElementById('transFill').style.width=pct+'%',300);
  if(oldR!==newR)setTimeout(()=>showLevelUp(newR),1000);
}
function continueNext(){document.getElementById('transFill').style.width='0%';openModule(ST.done.length)}
function exitToHero(){showView('viewHero');updateHeroBtn()}

function updateFinal(){
  animateCount('fXP',ST.xp);
  document.getElementById('fModules').textContent=ST.done.length+'/'+MODS.length;
  document.getElementById('fRank').textContent=RANKS[Math.min(ST.done.length,RANKS.length-1)];
  confetti();
}

function resetAll(){
  localStorage.removeItem('abc5');
  Object.assign(ST,{xp:0,streak:0,done:[],modIdx:0,step:0,lxp:0,combo:0});
  showView('viewHero');updateHeroBtn();
}

// ── Utils ──
function animateCount(id,target){
  const el=document.getElementById(id);if(!el)return;
  const cur=parseInt(el.textContent)||0;if(cur===target){el.textContent=target;return}
  const diff=target-cur;let val=cur,i=0;
  const t=setInterval(()=>{i++;val+=diff/20;el.textContent=Math.round(val);if(i>=20){el.textContent=target;clearInterval(t)}},30);
}
function floatXP(el,text){
  const r=el.getBoundingClientRect(),f=document.createElement('div');f.className='xp-float';f.textContent=text;
  f.style.left=(r.left+r.width/2-20)+'px';f.style.top=(r.top-10)+'px';
  document.body.appendChild(f);setTimeout(()=>f.remove(),1300);
}
function screenFlash(color){const f=document.getElementById('flash');f.className='flash';void f.offsetWidth;f.classList.add(color)}
function showLevelUp(rank){
  const b=document.createElement('div');b.className='levelup';
  b.innerHTML=`<i class="fi fi-sr-trophy"></i> NIVEL DESBLOQUEADO: ${rank.toUpperCase()}`;
  document.body.appendChild(b);setTimeout(()=>b.remove(),3200);
}
function confetti(){
  const cols=['#fb6422','#ff9a5c','#22c55e','#818cf8','#ffd700','#a855f7','#fff'],shapes=['square','circle','strip'];
  for(let i=0;i<50;i++){const c=document.createElement('div');c.className='confetti '+shapes[Math.floor(Math.random()*shapes.length)];
    c.style.left=Math.random()*100+'vw';c.style.top='-12px';c.style.background=cols[Math.floor(Math.random()*cols.length)];
    c.style.animationDelay=Math.random()*.8+'s';c.style.animationDuration=(1.5+Math.random()*1.2)+'s';
    document.body.appendChild(c);setTimeout(()=>c.remove(),3500)}
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
