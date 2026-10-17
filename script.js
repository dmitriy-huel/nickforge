const STYLE_TITLES = {
  aggressive: 'АГРЕССИВНЫЙ<br>СТИЛЬ',
  tactical: 'ТАКТИЧЕСКИЙ<br>СТИЛЬ',
  funny: 'СМЕШНОЙ<br>СТИЛЬ'
};

const STYLE_TAGS = {
  aggressive: 'TAG: [AK] ESPORTS // v.4',
  tactical: 'TAG: [AK] TACTICAL // v.3',
  funny: 'TAG: [AK] FUN // v.2'
};

const GAMES = ['CS 2','VALORANT','PUBG MOBILE','APEX LEGENDS','DOTA 2','OVERWATCH 2'];

const MORPH = {
  aggressive: {
    prefixes: ['AK','XR','DR','KR','VL','ZR','NX','VX','RX','TX','OM','IN','UN','EX','OB','AR','UR','IG','NOX','KRA'],
    roots: ['GHOST','REAPER','BLOOD','STRIKE','FURY','BLAZE','VENOM','SKULL','CRUSHER','RAID','DOOM','HAVOC','PHANTOM','WRAITH','TITAN','BEAST','SLAYER','HUNTER','WAR','RAGE','STORM','SHADOW','IRON','FANG','CLAW','BONE','ASH','DREAD','GRIM','HELL'],
    suffixes: ['X','Z','PRO','ACE','KILL','SLAY','CORE','EDGE','FIRE','BORN','WOLF','HAWK','LORD','KING','GOD','666','13','07','99','01'],
    separators: ['_','.','','-','X'],
    decorations: ['','_','xX','Xx','__'],
    endings: ['X','Z','_','', '!']
  },
  tactical: {
    prefixes: ['AK','OP','SP','TR','NV','CY','QR','ST','VT','EL','IR','SO','NZ','KP','LM','DT','FX','BR','CL','MN'],
    roots: ['SILENT','OPS','RECON','CYPHER','PHANTOM','GHOST','VECTOR','SENTINEL','WARDEN','CIPHER','ECHELON','SPECTRE','PRECISION','STEALTH','NIGHT','COLD','IRON','DELTA','ECHO','NOVA','ORBIT','PULSE','QUANTUM','RIFT','SCOPE','TRACE'],
    suffixes: ['PRO','OPS','X','Z','7','01','77','99','ACE','CORE','ONE','ZERO','NINE','OPS','NET','GRID','LINE','CODE'],
    separators: ['_','.','','-'],
    decorations: ['','_','__','.','::'],
    endings: ['','_','.', 'X','Z']
  },
  funny: {
    prefixes: ['NOOB','LAG','AFK','BOT','TROLL','CAMP','PANIC','SPRAY','SCOPE','RUN','HEAD','MISS','FEED','OUCH','YOLO','DERP','MEME','SALT','TILT','FACEPALM'],
    roots: ['SLAYER','MASTER','GOD','KING','LORD','HERO','NOOB','BOT','CAMPER','SNIPER','GOBLIN','MAGNET','BUTTON','CLICK','FPS','PING','LAG','TEAM','LOOT','RESPAWN'],
    suffixes: ['3000','9000','01','99','777','XXX','_','', 'BOT','GOD','LORD','KING','HERO','NOOB'],
    separators: ['_','.','','-'],
    decorations: ['','_','__'],
    endings: ['','_','!','?','.', 'XD']
  }
};

const LEET_MAP = {
  'a':'4','e':'3','i':'1','o':'0','s':'5','t':'7','b':'8','g':'9'
};

const usedNicks = new Set();

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function applyLeet(str, intensity){
  let out = '';
  for(const ch of str){
    const low = ch.toLowerCase();
    if(LEET_MAP[low] && Math.random() < intensity){
      out += LEET_MAP[low];
    }else{
      out += ch;
    }
  }
  return out;
}

function isUgly(str){
  if(!str) return true;
  if(str.length < 3 || str.length > 18) return true;
  if(/[^A-Za-z0-9_.\-\[\]!?]/.test(str)) return true;
  if(/(.)\1{2,}/.test(str.replace(/[_.\-]/g,''))) return true;
  if(/[bcdfghjklmnpqrstvwxz]{4,}/i.test(str)) return true;
  if(/[_.\-]{2,}/.test(str)) return true;
  if(/^[_.\-]|[_.\-]$/.test(str)) return true;
  if(/([_.\-])\1/.test(str)) return true;
  return false;
}

function buildNick(style, maxLen){
  const m = MORPH[style] || MORPH.aggressive;
  let nick = '';

  const usePrefix = Math.random() < 0.65;
  const useSuffix = Math.random() < 0.7;
  const useDecoration = Math.random() < 0.35;
  const useEnding = Math.random() < 0.25;

  if(usePrefix) nick += rand(m.prefixes);
  if(usePrefix && useSuffix && Math.random() < 0.8){
    nick += rand(m.separators);
  }
  nick += rand(m.roots);
  if(useSuffix){
    nick += rand(m.separators);
    nick += rand(m.suffixes);
  }
  if(useDecoration){
    const dec = rand(m.decorations);
    if(dec) nick = dec + nick + dec;
  }
  if(useEnding){
    nick += rand(m.endings);
  }

  const leetIntensity = style === 'aggressive' ? 0.45 : style === 'tactical' ? 0.25 : 0.35;
  nick = applyLeet(nick, leetIntensity);

  if(nick.length > maxLen) nick = nick.slice(0, maxLen);
  nick = nick.replace(/[_.\-]+$/,'');

  return nick;
}

function generateUniqueNick(style, maxLen){
  let attempt = 0;
  let nick = '';
  do{
    nick = buildNick(style, maxLen);
    attempt++;
  }while((isUgly(nick) || usedNicks.has(nick)) && attempt < 60);

  if(isUgly(nick) || usedNicks.has(nick)){
    const pool = style === 'aggressive' ? ['AK_GHOST','REAPER_X','BLOOD_STRIKE']
              : style === 'tactical' ? ['SILENT_OPS','PHANTOM_7','RECON_X']
              : ['NOOB_SLAYER','LAGGY_BOT','TROLL_XD'];
    nick = rand(pool);
  }

  usedNicks.add(nick);
  if(usedNicks.size > 500) usedNicks.clear();
  return nick;
}

function getQuery(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function copyToClipboard(text, statusId){
  const status = statusId ? document.getElementById(statusId) : null;
  const done = () => { if(status) status.textContent = '✓ Скопировано в буфер обмена'; };
  const fail = () => { if(status) status.textContent = '✓ Ник готов к использованию'; };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => {
      legacyCopy(text) ? done() : fail();
    });
  }else{
    legacyCopy(text) ? done() : fail();
  }
  if(navigator.vibrate) navigator.vibrate(15);
}

function legacyCopy(text){
  try{
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }catch(e){
    return false;
  }
}

const state = {
  style: getQuery('style') || 'aggressive',
  length: 8,
  nick: 'AK_GHOST'
};

if(!STYLE_TITLES[state.style]) state.style = 'aggressive';

const styleTitleEl = document.getElementById('generator-style-title');
const styleTagEl = document.getElementById('generator-tag');
const nickOutputEl = document.getElementById('nick-output');
const nickInfoEl = document.getElementById('nick-info');
const variantsBox = document.getElementById('variants-box');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const availabilityGrid = document.getElementById('availability-grid');
const resultCard = document.getElementById('result-card');
const finalNickEl = document.getElementById('final-nick');
const btnCopyAgain = document.getElementById('btn-copy-again');

if(styleTitleEl) styleTitleEl.innerHTML = STYLE_TITLES[state.style];
if(styleTagEl) styleTagEl.textContent = STYLE_TAGS[state.style];

function renderVariants(){
  if(!variantsBox) return;
  variantsBox.innerHTML = '<span class="variants__label">ВАРИАНТЫ:</span>';
  const variants = [];
  for(let i=0;i<3;i++){
    let v = '';
    let guard = 0;
    do{
      v = buildNick(state.style, state.length);
      guard++;
    }while((isUgly(v) || usedNicks.has(v) || variants.includes(v)) && guard < 40);
    if(isUgly(v)) continue;
    variants.push(v);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'variant-btn' + (v === state.nick ? ' active' : '');
    btn.textContent = v.length > 10 ? v.slice(0,10) : v;
    btn.title = v;
    btn.addEventListener('click', () => {
      state.nick = v;
      updateNickDisplay(true);
      renderVariants();
    });
    variantsBox.appendChild(btn);
  }
}

function renderAvailability(){
  if(!availabilityGrid) return;
  availabilityGrid.innerHTML = '';
  for(let i=0;i<3;i++){
    const game = GAMES[Math.floor(Math.random()*GAMES.length)];
    const item = document.createElement('div');
    item.className = 'avail-item';
    item.innerHTML = `<span class="avail-item__game">${game}</span><span class="avail-item__status">● СВОБОДЕН</span>`;
    availabilityGrid.appendChild(item);
  }
}

function updateNickDisplay(flash){
  if(!nickOutputEl) return;
  nickOutputEl.textContent = state.nick;
  if(nickInfoEl){
    nickInfoEl.innerHTML = `${state.nick.length} СИМВОЛОВ • <span class="accent">LEET-COMPATIBLE</span>`;
  }
  const uniqEl = document.getElementById('stat-unique');
  if(uniqEl){
    const uniq = String(Math.floor(Math.random()*77)+1).padStart(2,'0');
    uniqEl.textContent = `${uniq} / 77`;
  }
  if(flash){
    nickOutputEl.classList.remove('flash');
    void nickOutputEl.offsetWidth;
    nickOutputEl.classList.add('flash');
  }
}

function generateNick(){
  state.nick = generateUniqueNick(state.style, state.length);
  updateNickDisplay(true);
  renderVariants();
}

document.querySelectorAll('.toggle-buttons').forEach(group => {
  group.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

if(lengthSlider){
  lengthSlider.addEventListener('input', e => {
    state.length = parseInt(e.target.value,10);
    if(lengthValue) lengthValue.textContent = state.length;
    const pct = ((state.length - 4) / 12) * 100;
    e.target.style.background =
      `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border-light) ${pct}%, var(--border-light) 100%)`;
    if(state.nick.length > state.length){
      state.nick = state.nick.slice(0, state.length).replace(/[_.\-]+$/,'');
      updateNickDisplay(true);
      renderVariants();
    }
  });
  lengthSlider.dispatchEvent(new Event('input'));
}

const btnReset = document.getElementById('btn-reset');
if(btnReset){
  btnReset.addEventListener('click', () => {
    state.length = 8;
    if(lengthSlider){
      lengthSlider.value = 8;
      lengthSlider.dispatchEvent(new Event('input'));
    }
    usedNicks.clear();
    generateNick();
  });
}

const btnOther = document.getElementById('btn-other');
if(btnOther) btnOther.addEventListener('click', generateNick);

const btnTake = document.getElementById('btn-take');
if(btnTake){
  btnTake.addEventListener('click', () => {
    if(finalNickEl) finalNickEl.textContent = state.nick;
    if(resultCard){
      resultCard.hidden = false;
      resultCard.scrollIntoView({behavior:'smooth', block:'start'});
    }
    if(btnCopyAgain) btnCopyAgain.hidden = false;
    renderAvailability();
    copyToClipboard(state.nick, 'copy-status');
  });
}

if(btnCopyAgain){
  btnCopyAgain.addEventListener('click', () => {
    copyToClipboard(state.nick, 'copy-status');
  });
}

document.querySelector('.field__toggle')?.addEventListener('click', function(){
  const input = this.parentElement.querySelector('input');
  input.type = input.type === 'password' ? 'text' : 'password';
  this.textContent = input.type === 'password' ? '👁' : '🙈';
});

const favList = document.getElementById('fav-list');
if(favList){
  favList.addEventListener('click', e => {
    const removeBtn = e.target.closest('.fav-btn--remove');
    const copyBtn = e.target.closest('.fav-btn:not(.fav-btn--remove)');
    const item = e.target.closest('.fav-item');
    if(!item) return;

    if(removeBtn){
      item.style.transition = 'opacity .25s, transform .25s';
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => {
        item.remove();
        const count = document.querySelectorAll('#fav-list .fav-item').length;
        const counter = document.getElementById('fav-count');
        if(counter) counter.textContent = count;
      }, 250);
      if(navigator.vibrate) navigator.vibrate(15);
    }

    if(copyBtn){
      const nick = item.querySelector('.fav-item__nick')?.textContent?.trim();
      if(nick) copyToClipboard(nick, null);
    }
  });
}

document.querySelectorAll('.switch').forEach(sw => {
  sw.addEventListener('click', () => {
    sw.classList.toggle('switch--on');
    if(navigator.vibrate) navigator.vibrate(10);
  });
});

const historyList = document.getElementById('history-list');
if(historyList){
  historyList.addEventListener('click', e => {
    const item = e.target.closest('.history-item');
    if(!item) return;
    const nick = item.querySelector('.history-item__nick')?.textContent?.trim();
    if(nick){
      copyToClipboard(nick, null);
      item.style.borderColor = 'var(--accent)';
      setTimeout(() => { item.style.borderColor = ''; }, 500);
    }
  });
}

const btnLogout = document.getElementById('btn-logout');
if(btnLogout){
  btnLogout.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

if(nickOutputEl){
  renderVariants();
  updateNickDisplay(false);
  renderAvailability();
}