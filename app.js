// ===== ABC DEL TRADING — Engine (content in content.js) =====
const ST={xp:0,streak:0,done:[],modIdx:0,step:0,lxp:0,combo:0};
const RANKS=['Novato','Aprendiz','Estudiante','Iniciado','Trader Jr.','Analista Jr.','Trader','Analista','Estratega','Táctico','Gestor','Avanzado','Profesional','Experto','Pro Trader','Máster','Senior','Leyenda','Élite'];

// ── Init ──
document.addEventListener('DOMContentLoaded',()=>{
  load();
  if(ST.done.length>=MODS.length){showView('viewFinal');updateFinal()}
  else if(ST.done.length>0)updateHeroBtn();
});

function load(){const d=localStorage.getItem('abc6');if(d)Object.assign(ST,JSON.parse(d))}
function save(){localStorage.setItem('abc6',JSON.stringify(ST))}

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

function pipHTML(m){
  return '<div class="step-count">'+m.steps.map((_,i)=>`<div class="step-pip${i<ST.step?' done':i===ST.step?' active':''}"></div>`).join('')+'</div>';
}

// ── Render ──
function renderStep(){
  const m=MODS[ST.modIdx],s=m.steps[ST.step];
  const slot=document.getElementById('lSlot'),btn=document.getElementById('btnN');
  m.steps.forEach((_,i)=>{const d=document.getElementById('ld'+i);if(d)d.className='l-dot'+(i<ST.step?' d':i===ST.step?' a':'')});
  const ic=s.ic||'orange',pips=pipHTML(m);

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
    fillIdx=0;
    const sentParts=s.sentence.split('___');
    let sentHTML='';
    for(let i=0;i<sentParts.length;i++){sentHTML+=sentParts[i];if(i<s.blanks.length)sentHTML+=`<span class="fill-blank" id="fb${i}">___</span>`}
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

function pick(i,el){
  const s=MODS[ST.modIdx].steps[ST.step];
  document.querySelectorAll('.ch').forEach(b=>b.style.pointerEvents='none');
  const ok=s.ch[i].ok||s.allOk;
  if(ok){el.classList.add('ok');if(s.allOk)document.querySelectorAll('.ch').forEach(b=>b.classList.add('ok'));reward(el)}
  else{el.classList.add('no');s.ch.forEach((c,j)=>{if(c.ok)document.getElementById('c'+j).classList.add('ok')});punish()}
  if(s.exp)showExp(s.exp,ok);enableNext();
}

function pickTF(val,el){
  const s=MODS[ST.modIdx].steps[ST.step];
  document.querySelectorAll('.tf').forEach(b=>b.style.pointerEvents='none');
  const ok=val===s.answer;
  if(ok){el.classList.add('ok');reward(el)}
  else{el.classList.add('wrong');document.querySelectorAll('.tf').forEach(b=>{if((b.classList.contains('yes')&&s.answer)||(b.classList.contains('no')&&!s.answer))b.classList.add('ok')});punish()}
  if(s.exp)showExp(s.exp,ok);enableNext();
}

function pickFill(val,el){
  const s=MODS[ST.modIdx].steps[ST.step],idx=fillState.filled.length;
  if(idx>=fillState.blanks.length)return;
  const blank=document.getElementById('fb'+idx);
  if(val===fillState.blanks[idx]){
    el.classList.add('ok');el.style.pointerEvents='none';
    blank.textContent=val;blank.classList.add('filled');
    fillState.filled.push(val);fillState.correct++;reward(el);
    if(fillState.filled.length>=fillState.blanks.length){
      document.querySelectorAll('.fill-opt').forEach(b=>b.style.pointerEvents='none');
      if(s.exp)showExp(s.exp,true);enableNext();
    }
  } else {el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),500);punish()}
}

function reward(el){
  ST.combo++;
  const c=document.getElementById('combo'),v=document.getElementById('comboVal');
  if(c&&ST.combo>=2){v.textContent='x'+ST.combo;c.classList.add('show');c.classList.remove('fire');void c.offsetWidth;c.classList.add('fire')}
  const bonus=Math.min(ST.combo-1,3)*5,earned=15+bonus;
  ST.lxp+=earned;animateCount('lXP',ST.lxp);floatXP(el,'+'+earned);screenFlash('green');
  document.querySelector('.topbar-xp').classList.add('glow');
  setTimeout(()=>document.querySelector('.topbar-xp').classList.remove('glow'),600);
}
function punish(){ST.combo=0;screenFlash('red');const c=document.getElementById('combo');if(c)c.classList.remove('show')}
function showExp(exp,ok){setTimeout(()=>{document.getElementById('expS').innerHTML=`<div class="exp"><h4><i class="fi fi-sr-lightbulb-on"></i> ${exp.t}</h4><p>${exp.p}</p></div>`},ok?400:600)}
function enableNext(){
  const btn=document.getElementById('btnN'),last=ST.step>=MODS[ST.modIdx].steps.length-1;
  btn.className='btn-next '+(last?'done':'go');
  btn.innerHTML=last?'Completar módulo <i class="fi fi-sr-check"></i>':'Continuar <i class="fi fi-rr-arrow-right"></i>';
}

function goNext(){const btn=document.getElementById('btnN');if(btn.classList.contains('wait'))return;if(ST.step<MODS[ST.modIdx].steps.length-1){ST.step++;renderStep()}else completeModule()}

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
  localStorage.removeItem('abc6');
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

// ── CHATTRADE DEMO ENGINE ──
let demoStep=0;

function openDemo(){
  demoStep=0;
  showView('viewDemo');
  animateCount('demoTokens',ST.xp*10);
  document.getElementById('demoChatBody').innerHTML=`
    <div class="demo-welcome">
      <img src="bot_mark.png" alt="" class="demo-welcome-icon">
      <h3>¿Cómo puedo ayudarte hoy?</h3>
      <p>Listo para ayudarte a operar BTCUSD.</p>
    </div>`;
  document.getElementById('demoQuick').style.display='flex';
  document.getElementById('demoQuick').innerHTML=`
    <button class="demo-qbtn analysis" onclick="demoAsk('analysis')"><i class="fi fi-sr-chart-mixed-up-circle-dollar"></i> Análisis de Mercado</button>
    <button class="demo-qbtn opp" onclick="demoAsk('opportunity')"><i class="fi fi-sr-diamond"></i> Encontrar Oportunidades</button>`;
}

function exitDemo(){showView('viewFinal');updateFinal()}

const DEMO_FLOWS={
  analysis:{
    userMsg:'Análisis de mercado para BTCUSD',
    botReply:'<strong>BTCUSD — Análisis en tiempo real</strong><br><br>Bitcoin se consolida alrededor de <strong>$67,420</strong>.<br><br>Indicadores clave:<br>• RSI (14): 58.3 — neutral-alcista<br>• MACD: cruce alcista confirmado<br>• Volumen: +12% últimas 4h<div class="demo-signal"><div class="demo-signal-row"><span>Sesgo</span><strong>COMPRAS 74%</strong></div><div class="demo-signal-row"><span>Zona de entrada</span><strong>$67,200 - $67,500</strong></div><div class="demo-signal-row"><span>Stop Loss</span><strong>$66,800</strong></div><div class="demo-signal-row"><span>Take Profit</span><strong>$68,900</strong></div><div class="demo-signal-row"><span>R/R</span><strong>1:2.8</strong></div></div>',
    followQ:'¿Cuánto debería arriesgar?',
    followA:'Con la regla del 2% que aprendiste:<br><br>Si tu cuenta = <strong>$1,000</strong> → riesgo máximo = <strong>$20</strong><br><br>• Entrada: $67,350<br>• Stop Loss: $66,800<br>• Tamaño: <strong>0.003 BTC</strong><br><br>BOTFX calcula esto automáticamente en cada señal.'
  },
  opportunity:{
    userMsg:'Encontrar oportunidades ahora',
    botReply:'<strong>Top 3 señales activas:</strong><br><br>1. <strong>BTCUSD</strong> — Compras 74% — R/R 1:2.8<br>2. <strong>EURUSD</strong> — Ventas 68% — R/R 1:2.1<br>3. <strong>XAUUSD</strong> — Compras 81% — R/R 1:3.2<div class="demo-signal"><div class="demo-signal-row"><span>Mejor oportunidad</span><strong>XAUUSD (Oro)</strong></div><div class="demo-signal-row"><span>Probabilidad</span><strong>81% COMPRAS</strong></div><div class="demo-signal-row"><span>R/R</span><strong>1:3.2</strong></div><div class="demo-signal-row"><span>GEX</span><span class="demo-signal-tag long">Muro institucional</span></div></div>',
    followQ:'¿Cómo abro esta operación?',
    followA:'Para operar XAUUSD:<br><br>1. Abre tu broker conectado a BOTFX<br>2. Busca <strong>XAUUSD</strong><br>3. Configura:<br>• <strong>Buy Limit</strong> en zona de entrada<br>• Stop Loss según la señal<br>• Take Profit automático<br><br>En BOTFX real, todo con un solo clic.'
  },
  custom:{
    userMsg:'¿Qué hace especial a BOTFX?',
    botReply:'<strong>3 tecnologías únicas:</strong><br><br>1. <strong>GEX Bubbles</strong> — Detecta dónde están las instituciones. GPS del dinero grande.<br><br>2. <strong>IA Predictiva</strong> — +200 variables en tiempo real con probabilidad exacta.<br><br>3. <strong>ChatTrade</strong> — Tu asistente IA. Pregunta lo que quieras con datos en vivo.<br><br>Todo lo del ABC del Trading, BOTFX lo ejecuta automáticamente.',
    followQ:'¿Cuánto cuesta?',
    followA:'Planes desde <strong>$29/mes</strong>.<br><br>Incluye:<br>• Señales en 63 activos<br>• GEX Bubbles en vivo<br>• ChatTrade con Ask Chris<br>• Tokens mensuales<br><br>Tus tokens del ABC se acreditan al registrarte.'
  }
};

function demoAsk(type){
  if(demoStep>=2){showDemoCTA();return}
  const flow=DEMO_FLOWS[type];
  const chat=document.getElementById('demoChatBody');
  const quick=document.getElementById('demoQuick');
  const w=chat.querySelector('.demo-welcome');
  if(w)w.remove();
  quick.style.display='none';

  addBubble(chat,'user',flow.userMsg);
  setTimeout(()=>{
    const t=addTyping(chat);
    setTimeout(()=>{
      t.remove();
      addBubble(chat,'bot',flow.botReply);
      chat.scrollTop=chat.scrollHeight;
      demoStep++;
      setTimeout(()=>{
        quick.innerHTML=`<button class="demo-qbtn analysis" onclick="demoFollowUp('${type}')"><i class="fi fi-rr-interrogation"></i> ${flow.followQ}</button>`;
        quick.style.display='flex';
      },600);
    },1800);
  },400);
}

function demoFollowUp(type){
  const flow=DEMO_FLOWS[type];
  const chat=document.getElementById('demoChatBody');
  const quick=document.getElementById('demoQuick');
  quick.style.display='none';

  addBubble(chat,'user',flow.followQ);
  setTimeout(()=>{
    const t=addTyping(chat);
    setTimeout(()=>{
      t.remove();
      addBubble(chat,'bot',flow.followA);
      chat.scrollTop=chat.scrollHeight;
      demoStep++;
      if(demoStep>=2)setTimeout(showDemoCTA,800);
    },1500);
  },400);
}

function addBubble(c,type,html){
  const d=document.createElement('div');d.className='demo-bubble '+type;
  d.innerHTML=html;c.appendChild(d);c.scrollTop=c.scrollHeight;return d;
}
function addTyping(c){
  const d=document.createElement('div');d.className='demo-typing';
  d.innerHTML='<span></span><span></span><span></span>';c.appendChild(d);c.scrollTop=c.scrollHeight;return d;
}

function showDemoCTA(){
  const quick=document.getElementById('demoQuick');
  quick.innerHTML=`
    <div class="demo-cta-banner">
      <p>Esto fue una demo. En <strong>BOTFX real</strong>, Ask Chris responde con datos de mercado en vivo, señales al segundo, y análisis institucional con GEX Bubbles.</p>
      <a href="https://www.botfx.ai/register" target="_blank" class="demo-cta-link"><i class="fi fi-sr-bolt"></i> Crear cuenta BOTFX</a>
    </div>`;
  quick.style.display='flex';
}

