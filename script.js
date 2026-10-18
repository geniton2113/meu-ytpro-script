/***** YOUTUBE PREMIUM CUSTOM SCRIPT *****/
if(!window.YTProVer){
var YTProVer = "50.0 Premium";
var sTime = [];
var GeminiAT = "";
var touchstartY = 0;
var touchendY = 0;
var initialDistance = null;
var sens = 0.005;
var vol = (window.Android && Android.getVolume) ? Android.getVolume() : 1;
var brt = (window.Android && Android.getBrightness) ? Android.getBrightness()/100 : 0.5;

// Inicialização Segura de Configurações
var defaultSettings = {
    bgplay: true, keepscreen: false, speed: "1", loop: false, autoplay: true, unlock60fps: false, volboost: false, doubletap: true, seekstep: "10", autocap: false,
    darkmode: true, oled: false, hideshorts: true, hideshortsnav: true, hidecomm: true, hidecomments: false, hidechat: false, hidewatermark: false, hidecast: false, hidecreate: false, hidenotif: false, hideexplore: false, hidehome: false, hideendscreen: true, hidepremium: true,
    adblock: true, sponsorblock: true, dislikes: true, gestures: true, miniplayergesture: false, forcezoom: false, 
    fastforward: false, spoofios: false, spoofdesktop: false, hideage: false, floatingmenu: false, debug: false
};

var Settings = {};
for (var key in defaultSettings) {
    var saved = localStorage.getItem("ytp_" + key);
    Settings[key] = saved !== null ? (saved === "true" ? true : (saved === "false" ? false : saved)) : defaultSettings[key];
}

function saveSetting(key, val) {
    Settings[key] = val;
    localStorage.setItem("ytp_" + key, val);
    applySettings();
}

var c="#000", d="#f2f2f2", dc="#fff", isD=false, dislikes="...";

function updateThemeColors() {
    isD = Settings.darkmode || Settings.oled;
    if (isD) { c = "#fff"; dc = "#000"; d = "rgba(255,255,255,0.1)"; } 
    else { c = "#000"; dc = "#fff"; d = "rgba(0,0,0,0.05)"; }
}

function injectCustomCSS() {
    var style = document.getElementById("ytp-custom-styles");
    if (!style) {
        style = document.createElement('style');
        style.id = "ytp-custom-styles";
        if(document.head) document.head.appendChild(style);
    }
    if(!style) return;
    
    var css = "";
    if (Settings.hideshorts) css += "ytm-reel-shelf-renderer, ytm-shorts-lockup-view-model { display: none !important; }";
    if (Settings.hideshortsnav) css += "ytm-pivot-bar-item-renderer:nth-child(4) { display: none !important; }";
    if (Settings.hidecomm) css += "ytm-backstage-post-thread-renderer { display: none !important; }";
    if (Settings.hidecomments) css += "#comments-button, ytm-comments-entry-point-header-renderer { display: none !important; }";
    if (Settings.hidechat) css += "#chat-container, ytm-live-chat-header-renderer { display: none !important; }";
    if (Settings.hidewatermark) css += ".ytp-watermark { display: none !important; }";
    if (Settings.hidecast) css += "ytm-cast-button-header { display: none !important; }";
    if (Settings.hidecreate) css += "ytm-pivot-bar-item-renderer:nth-child(3) { display: none !important; }";
    if (Settings.hidenotif) css += "ytm-notification-button-renderer { display: none !important; }";
    if (Settings.hideexplore) css += "ytm-explore-button-renderer { display: none !important; }";
    if (Settings.hidehome) css += "ytm-browse { display: none !important; }";
    if (Settings.hideendscreen) css += ".html5-endscreen, .ytp-ce-element { display: none !important; }";
    if (Settings.hidepremium) css += "ytm-mealbar-promo-renderer, ytm-button-renderer[target-id='premium'] { display: none !important; }";
    
    style.innerHTML = css;
}

function applyDarkMode() {
    if (Settings.darkmode || Settings.oled) {
        document.cookie = "PREF=f6=400; path=/; domain=.youtube.com";
    } else {
        document.cookie = "PREF=f6=0; path=/; domain=.youtube.com";
    }
}

function applySettings() {
    updateThemeColors();
    injectCustomCSS();
    applyDarkMode();
    
    var v = document.querySelector('video');
    if (v) {
        v.playbackRate = parseFloat(Settings.speed) || 1;
        v.loop = Settings.loop;
    }
    
    if (window.Android && window.Android.setBgPlay) {
        window.Android.setBgPlay(Settings.bgplay);
    }
    
    if (Settings.unlock60fps) {
        localStorage.setItem("block_60fps", "false");
    } else {
        localStorage.setItem("block_60fps", "true");
    }
}

function openPremiumMenu() {
    var existing = document.getElementById("premium-cheat-menu");
    if (existing) existing.remove();

    var menuHtml = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        #premium-cheat-menu {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px);
            z-index: 99999999; display: flex; justify-content: center; align-items: center;
            font-family: 'Share Tech Mono', monospace; color: #e0e0e0;
        }
        .pcm-container {
            width: 92%; max-width: 450px; height: 85%; background: #0a0a0c;
            border: 2px solid #00ffcc; border-radius: 12px;
            box-shadow: 0 0 20px rgba(0, 255, 204, 0.4); display: flex; flex-direction: column;
        }
        .pcm-header {
            background: #111; padding: 15px; border-bottom: 2px solid #00ffcc;
            display: flex; justify-content: space-between; align-items: center;
        }
        .pcm-title {
            font-size: 18px; font-weight: bold; color: #00ffcc;
            text-shadow: 0 0 10px #00ffcc; letter-spacing: 2px;
        }
        .pcm-close {
            color: #ff3366; font-size: 24px; font-weight: bold; cursor: pointer;
            text-shadow: 0 0 5px #ff3366; transition: 0.2s;
        }
        .pcm-close:hover { transform: scale(1.2); }
        .pcm-content {
            padding: 15px; overflow-y: auto; flex: 1;
        }
        .pcm-content::-webkit-scrollbar { width: 6px; }
        .pcm-content::-webkit-scrollbar-thumb { background: #00ffcc; border-radius: 3px; }
        .pcm-section {
            font-size: 14px; color: #00ffcc; margin: 15px 0 10px 0;
            border-bottom: 1px solid #333; padding-bottom: 5px;
        }
        .pcm-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px; background: #151518; border-radius: 8px; margin-bottom: 8px;
            border: 1px solid #222; transition: 0.2s;
        }
        .pcm-row:hover { border-color: #00ffcc; box-shadow: 0 0 8px rgba(0, 255, 204, 0.2); }
        .pcm-label { font-size: 13px; }
        .pcm-btn {
            background: #222; color: #fff; border: 1px solid #444;
            padding: 5px 10px; border-radius: 5px; cursor: pointer; font-family: inherit;
        }
        .pcm-btn:hover { background: #00ffcc; color: #000; }
        .pcm-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .pcm-switch input { opacity: 0; width: 0; height: 0; }
        .pcm-slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #333; transition: .4s; border-radius: 20px;
        }
        .pcm-slider:before {
            position: absolute; content: ""; height: 16px; width: 16px;
            left: 2px; bottom: 2px; background-color: #888; transition: .4s; border-radius: 50%;
        }
        .pcm-switch input:checked + .pcm-slider { background-color: #00ffcc; box-shadow: 0 0 10px #00ffcc; }
        .pcm-switch input:checked + .pcm-slider:before { transform: translateX(20px); background-color: #000; }
        .pcm-select {
            background: #222; color: #00ffcc; border: 1px solid #444; padding: 4px; border-radius: 4px;
        }
    </style>
    
    <div class="pcm-container">
        <div class="pcm-header">
            <div class="pcm-title">CONFIGURAÇÕES PREMIUM</div>
            <div class="pcm-close" onclick="document.getElementById('premium-cheat-menu').remove()">×</div>
        </div>
        <div class="pcm-content">
            
            <div class="pcm-section">▶ REPRODUÇÃO</div>
            ${createToggle('Reprodução em Segundo Plano', 'bgplay')}
            ${createToggle('Manter Tela Ligada', 'keepscreen')}
            ${createToggle('Loop Automático', 'loop')}
            ${createToggle('Desbloquear 60FPS', 'unlock60fps')}
            ${createToggle('Aumentar Volume (200%)', 'volboost')}
            ${createDropdown('Velocidade Padrão', 'speed', ['0.5', '1', '1.5', '2'])}
            
            <div class="pcm-section">🛡️ LIMPEZA E UI</div>
            ${createToggle('Forçar Tema Escuro', 'darkmode')}
            ${createToggle('Tema OLED (Preto)', 'oled')}
            ${createToggle('Ocultar Shorts (Home)', 'hideshorts')}
            ${createToggle('Ocultar Shorts (Nav)', 'hideshortsnav')}
            ${createToggle('Ocultar Posts Comunidade', 'hidecomm')}
            ${createToggle('Ocultar Comentários', 'hidecomments')}
            ${createToggle('Ocultar Chat ao Vivo', 'hidechat')}
            ${createToggle("Ocultar Marca D'água", 'hidewatermark')}
            ${createToggle('Ocultar Botão Cast', 'hidecast')}
            ${createToggle('Ocultar Botão Criar', 'hidecreate')}
            ${createToggle('Ocultar Notificações', 'hidenotif')}
            ${createToggle('Ocultar Tela Inicial', 'hidehome')}
            ${createToggle('Ocultar Fim do Vídeo', 'hideendscreen')}
            
            <div class="pcm-section">⚙️ FUNÇÕES CORE</div>
            ${createToggle('AdBlock Master', 'adblock')}
            ${createToggle('Pular Patrocinadores', 'sponsorblock')}
            ${createToggle('Retornar Deslikes', 'dislikes')}
            ${createToggle('Controles de Gestos', 'gestures')}
            ${createToggle('Gesto do Miniplayer', 'miniplayergesture')}
            ${createToggle('Forçar Zoom', 'forcezoom')}
            
            <div class="pcm-section">🚀 CHEATS EXTRAS</div>
            ${createToggle('Botão Fast Forward (10x)', 'fastforward')}
            ${createToggle('Spoof User Agent (iOS)', 'spoofios')}
            ${createToggle('Esconder Idade Restrita', 'hideage')}
            ${createToggle('Modo Debug (Eruda)', 'debug')}
            
            <div class="pcm-section">🔧 FERRAMENTAS</div>
            <div class="pcm-row">
                <span class="pcm-label">Ações Rápidas</span>
                <div>
                    <button class="pcm-btn" onclick="if(window.ytproSabrDownload) window.ytproSabrDownload(); else alert('Downloader não carregado');">Baixar Vídeo</button>
                </div>
            </div>
            <div class="pcm-row">
                <span class="pcm-label">Copiar Link do Vídeo</span>
                <button class="pcm-btn" onclick="copyCurrentLink()">Copiar</button>
            </div>
            <div class="pcm-row">
                <span class="pcm-label">Limpar Cache do App</span>
                <button class="pcm-btn" onclick="if(window.Android && Android.clearAppCache) Android.clearAppCache()">Limpar</button>
            </div>
            <div class="pcm-row">
                <span class="pcm-label">Créditos</span>
                <span style="color:#00ffcc; font-weight:bold;">YOUTUBE PREMIUM</span>
            </div>
            
            <br><br><br>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', menuHtml);
}

function createToggle(label, key) {
    var checked = Settings[key] ? 'checked' : '';
    return `
    <div class="pcm-row">
        <span class="pcm-label">${label}</span>
        <label class="pcm-switch">
            <input type="checkbox" ${checked} onchange="saveSetting('${key}', this.checked)">
            <span class="pcm-slider"></span>
        </label>
    </div>`;
}
function createDropdown(label, key, options) {
    var opts = options.map(o => `<option value="${o}" ${Settings[key] == o ? 'selected' : ''}>${o}</option>`).join('');
    return `
    <div class="pcm-row">
        <span class="pcm-label">${label}</span>
        <select class="pcm-select" onchange="saveSetting('${key}', this.value)">${opts}</select>
    </div>`;
}

function copyCurrentLink() {
    let url = window.location.href.split('&si=')[0];
    navigator.clipboard.writeText(url).then(() => {
        if(window.Android && Android.showToast) Android.showToast("Link copiado!");
    });
}

function addSettingsTab() {
    if (document.getElementById("setDiv") == null) {
        var setDiv = document.createElement("div");
        setDiv.setAttribute("style", `
            z-index: 99999999;
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00ffcc, #0088ff);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0, 255, 204, 0.5);
            cursor: pointer;
        `);
        setDiv.setAttribute("id", "setDiv");
        setDiv.innerHTML = `<svg fill="#000" xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28"><path d="M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z"></path></svg>`;
        
        document.body.appendChild(setDiv);
        setDiv.addEventListener("click", openPremiumMenu);
    }
}

function initAdBlock() {
    if (!Settings.adblock) return;
    const _origFetch = window.fetch;
    window.fetch = async function(input, init) {
        try {
            const url = (typeof input === 'string') ? input : input.url;
            if(url.includes("googleads.g.doubleclick.net") || url.includes("youtube.com/youtubei/v1/player/ad_break") || url.includes("youtube.com/pagead/adview") || url.includes("youtube.com/api/stats/ads")){
                return "";
            } else if(url.includes("youtube.com/youtubei/")) {
                const response = await _origFetch.apply(this, arguments);
                try {
                    const clone = response.clone();
                    let data = await clone.json();
                    delete data?.adSlots;
                    delete data?.playerAds;
                    delete data?.adPlacements;
                    delete data?.[0]?.playerResponse?.adSlots;
                    delete data?.[0]?.playerResponse?.playerAds;
                    const newBody = JSON.stringify(data);
                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("content-length", String(newBody.length));
                    return new Response(newBody, { status: response.status, headers: newHeaders });
                } catch (e) { return response; }
            }
            return _origFetch.apply(this, arguments);
        } catch (e) { return _origFetch.apply(this, arguments); }
    };
}

function adsBlockDOM() {
    if (!Settings.adblock) return;
    try {
        var ads = document.getElementsByTagName("ad-slot-renderer");
        for(var x in ads) { try { ads[x].remove(); } catch{} }
        var adInt = document.getElementsByClassName("ad-interrupting");
        if(adInt.length > 0) {
            var vid = adInt[0].getElementsByTagName("video")[0];
            if(vid) vid.currentTime = vid.duration;
        }
    } catch{}
}

function initGestures() {
    if (!Settings.gestures) return;
    document.body.addEventListener('touchstart', e => {
        touchstartY = e.changedTouches[0].screenY;
    }, { capture: true });

    document.body.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && e.target.className.includes("video-stream")) {
            var diff = touchstartY - e.touches[0].pageY;
            if (Math.abs(diff) > 10) {
                // Lógica de Volume/Brilho
            }
        }
    }, { capture: true });
}

// Inicialização Segura (Não depende do window.load)
setTimeout(function() {
    applySettings();
    initAdBlock();
    initGestures();
    
    var observer = new MutationObserver(() => {
        injectCustomCSS();
        adsBlockDOM();
        addSettingsTab();
        
        var v = document.querySelector('video');
        if (v) {
            if (Settings.loop && !v.loop) v.loop = true;
            if (Settings.speed && v.playbackRate != parseFloat(Settings.speed)) {
                v.playbackRate = parseFloat(Settings.speed);
            }
        }
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    injectCustomCSS();
    addSettingsTab();
    
    if (window.location.hash === "#settings") {
        openPremiumMenu();
    }
}, 1000); // Espera 1 segundo para garantir que a página carregou

}
