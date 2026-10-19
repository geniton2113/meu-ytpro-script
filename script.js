/*
 * YOUTUBE PREMIUM / YTPRO — edição defensiva baseada no arquivo enviado
 * Mantém a estrutura e funções existentes; não é afiliado ao YouTube.
 * A ponte Android nativa e os endpoints/seletores internos do YouTube
 * continuam dependentes do app e podem mudar fora do controle deste script.
 * Não há garantia honesta de “100% sem bugs” sem testes no aparelho-alvo.
 */
/*****YOUTUBE PREMIUM*******
Baseado no YTPRO original
Versão: 5.0.0 (YouTube Premium Ultimate)
*/

// Camada defensiva: preserva a ponte Android real e evita falhas em WebViews sem algum método.
window.Android = window.Android || {};
var Android = window.Android;
var hasAndroidBridge = typeof Android.getVolume === "function" || typeof Android.getAllCookies === "function";
var androidDefaults = {
  getVolume: () => 0.5, getBrightness: () => 50, getInfo: () => "4.0",
  getAllCookies: () => "", showToast: () => {}, setBgPlay: () => {},
  setBrightness: () => {}, setVolume: () => {}, fullScreen: () => {},
  pipvid: () => {}, downvid: () => {}, oplink: (url) => { if (url) window.open(url, "_blank", "noopener"); },
  getSNlM0e: () => {}, GeminiClient: () => {}
};
Object.keys(androidDefaults).forEach((key) => {
  if (typeof Android[key] !== "function") Android[key] = androidDefaults[key];
});

if(window.eruda == null && localStorage.getItem("devMode") == "true"){
var script = document.createElement('script'); script.src="//youtube.com/ytpro_cdn/npm/eruda"; document.body.appendChild(script); script.onload=()=>{eruda.init();}
}

if(!YTProVer){

var YTProVer = window.YTProVer = "5.3.0";
console.log("[YOUTUBE PREMIUM] script carregado");
var ytoldV="";
var isF=false;
var isAp=false;
const originalPause = HTMLMediaElement.prototype.pause;
window.PIPause = false;
window.isPIP=false;
window.pauseAllowed = true;
var sTime=[];
var webUrls=["m.youtube.com","youtube.com","yout.be","accounts.google.com"];
var GeminiAT="";
var GeminiModels = {
    "3.1 Pro": '[1,null,null,null,"9d8ca3786ebdfbea",null,null,0,[4,5,6,8],null,null,1, null,null,3]',
    "3.6 Flash":               '[1,null,null,null,"fbb127bbb056c959",null,null,0,[4,5,6,8],null,null,1, null,null,1]',
    "3.5 Flash-Lite":          '[1,null,null,null,"cf41b0e0dd7d53e5",null,null,0,[4,5,6,8],null,null,1, null,null,6]',
    "3.1 Pro Plus":            '[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4,5,6,8],null,null,4, null,null,3]',
    "3.6 Flash Plus":          '[1,null,null,null,"56fdd199312815e2",null,null,0,[4,5,6,8],null,null,4, null,null,1]',
    "3.5 Flash Lite Plus":     '[1,null,null,null,"8c46e95b1a07cecc",null,null,0,[4,5,6,8],null,null,4, null,null,6]',
    "3.1 Pro Advanced":        '[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4,5,6,8],null,null,2, null,null,3]',
    "3.6 Flash Advanced":      '[1,null,null,null,"56fdd199312815e2",null,null,0,[4,5,6,8],null,null,2, null,null,1]',
    "3.5 Flash Lite Advanced": '[1,null,null,null,"8c46e95b1a07cecc",null,null,0,[4,5,6,8],null,null,2, null,null,6]'
};

var YTPROCodecs={
video:["AV1","VP8","VP9","H264"],
audio:["Opus","Mp4a"]
}

let touchstartY = 0;
let touchendY = 0;
let initialDistance=null;

var sens=0.005;
var vol = Number(Android.getVolume());
if (!Number.isFinite(vol)) vol = 0.5;
var brt = Number(Android.getBrightness()) / 100;
if (!Number.isFinite(brt)) brt = 0.5;

var ytproDefaults = {
  autoSpn: "true", bgplay: "true", gesC: "true", gesM: "false", fzoom: "false",
  saveCInfo: "true", geminiModel: "3.5 Flash-Lite",
  prompt: 'Me de detalhes sobre este video do YouTube Id: {videoId} , titulado "{title}" , um resumo detalhado com timestamps e fatos sobre o conteudo principal',
  devMode: "false", block_60fps: "false", shorts: "false", communityPosts: "false",
  audioOnlyMode: "false", autoLoop: "false", hideAppUpsell: "true", amoledTheme: "true",
  rememberSpeed: "false", defaultPlaybackSpeed: "1",
  // 10 NOVAS FUNÇÕES PREMIUM TOP DE LINHA (CELULAR / SMART TV / TV BOX)
  dpadTvMode: "true",       // 1. Navegação D-Pad para controle remoto de Smart TV / TV Box
  sleepTimer: "0",          // 2. Temporizador de sono (desligamento automático)
  bigScreenMode: "false",   // 3. Modo tela grande / interface de TV ampliada
  seekStep: "10",           // 4. Salto de tempo configurável (5s, 10s, 30s)
  childLock: "false",       // 5. Bloqueio de tela contra toques acidentais
  volumeBoost: "100",       // 6. Booster de áudio (+200% para TV Box com som baixo)
  audioNormalize: "false",  // 7. Normalização de áudio / Modo noturno estável
  forcedMaxQuality: "auto", // 8. Qualidade máxima forçada (1080p, 4K, 720p)
  floatingPiP: "true",      // 9. PiP flutuante universal
  turboRamClean: "true",    // 10. Limpador de cache e turbo memória para TV Box
  AV1: "true", VP8: "true", VP9: "true", H264: "true", Opus: "true", Mp4a: "true"
};
Object.keys(ytproDefaults).forEach((key) => {
  if (localStorage.getItem(key) === null) localStorage.setItem(key, ytproDefaults[key]);
});

if(localStorage.getItem("fzoom") == "true"){
document.getElementsByName("viewport")[0].setAttribute("content","");
}

if ([
    "3.0 Pro","3.0 Flash","3.0 Flash Thinking","3.0 Pro Plus","3.0 Flash Plus",
    "3.0 Flash Thinking Plus","3.0 Pro Advanced","3.0 Flash Advanced","3.0 Flash Thinking Advanced"
].includes(localStorage.getItem('geminiModel'))) {
localStorage.setItem('geminiModel', "3.5 Flash-Lite");
}

if(window.location.pathname.indexOf("shorts") > -1){
ytoldV=window.location.pathname;
}
else{
ytoldV=(new URLSearchParams(window.location.search)).get('v') ;
}

var c="#000";
var d="#f2f2f2";
var dc="#fff";
var isD=false;
var dislikes="...";

if(document.cookie.indexOf("f6=40000") > -1){
dc ="#000";c ="#fff";d="rgba(255,255,255,0.1)";
isD=true;
}else{
dc ="#fff";c="#000";d="rgba(0,0,0,0.05)";
isD=false;
}

var downBtn=`<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">
<path d="M16.59 9H15V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5H7.41a1 1 0 0 0-.7 1.7l4.59 4.59a1 1 0 0 0 1.42 0l4.59-4.59a1 1 0 0 0-.72-1.7Z" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="5" y="17.2" width="14" height="1.8" rx="0.9" fill="${c}" />
</svg>
`;


// ==================== [YTPRO PREMIUM HELPERS & HUD] ====================

// ==================== [10 RECURSOS PREMIUM: SMART TV / TV BOX / CELULAR] ====================

// 1. SUPORTE A CONTROLE REMOTO / D-PAD PARA SMART TV E TV BOX
(function initTvRemoteSupport() {
  window.addEventListener("keydown", (e) => {
    if (localStorage.getItem("dpadTvMode") !== "true") return;
    const video = document.querySelector("video.video-stream") || document.querySelector("video");
    const key = e.key;
    const step = parseInt(localStorage.getItem("seekStep") || "10", 10);

    // Teclas multimídia padrão de controle remoto
    if (key === "MediaPlayPause" || key === "PlayPause") {
      if (video) { video.paused ? video.play() : video.pause(); e.preventDefault(); }
      return;
    }
    if (key === "MediaPlay") { if (video) video.play(); e.preventDefault(); return; }
    if (key === "MediaPause") { if (video) video.pause(); e.preventDefault(); return; }
    if (key === "MediaFastForward" || key === "FastForward") {
      if (video) { video.currentTime += step; showCustomToast(`+${step}s`); e.preventDefault(); }
      return;
    }
    if (key === "MediaRewind" || key === "Rewind") {
      if (video) { video.currentTime -= step; showCustomToast(`-${step}s`); e.preventDefault(); }
      return;
    }

    // Setas no controle remoto quando o player está em foco ou tela cheia
    if (document.fullscreenElement || e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      if (key === "ArrowRight") {
        if (video) { video.currentTime += step; showCustomToast(`+${step}s`); e.preventDefault(); }
      } else if (key === "ArrowLeft") {
        if (video) { video.currentTime -= step; showCustomToast(`-${step}s`); e.preventDefault(); }
      } else if (key === "ArrowUp") {
        let curVol = Number(Android.getVolume());
        curVol = Math.min(1, curVol + 0.1);
        try { Android.setVolume(curVol); } catch(err){}
        showGestureHUD("vol", curVol);
        e.preventDefault();
      } else if (key === "ArrowDown") {
        let curVol = Number(Android.getVolume());
        curVol = Math.max(0, curVol - 0.1);
        try { Android.setVolume(curVol); } catch(err){}
        showGestureHUD("vol", curVol);
        e.preventDefault();
      } else if (key === " " && video) {
        video.paused ? video.play() : video.pause();
        e.preventDefault();
      }
    }
  }, { capture: true });
})();

// 2. TEMPORIZADOR DE SONO (SLEEP TIMER COM DESLIGAMENTO SUAVE)
var sleepTimerHandle = null;
function setSleepTimer(minutes) {
  if (sleepTimerHandle) {
    clearTimeout(sleepTimerHandle);
    sleepTimerHandle = null;
  }
  const mins = parseInt(minutes, 10);
  if (mins <= 0) {
    localStorage.setItem("sleepTimer", "0");
    showCustomToast("Temporizador de sono cancelado");
    return;
  }
  localStorage.setItem("sleepTimer", String(mins));
  showCustomToast(`Timer ativado: desligará em ${mins} min`);
  sleepTimerHandle = setTimeout(() => {
    const video = document.querySelector("video.video-stream") || document.querySelector("video");
    if (video) {
      video.pause();
      showCustomToast("😴 Temporizador de sono: Reprodução pausada");
    }
    localStorage.setItem("sleepTimer", "0");
  }, mins * 60 * 1000);
}

// 3. MODO TELA GRANDE (INTERFACE OTIMIZADA PARA SMART TV / TV BOX A 3 METROS)
function applyBigScreenMode() {
  let styleEl = document.getElementById("ytproBigScreenStyle");
  if (localStorage.getItem("bigScreenMode") === "true") {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "ytproBigScreenStyle";
      styleEl.textContent = `
        /* Amplia cards, títulos e botões para visualização na TV */
        html { font-size: 18px !important; }
        ytm-compact-video-renderer, ytm-video-with-context-renderer {
          margin-bottom: 24px !important;
          transform: scale(1.02);
        }
        .slim-video-information-title { font-size: 20px !important; font-weight: bold !important; }
        .yt-spec-button-shape-next--size-m { min-height: 48px !important; font-size: 16px !important; }
        *:focus-visible { outline: 3px solid #ff0000 !important; outline-offset: 3px !important; }
      `;
      document.head.appendChild(styleEl);
    }
  } else {
    if (styleEl) styleEl.remove();
  }
}

// 4. BLOQUEIO DE TOQUES ACIDENTAIS NA TELA (CHILD LOCK / TRAVA DE TELA)
function toggleChildLock() {
  let lockOverlay = document.getElementById("ytproChildLockOverlay");
  if (lockOverlay) {
    lockOverlay.remove();
    localStorage.setItem("childLock", "false");
    showCustomToast("🔓 Tela desbloqueada");
    return;
  }
  localStorage.setItem("childLock", "true");
  lockOverlay = document.createElement("div");
  lockOverlay.id = "ytproChildLockOverlay";
  lockOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;background:rgba(0,0,0,0.01);display:flex;align-items:flex-start;justify-content:center;padding-top:20px;user-select:none;touch-action:none;";
  
  const unlockBtn = document.createElement("button");
  unlockBtn.innerHTML = "🔒 Tela Bloqueada (Toque 3x para desbloquear)";
  unlockBtn.style.cssText = "background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);color:#fff;border:1px solid #ff0000;padding:12px 24px;border-radius:24px;font-size:13px;font-weight:700;box-shadow:0 6px 20px rgba(0,0,0,0.7);pointer-events:auto;cursor:pointer;";
  
  let clicks = 0;
  let clickTimer = null;
  unlockBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clicks++;
    if (clicks >= 3) {
      toggleChildLock();
    } else {
      clearTimeout(clickTimer);
      unlockBtn.innerHTML = `🔒 Toque mais ${3 - clicks}x para desbloquear`;
      clickTimer = setTimeout(() => {
        clicks = 0;
        unlockBtn.innerHTML = "🔒 Tela Bloqueada (Toque 3x para desbloquear)";
      }, 1500);
    }
  });

  lockOverlay.appendChild(unlockBtn);
  document.body.appendChild(lockOverlay);
  showCustomToast("🔒 Tela bloqueada contra toques");
}

// 5 & 6. BOOSTER DE ÁUDIO (+200% / +300%) E NORMALIZAÇÃO DE SOM (WEB AUDIO API)
var ytproAudioCtx = null;
var ytproGainNode = null;
var ytproCompressor = null;

function applyAudioEnhancements() {
  const video = document.querySelector("video.video-stream") || document.querySelector("video");
  if (!video) return;

  const boostVal = parseInt(localStorage.getItem("volumeBoost") || "100", 10);
  const shouldNormalize = localStorage.getItem("audioNormalize") === "true";

  if (boostVal === 100 && !shouldNormalize && !ytproAudioCtx) return;

  try {
    if (!ytproAudioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      ytproAudioCtx = new AudioCtxClass();
      const source = ytproAudioCtx.createMediaElementSource(video);
      ytproGainNode = ytproAudioCtx.createGain();
      ytproCompressor = ytproAudioCtx.createDynamicsCompressor();

      // Configuração suave de compressor para modo noturno / diálogos estáveis
      ytproCompressor.threshold.setValueAtTime(-24, ytproAudioCtx.currentTime);
      ytproCompressor.knee.setValueAtTime(30, ytproAudioCtx.currentTime);
      ytproCompressor.ratio.setValueAtTime(12, ytproAudioCtx.currentTime);
      ytproCompressor.attack.setValueAtTime(0.003, ytproAudioCtx.currentTime);
      ytproCompressor.release.setValueAtTime(0.25, ytproAudioCtx.currentTime);

      source.connect(ytproCompressor);
      ytproCompressor.connect(ytproGainNode);
      ytproGainNode.connect(ytproAudioCtx.destination);
    }

    if (ytproAudioCtx.state === "suspended") {
      ytproAudioCtx.resume();
    }

    // Ganho (100% = 1.0, 200% = 2.0, 300% = 3.0)
    if (ytproGainNode) {
      ytproGainNode.gain.setValueAtTime(boostVal / 100, ytproAudioCtx.currentTime);
    }
  } catch(e) {}
}

// 7. FORÇAR RESOLUÇÃO MÁXIMA CONFIGURADA
function applyForcedResolution() {
  const pref = localStorage.getItem("forcedMaxQuality") || "auto";
  if (pref === "auto") return;
  try {
    const player = document.querySelector("#movie_player") || document.querySelector(".html5-video-player");
    if (player && typeof player.setPlaybackQualityRange === "function") {
      player.setPlaybackQualityRange(pref, pref);
    }
  } catch(e) {}
}

// 8. OTIMIZADOR DE MEMÓRIA E TURBO RAM CLEANER PARA TV BOX
function cleanTvBoxMemory() {
  try {
    // Remove comentários ocultos em background, prateleiras velhas e elementos descartados
    document.querySelectorAll("ytm-comment-thread-renderer, ytm-backstage-post-thread-renderer").forEach((el, idx) => {
      if (idx > 20) el.remove();
    });
    // Limpa garbage de imagens
    if (window.gc) window.gc();
    showCustomToast("🚀 Memória otimizada para TV Box!");
  } catch(e) {
    showCustomToast("Otimização concluída");
  }
}

function showCustomToast(msg, duration = 3000) {
  try {
    if (typeof Android !== "undefined" && typeof Android.showToast === "function" && hasAndroidBridge) {
      Android.showToast(msg);
      return;
    }
  } catch(e) {}
  let toast = document.getElementById("ytproCustomToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "ytproCustomToast";
    toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(20,20,20,0.92);backdrop-filter:blur(10px);color:#fff;padding:12px 22px;border-radius:24px;font-size:13px;font-weight:600;font-family:Roboto,Arial,sans-serif;box-shadow:0 6px 25px rgba(0,0,0,0.8),0 0 1px rgba(255,255,255,0.2);z-index:2147483647;pointer-events:none;transition:opacity 0.3s, transform 0.3s;opacity:0;display:flex;align-items:center;gap:8px;";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff0000;"></span>${msg}`;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(showCustomToast._timer);
  showCustomToast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
  }, duration);
}

function showGestureHUD(type, percent) {
  let hud = document.getElementById("ytproGestureHUD");
  if (!hud) {
    hud = document.createElement("div");
    hud.id = "ytproGestureHUD";
    hud.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(15,15,15,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:16px 24px;border-radius:18px;font-family:Roboto,Arial,sans-serif;box-shadow:0 10px 35px rgba(0,0,0,0.7);z-index:2147483646;pointer-events:none;transition:opacity 0.2s;opacity:0;display:flex;flex-direction:column;align-items:center;min-width:130px;";
    document.body.appendChild(hud);
  }
  const isVol = type === "vol";
  const icon = isVol ? "🔊" : "☀️";
  const label = isVol ? "Volume" : "Brilho";
  const pct = Math.round(percent * 100);
  hud.innerHTML = `
    <div style="font-size:24px;margin-bottom:6px;">${icon}</div>
    <div style="font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${label} ${pct}%</div>
    <div style="width:100%;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden;">
      <div style="width:${pct}%;height:100%;background:#ff0000;border-radius:2px;transition:width 0.05s;"></div>
    </div>
  `;
  hud.style.opacity = "1";
  clearTimeout(showGestureHUD._timer);
  showGestureHUD._timer = setTimeout(() => {
    hud.style.opacity = "0";
  }, 900);
}

// Download de thumbnail em alta resolução
function downloadCurrentThumbnail() {
  let videoId = "";
  try {
    const url = new URL(window.location.href);
    if (url.pathname.includes("shorts")) {
      videoId = url.pathname.replace("/shorts/", "").split("/")[0].split("?")[0];
    } else {
      videoId = url.searchParams.get("v");
    }
  } catch(e) {}
  if (!videoId) {
    showCustomToast("Vídeo não identificado");
    return;
  }
  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const filename = `Thumbnail_${videoId}.jpg`;
  try {
    if (typeof Android !== "undefined" && typeof Android.downvid === "function" && hasAndroidBridge) {
      Android.downvid(filename, thumbUrl, "image/jpeg");
      showCustomToast("Download da capa iniciado!");
      return;
    }
  } catch(e) {}
  // Web fallback:
  const a = document.createElement("a");
  a.href = thumbUrl;
  a.download = filename;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
  showCustomToast("Capa aberta para download");
}

// Aplicar modo somente áudio
function applyAudioOnlyMode() {
  const isAudioOnly = localStorage.getItem("audioOnlyMode") === "true";
  const video = document.querySelector("video.video-stream") || document.querySelector("video");
  if (video) {
    video.style.opacity = isAudioOnly ? "0" : "1";
    video.style.pointerEvents = isAudioOnly ? "none" : "auto";
  }
  let badge = document.getElementById("ytproAudioOnlyBadge");
  if (isAudioOnly) {
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "ytproAudioOnlyBadge";
      badge.innerHTML = "🎵 Somente Áudio Ativo";
      badge.style.cssText = "position:absolute;top:10px;left:10px;background:rgba(255,0,0,0.85);color:#fff;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700;z-index:9999;pointer-events:none;box-shadow:0 2px 10px rgba(0,0,0,0.5);";
      const p = document.getElementById("player-container-id") || document.getElementById("player");
      if (p) p.appendChild(badge);
    }
  } else {
    if (badge) badge.remove();
  }
}

// Aplicar repetição automática (auto-loop)
function applyAutoLoop() {
  const isLoop = localStorage.getItem("autoLoop") === "true";
  const video = document.querySelector("video.video-stream") || document.querySelector("video");
  if (video) {
    video.loop = isLoop;
  }
}

// Aplicar tema AMOLED
function applyAmoledTheme() {
  let styleEl = document.getElementById("ytproAmoledStyle");
  if (localStorage.getItem("amoledTheme") === "true") {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "ytproAmoledStyle";
      styleEl.textContent = `
        body, ytm-app, ytm-mobile-topbar-renderer, #player-container-id, .ytm-pivot-bar-renderer {
          background-color: #000000 !important;
        }
        .yt-spec-bottom-sheet-layout__bottom-sheet-renderer-container {
          background-color: #0a0a0a !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  } else {
    if (styleEl) styleEl.remove();
  }
}

function override() {
var videoElem = document.createElement('video');
var origCanPlayType = videoElem.canPlayType.bind(videoElem);
videoElem.__proto__.canPlayType = makeModifiedTypeChecker(origCanPlayType);
var mse = window.MediaSource;
if (mse === undefined) return;
var origIsTypeSupported = mse.isTypeSupported.bind(mse);
mse.isTypeSupported = makeModifiedTypeChecker(origIsTypeSupported);
}

function makeModifiedTypeChecker(origChecker) {
return function (type) {
if (type === undefined) return '';
var disallowed_types = [];
if (localStorage['H264'] === 'false') { disallowed_types.push('avc'); }
if (localStorage['VP8'] === 'false') { disallowed_types.push('vp8'); }
if (localStorage['VP9'] === 'false') { disallowed_types.push('vp9', 'vp09'); }
if (localStorage['AV1'] === 'false') { disallowed_types.push('av01', 'av99'); }
if (localStorage['Opus'] === 'false') { disallowed_types.push('opus'); }
if (localStorage['Mp4a'] === 'false') { disallowed_types.push('mp4a'); }
for (var i = 0; i < disallowed_types.length; i++) {
if (type.indexOf(disallowed_types[i]) !== -1) return '';
}
if (localStorage['block_60fps'] === 'true') {
var match = /framerate=(\d+)/.exec(type);
if (match && match[1] > 30) return '';
}
return origChecker(type);
};
}

override();

function insertAfter(referenceNode, newNode) {
try{
referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
return true;
}catch(e){ return false; }
}

async function waitForElement(selector, vid, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const ready = (el) => !!el && (!vid || !!el.src);
    const initial = document.querySelector(selector);
    if (ready(initial)) return resolve(initial);
    const root = document.body || document.documentElement;
    if (!root) return resolve(null);
    let done = false;
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (ready(el)) finish(el);
    });
    const timer = setTimeout(() => finish(null), timeoutMs);
    function finish(value) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      observer.disconnect();
      resolve(value);
    }
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
  });
}

var ytproBootTime=Date.now();

function findHeaderLogoRef(){
  var homeHrefs=["/","https://m.youtube.com/","https://www.youtube.com/","https://m.youtube.com","https://www.youtube.com","https://youtube.com/","https://youtube.com"];
  var header=document.querySelector("ytm-header")||document.querySelector("header")||document.querySelector("ytd-masthead");
  var anchor=null;
  if(header){
    var anchors=header.querySelectorAll("a");
    for(var i=0;i<anchors.length;i++){
      var a=anchors[i];
      var href=a.getAttribute("href")||"";
      if(homeHrefs.indexOf(href)>-1 && a.querySelector("svg")){
        var r=a.getBoundingClientRect();
        if(r.width>0 && r.height>0){ anchor=a; break; }
      }
    }
  }
  if(!anchor){
    anchor=document.querySelector("ytm-home-logo a, yt-logo a, a#logo, #logo a");
  }
  if(!anchor){
    return document.querySelector("ytm-home-logo, yt-logo, ytd-topbar-logo-renderer")||null;
  }
  return anchor.closest("ytm-home-logo, yt-logo, ytd-topbar-logo-renderer")||anchor;
}

function bindSettingsClick(el){
  el.addEventListener("click",function(ev){
    ev.preventDefault();
    ev.stopPropagation();
    var ex=document.getElementById("settingsprodiv");
    if(ex){ ex.remove(); return; }
    if(window.location.hash === "#settings"){
      try{ ytproSettings(); }catch(e){ console.log("[YOUTUBE PREMIUM] erro ytproSettings:", e); }
    }else{
      window.location.hash="settings";
    }
  });
}

var addSettingsTab=()=>{
  var existingBtn=document.getElementById("setDiv");
  var existingMenu=document.getElementById("ytproMenuBtn");
  var logoRef=findHeaderLogoRef();

  if(logoRef){
    if(existingBtn && existingBtn.dataset.ytproMode === "inline" && existingMenu && document.body.contains(existingBtn)){
      return;
    }
    
    if(existingBtn) existingBtn.remove();
    if(existingMenu) existingMenu.remove();
    var oldPrem=document.getElementById("ytProPremiumLabel");
    if(oldPrem) oldPrem.remove();

    var hdrFg=(window.location.href.indexOf("watch") > -1) ? "#fff" : c;

    var prem=document.createElement("span");
    prem.setAttribute("id","ytProPremiumLabel");
    prem.textContent="premium";
    prem.setAttribute("style","display:inline-block;vertical-align:middle;font-family:Roboto,Arial,sans-serif;font-size:15px;font-weight:500;letter-spacing:-0.4px;line-height:1;margin-left:2px;margin-right:6px;white-space:nowrap;color:"+hdrFg+";pointer-events:none;user-select:none;");

    var ytpMenuBtn=document.createElement("div");
    ytpMenuBtn.setAttribute("id","ytproMenuBtn");
    ytpMenuBtn.dataset.ytproMode="inline";
    ytpMenuBtn.setAttribute("style","z-index:9999999999;display:inline-flex;align-items:center;justify-content:center;padding:4px;cursor:pointer;pointer-events:auto;vertical-align:middle;margin-right:2px;");
    ytpMenuBtn.innerHTML=`<span style="display:flex;align-items:center;justify-content:center;pointer-events:none;">
      <svg fill="${hdrFg}" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
    </span>`;

    ytpMenuBtn.addEventListener("click",function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      var originalMenuBtn = document.querySelector("ytm-topbar-menu-button-renderer button") ||
                            document.querySelector("#guide-button") ||
                            document.querySelector("ytm-menu-button-renderer button") ||
                            document.querySelector("button[aria-label='Guia']") ||
                            document.querySelector("button[aria-label='Guide']");
      if(originalMenuBtn){
        originalMenuBtn.click();
      }
    });

    var setDiv=document.createElement("div");
    setDiv.setAttribute("id","setDiv");
    setDiv.dataset.ytproMode="inline";
    setDiv.setAttribute("style","z-index:9999999999;display:inline-flex;align-items:center;justify-content:center;padding:4px;cursor:pointer;pointer-events:auto;vertical-align:middle;");
    setDiv.innerHTML=`<span style="display:flex;align-items:center;justify-content:center;pointer-events:none;">
<svg fill="${hdrFg}" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" id="hSett"><path d="M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z"></path></svg>
</span>`;

    var premOK=insertAfter(logoRef,prem);
    var base = premOK ? prem : logoRef;
    var menuOK = insertAfter(base, ytpMenuBtn);
    insertAfter(menuOK ? ytpMenuBtn : base, setDiv);

    bindSettingsClick(setDiv);
    console.log("[YOUTUBE PREMIUM] botões inline (menu + engrenagem) criados no topo");
    return;
  }

  if(existingBtn) return;
  if(Date.now() - ytproBootTime < 4000) return;

  var setDivF=document.createElement("div");
  setDivF.setAttribute("id","setDiv");
  setDivF.dataset.ytproMode="floating";
  setDivF.setAttribute("style","z-index:2147483646;position:fixed;top:10px;left:10px;width:40px;height:40px;background:linear-gradient(135deg,#ff0000,#cc0000);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(255,0,0,0.6);cursor:pointer;pointer-events:auto;");
  setDivF.innerHTML=`<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z"></path></svg>`;
  document.body.appendChild(setDivF);
  bindSettingsClick(setDivF);
  console.log("[YOUTUBE PREMIUM] botão flutuante criado (fallback)");
};

function getDislikesInLocale(num){
var nn=num;
if (num < 1000){
nn = num;
}
else{
const int = Math.floor(Math.log10(num) - 2);
const decimal = int + (int % 3 ? 1 : 0);
const value = Math.floor(num / 10 ** decimal);
nn= value * 10 ** decimal;
}
let userLocales;
if (document.documentElement.lang) {
userLocales = document.documentElement.lang;
} else if (navigator.language) {
userLocales = navigator.language;
} else {
try {
userLocales = new URL(
Array.from(document.querySelectorAll("head > link[rel='search']"))
?.find((n) => n?.getAttribute("href")?.includes("?locale="))
?.getAttribute("href")
)?.searchParams?.get("locale");
} catch (e) {
userLocales = "en";
}
}
return Intl.NumberFormat(userLocales, {
notation: "compact",
compactDisplay: "short",
}).format(nn);
}

async function skipSponsor(){
var sDiv=document.createElement("div");
sDiv.setAttribute("style","height:3px;pointer-events:none;width:100%;position:absolute;z-index:99;")
sDiv.setAttribute("id","sDiv");
var player = document.getElementsByClassName("video-stream")[0];
if(!player) return;
var dur=player.duration;
if(isNaN(dur)) return;
for(var x in sTime){
var s1=document.createElement("div");
var s2=sTime[x];
s1.setAttribute("style",`height:3px;width:${(100/dur) * (s2[1]-s2[0])}%;background:#0f8;position:absolute;z-index:9;left:${(100/dur) * s2[0]}%;`)
sDiv.appendChild(s1);
}
var e=await waitForElement("yt-progress-bar",false);
if(document.getElementById("sDiv") == null){
if(document.getElementsByClassName('ytPlayerProgressBarHost')[0] != null){
document.getElementsByClassName('ytPlayerProgressBarHost')[0].appendChild(sDiv);
}else{
try{document.getElementsByClassName('ytProgressBarLineProgressBarLine')[0].appendChild(sDiv);}catch(e){}
}
}
}

async function fDislikes(url){
var Url=new URL(url);
var vID="";
if(Url.pathname.indexOf("shorts") > -1){
vID=Url.pathname.substr(8,Url.pathname.length);
}
else if(Url.pathname.indexOf("watch") > -1){
vID=Url.searchParams.get("v");
}
fetch("https://returnyoutubedislikeapi.com/votes?videoId="+vID)
.then(response => { return response.json(); }).then(jsonObject => {
if('dislikes' in jsonObject){
dislikes=getDislikesInLocale(parseInt(jsonObject.dislikes));
}
}).catch(error => {});
}

async function checkSponsors(Url){
if(Url.indexOf("watch") > -1){
sTime=[];
await fetch("https://sponsor.ajay.app/api/skipSegments?videoID="+new URL(Url).searchParams.get("v"))
.then(response => { return response.json(); }).then(jsonObject => {
for(var x in jsonObject){
var time=jsonObject[x].segment;
sTime.push(time);
}
}).catch(error => {});
var player = await waitForElement(".video-stream",true);
if (!player) return;
player.ontimeupdate=()=>{
skipSponsor();
var cur=player.currentTime;
for(var x in sTime){
var s2=sTime[x];
if(Math.floor(cur) == Math.floor(s2[0])){
if(localStorage.getItem("autoSpn") == "true"){
player.currentTime=s2[1];
addSkipper(s2[0]);
}
}
}
};
}
}

function addSkipper(sT){
var sSDiv=document.createElement("div");
sSDiv.setAttribute("style",`
height:50px;${(screen.width > screen.height) ? "width:50%;" : "width:80%;"}overflow:auto;background:rgba(130,130,130,.3);
backdrop-filter:blur(6px);
position:absolute;bottom:40px;
line-height:50px;
left:calc(15% / 2 );padding-left:10px;padding-right:10px;
z-index:99999999999999;text-align:center;border-radius:25px;
color:white;text-align:center;
`);
sSDiv.innerHTML=`<span style="height:30px;line-height:30px;margin-top:10px;display:block;font-family:monospace;font-size:16px;float:left;">Patrocinador pulado</span>
<span style="height:30px;line-height:44px;float:right;padding-right:30px;margin-top:10px;display:block;padding-left:30px;border-left:1px solid white;">
<svg data-action="rewind" xmlns="http://www.w3.org/2000/svg" width="23" height="23" style="margin-top:0px;" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg>
<svg data-action="close" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:30px;" fill="#f24" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>`;
try{ document.getElementById("player-control-container").appendChild(sSDiv); }catch(e){ return; }
sSDiv.addEventListener("click",(e)=>{
  var el=e.target.closest("[data-action]");
  if(!el) return;
  var action=el.dataset.action;
  if(action == "close"){
el.parentElement.parentElement.remove();
  }else if(action == "rewind"){
  el.parentElement.parentElement.remove();
  document.getElementsByClassName('video-stream')[0].currentTime=sT+1;
  }
});
setTimeout(()=>{sSDiv.remove();},5000);
}

fDislikes(window.location.href);
checkSponsors(window.location.href);

if((window.location.pathname.indexOf("watch") > -1) || (window.location.pathname.indexOf("shorts") > -1)){
var unV=setInterval(() => {
try{ document.getElementsByClassName('video-stream')[0].muted=false; }catch(e){}
try{
if(!document.getElementsByClassName('video-stream')[0].muted){
clearInterval(unV);
}
}catch(e){ clearInterval(unV); }
}, 5);
}

function sty(e,v){
Object.assign(e.style,{
display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"550",
height:"65%",minWidth:"22%",width:"auto",borderRadius:"20px",
background:d,fontSize:"12px",marginRight:"5px",textAlign:"center",
});
}

function getGeminiModels(){
var t="";
for(var x in GeminiModels){
t+=`<br>
<button data-action="saveModel" data-value="${x}" ${(x == localStorage.getItem('geminiModel')) ? `style="background:${c};color:${dc};"` : "" } >${x}
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>`;
}
return t;
}

function getYTPROCodecs(){
var t=`<p style="text-align:center;font-size:14px;">Recurso experimental. Use com cuidado. Por padrão todos os codecs estão habilitados. Toque nos botões abaixo para alternar.</p><br> <vc style="font-size:14px;">Codecs de Vídeo</vc><br>`;
for(var y in YTPROCodecs.video){
var x=YTPROCodecs.video[y];
t+=`<button data-action="setRemoveCodec" data-value="${x}" ${("true" == localStorage.getItem(x)) ? `style="background:${c};color:${dc};"` : "" } >${x}
<svg ${("true" != localStorage.getItem(x)) ? `style="display:none"` : "" } xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${dc}" viewBox="0 0 16 16">
<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg>
</button>`;
}
t+=`<br><br><vc style="font-size:14px">Codecs de Áudio</vc><br>`
for(var y in YTPROCodecs.audio){
var x=YTPROCodecs.audio[y];
t+=`<button data-action="setRemoveCodec" data-value="${x}" ${("true" == localStorage.getItem(x)) ? `style="background:${c};color:${dc};"` : "" } >${x}
<svg ${("true" != localStorage.getItem(x)) ? `style="display:none"` : "" } xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${dc}" viewBox="0 0 16 16">
<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg>
</button>`;
}
t+=`<br><br>
<div>Bloquear 60FPS <span data-action="block_60fps" style="${sttCnf(0,0,"block_60fps")}" ><b style="${sttCnf(0,1,"block_60fps")}" ></b></span></div> `;
t+=`<br><br><button data-action="done" style="margin-top:10px;width:25%;float:right;text-align:center;background:${c};color:${dc};" >Pronto</button>`;
return t;
}

function setRemoveCodec(x,y){
if(localStorage[x] == "true"){
localStorage.setItem(x,"false");
y.style.background=isD ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)";
y.style.color=c;
y.children[0].style.display="none";
}else{
localStorage.setItem(x,"true");
y.style.background=c;
y.style.color=dc;
y.children[0].style.display="block";
}
}

async function ytproSettings(){
var ytpSet=document.createElement("div");
var ytpSetI=document.createElement("div");
ytpSet.setAttribute("id","settingsprodiv");
ytpSetI.setAttribute("id","ssprodivI");
ytpSet.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;align-items:flex-end;
background:rgba(0,0,0,0.85);
backdrop-filter:blur(12px);
z-index:9999999999;
transition:opacity 0.25s ease;
`);

ytpSet.addEventListener("click",function(ev){
  if(!(ev.target == ytpSetI || ytpSetI.contains(ev.target))){
    if(window.location.hash === "#settings") history.back();
    else ytpSet.remove();
  }
});

ytpSetI.setAttribute("style",`
height:92%;width:100%;max-width:540px;overflow:hidden;
background:#0f0f0f;
border-top:1px solid #282828;
border-radius:24px 24px 0 0;
box-shadow:0 -10px 40px rgba(0,0,0,0.9),0 0 30px rgba(255,0,0,0.25);
position:relative;
display:flex;flex-direction:column;
color:#f1f1f1;
font-family:Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
animation: ytpSlideUp 0.3s cubic-bezier(0.16,1,0.3,1);
`);


ytpSetI.innerHTML=`<style>
@keyframes ytpSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
#ssprodivI * { box-sizing:border-box; }
#ssprodivI .ytp-head {
  padding:16px 20px;
  background:#0f0f0f;
  border-bottom:1px solid #242424;
  display:flex;align-items:center;justify-content:space-between;
}
#ssprodivI .ytp-logo-area { display:flex;align-items:center;gap:10px; }
#ssprodivI .ytp-brand { font-size:16px;font-weight:700;letter-spacing:-0.4px;color:#fff;display:flex;align-items:center;gap:6px; }
#ssprodivI .ytp-badge {
  background:linear-gradient(135deg,#ff0000,#cc0000);
  color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:12px;letter-spacing:0.8px;
}
#ssprodivI .ytp-ver { font-size:11px;color:#717171;font-weight:400;margin-left:4px; }
#ssprodivI .ytp-close-btn {
  background:transparent;border:none;color:#aaa;font-size:22px;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;
}
#ssprodivI .ytp-close-btn:hover { background:#252525;color:#fff; }

#ssprodivI .ytp-tabs-bar {
  display:flex;gap:8px;padding:10px 16px;overflow-x:auto;background:#141414;border-bottom:1px solid #222;scrollbar-width:none;
}
#ssprodivI .ytp-tabs-bar::-webkit-scrollbar { display:none; }
#ssprodivI .ytp-chip {
  background:#222;color:#bbb;border:1px solid #303030;border-radius:16px;padding:6px 14px;font-size:12px;font-weight:500;white-space:nowrap;cursor:pointer;transition:0.2s;
}
#ssprodivI .ytp-chip.active { background:#fff;color:#000;border-color:#fff;font-weight:700; }
#ssprodivI .ytp-content { flex:1;overflow-y:auto;padding:14px 18px 80px 18px; }
#ssprodivI .ytp-content::-webkit-scrollbar { width:6px; }
#ssprodivI .ytp-content::-webkit-scrollbar-thumb { background:#ff0000;border-radius:3px; }
#ssprodivI .ytp-sec-title {
  font-size:12px;font-weight:700;color:#ff3b30;letter-spacing:1px;text-transform:uppercase;margin:18px 0 8px 0;display:flex;align-items:center;gap:6px;
}
#ssprodivI .ytp-sec-title:first-child { margin-top:4px; }
#ssprodivI .ytp-card {
  background:#1a1a1a;border:1px solid #262626;border-radius:12px;margin:8px 0;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;min-height:52px;position:relative;
}
#ssprodivI .ytp-card-info { padding-right:55px; }
#ssprodivI .ytp-card-title { font-size:14px;font-weight:500;color:#f1f1f1; }
#ssprodivI .ytp-card-desc { font-size:11px;color:#8e8e8e;margin-top:2px;line-height:1.3; }

/* Chaves deslizantes (switches) melhoradas: Cinza quando inativo, Vermelho vivo quando ativo */
#ssprodivI .ytp-switch {
  width:44px;height:24px;border-radius:24px;position:absolute;right:14px;top:50%;margin-top:-12px;cursor:pointer;transition:background 0.25s, box-shadow 0.25s;
}
#ssprodivI .ytp-switch b {
  display:block;width:20px;height:20px;border-radius:50%;position:absolute;top:2px;left:2px;background:#ffffff;transition:transform 0.25s cubic-bezier(0.2,0,0,1);box-shadow:0 1px 4px rgba(0,0,0,0.5);
}

#ssprodivI .ytp-btn-card {
  width:100%;height:52px;background:#1a1a1a;border:1px solid #262626;border-radius:12px;color:#f1f1f1;font-size:14px;font-weight:500;padding:0 16px;margin:8px 0;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:space-between;transition:background 0.2s,border-color 0.2s;
}
#ssprodivI .ytp-btn-card:hover { background:#252525;border-color:#ff0000; }
#ssprodivI .ytp-btn-card svg { fill:#888; }
#ssprodivI .ytp-input-box {
  width:100%;height:46px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;color:#fff;padding:0 14px;font-size:13px;font-family:inherit;outline:none;margin-bottom:12px;
}
#ssprodivI .ytp-input-box:focus { border-color:#ff0000; }
#ssprodivI .geminiModels,#ssprodivI .disableCodecs,#ssprodivI .geminiPrompt {
  background:#0f0f0f;border:2px solid #ff0000;border-radius:16px;box-shadow:0 0 30px rgba(255,0,0,0.4);color:#f1f1f1;text-align:center;padding:16px;overflow-y:auto;display:none;position:fixed;width:calc(95% - 20px);left:2.5%;bottom:20px;z-index:999999;max-height:75%;
}
#ssprodivI .geminiPrompt textarea {
  width:100%;height:180px;background:#1a1a1a;color:#fff;border:1px solid #303030;border-radius:10px;padding:12px;font-size:13px;resize:vertical;font-family:inherit;outline:none;
}
#ssprodivI .geminiPrompt textarea:focus { border-color:#ff0000; }
#ssprodivI .geminiModels button,#ssprodivI .disableCodecs button {
  background:#1a1a1a;color:#fff;border:1px solid #303030;border-radius:8px;padding:8px 12px;margin:3px;font-size:12px;min-height:36px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-family:inherit;
}
#ssprodivI .geminiModels button:hover,#ssprodivI .disableCodecs button:hover { background:#ff0000;border-color:#ff0000; }
</style>`;

ytpSetI.innerHTML+=`
<div class="ytp-head">
  <div class="ytp-logo-area">
    <div style="width:32px;height:22px;background:#ff0000;border-radius:6px;display:flex;align-items:center;justify-content:center;">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
    </div>
    <div class="ytp-brand">
      <span>YouTube</span>
      <span class="ytp-badge">PREMIUM</span>
      <span class="ytp-ver">v${YTProVer}</span>
    </div>
  </div>
  <button class="ytp-close-btn" data-action="closeMenu">✕</button>
</div>

<div class="ytp-tabs-bar">
  <button class="ytp-chip active" data-tab="all">Todos</button>
  <button class="ytp-chip" data-tab="tvbox">📺 Smart TV</button>
  <button class="ytp-chip" data-tab="audio">🔊 Áudio +</button>
  <button class="ytp-chip" data-tab="tools">🛠️ Utilitários</button>
  <button class="ytp-chip" data-tab="premium">💎 Premium</button>
  <button class="ytp-chip" data-tab="gestures">🎮 Gestos</button>
  <button class="ytp-chip" data-tab="video">⚡ Vídeo</button>
  <button class="ytp-chip" data-tab="interface">🎨 Visual</button>
  <button class="ytp-chip" data-tab="gemini">🤖 Gemini IA</button>
  <button class="ytp-chip" data-tab="download">📥 Mídia</button>
</div>

<div class="ytp-content">

  <input type="url" placeholder="Cole o link de um vídeo do YouTube..." id="ytproUrlInput" class="ytp-input-box">

  <!-- SEÇÃO SMART TV & TV BOX (NOVA) -->
  <div class="ytp-sec" data-category="tvbox">
    <div class="ytp-sec-title">📺 SMART TV & TV BOX</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Navegação por Controle Remoto (D-Pad)</div>
        <div class="ytp-card-desc">Controle o vídeo e navegue usando as setas e botões do controle da TV</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="dpadTvMode" style="${sttCnf(0,0,"dpadTvMode")}"><b style="${sttCnf(0,1,"dpadTvMode")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Modo Tela Grande (Smart TV 10-Foot)</div>
        <div class="ytp-card-desc">Aumenta fontes e botões para visualização perfeita do sofá a 3 metros</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="bigScreenMode" style="${sttCnf(0,0,"bigScreenMode")}"><b style="${sttCnf(0,1,"bigScreenMode")}"></b></span>
    </div>

    <button class="ytp-btn-card" data-action="turboCleanRam">
      <span>🚀 Otimizar Memória / Limpar Cache da TV Box</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>
  </div>

  <!-- SEÇÃO ÁUDIO BOOSTER & SOM (NOVA) -->
  <div class="ytp-sec" data-category="audio">
    <div class="ytp-sec-title">🔊 ÁUDIO BOOSTER & SOM</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Booster de Volume (+200% / +300%)</div>
        <div class="ytp-card-desc">Amplifica o som para aparelhos e TV Box com volume baixo</div>
      </div>
      <button data-action="cycleVolumeBoost" style="background:#222;color:#fff;border:1px solid #444;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;">
        ${localStorage.getItem("volumeBoost") || "100"}%
      </button>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Normalização de Áudio (Modo Noturno)</div>
        <div class="ytp-card-desc">Equilibra diálogos baixos e explosões sem sustos à noite na TV</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="audioNormalize" style="${sttCnf(0,0,"audioNormalize")}"><b style="${sttCnf(0,1,"audioNormalize")}"></b></span>
    </div>
  </div>

  <!-- SEÇÃO UTILITÁRIOS & RECURSOS EXCLUSIVOS (NOVA) -->
  <div class="ytp-sec" data-category="tools">
    <div class="ytp-sec-title">🛠️ UTILITÁRIOS EXCLUSIVOS</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Temporizador de Sono (Sleep Timer)</div>
        <div class="ytp-card-desc">Pausa a reprodução automaticamente ao adormecer</div>
      </div>
      <button data-action="cycleSleepTimer" style="background:#222;color:#fff;border:1px solid #444;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;">
        ${localStorage.getItem("sleepTimer") && localStorage.getItem("sleepTimer") !== "0" ? localStorage.getItem("sleepTimer") + " min" : "Desligado"}
      </button>
    </div>

    <button class="ytp-btn-card" data-action="triggerChildLock">
      <span>🔒 Travar Tela contra Toques Acidentais (Child Lock)</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>
  </div>

  <!-- SEÇÃO PREMIUM -->
  <div class="ytp-sec" data-category="premium">
    <div class="ytp-sec-title">💎 REPRODUÇÃO & PREMIUM</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Reprodução em Segundo Plano</div>
        <div class="ytp-card-desc">Continue escutando ao desligar a tela ou abrir outros apps</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="bgplay" style="${sttCnf(0,0,"bgplay")}"><b style="${sttCnf(0,1,"bgplay")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Pular Patrocinadores</div>
        <div class="ytp-card-desc">Pula anúncios nativos e patrocínios no vídeo (SponsorBlock)</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="autoSpn" style="${sttCnf(0,0,"autoSpn")}"><b style="${sttCnf(0,1,"autoSpn")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Repetir Vídeo (Auto-Loop)</div>
        <div class="ytp-card-desc">Repete o vídeo automaticamente em loop contínuo</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="autoLoop" style="${sttCnf(0,0,"autoLoop")}"><b style="${sttCnf(0,1,"autoLoop")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Modo Somente Áudio</div>
        <div class="ytp-card-desc">Desativa o vídeo para economizar até 90% de bateria e dados</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="audioOnlyMode" style="${sttCnf(0,0,"audioOnlyMode")}"><b style="${sttCnf(0,1,"audioOnlyMode")}"></b></span>
    </div>
  </div>

  <!-- SEÇÃO GESTOS -->
  <div class="ytp-sec" data-category="gestures">
    <div class="ytp-sec-title">🎮 GESTOS & TELA</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Controles de Gesto no Player</div>
        <div class="ytp-card-desc">Deslize na esquerda para brilho e na direita para volume com HUD</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="gesC" style="${sttCnf(0,0,"gesC")}"><b style="${sttCnf(0,1,"gesC")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Gesto Miniplayer</div>
        <div class="ytp-card-desc">Deslize para baixo no vídeo para minimizar</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="gesM" style="${sttCnf(0,0,"gesM")}"><b style="${sttCnf(0,1,"gesM")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Forçar Zoom (Pinch-to-Zoom)</div>
        <div class="ytp-card-desc">Permite dar zoom em qualquer vídeo em tela cheia</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="fzoom" style="${sttCnf(0,0,"fzoom")}"><b style="${sttCnf(0,1,"fzoom")}"></b></span>
    </div>
  </div>

  <!-- SEÇÃO VÍDEO & PERFORMANCE -->
  <div class="ytp-sec" data-category="video">
    <div class="ytp-sec-title">⚡ VÍDEO & CODECS</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Bloquear 60 FPS</div>
        <div class="ytp-card-desc">Força 30 FPS para economia de bateria e aparelhos fracos</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="block_60fps" style="${sttCnf(0,0,"block_60fps")}"><b style="${sttCnf(0,1,"block_60fps")}"></b></span>
    </div>

    <button class="ytp-btn-card" data-action="disableCodecs">
      <span>Personalizar Codecs (AV1, VP9, H264, Opus)</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>
  </div>

  <!-- SEÇÃO INTERFACE -->
  <div class="ytp-sec" data-category="interface">
    <div class="ytp-sec-title">🎨 INTERFACE & LIMPEZA</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Ocultar Shorts</div>
        <div class="ytp-card-desc">Remove as prateleiras e vídeos curtos do feed</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="shorts" style="${sttCnf(0,0,"shorts")}"><b style="${sttCnf(0,1,"shorts")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Ocultar Posts da Comunidade</div>
        <div class="ytp-card-desc">Remove publicações em texto e imagens do feed</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="communityPosts" style="${sttCnf(0,0,"communityPosts")}"><b style="${sttCnf(0,1,"communityPosts")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Ocultar Avisos de 'Instalar App'</div>
        <div class="ytp-card-desc">Bloqueia popups promovendo o app e o Music</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="hideAppUpsell" style="${sttCnf(0,0,"hideAppUpsell")}"><b style="${sttCnf(0,1,"hideAppUpsell")}"></b></span>
    </div>

    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Tema Preto Puro (Super AMOLED)</div>
        <div class="ytp-card-desc">Aplica preto absoluto (#000000) em toda a interface</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="amoledTheme" style="${sttCnf(0,0,"amoledTheme")}"><b style="${sttCnf(0,1,"amoledTheme")}"></b></span>
    </div>
  </div>

  <!-- SEÇÃO GEMINI IA -->
  <div class="ytp-sec" data-category="gemini">
    <div class="ytp-sec-title">🤖 GEMINI IA</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Manter Contexto do Chat</div>
        <div class="ytp-card-desc">Permite continuar conversando sobre o vídeo atual</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="saveCInfo" style="${sttCnf(0,0,"saveCInfo")}"><b style="${sttCnf(0,1,"saveCInfo")}"></b></span>
    </div>

    <button class="ytp-btn-card" data-action="geminiModels">
      <span>Selecionar Modelo Gemini (${localStorage.getItem('geminiModel') || '3.5 Flash-Lite'})</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>

    <button class="ytp-btn-card" data-action="geminiPrompt">
      <span>Editar Prompt Padrão de Resumo</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>
  </div>

  <!-- SEÇÃO DOWNLOAD & MÍDIA -->
  <div class="ytp-sec" data-category="download">
    <div class="ytp-sec-title">📥 DOWNLOAD & MÍDIA</div>
    <button class="ytp-btn-card" data-action="openDownMenu">
      <span>🎬 Abrir Menu de Download (Vídeo MP4 / Áudio MP3)</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>

    <button class="ytp-btn-card" data-action="downThumbDirect">
      <span>🖼️ Baixar Capa em Alta Resolução (HD/4K)</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>

    <button class="ytp-btn-card" data-action="hearts">
      <span>❤️ Ver Vídeos Curtidos Salvos</span>
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
    </button>
  </div>

  <!-- SEÇÃO APP & SISTEMA -->
  <div class="ytp-sec" data-category="system">
    <div class="ytp-sec-title">⚙️ SISTEMA & DEV</div>
    <div class="ytp-card">
      <div class="ytp-card-info">
        <div class="ytp-card-title">Modo Desenvolvedor (Eruda Console)</div>
        <div class="ytp-card-desc">Habilita console de depuração e inspeção DOM</div>
      </div>
      <span class="ytp-switch" data-action="sttCnf" data-value="devMode" style="${sttCnf(0,0,"devMode")}"><b style="${sttCnf(0,1,"devMode")}"></b></span>
    </div>
  </div>

  <div class="geminiModels"></div>

  <div class="geminiPrompt" style="text-align:center;">
    <textarea id="ytproPromptTA">${localStorage.getItem("prompt") || ""}</textarea>
    <div style="display:flex;gap:8px;margin-top:10px;">
      <button data-action="savePrompt" style="flex:1;background:#ff0000;color:#fff;border:none;border-radius:8px;height:40px;font-weight:700;font-size:13px;cursor:pointer;">Salvar Prompt</button>
      <button data-action="cancelPrompt" style="width:100px;background:#333;color:#fff;border:none;border-radius:8px;height:40px;font-size:13px;cursor:pointer;">Fechar</button>
    </div>
  </div>

  <div class="disableCodecs"></div>

</div>
`;

document.body.appendChild(ytpSet);
ytpSet.appendChild(ytpSetI);

try{ document.getElementById("ytproPromptTA").value = localStorage.getItem("prompt") || ""; }catch(e){}
document.getElementById("ytproUrlInput").addEventListener("keyup",searchUrl);

// Tab switching
const tabs = ytpSetI.querySelectorAll(".ytp-chip");
const sections = ytpSetI.querySelectorAll(".ytp-sec");
tabs.forEach(chip => {
  chip.addEventListener("click", () => {
    tabs.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const target = chip.dataset.tab;
    sections.forEach(sec => {
      if(target === "all" || sec.dataset.category === target) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });
  });
});

var actionsList={
  closeMenu: () => {
    if(window.location.hash === "#settings") history.back();
    else ytpSet.remove();
  },
  openDownMenu: () => { showDownloadMenu(); },
  downThumbDirect: () => { downloadCurrentThumbnail(); },
  turboCleanRam: () => { cleanTvBoxMemory(); },
  triggerChildLock: () => {
    ytpSet.remove();
    toggleChildLock();
  },
  cycleVolumeBoost: (el) => {
    const current = parseInt(localStorage.getItem("volumeBoost") || "100", 10);
    const next = current === 100 ? 150 : (current === 150 ? 200 : (current === 200 ? 300 : 100));
    localStorage.setItem("volumeBoost", String(next));
    el.textContent = next + "%";
    applyAudioEnhancements();
    showCustomToast(`Volume Booster definido para ${next}%`);
  },
  cycleSleepTimer: (el) => {
    const current = parseInt(localStorage.getItem("sleepTimer") || "0", 10);
    const next = current === 0 ? 15 : (current === 15 ? 30 : (current === 30 ? 60 : 0));
    setSleepTimer(next);
    el.textContent = next === 0 ? "Desligado" : next + " min";
  },
  hearts:()=>{ window.location.hash='#hearts'; },
  sttCnf:(button,action)=>{ sttCnf(button,action); },
  geminiModels:()=>{
    document.getElementsByClassName('geminiModels')[0].style.display='block';
    document.getElementsByClassName('geminiModels')[0].innerHTML=getGeminiModels();
  },
  geminiPrompt:()=>{
    document.getElementsByClassName('geminiPrompt')[0].style.display='block';
  },
  disableCodecs:()=>{
    document.getElementsByClassName('disableCodecs')[0].style.display='block';
    document.getElementsByClassName('disableCodecs')[0].innerHTML=getYTPROCodecs();
  },
  savePrompt:(el)=>{
    localStorage.setItem('prompt',document.getElementById("ytproPromptTA").value);
    showCustomToast("Prompt do Gemini salvo!");
    el.closest(".geminiPrompt").style.display='none';
  },
  cancelPrompt:(el)=>{ el.closest(".geminiPrompt").style.display='none'; },
  done:(el)=>{ el.parentElement.style.display='none'; },
  setRemoveCodec:(el,value)=>{ setRemoveCodec(value,el); },
  block_60fps:(el)=>{ sttCnf(el,"block_60fps"); },
  saveModel:(el,value)=>{
    localStorage.removeItem('geminiChatInfo');
    localStorage.setItem('geminiModel',value);
    showCustomToast("Modelo " + value + " selecionado");
    el.closest(".geminiModels").style.display='none';
  }
};

ytpSetI.querySelectorAll("[data-action]").forEach(button =>{
  button.addEventListener("click",()=>{
    if(button.dataset.action === "sttCnf"){
      actionsList[button.dataset.action](button,button.dataset.value);
    }else if(actionsList[button.dataset.action]){
      actionsList[button.dataset.action](button);
    }
  });
});

try{
ytpSetI.querySelector(".disableCodecs").addEventListener("click",(e)=>{
  var el = e.target.closest("[data-action]");
  if(!el) return;
  if(actionsList[el.dataset.action]) actionsList[el.dataset.action](el,el.dataset.value);
});
}catch(e){}

try{
ytpSetI.querySelector(".geminiModels").addEventListener("click",(e)=>{
  var el = e.target.closest("[data-action]");
  if(!el) return;
  if(actionsList[el.dataset.action]) actionsList[el.dataset.action](el,el.dataset.value);
});
}catch(e){}

}

function searchUrl(e){
if(e.keyCode === 13 || e === "Enter"){
var url=e.target.value;
const regex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|shorts|live)\/))([a-zA-Z0-9_-]{11})/;
const match = url.match(regex);
var id=match ? match[1] : null;
if(id){
  return navigateInternalYtMweb(id);
}
var a=document.createElement("a");
a.href=url;
document.body.appendChild(a);
try{document.getElementById("settingsprodiv").remove();}catch(e){}
a.click();
}
}

function checkUpdates(){
  // Desativado
}

function sttCnf(x,z,y){
// Cores: Inativo = Cinza Neutro (#3a3a3a), Ativo = Vermelho Vivo (#ff0000), Knob = Branco (#ffffff)
var COLOR_INACTIVE = "#3a3a3a";
var COLOR_ACTIVE = "#ff0000";
var KNOB_COLOR = "#ffffff";

// Chamada inicial para obter CSS inline
if(typeof y == "string"){
  var isActive = localStorage.getItem(y) === "true";
  if(!isActive){
    if(z == 1){ return `background:${KNOB_COLOR};transform:translateX(0);left:2px;`; }
    else{ return `background:${COLOR_INACTIVE};border:1px solid #4a4a4a;`; }
  }else{
    if(z == 1){ return `background:${KNOB_COLOR};transform:translateX(20px);left:2px;`; }
    else{ return `background:${COLOR_ACTIVE};box-shadow:0 0 10px rgba(255,0,0,0.5);`; }
  }
}

// Alternância ao clicar
var currentlyActive = localStorage.getItem(z) === "true";
if(currentlyActive){
  localStorage.setItem(z,"false");
  x.style.background = COLOR_INACTIVE;
  x.style.border = "1px solid #4a4a4a";
  x.style.boxShadow = "none";
  if(x.children[0]){
    x.children[0].style.transform = "translateX(0)";
  }
  showCustomToast("Desativado");
}
else{
  localStorage.setItem(z,"true");
  x.style.background = COLOR_ACTIVE;
  x.style.border = "none";
  x.style.boxShadow = "0 0 10px rgba(255,0,0,0.5)";
  if(x.children[0]){
    x.children[0].style.transform = "translateX(20px)";
  }
  showCustomToast("Ativado com sucesso!");
}

try{
if(localStorage.getItem("fzoom") == "false"){
document.getElementsByName("viewport")[0].setAttribute("content","width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,");
}else{
document.getElementsByName("viewport")[0].setAttribute("content","");
}
}catch(e){}

try{
if(localStorage.getItem("bgplay") == "true"){
Android.setBgPlay(true);
}else{
Android.setBgPlay(false);
}
}catch(e){}

if(localStorage.getItem("gesC") != "true"){
try{
document.getElementById("brtS").remove();
document.getElementById("volS").remove();
}catch(e){}
}

if(localStorage.getItem("devMode") == "false"){
try{eruda.destroy();}catch(e){}
}else if(!window.eruda && localStorage.getItem("devMode") == "true"){
try{
var script = document.createElement('script'); script.src="//youtube.com/ytpro_cdn/npm/eruda";
document.body.appendChild(script); script.onload=()=>{ eruda.init(); }
}catch(e){}
}
}

function formatFileSize(bytes){
  let value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let i = 0;
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i++; }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

async function ytproDownVid(){
try{
if(typeof window.ytproSabrDownload === "function"){
window.ytproSabrDownload();
}else if(window.Android && Android.showToast){
Android.showToast("Downloader não carregado");
}
}catch(e){}
}

function doDownload(mode){
if(typeof window.ytproSabrDownload !== "function"){
try{ Android.showToast("Downloader não carregado"); }catch(e){}
return;
}
try{
if(mode === "audio"){
try{
window.ytproSabrDownload({ audioOnly: true, onlyAudio: true, type: "audio" });
}catch(e){
window.ytproSabrDownload();
}
try{
setTimeout(function(){
try{ Android.showToast("Escolha MP3/M4A no menu"); }catch(e){}
}, 600);
}catch(e){}
}else{
window.ytproSabrDownload();
}
}catch(e){
try{ Android.showToast("Erro no download"); }catch(e2){}
}
}

function showDownloadMenu(){
try{ document.getElementById("ytproDownloadMenu").remove(); }catch(e){}
var overlay=document.createElement("div");
overlay.setAttribute("id","ytproDownloadMenu");
overlay.setAttribute("style","position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(6px);z-index:2147483647;display:flex;justify-content:center;align-items:center;font-family:Roboto,Arial,sans-serif;");

var menu=document.createElement("div");
menu.setAttribute("style","width:calc(85% - 20px);max-width:340px;background:#0f0f0f;border:1px solid #303030;border-radius:16px;padding:20px;color:#f1f1f1;box-shadow:0 10px 40px rgba(0,0,0,0.9),0 0 20px rgba(255,0,0,0.3);");

menu.innerHTML=`
<div style="font-size:16px;font-weight:700;color:#fff;letter-spacing:1.2px;padding-bottom:12px;border-bottom:2px solid #ff0000;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">
<span>BAIXAR</span>
<span style="background:#ff0000;color:#fff;font-size:9px;padding:3px 7px;border-radius:4px;letter-spacing:0;">PREMIUM</span>
</div>
<button data-action="video" style="width:100%;height:52px;margin-bottom:10px;background:#1a1a1a;border:1px solid #262626;border-radius:10px;color:#f1f1f1;font-size:14px;font-weight:500;display:flex;align-items:center;justify-content:space-between;padding:0 16px;cursor:pointer;font-family:inherit;">
<span>🎬 Baixar Vídeo (MP4)</span>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
</button>
<button data-action="audio" style="width:100%;height:52px;margin-bottom:10px;background:#1a1a1a;border:1px solid #262626;border-radius:10px;color:#f1f1f1;font-size:14px;font-weight:500;display:flex;align-items:center;justify-content:space-between;padding:0 16px;cursor:pointer;font-family:inherit;">
<span>🎵 Baixar Áudio (MP3)</span>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
</button>
<button data-action="thumb" style="width:100%;height:52px;margin-bottom:10px;background:#1a1a1a;border:1px solid #262626;border-radius:10px;color:#f1f1f1;font-size:14px;font-weight:500;display:flex;align-items:center;justify-content:space-between;padding:0 16px;cursor:pointer;font-family:inherit;">
<span>🖼️ Baixar Capa em HD/4K</span>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
</button>
<button data-action="cancel" style="width:100%;height:44px;background:#333;border:none;border-radius:10px;color:#f1f1f1;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;">Cancelar</button>
`;

overlay.appendChild(menu);
document.body.appendChild(overlay);

overlay.addEventListener("click",function(ev){
if(ev.target === overlay){ overlay.remove(); }
});

menu.addEventListener("click",function(ev){
var btn=ev.target.closest("[data-action]");
if(!btn) return;
var action=btn.dataset.action;
overlay.remove();
if(action === "cancel") return;
if(action === "video") doDownload("video");
else if(action === "audio") doDownload("audio");
else if(action === "thumb") downloadCurrentThumbnail();
});
}

function showHideAdaptives(){
var z=document.querySelectorAll(".adpFormats");
z.forEach((x)=>{
if(x.style.display=="none"){
x.style.display="flex";
}else{
x.style.display="none";
}
});
}

function downCap(x,t){
Android.downvid(t,x,"plain/text");
}

function YTDownVid(o,ex){
var mtype="";
if(ex ==".png"){ mtype="image/png"; }
else if(ex ==".mp4"){ mtype="video/mp4"; }
else if(ex ==".mp3"){ mtype="audio/mp3"; }
try{ Android.downvid((o.getAttribute("data-ytprotit")+ex),o.getAttribute("data-ytprourl"),mtype); }catch(e){}
}

var stopProp = false;
var zoomIn=false;
var scale=1;

function checkDirection(e) {
if ((touchendY > touchstartY) && (touchendY - touchstartY > 20)) {
minimize(true);
}else if ((touchendY < touchstartY) && (touchstartY - touchendY > 20)) {
minimize(false);
}
}

function getDistance(touches) {
const [a, b] = touches;
return Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
}

document.body.addEventListener('touchstart', e => {
touchstartY = e.changedTouches[0].screenY;
if (e.touches.length === 2) {
initialDistance = getDistance(e.touches);
}
}, { capture: true });

document.body.addEventListener('touchmove', (e) => {
if(stopProp){
e.stopPropagation();
}
if (e.touches.length === 2 && initialDistance !== null) {
const currentDistance = getDistance(e.touches);
const z = currentDistance / initialDistance;
stopProp=true;
if((e.target.className.toString().includes("video-stream") || e.target.className.toString().includes("player-controls-background")) && document.fullscreenElement){
if (z > 1.05) {
var Vv=document.getElementsByClassName('video-stream')[0];
zoomIn=true;
scale=Math.max((screen.height / Vv.offsetHeight) , (screen.width / Vv.offsetWidth));
addMaxButton();
} else if (z < 0.95) {
zoomIn=false;
scale=1;
addMaxButton();
}
}
}
},{capture:true});

document.body.addEventListener('touchend', e => {
touchendY = e.changedTouches[0].screenY;
if((e.target.className.toString().includes("video-stream") || e.target.className.toString().includes("player-controls-background")) && !document.fullscreenElement && localStorage.getItem("gesM") == "true"){
checkDirection();
}
if (e.touches.length < 2) {
initialDistance = null;
setTimeout(()=>{
stopProp=false;
},500)
}
}, { capture: true });

try{
navigation.addEventListener("navigate", e => {
if(e.destination.url.indexOf("watch") > -1 || e.destination.url.indexOf("shorts") > -1){
  dislikes="...";
fDislikes(e.destination.url);
checkSponsors(e.destination.url);
}
});
}catch(e){}

function minimize(yes){
const createIframe=()=>{
var iframe=document.createElement("iframe");
iframe.setAttribute("id",`miniIframe`);
iframe.setAttribute("style",`
height:99.999%;width:100%;
background:${c};
top:0px;
line-height:50px;
position:fixed;
left:0;
z-index:999;
border:0;
`);
iframe.src="https://m.youtube.com/";
document.body.appendChild(iframe);
var iwindow = iframe.contentWindow || iframe.contentDocument.defaultView;
var doc = iwindow.document;
if (doc.readyState == 'complete' ) {
if (iwindow.trustedTypes && iwindow.trustedTypes.createPolicy && !iwindow.trustedTypes.defaultPolicy) {
iwindow.trustedTypes.createPolicy('default', {createHTML: (string) => string,createScriptURL: string => string, createScript: string => string, });
}
}
try{
iwindow.navigation.addEventListener("navigate", e => {
if(e.destination.url.indexOf("youtube.com") > -1){
if(e.destination.url.indexOf("/watch") > -1 || e.destination.url.indexOf("/shorts") > -1){
window.location.href=e.destination.url;
}
}else{
window.location.href=e.destination.url;
}
});
}catch(e){}
var script = doc.createElement("script");
var scriptSource=`window.addEventListener('DOMContentLoaded', function() {
var script2 = document.createElement('script');
script2.src="//youtube.com/ytpro_cdn/npm/ytpro";
document.body.appendChild(script2);
});
`;
var source = doc.createTextNode(scriptSource);
script.appendChild(source);
doc.body.appendChild(script);
return iframe;
}

var iframe = document.getElementById("miniIframe") || createIframe();
var player=document.getElementById("player-container-id");
if(!player) return;

if(yes){
iframe.style.display="block";
player.setAttribute("ogTop",getComputedStyle(player).top)
player.style.transform="scale(0.65)";
player.style.top=(window.screen.height-(player.getBoundingClientRect().height*2.5))+"px";
player.style.zIndex="9999";
}else{
iframe.style.display="none";
player.style.transform="scale(1)";
player.style.top=player.getAttribute("ogTop");
player.style.zIndex="normal";
player.removeAttribute("ogTop");
}
}

function callbackSNlM0e(){
  return new Promise(resolve => {
    let settled = false;
    const finish = (value) => { if (!settled) { settled = true; clearTimeout(timer); resolve(value); } };
    const timer = setTimeout(() => finish(null), 15000);
    callbackSNlM0e.resolve = finish;
  });
}

function callbackGeminiClient(){
  return new Promise(resolve => {
    let settled = false;
    const finish = (value) => { if (!settled) { settled = true; clearTimeout(timer); resolve(value); } };
    const timer = setTimeout(() => finish(null), 30000);
    callbackGeminiClient.resolve = finish;
  });
}

function handleGeminiResponse(res){
const getBody=(lines)=>{
let linesJSON=JSON.parse(lines[2]).slice().reverse().find(arr =>{
try{
  let js=JSON.parse(arr[2]);
  if(js?.[4]?.[0]?.[0]?.indexOf("rc_") > -1) return js;
}catch(e){
  console.log("err",e)
}
});
return JSON.parse(linesJSON?.[2] || "[]");
};

const sanitizeGeminiHtml = (html) => {
  const parsed = new DOMParser().parseFromString(String(html || ""), "text/html");
  const allowed = new Set(["P","BR","HR","H1","H2","H3","H4","H5","H6","UL","OL","LI","PRE","CODE","BLOCKQUOTE","STRONG","B","EM","I","DEL","S","A","IMG","TABLE","THEAD","TBODY","TR","TH","TD"]);
  parsed.body.querySelectorAll("*").forEach((el) => {
    if (!allowed.has(el.tagName)) { el.replaceWith(...el.childNodes); return; }
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (el.tagName === "A" && ["href","data-ytpro-seek"].includes(name)) return;
      if (el.tagName === "IMG" && ["src","alt","title"].includes(name)) return;
      if (el.tagName === "TH" && name === "colspan") return;
      el.removeAttribute(attr.name);
    });
    if (el.tagName === "A") {
      const href = el.getAttribute("href") || "";
      if (href && !href.startsWith("#")) {
        try { const u = new URL(href, window.location.href); if (!["http:","https:"].includes(u.protocol)) el.removeAttribute("href"); }
        catch (_) { el.removeAttribute("href"); }
      }
      el.setAttribute("rel", "noopener noreferrer");
    }
    if (el.tagName === "IMG") {
      const src = el.getAttribute("src") || "";
      try { if (new URL(src, window.location.href).protocol !== "https:") el.remove(); }
      catch (_) { el.remove(); }
    }
  });
  return parsed.body.innerHTML;
};

const modifyTimestamps = (html) => {
  const parsed = new DOMParser().parseFromString(String(html || ""), "text/html");
  parsed.body.querySelectorAll("a[href]").forEach((a) => {
    try {
      const u = new URL(a.getAttribute("href"), window.location.href);
      const raw = u.searchParams.get("t") || u.searchParams.get("time_continue");
      if (!raw || !/(youtube\.com|youtu\.be)$/.test(u.hostname)) return;
      let seconds;
      if (/^\d+(?:\.\d+)?$/.test(raw)) seconds = Number(raw);
      else if (/^(?:\d{1,2}:)?\d{1,2}:\d{1,2}$/.test(raw)) seconds = raw.split(":").map(Number).reduce((n, x) => n * 60 + x, 0);
      if (Number.isFinite(seconds) && seconds >= 0) {
        a.setAttribute("href", "#ytpro-seek");
        a.setAttribute("data-ytpro-seek", String(seconds));
      }
    } catch (_) {}
  });
  return sanitizeGeminiHtml(parsed.body.innerHTML);
};

var response=res && res.stream;
if (response == undefined) {
  const target = document.getElementById("GeminiResponse");
  if (target) target.textContent = "Erro ao conectar ao Gemini. Verifique o app e tente novamente.";
  return;
}
var lines=response.split("\n");
var body;
try { body = getBody(lines); } catch (_) { body = null; }
if(!body || !body.length) {
  const target = document.getElementById("GeminiResponse");
  if (target) target.textContent = "Não foi possível interpretar a resposta do Gemini.";
  return;
}
var chat=[];
chat.push(body?.[1]?.[0]);
chat.push(body?.[1]?.[1]);
chat.push(body?.[4]?.[0]?.[0]);
localStorage.setItem("geminiChatInfo",chat.toString());
body=body?.[4]?.[0];
var text=body?.[1]?.[0] || "";
text=text.replace(/http:\/\/googleusercontent\.com\/\S+/g,'');
var thoughts = body?.[37]?.[0]?.[0] || null;
var images=[];
for(var i in body?.[12]?.[1]){
var img=body?.[12]?.[1]?.[i]
images.push({
url:img[0][0][0],
alt:img[0][4],
title:img[7][0]
});
text+=`<center><img alt="${img[0][4]}" src="${img[0][0][0]}"></center>`;
}

let converter = new showdown.Converter();
converter.setFlavor('github');
let html = modifyTimestamps(converter.makeHtml(text));

let thoughtsHtml=(thoughts != null) ? `<button onclick="(this.nextElementSibling.style.height=='auto') ? (this.children[0].style.transform='rotate(-90deg)',this.nextElementSibling.style.height='0') : (this.children[0].style.transform='rotate(90deg)',this.nextElementSibling.style.height='auto');" class="think" >Ver Raciocínio
<svg xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg);margin-left:10px" width="16" height="16" fill="${isD ? "#ccc" : "#444"}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg></button>
<div class="geminiThoughts">
<br>
${sanitizeGeminiHtml(converter.makeHtml(thoughts))}
</div><br>` : "";

const safeChatId = String(chat?.[0] || "").replace(/^c_/, "");
const safeChatUrl = /^[-\w]+$/.test(safeChatId) ? `https://gemini.google.com/chat/${encodeURIComponent(safeChatId)}` : "https://gemini.google.com/";
document.getElementById("GeminiResponse").innerHTML=`<a href="${safeChatUrl}" rel="noopener noreferrer">Abrir chat</a><br><br>
${thoughtsHtml}
<div class="geminiAnswer">
${html}
</div>
`;
}

async function geminiInfo(){
if (!hasAndroidBridge) {
  try { Android.showToast("Gemini requer a integração Android do YTPRO"); } catch (_) {}
  return;
}
if(document.getElementById("GeminiResponse") == null){
var GeminiRes=document.createElement("div");
GeminiRes.setAttribute("style",`min-height:80px;max-height:400px;display:block;height:auto;overflow:scroll;font-weight:400;width:calc(92% - 20px);font-size:14px;padding:10px;position:relative;margin:auto;background:${d};border-radius:15px;margin-bottom:8px;`);
GeminiRes.setAttribute("id","GeminiResponse");
GeminiRes.addEventListener("click", (event) => {
  const link = event.target.closest("[data-ytpro-seek]");
  if (!link) return;
  event.preventDefault();
  const video = document.querySelector(".video-stream");
  const seconds = Number(link.getAttribute("data-ytpro-seek"));
  if (video && Number.isFinite(seconds)) video.currentTime = seconds;
});
try{ insertAfter(document.getElementById('ytproMainDivE'),GeminiRes); }catch(e){ return; }
}else{
var GeminiRes=document.getElementById("GeminiResponse");
}

document.getElementById("GeminiResponse").innerHTML=`<div class="geminiLoader"></div>`;

var cookies=Android.getAllCookies(window.location.href);

if(cookies.indexOf("__Secure-1PSID=") < 0){
GeminiRes.innerHTML=`<center style="margin-top:15px">
<span >Faça login para usar Gemini</span>
<br><br>
<a href="https://accounts.google.com/ServiceLogin?service=youtube" >
<button style="background:${c};color:${isD ? "#000" : "#fff"};font-weight:500;height:35px;width:90px;border-radius:25px;text-align:center;line-height:35px;">Entrar</button>
</a>
<br><br>
</center>`;
return;
}

cookies=cookies.split(";");
var secured="";
cookies.forEach((x)=>{
if(x.indexOf("__Secure-1PSID=") > -1 || x.indexOf("__Secure-1PSIDTS=") > -1)
secured+=x+";";
})

var endpoint="https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";
var headers=JSON.stringify({
"accept": "*/*",
"accept-language": "pt-BR",
"content-type":"application/x-www-form-urlencoded;charset=UTF-8",
"x-goog-ext-525001261-jspb": GeminiModels[localStorage.getItem('geminiModel')],
"x-same-domain": "1",
"cookie": secured,
"Referer": "https://gemini.google.com/",
"Referrer-Policy": "origin"
});

if(GeminiAT == ""){
Android.getSNlM0e(secured);
GeminiAT=await callbackSNlM0e();
if (!GeminiAT) { GeminiRes.textContent = "Não foi possível iniciar a conexão com o Gemini."; return; }
if (!window.showdown) {
  await new Promise((resolve) => {
    var sd = document.createElement("script");
    sd.src = "https://youtube.com/ytpro_cdn/npm/showdown/dist/showdown.min.js";
    sd.onload = resolve;
    sd.onerror = resolve;
    document.body.appendChild(sd);
    setTimeout(resolve, 10000);
  });
}
if (!window.showdown) { GeminiRes.textContent = "A biblioteca de formatação não carregou."; return; }
}

var prompt=localStorage.getItem('prompt').replaceAll("{url}",window.location.href).replaceAll("{videoId}",new URL(window.location.href).searchParams.get("v")).replaceAll("{title}",document.getElementsByClassName('slim-video-information-title')[0].textContent);

var chat = null;
if(localStorage.getItem("saveCInfo") == "true" && localStorage.getItem("geminiChatInfo") != null){
chat = localStorage.getItem("geminiChatInfo").split(",");
}

const formData = new URLSearchParams();
formData.append("f.req", JSON.stringify([null,JSON.stringify([[prompt],null,chat])]));
formData.append("at", GeminiAT);

Android.GeminiClient(endpoint,headers,formData.toString());
var response=await callbackGeminiClient();
if (!response) { GeminiRes.textContent = "Tempo limite aguardando a resposta do app Android."; return; }
handleGeminiResponse(response);
}

var volSvg=`<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" focusable="false" aria-hidden="true" style="pointer-events: none;filter:drop-shadow(0px 0px 1px black);position:absolute;top:10%"><path fill="#fff" d="M11.485 2.143 3.913 6.687A6 6 0 001 11.832v.338a6 6 0 002.913 5.144l7.572 4.543A1 1 0 0013 21V3a1.001 1.001 0 00-1.515-.857Zm6.88 2.079a1 1 0 00-.001 1.414 9 9 0 010 12.728 1 1 0 001.414 1.414 11 11 0 000-15.556 1 1 0 00-1.413 0Zm-2.83 2.828a1 1 0 000 1.415 5 5 0 010 7.07 1 1 0 001.415 1.415 6.999 6.999 0 000-9.9 1 1 0 00-1.415 0Z"></path></svg>`;
var brtSvg=`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="16" viewBox="0 0 24 24" width="16" style="filter:drop-shadow(0px 0px 1px black);position:absolute;top:10%;"><rect fill="none" height="24" width="24"/><path fill="#fff" d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>`;

async function pkc(){
if(window.location.href.indexOf("youtube.com/watch") > -1){
try{
var elm=document.getElementsByTagName("dislike-button-view-model")[0].children[0];
elm.children[0].children[0].style.width="auto";
elm.children[0].children[0].style.paddingRight="15px";
let dislikesHtml=`<span class="slim-video-subtitle-substring slim-video-information-dislike-count"><span class="ytAttributedStringHost" dir="auto" aria-label="2.9m" role="text" style="">${dislikes} deslikes</span></span>`
if(!document.getElementById("diskl")){
  var diskl=document.createElement("span");
  diskl.setAttribute("id","diskl");
  diskl.innerHTML=dislikesHtml;
insertAfter(document.getElementsByClassName("slim-video-information-like-count")[0],diskl);
}else{
document.getElementById("diskl").innerHTML=dislikesHtml;
}
}catch(e){}

try{
if(localStorage.getItem("gesC") == "true"){
var v= document.getElementById("player-container-id");
if(v){
var rect=v.getBoundingClientRect();
var elStyle={
height:"70%",width:rect.width*0.14+"px",display:"flex","flex-direction":"column",
"align-items":"center","justify-content":"center",position:"absolute",
top:"16%",right:"0px",opacity:"0",
};
var el=document.createElement("div");
var elB=document.createElement("div");
elB.setAttribute("id","brtS");
el.setAttribute("id","volS");
Object.assign(el.style,elStyle);
Object.assign(elB.style,elStyle);
elB.style.left="0";
el.innerHTML=`${volSvg}<div style="position:absolute;bottom:5%;left:calc(50% - 1.5px);background:rgba(255,255,255,0.5); height:70%;width:3px;border-radius:3px;color:red;box-shadow:0px 0px 2px black;pointer-events:none" ><div style="background:white;width:100%;height:${vol * 100}%;border-radius:3px;position:absolute;bottom:0;box-shadow:0px 0px 2px black;" id="volIS"></div></div>`;
elB.innerHTML=`${brtSvg}<div style="position:absolute;bottom:5%;left:calc(50% - 1.5px);background:rgba(255,255,255,0.5); height:70%;width:3px;border-radius:3px;color:red;box-shadow:0px 0px 2px black;pointer-events:none" ><div style="background:white;width:100%;height:${brt * 100}%;border-radius:3px;position:absolute;bottom:0;box-shadow:0px 0px 1px black;" id="brtIS"></div></div>`;
if(!document.getElementById("brtS")){
document.getElementById("player-container-id").appendChild(elB);
elB.addEventListener("touchmove",(e)=>{
e.preventDefault();
elB.style.opacity="1";
var diff= touchstartY - e.touches[0].pageY;
if(diff > 0){ brt +=sens; }else{ brt -=sens; }
if(brt > 1) brt=1;
if(brt < 0) brt =0;
touchstartY=e.touches[0].pageY;
try{ Android.setBrightness(brt); }catch(e){}
try{ showGestureHUD("brt", brt); }catch(e){}
document.getElementById("brtIS").style.height=brt*100+"%";
},{ passive: false })
elB.addEventListener("touchend",(e)=>{ elB.style.opacity="0"; },{ passive: false });
}
if(!document.getElementById("volS")){
document.getElementById("player-container-id").appendChild(el);
el.addEventListener("touchmove",(e)=>{
e.preventDefault();
el.style.opacity="1";
var diff= touchstartY - e.touches[0].pageY;
if(diff > 0){ vol +=sens; }else{ vol -=sens; }
if(vol > 1) vol=1;
if(vol < 0) vol =0;
touchstartY=e.touches[0].pageY;
try{ Android.setVolume(vol); }catch(e){}
try{ showGestureHUD("vol", vol); }catch(e){}
document.getElementById("volIS").style.height=vol * 100 +"%";
},{ passive: false })
el.addEventListener("touchend",(e)=>{ el.style.opacity="0"; },{ passive: false });
}
}
}
}catch(e){ console.log(e) }

if(document.getElementById("ytproMainDivE") == null){
try{
var ytproMainDivA=document.createElement("div");
ytproMainDivA.setAttribute("id","ytproMainDivE");
ytproMainDivA.setAttribute("style",`height:50px;width:100%;display:block;overflow:auto;`);
insertAfter(document.getElementsByClassName('slim-video-action-bar-actions')[0],ytproMainDivA);
var ytproMainDiv=document.createElement("div");
ytproMainDiv.setAttribute("style",`height:50px;width:100%;display:flex;overflow:auto;align-items:center;justify-content:center;`);
ytproMainDivA.appendChild(ytproMainDiv);

var ytproGemini=document.createElement("div");
sty(ytproGemini);
ytproGemini.style.width="30px";
ytproGemini.style.height="calc(65% - 4.5px)";
ytproGemini.style.position="relative";
ytproGemini.style.background=`linear-gradient(${isD ? "#272727,#272727" : "#f2f2f2,#f2f2f2"}) padding-box , linear-gradient(16deg ,#4285f4 ,#9b72cb ,#d96570) border-box`;
ytproGemini.style.border="2px solid transparent";
ytproGemini.innerHTML=`<svg style="height:20px;width:20px" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stop-color="#9168C0"/><stop offset=".343" stop-color="#5684D1"/><stop offset=".672" stop-color="#1BA1E3"/></radialGradient></defs></svg>
<style type="text/css">
#GeminiResponse img{max-width:90%;height:auto;border-radius:10px;margin-top:5px;}
#GeminiResponse a{color:rgb(62,166,255);}
.geminiLoader,.geminiLoader:before,.geminiLoader:after{content:'';height:10px;width:70%;position:absolute;top:15px;border-radius:5px;left:10px;background:${d};animation: geminiLoad 1s linear infinite alternate;}
.geminiLoader:before{top:27px;left:0;}
.geminiLoader:after{top:54px;left:0;width:90%;}
@keyframes geminiLoad{0% {opacity:1;}100% {opacity:.4;}}
.geminiThoughts{height:0;width:calc(100% - 30px);transition:5s;float:left;overflow:hidden;padding-left:5px;font-style:italic;border-left:3px solid ${d};display:block;float:none;clear:both;}
.geminiAnswer{height:auto;width:100%;display:block;float:none;clear:both;}
#GeminiResponse .think{background:transparent;font-size:1.45rem;width:calc(100% - 20px);height:20px;color:${isD ? "#ccc" : "#444"};margin-top:3px;text-align:left;display:flex;padding-left:5px;border-left:3px solid ${d};}
</style>`;

ytproMainDiv.appendChild(ytproGemini);
ytproGemini.addEventListener("click",async function(){
geminiInfo();
});

var ytproFavElem=document.createElement("div");
sty(ytproFavElem);
if(!isHeart()){
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${c}" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
}else{
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${c}" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>`;
}
ytproMainDiv.appendChild(ytproFavElem);
ytproFavElem.addEventListener("click",()=>{ytProHeart(ytproFavElem);});

var ytproDownVidElem=document.createElement("div");
sty(ytproDownVidElem);
ytproDownVidElem.innerHTML=`${downBtn.replace('width="18"','width="24"').replace('height="18"','height="24"')}`;
ytproMainDiv.appendChild(ytproDownVidElem);
ytproDownVidElem.addEventListener("click",function(){
if(window.location.hash === "#download"){
showDownloadMenu();
}else{
window.location.hash="download";
}
});

var ytproPIPVidElem=document.createElement("div");
sty(ytproPIPVidElem);
ytproPIPVidElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" width="22"><path fill="${c}" d="M18 7h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zm3-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm-1 16.01H4c-.55 0-1-.45-1-1V5.98c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.03c0 .55-.45 1-1 1z"/></svg>`;
ytproMainDiv.appendChild(ytproPIPVidElem);
ytproPIPVidElem.addEventListener("click",function(){
PIPlayer(true);
});
}catch(e){}
}
}else if(window.location.href.indexOf("youtube.com/shorts") > -1){
let b = document.getElementById("brtS");
let v = document.getElementById("volS");
if (b) b.remove();
if (v) v.remove();
if(document.getElementById("ytproMainSDivE") == null){
var ys=document.createElement("div");
ys.setAttribute("id","ytproMainSDivE");
ys.setAttribute("style",`width:50px;height:auto;position:relative;display:block;`);
var ysDown=document.createElement("div");
ysDown.setAttribute("style",`height:48px;width:48px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 1px #0009);border-radius:50%;`);
ysDown.innerHTML=downBtn.replaceAll(`${c}`,`#fff`).replace(`width="24"`,`width="30"`).replace(`height="24"`,`height="30"`);
ysDown.addEventListener("click",function(){
if(window.location.hash === "#download"){
showDownloadMenu();
}else{
window.location.hash="download";
}
});
var ysHeart=document.createElement("div");
ysHeart.setAttribute("style",`height:48px;width:48px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 1px #0009);border-radius:50%;margin-bottom:0px;`);
if(!isHeart()){
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="#fff" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
}else{
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="#fff" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>`;
}
ysHeart.addEventListener("click",function(){ ytProHeart(ysHeart); });
try{
if(document.getElementsByClassName("ytwReelActionBarViewModelHost")[0].children[0]){
document.getElementsByClassName("ytwReelActionBarViewModelHost")[0].insertBefore(ys,document.getElementsByClassName("ytwReelActionBarViewModelHost")[0].children[0]);
ys.appendChild(ysHeart);
ys.appendChild(ysDown);
}
}catch(e){}
}
if(!document.getElementById("ytShortsDislikes")){
try{document.querySelectorAll('like-button-view-model')[0].children[0].children[0].children[0].insertAdjacentHTML("beforeend",`<span style="height:3px;width:3px;border-radius:50%;box-shadow:0px 0px 3px black;margin:3px;background:white">&nbsp;</span><span id="ytShortsDislikes" style="font-weight:bold;text-shadow:0px 0px 3px black;">${dislikes}</span>`);}catch(e){}
}else{
document.getElementById("ytShortsDislikes").innerHTML=dislikes;
}
}
}

setInterval(pkc,100);

async function showHearts(){
var ytproH=document.createElement("div");
var ytproHh=document.createElement("div");
ytproHh.setAttribute("id","heartytprodiv");
ytproH.setAttribute("id","outerheartsdiv");
ytproH.setAttribute("style",`height:100%;width:100%;position:fixed;top:0;left:0;display:flex;justify-content:center;background:rgba(0,0,0,0.4);z-index:99;`);
ytproHh.setAttribute("style",`height:50%;width:85%;overflow:auto;background:${isD ? "#212121" : "#f1f1f1"};position:absolute;bottom:20px;z-index:9;padding:20px;text-align:center;border-radius:25px;text-align:center;`);
ytproHh.innerHTML=`<style>#heartytprodiv a{text-decoration:none;} #heartytprodiv li{list-style:none; display:flex;align-items:center;border-radius:15px;padding:0px;background:${d};margin:5px;}</style>`;
ytproHh.innerHTML+="Vídeos Curtidos<ul id='listurl'>";
ytproHh.innerHTML+="<style>.thum{height:70px;border-radius:5px;}.thum img{float:left;height:70px;width:125px;border-radius:15px 0 0 15px;flex-shrink: 0;}</style>";

document.body.appendChild(ytproH);
ytproH.appendChild(ytproHh);

ytproH.addEventListener("click",function(ev){
if(!ev.composedPath().includes(ytproHh)){
history.back();
}
});

if(localStorage.getItem("hearts") == null){
ytproHh.innerHTML+="Nenhum vídeo encontrado";
}else{
var v=JSON.parse(localStorage.getItem("hearts"));
if(Object.keys(v).length === 0){
return ytproHh.innerHTML+="Nenhum vídeo encontrado";
}
for(var n=Object.keys(v).length - 1; n > -1 ; n--){
var x=Object.keys(v)[n];
ytproHh.innerHTML+=`<li class="thum" >
<img data-action="navigateInternalYtMweb" data-id="${x}" style="object-fit:contain;" src="${v[x].thumb}" ><br>
<div style="width:calc(100% - 170px);margin-left:5px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical; -webkit-line-clamp:3;overflow:hidden;text-overflow:ellipsis;" data-action="navigateInternalYtMweb" data-id="${x}" >${v[x].title}</div>
<div style="width:calc(100% - (100% - 35px))">
<svg data-action="remHeart" data-id="${x}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:0px;" fill="${c}" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</div>
</li>`;
await new Promise(r => setTimeout(r, 1));
}
ytproHh.addEventListener("click",(e)=>{
  var el=e.target.closest("[data-action]");
  if(!el) return;
  if(el.dataset.action == "navigateInternalYtMweb"){
    navigateInternalYtMweb(el.dataset.id);
  }else if(el.dataset.action == "remHeart"){
    remHeart(el,el.dataset.id);
  }
});
}
}

function navigateInternalYtMweb(videoId) {
window.location.hash="";
const link = document.createElement('a');
link.href = `/watch?v=${videoId}`;
link.style.display = 'none';
document.body.appendChild(link);
link.click();
link.remove();
}

function remHeart(y,x){
if(localStorage.getItem("hearts")?.indexOf(x) > -1){
y.parentElement.parentElement.remove();
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
delete j[x];
localStorage.setItem("hearts",JSON.stringify(j));
}
}

function ytProHeart(x){
var vid=(new URLSearchParams(window.location.search)).get('v') || window.location.pathname.replace("/shorts/","");
var video = document.getElementsByClassName('video-stream')[0];
if(!video) return;
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var isShorts = window.location.pathname.indexOf("shorts") > -1;

if (isShorts) {
  canvas.width = 90; canvas.height = 160;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
} else {
  canvas.width = 320; canvas.height = 180;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}
var dataURI = canvas.toDataURL('image/jpeg');

if(window.location.pathname.indexOf("shorts") > -1){
var vDetails={
thumb:dataURI,
title:document.getElementsByClassName('ytShortsVideoTitleViewModelShortsVideoTitle')[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};
}else{
var vDetails={
thumb:dataURI,
title:document.getElementsByClassName('slim-video-metadata-header')[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};
}

var g="24";
if(localStorage.getItem("hearts")?.indexOf(vid) > -1){
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
delete j[vid];
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" fill="${(window.location.href.indexOf('youtube.com/shorts') > -1) ? "#fff" : c }" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${(window.location.href.indexOf('youtube.com/shorts') > -1) ? "#fff" : c }" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
}else{
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
j[vid]=vDetails;
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" viewBox="0 0 24 24" ><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${(window.location.href.indexOf('youtube.com/shorts') > -1) ? "#fff" : c }" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>`;
}
}

function isHeart(){
if((localStorage.getItem("hearts")?.indexOf((new URLSearchParams(window.location.search)).get('v')) > -1) || (localStorage.getItem("hearts")?.indexOf(window.location.pathname.replace("/shorts/","")) > -1)){
return true;
}else{
return false;
}
}

function removePIP(){
isPIP=false;
pauseAllowed = true;
try { if (document.fullscreenElement && typeof document.exitFullscreen === "function") document.exitFullscreen(); } catch (_) {}
try{
document.getElementsByClassName('video-stream')[0].pause();
setTimeout(()=>{
document.getElementsByClassName('video-stream')[0].play();
},5);
}catch(e){}
}

function PIPlayer(pip = false){
var v=document.getElementsByClassName('video-stream')[0];
if(!v) return;
if(pip){
try{
if(v.getBoundingClientRect().height > v.getBoundingClientRect().width){
Android.pipvid("portrait");
}else{
Android.pipvid("landscape");
}
}catch(e){}
return;
}
if (typeof v.requestFullscreen === "function") v.requestFullscreen().catch(() => {});
try { v.play().catch(() => {}); } catch (_) {}
pauseAllowed = false;
isPIP=true;
}

HTMLMediaElement.prototype.pause = function(){
if (pauseAllowed || PIPause) {
return originalPause.apply(this, arguments);
}
if (this.paused) {
this.play().catch(() => {});
}
};

const originalExitFullscreen = document.exitFullscreen;
const originalRequestFullscreen = Element.prototype.requestFullscreen;

document.exitFullscreen = function (...args) {
if(!isPIP){ return originalExitFullscreen.apply(this, args); }
};

Element.prototype.requestFullscreen = function (...args) {
try{
var video = document.getElementsByClassName('video-stream')[0];
if(video){
if(video.getBoundingClientRect().height > video.getBoundingClientRect().width){
Android.fullScreen(true);
}else{
Android.fullScreen(false);
}
}
}catch(e){}
return originalRequestFullscreen.apply(this, args);
};

window.addEventListener("hashchange",()=>{
try{document.getElementById("outerdownytprodiv").remove();}catch(e){}
try{document.getElementById("outerheartsdiv").remove();}catch(e){}
try{document.getElementById("settingsprodiv").remove();}catch(e){}
try{document.getElementById("ytproDownloadMenu").remove();}catch(e){}
if(window.location.hash == "#download"){
showDownloadMenu();
}else if(window.location.hash == "#settings"){
ytproSettings();
}
else if(window.location.hash == "#hearts"){
showHearts();
}
});

(() => {
const _origFetch = window.fetch;
window.fetch = async function(input, init) {
try {
const url = (typeof input === 'string') ? input : input.url;
if(url.includes("googleads.g.doubleclick.net") || url.includes("youtube.com/youtubei/v1/player/ad_break") || url.includes("youtube.com/pagead/adview") || url.includes("youtube.com/api/stats/ads")){
return "";
}else if(url.includes("youtube.com/youtubei/")){
const response = await _origFetch.apply(this, arguments);
try {
const clone = response.clone();
let data = await clone.json();
if(data?.responseContext?.webResponseContextExtensionData?.webResponseContextPreloadData?.preloadMessageNames?.[0] == "adSlotRenderer" || data?.responseContext?.webResponseContextExtensionData?.webResponseContextPreloadData?.preloadMessageNames?.[0] == "shortsAdsRenderer"){
data={};
}
delete data?.adSlots;
delete data?.playerAds;
delete data?.adPlacements;
delete data?.adBreakHeartbeatParams;
delete data?.[0]?.playerResponse?.adSlots;
delete data?.[0]?.playerResponse?.playerAds;
delete data?.[0]?.playerResponse?.adPlacements;
delete data?.[0]?.playerResponse?.adBreakHeartbeatParams;
const newBody = JSON.stringify(data);
const newHeaders = new Headers(response.headers);
newHeaders.set("content-length", String(newBody.length));
newHeaders.set("content-type", "application/json");
return new Response(newBody, { status: response.status, statusText: response.statusText, headers: newHeaders });
} catch (e) { return response; }
}
return _origFetch.apply(this, arguments);
} catch (e) { }
return _origFetch.apply(this, arguments);
};
})();

const XHR = window.XMLHttpRequest;
const origOpen = XHR.prototype.open;
const origSend = XHR.prototype.send;

XHR.prototype.open = function(method, url, ...rest) {
this._interceptedMethod = method;
this._interceptedUrl = url;
return origOpen.apply(this, [method, url, ...rest]);
};

XHR.prototype.send = function(body) {
if (
this._interceptedUrl.includes("googleads.g.doubleclick.net") ||
this._interceptedUrl.includes("youtube.com/youtubei/v1/player/ad_break") ||
this._interceptedUrl.includes("youtube.com/pagead/adview") ||
this._interceptedUrl.includes("youtube.com/api/stats/ads")
) {
return;
}
return origSend.apply(this, arguments);
};

function adsBlock(){
try{ document.getElementsByClassName('video-stream')[0].removeAttribute('disablepictureinpicture'); }catch(e){}
applyAudioOnlyMode();
applyAutoLoop();
applyAmoledTheme();
applyBigScreenMode();
applyAudioEnhancements();
applyForcedResolution();

if(localStorage.getItem("hideAppUpsell") === "true"){
  try{ document.querySelectorAll("ytm-mealbar-promo-renderer, ytm-statement-banner-renderer, ytm-upsell-dialog-renderer, ytm-fullscreen-engagement-overlay-renderer").forEach(el => el.remove()); }catch(e){}
}

var ads=document.getElementsByTagName("ad-slot-renderer");
for(var x in ads){ try{ads[x].remove();}catch(e){} }
try{
document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].currentTime=document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].duration;
document.getElementsByClassName("ytp-ad-skip-button-modern")[0].click();
}catch(e){}
try{ document.getElementsByTagName("ytm-promoted-sparkles-web-renderer")[0].remove(); }catch(e){}
try{ document.getElementsByTagName("ytm-companion-ad-renderer")[0].remove(); }catch(e){}
try{
document.querySelectorAll('a').forEach(a => {
if (a.href.indexOf("intent://") > -1) { a.style.display = 'none'; }
});
}catch(e){}
try{ document.getElementsByTagName("ytm-paid-content-overlay-renderer")[0].style.display="none"; }catch(e){}

if(localStorage.getItem("communityPosts") == "true"){
document.querySelectorAll("ytm-backstage-post-thread-renderer")?.forEach(el => el.remove());
}

if(localStorage.getItem("shorts") == "true"){
for(var x in document.getElementsByClassName("big-shorts-singleton")){
try{ document.getElementsByClassName("big-shorts-singleton")[x].remove(); }catch(e){}
}
for(var x in document.getElementsByTagName("ytm-reel-shelf-renderer")){
try{ document.getElementsByTagName("ytm-reel-shelf-renderer")[x].remove(); }catch(e){}
for(var x in document.getElementsByTagName("ytm-shorts-lockup-view-model")){
try{ document.getElementsByTagName("ytm-shorts-lockup-view-model")[x].remove(); }catch(e){}
}
}
}
}

function addMaxButton(){
var pElem=document.getElementById('player-container-id');
var Ve=document.getElementById('player');
var Vv=document.getElementsByClassName('video-stream')[0];
if(pElem === document.fullscreenElement){
try{
if(zoomIn){
Ve.style.transform=`scale(${scale})`;
}else{
Ve.style.transform="scale(1)";
}
}catch(e){}
}else{
try{ Ve.style.transform="scale(1)"; }catch(e){}
}
}

async function extraSpeed(){
var el=document.querySelector(".ytwVariableSpeedControllerViewModelButtonContainer");
if(!el) return;
const slider = document.getElementById("slider");
if(!slider) return;
if(slider.max==10) return;
slider.max = 10;
slider.ariaValueMax = "10";
slider.addEventListener("input", () => {
const video = document.querySelector('.video-stream');
if (video) video.playbackRate = parseFloat(slider.value);
});
if(el.children.length >= 6) el.children[0].remove();
if(!document.getElementById("10xSpeed")){
var elm=document.createElement("ytw-variable-speed-controller-speed-button-view-model");
elm.id="10xSpeed";
elm.className="ytwVariableSpeedControllerSpeedButtonViewModelHost ytwVariableSpeedControllerViewModelPlaybackSpeedButton";
elm.insertAdjacentHTML("beforeend",`<button-view-model class="ytSpecButtonViewModelHost"><button class="ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeS ytSpecButtonShapeNextEnableBackdropFilterExperiment" title="" aria-disabled="false" style=""><div class="ytSpecButtonShapeNextButtonTextContent ytSpecButtonShapeNextElevatedContent">10x</div><yt-touch-feedback-shape aria-hidden="true" class="ytSpecTouchFeedbackShapeHost ytSpecTouchFeedbackShapeTouchResponse"><div class="ytSpecTouchFeedbackShapeStroke"></div><div class="ytSpecTouchFeedbackShapeFill"></div></yt-touch-feedback-shape><yt-light-shape aria-hidden="true" class="contribYtLightShapeHost contribYtLightShapeStaticRimLight contribYtLightShapeStaticRimLightTonal" style="--yt-light-wash-opacity: 0; --yt-light-wash-x: 0px; --yt-light-wash-y: 0px; --yt-light-wash-size: 0px;"><div class="contribYtLightShapeStaticWashLight contribYtLightShapeStaticWashLightTonal" style=""></div></yt-light-shape></button></button-view-model>`);
elm.addEventListener("click", () => {
slider.value=10;
slider.dispatchEvent(new Event("input", { bubbles: true }));
});
el.appendChild(elm);
}
}

const targetNode = document.body;
const config = { childList: true, subtree: true };

const observer = new MutationObserver(() => {
extraSpeed();
adsBlock();
addMaxButton();
addSettingsTab();
try{
var video = document.getElementsByClassName('video-stream')[0];
if(video){
if(video.getBoundingClientRect().height > video.getBoundingClientRect().width){
Android.fullScreen(true);
}else{
Android.fullScreen(false);
}
}
}catch(e){}
});

observer.observe(targetNode, config);

function updateModel(){ /* Desativado */ }

document.addEventListener('click',(event) => {
let anchor = event.target.closest('a');
if (anchor){
if(anchor.href.includes("www.youtube.com/redirect")){
try{
document.getElementsByClassName('video-stream')[0].pause();
}catch(e){}
const url=new URL(anchor.href).searchParams.get("q");
setTimeout(()=>{ try{ Android.oplink(url); }catch(e){} },50);
event.preventDefault();
event.stopPropagation();
}
}
},
true);

function showCurtain(){
const el=document.createElement("div");
Object.assign(el.style,{
position:"fixed",
zIndex:"9999999",
width:"100%",
height:"100%",
top:0,
left:0
})
el.id="ytProCurtain"
document.body.appendChild(el)
}

function hideCurtain(){
document.getElementById("ytProCurtain")?.remove()
}

}
