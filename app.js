// 轩辕剑叁外传：天之痕 (The Scar of the Sky) Web Edition Controller
// Features: iPad Backquote (~/`) -> Esc mapping, WebAudio Jukebox, Canvas Prologue Engine, 
// 符鬼 (Ghost) Companion Simulator, and .cm Save Game Manager.

// 1. iPad Magic Keyboard & Global Shortcut Handler (~ / ` -> Esc)
window.addEventListener('keydown', (e) => {
  if (
    e.code === 'Backquote' || 
    e.key === '`' || 
    e.key === '~' || 
    e.key === '·' || 
    e.key === '～' || 
    e.keyCode === 192
  ) {
    e.preventDefault();
    handleEscapeAction();
  } else if (e.key === 'Escape') {
    handleEscapeAction();
  }
});

function handleEscapeAction() {
  const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab;
  console.log(`[Input] Esc / ~ pressed in tab: ${activeTab}`);
  
  // Show notification badge
  showNotification('⚡ [iPad Esc 映射] 已响应 Esc / ~ 键');
  
  if (activeTab === 'story') {
    resetStoryBattle();
  }
}

function showNotification(msg) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      background: rgba(20, 24, 32, 0.95);
      border: 1px solid var(--border-color);
      color: var(--text-gold);
      padding: 10px 18px; border-radius: 8px;
      font-size: 13px; z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
  }, 2200);
}

// 2. Navigation Tabs
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    
    tab.classList.add('active');
    const target = document.getElementById(`tab-${tab.dataset.tab}`);
    if (target) target.classList.add('active');
    
    if (tab.dataset.tab === 'story') {
      startCanvasLoop();
    }
  });
});

// 3. Jukebox & Audio System (WebAudio)
const TRACKS = [
  { id: 'Scar02', title: '三个人的时光 (笛琵绝响)', file: 'audio/Scar02.mp3', duration: '02:45', desc: '天之痕最经典的灵魂主题曲，小雪、玉儿与靖仇的千年回忆' },
  { id: 'Scar01', title: '如忆玉儿曲 (琵琶独奏)', file: 'audio/Scar01.mp3', duration: '01:52', desc: '凄美孤寂的琵琶旋律，忆玉儿之别' },
  { id: 'Scar03', title: '小雪的誓言 (女娲石)', file: 'audio/Scar03.mp3', duration: '02:18', desc: '温柔坚定的小雪主题乐章' },
  { id: 'Battle01', title: '经典战斗曲 (气势磅礴)', file: 'audio/Battle01.mp3', duration: '01:34', desc: '大雁南飞、隋末乱世的经典战斗背景曲' },
  { id: 'Battle02', title: '决战时刻 (首领激斗)', file: 'audio/Battle02.mp3', duration: '01:42', desc: '饕餮、宇文拓等强敌战激昂乐章' },
  { id: 'Cloud01', title: '云和山的彼端·隋郡', file: 'audio/Cloud01.mp3', duration: '02:30', desc: '漫步山河大地与中原古城' },
  { id: 'Gold01', title: '轩辕剑出·金石长鸣', file: 'audio/Gold01.mp3', duration: '02:15', desc: '上古十神器共鸣之威严正气' }
];

let currentTrackIndex = 0;
const audioPlayer = new Audio();
audioPlayer.loop = true;
audioPlayer.volume = 0.75;

function initJukebox() {
  const tableBody = document.getElementById('tracksTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  TRACKS.forEach((track, idx) => {
    const tr = document.createElement('tr');
    tr.id = `trackRow-${idx}`;
    if (idx === currentTrackIndex) tr.classList.add('active');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${track.title}</strong><div style="font-size:12px;color:var(--text-secondary);">${track.desc}</div></td>
      <td>${track.id}</td>
      <td>${track.duration}</td>
      <td><button class="action-btn" onclick="playTrack(${idx})">▶ 播放</button></td>
    `;
    tableBody.appendChild(tr);
  });
  
  updateNowPlaying();
}

function playTrack(idx) {
  currentTrackIndex = idx;
  const track = TRACKS[idx];
  audioPlayer.src = track.file;
  audioPlayer.play().then(() => {
    document.getElementById('playPauseIcon').innerText = '⏸';
    document.querySelector('.disc-icon')?.classList.remove('paused');
  }).catch(err => {
    console.log('Audio autoplay prevented:', err);
  });
  
  document.querySelectorAll('#tracksTableBody tr').forEach((r, i) => {
    r.classList.toggle('active', i === idx);
  });
  updateNowPlaying();
}

function togglePlay() {
  if (audioPlayer.paused) {
    if (!audioPlayer.src) {
      playTrack(currentTrackIndex);
    } else {
      audioPlayer.play();
      document.getElementById('playPauseIcon').innerText = '⏸';
      document.querySelector('.disc-icon')?.classList.remove('paused');
    }
  } else {
    audioPlayer.pause();
    document.getElementById('playPauseIcon').innerText = '▶';
    document.querySelector('.disc-icon')?.classList.add('paused');
  }
}

function nextTrack() {
  playTrack((currentTrackIndex + 1) % TRACKS.length);
}

function prevTrack() {
  playTrack((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
}

function updateNowPlaying() {
  const track = TRACKS[currentTrackIndex];
  const titleEl = document.getElementById('nowPlayingTitle');
  const descEl = document.getElementById('nowPlayingDesc');
  if (titleEl) titleEl.innerText = track.title;
  if (descEl) descEl.innerText = `${track.desc} · 格式: 原版 128kbps MP3`;
}

// 4. 符鬼小窝 (Ghost Companion Simulator)
const GHOST_ELEMENTS = [
  { id: '01', name: '金 (Metal)', class: 'elem-gold', title: '金系符鬼', desc: '善使雷电与金石之术，攻防均衡，性格刚烈' },
  { id: '02', name: '木 (Wood)', class: 'elem-wood', title: '木系符鬼', desc: '善使毒木愈愈之术，敏捷灵动，常带狡黠' },
  { id: '03', name: '水 (Water)', class: 'elem-water', title: '水系符鬼', desc: '善使冰魄寒水之术，聪颖温顺，恢复力极高' },
  { id: '04', name: '火 (Fire)', class: 'elem-fire', title: '火系符鬼', desc: '善使烈焰玄火之术，攻击凶悍，性格热烈' },
  { id: '05', name: '土 (Earth)', class: 'elem-earth', title: '土系符鬼', desc: '善使石障地陷之术，防御卓绝，贪吃贪睡' }
];

let currentGhostElem = '03'; // Default Water
let ghostFullness = 72;
let ghostMood = '开心';
let ghostLevel = 18;
let ghostPower = 48;
let ghostAgility = 36;
let ghostWisdom = 54;
let ghostAnimTimer = 0;
let ghostAction = 'normal';

function initGhostSystem() {
  const selector = document.getElementById('ghostElemSelector');
  if (!selector) return;
  
  selector.innerHTML = '';
  GHOST_ELEMENTS.forEach(elem => {
    const btn = document.createElement('button');
    btn.className = `elem-btn ${elem.class} ${elem.id === currentGhostElem ? 'active' : ''}`;
    btn.innerText = elem.name[0];
    btn.title = elem.title;
    btn.onclick = () => selectGhostElement(elem.id);
    selector.appendChild(btn);
  });
  
  updateGhostUI();
  renderGhostSprite();
}

function selectGhostElement(elemId) {
  currentGhostElem = elemId;
  document.querySelectorAll('.elem-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', GHOST_ELEMENTS[idx].id === elemId);
  });
  
  const elem = GHOST_ELEMENTS.find(e => e.id === elemId);
  document.getElementById('ghostElemTitle').innerText = elem.title;
  document.getElementById('ghostElemDesc').innerText = elem.desc;
  
  ghostAction = 'happy';
  setTimeout(() => { ghostAction = 'normal'; renderGhostSprite(); }, 1200);
  renderGhostSprite();
}

function feedGhost(foodName, deltaFull, deltaPow, deltaAgi, deltaWis) {
  ghostFullness = Math.min(100, Math.max(0, ghostFullness + deltaFull));
  ghostPower += deltaPow;
  ghostAgility += deltaAgi;
  ghostWisdom += deltaWis;
  
  if (ghostFullness >= 90) ghostMood = '满足·打饱嗝';
  else if (ghostFullness <= 20) ghostMood = '饥肠辘辘';
  else ghostMood = '快乐';
  
  ghostAction = 'happy';
  showNotification(`🐾 喂养成功！【${foodName}】饱食度 +${deltaFull}%`);
  
  updateGhostUI();
  renderGhostSprite();
  
  setTimeout(() => {
    ghostAction = 'normal';
    renderGhostSprite();
  }, 1500);
}

function updateGhostUI() {
  const fullBar = document.getElementById('ghostFullnessBar');
  const fullText = document.getElementById('ghostFullnessText');
  const moodText = document.getElementById('ghostMoodText');
  const powText = document.getElementById('ghostPowerText');
  const agiText = document.getElementById('ghostAgilityText');
  const wisText = document.getElementById('ghostWisdomText');
  
  if (fullBar) fullBar.style.width = `${ghostFullness}%`;
  if (fullText) fullText.innerText = `${ghostFullness}%`;
  if (moodText) moodText.innerText = ghostMood;
  if (powText) powText.innerText = ghostPower;
  if (agiText) agiText.innerText = ghostAgility;
  if (wisText) wisText.innerText = ghostWisdom;
}

function renderGhostSprite() {
  const canvas = document.getElementById('ghostSpriteCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const frame = (ghostAnimTimer % 2 === 0) ? '01' : '02';
  let actStr = 'normal';
  if (ghostAction === 'happy') actStr = 'happy';
  else if (ghostAction === 'angry') actStr = 'angry';
  else if (ghostAction === 'sleep') actStr = 'sleep';
  
  const imgPath = `img/ghosts/ghost_${currentGhostElem}_${actStr}_${frame}.png`;
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw enlarged pixelated
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.onerror = () => {
    // Fallback: draw placeholder SVG element icon
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(48, 48, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#12151a';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('符鬼', 48, 48);
  };
  img.src = imgPath;
}

setInterval(() => {
  ghostAnimTimer++;
  renderGhostSprite();
}, 600);

// 5. Interactive Prologue & Story Canvas Engine (伏魔山冰封饕餮)
const canvas = document.getElementById('gameCanvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let animFrameId = null;

const battleState = {
  stage: 'fumo_shan',
  chenHp: 320,
  chenMaxHp: 320,
  chenMp: 140,
  chenMaxMp: 140,
  taotieHp: 1850,
  taotieMaxHp: 2200,
  turn: 'player',
  logText: '隋大业十二年，伏魔山顶阴云笼罩。陈辅师徒深入石洞寻找昆仑镜，上古凶兽「饕餮」破冰而出！'
};

function startCanvasLoop() {
  if (!canvas) return;
  cancelAnimationFrame(animFrameId);
  
  function render() {
    drawScene();
    animFrameId = requestAnimationFrame(render);
  }
  render();
}

let tick = 0;
function drawScene() {
  if (!ctx) return;
  tick++;
  
  const w = canvas.width;
  const h = canvas.height;
  
  // Background gradient: misty ink mountains
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#10151f');
  grad.addColorStop(0.4, '#1b2333');
  grad.addColorStop(0.8, '#2a354b');
  grad.addColorStop(1, '#1e2636');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  
  // Distant peaks
  ctx.fillStyle = 'rgba(15, 20, 30, 0.7)';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.7);
  ctx.lineTo(w * 0.25, h * 0.35);
  ctx.lineTo(w * 0.5, h * 0.65);
  ctx.lineTo(w * 0.75, h * 0.4);
  ctx.lineTo(w, h * 0.75);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
  
  // Mist particles
  ctx.fillStyle = 'rgba(200, 220, 240, 0.08)';
  for (let i = 0; i < 6; i++) {
    const x = ((tick * (0.4 + i * 0.1) + i * 140) % (w + 200)) - 100;
    const y = h * 0.45 + Math.sin(tick * 0.02 + i) * 20;
    ctx.beginPath();
    ctx.arc(x, y, 70 + i * 15, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Foreground Cave Ground
  ctx.fillStyle = '#141820';
  ctx.fillRect(0, h * 0.72, w, h * 0.28);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  ctx.lineTo(w, h * 0.72);
  ctx.stroke();
  
  // Draw TaoTie (饕餮) Boss on the Right
  const taotieX = w * 0.75;
  const taotieY = h * 0.65 + Math.sin(tick * 0.05) * 5;
  
  ctx.fillStyle = 'rgba(180, 40, 30, 0.85)';
  ctx.beginPath();
  ctx.arc(taotieX, taotieY - 40, 60, 0, Math.PI * 2);
  ctx.fill();
  
  // TaoTie Horns & Glow
  ctx.strokeStyle = '#ff9988';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(taotieX - 30, taotieY - 80);
  ctx.lineTo(taotieX - 55, taotieY - 120);
  ctx.moveTo(taotieX + 30, taotieY - 80);
  ctx.lineTo(taotieX + 55, taotieY - 120);
  ctx.stroke();
  
  // TaoTie glowing eyes
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.arc(taotieX - 20, taotieY - 45, 8, 0, Math.PI * 2);
  ctx.arc(taotieX + 20, taotieY - 45, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // TaoTie Name & HP Bar
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px serif';
  ctx.textAlign = 'center';
  ctx.fillText('上古凶兽 · 饕餮', taotieX, taotieY - 130);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(taotieX - 70, taotieY - 120, 140, 8);
  ctx.fillStyle = '#e53935';
  ctx.fillRect(taotieX - 70, taotieY - 120, 140 * (battleState.taotieHp / battleState.taotieMaxHp), 8);
  
  // Draw Protagonists on the Left
  // Chen Jingchou (陈靖仇)
  const chenX = w * 0.22;
  const chenY = h * 0.68 + Math.sin(tick * 0.04) * 3;
  
  ctx.fillStyle = '#3498db';
  ctx.beginPath();
  ctx.arc(chenX, chenY - 30, 24, 0, Math.PI * 2);
  ctx.fill();
  
  // Sword
  ctx.strokeStyle = '#e2c044';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(chenX + 15, chenY - 20);
  ctx.lineTo(chenX + 45, chenY - 50);
  ctx.stroke();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px serif';
  ctx.textAlign = 'center';
  ctx.fillText('陈靖仇 (Lv.12)', chenX, chenY - 60);
  
  // Master Chen Fu (陈辅)
  const fuX = w * 0.36;
  const fuY = h * 0.66;
  ctx.fillStyle = '#9b59b6';
  ctx.beginPath();
  ctx.arc(fuX, fuY - 36, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText('师尊 · 陈辅', fuX, fuY - 72);
  
  // Ice seal aura on Chen Fu if active
  if (battleState.stage === 'sealed') {
    ctx.strokeStyle = 'rgba(100, 220, 255, 0.8)';
    ctx.lineWidth = 4;
    ctx.strokeRect(fuX - 45, fuY - 90, 90, 100);
    ctx.strokeRect(taotieX - 75, taotieY - 140, 150, 160);
  }
}

function handleCombatAction(actionType) {
  const dialogEl = document.getElementById('storyDialogText');
  const speakerEl = document.getElementById('storySpeaker');
  
  if (actionType === 'attack') {
    const dmg = 85 + Math.floor(Math.random() * 30);
    battleState.taotieHp = Math.max(0, battleState.taotieHp - dmg);
    speakerEl.innerText = '陈靖仇';
    dialogEl.innerText = `靖仇拔剑疾刺！施展【长剑平刺】，对饕餮造成了 ${dmg} 点伤害！`;
    showNotification(`⚔️ 命中饕餮！造成 ${dmg} 点物理伤害`);
  } else if (actionType === 'magic_ice') {
    if (battleState.chenMp < 25) {
      showNotification('⚠️ 灵力不足，无法施展冰石乱坠！');
      return;
    }
    battleState.chenMp -= 25;
    const dmg = 190 + Math.floor(Math.random() * 45);
    battleState.taotieHp = Math.max(0, battleState.taotieHp - dmg);
    speakerEl.innerText = '陈靖仇';
    dialogEl.innerText = `靖仇手掐剑诀：【冰石乱坠】！无数尖锐冰柱从洞窟顶端呼啸砸下，对饕餮造成 ${dmg} 点水系玄冰暴击！`;
    showNotification(`❄️ 奇术发动！冰石乱坠造成 ${dmg} 点暴击`);
  } else if (actionType === 'master_seal') {
    battleState.stage = 'sealed';
    speakerEl.innerText = '师尊 · 陈辅';
    dialogEl.innerText = `「靖仇快走！饕餮乃上古凶兽，非凡人之力可破！为师将以毕生元神施展【饕餮封印术】，与此獠永封于玄冰之中！你速速下山寻访【雷夏泽公山先生】，求取破冰救师之法！」`;
    showNotification('❄️ 绝技发动！陈辅舍身冰封饕餮！');
  }
  
  updatePartyStatusHUD();
}

function resetStoryBattle() {
  battleState.stage = 'fumo_shan';
  battleState.chenHp = 320;
  battleState.chenMp = 140;
  battleState.taotieHp = 1850;
  document.getElementById('storySpeaker').innerText = '叙白';
  document.getElementById('storyDialogText').innerText = '隋大业十二年，伏魔山顶阴云笼罩。陈辅师徒深入石洞寻找昆仑镜，上古凶兽「饕餮」破冰而出！';
  updatePartyStatusHUD();
}

function updatePartyStatusHUD() {
  const hpEl = document.getElementById('chenHpVal');
  const mpEl = document.getElementById('chenMpVal');
  if (hpEl) hpEl.innerText = `${battleState.chenHp} / ${battleState.chenMaxHp}`;
  if (mpEl) mpEl.innerText = `${battleState.chenMp} / ${battleState.chenMaxMp}`;
}

// 6. 存档管理器 (.cm Save Inspector)
const SAVE_SLOTS = [
  { slot: 0, title: '存档 1 · 伏魔山洞窟', hero: '陈靖仇', level: 12, hp: '320/320', gold: 1250, map: '伏魔山·玄冰石室', time: '2026-10-15 01:00' },
  { slot: 1, title: '存档 2 · 月河村救小雪', hero: '陈靖仇 / 于小雪', level: 18, hp: '540/540', gold: 3840, map: '月河村·客栈客房', time: '2026-10-14 22:30' },
  { slot: 2, title: '存档 3 · 黑山镇逢玉儿', hero: '陈靖仇 / 于小雪 / 拓跋玉儿', level: 24, hp: '820/820', gold: 8900, map: '黑山镇·拓跋营帐', time: '2026-10-14 18:20' },
  { slot: 3, title: '存档 4 · 仙山岛天外仙境', hero: '陈靖仇 / 于小雪 / 拓跋玉儿', level: 38, hp: '1680/1680', gold: 24500, map: '仙山岛·对弈亭', time: '2026-10-13 15:40' },
  { slot: 4, title: '存档 5 · 自动存档 (Auto 5)', hero: '陈靖仇 / 于小雪 / 拓跋玉儿', level: 39, hp: '1720/1720', gold: 26300, map: '大梁城·天下第一镖局', time: '2026-10-15 00:55' }
];

function initSaveManager() {
  const grid = document.getElementById('saveSlotsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  SAVE_SLOTS.forEach(save => {
    const card = document.createElement('div');
    card.className = `save-slot-card ${save.slot === 0 ? 'active' : ''}`;
    card.innerHTML = `
      <div class="slot-num">
        <span>${save.title}</span>
        <span style="font-size:12px;color:var(--text-gold);">.cm</span>
      </div>
      <div class="slot-details">
        <div><strong>队伍：</strong>${save.hero} (Lv.${save.level})</div>
        <div><strong>所在：</strong>${save.map}</div>
        <div><strong>银两：</strong>${save.gold} 两</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">时间：${save.time}</div>
      </div>
    `;
    card.onclick = () => {
      document.querySelectorAll('.save-slot-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      showNotification(`💾 已载入【${save.title}】`);
    };
    grid.appendChild(card);
  });
}

// Global Init
window.addEventListener('DOMContentLoaded', () => {
  initJukebox();
  initGhostSystem();
  initSaveManager();
  startCanvasLoop();
  console.log('轩辕剑叁外传：天之痕 Web Edition Loaded successfully.');
});
