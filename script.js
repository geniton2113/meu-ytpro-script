/* ============================================================
   YOUTUBE PREMIUM — CONFIGURAÇÕES PREMIUM (PT-BR)
   Versão 5.0.0 PT — Script Completo
   ============================================================ */
(function () {
  'use strict';

  // Guarda única para evitar execução dupla
  if (window.__YTPREMIUM_PT__) return;
  window.__YTPREMIUM_PT__ = true;

  var YTProVer = "5.0.0 PT";

  // ---------- Utilitários ----------
  function $(id) { return document.getElementById(id); }
  function qs(sel) { try { return document.querySelector(sel); } catch (e) { return null; } }
  function qsa(sel) { try { return document.querySelectorAll(sel); } catch (e) { return []; } }

  function get(key, def) {
    var v = localStorage.getItem("ytp_" + key);
    if (v === null) return def;
    if (v === "true") return true;
    if (v === "false") return false;
    return v;
  }
  function set(key, val) {
    localStorage.setItem("ytp_" + key, val);
  }

  // ---------- Configurações Padrão ----------
  var DEFAULTS = {
    // Reprodução
    bgplay: true,
    keepscreen: false,
    loop: false,
    speed: "1",
    autoplaynext: true,
    unlock60fps: false,
    quality: "auto",
    volboost: false,
    seekstep: "10",
    autocap: false,
    capfontsize: "100",
    // Clean UI
    darkmode: true,
    oled: false,
    hideshorts: true,
    hideshortsnav: true,
    hidecomm: true,
    hidecomments: false,
    hidechat: false,
    hidewatermark: false,
    hidecast: false,
    hidecreate: false,
    hidenotif: false,
    hideexplore: false,
    hidehome: false,
    hideendscreen: true,
    hidepremium: true,
    hidemerch: false,
    hideinfocards: false,
    hidepauseoverlay: false,
    hideactions: false,
    hidesubbutton: false,
    hidesharebar: false,
    hidethumbs: false,
    hidechannelname: false,
    hideviews: false,
    hideuploaddate: false,
    hideverified: false,
    hidelive: false,
    hidewatched: false,
    hidemix: false,
    hidepromobanners: false,
    hidesearchbar: false,
    hidelogo: false,
    hideback: false,
    hidehamburger: false,
    hideplayercontrols: false,
    hidelike: false,
    hidedislike: false,
    hidesave: false,
    hideshare: false,
    hidedownload: false,
    hidemore: false,
    // Core
    adblock: true,
    sponsorblock: true,
    dislikes: true,
    gestures: true,
    miniplayergesture: false,
    forcezoom: false,
    pipbutton: true,
    fastforward: false,
    autolike: false,
    autosubscribe: false,
    // Extras
    spoofios: false,
    spoofdesktop: false,
    hideage: false,
    debug: false,
    eventlog: false,
    cinemamode: false,
    autofullscreen: false,
    disableanimations: false,
    highcontrast: false,
    grayscale: false,
    sepia: false,
    invert: false,
    nightfilter: false,
    screendimmer: false,
    batterysaver: false,
    performancemode: false,
    turbomode: false,
    experimental: false,
    // Gemini
    gemini: true,
    geminiModel: "3.5 Flash-Lite",
    geminiSingleChat: true,
    // Temas extras
    glasseffect: false,
    neonglow: false,
    retro: false,
    matrix: false,
    cyberpunk: false
  };

  var Settings = {};
  (function initSettings() {
    for (var k in DEFAULTS) {
      var v = localStorage.getItem("ytp_" + k);
      if (v === null) {
        Settings[k] = DEFAULTS[k];
      } else if (v === "true") {
        Settings[k] = true;
      } else if (v === "false") {
        Settings[k] = false;
      } else {
        Settings[k] = v;
      }
    }
  })();

  function saveSetting(key, val) {
    Settings[key] = val;
    localStorage.setItem("ytp_" + key, String(val));
    applySettings();
  }

  // ---------- Tema ----------
  var C = "#000", D = "#f2f2f2", DC = "#fff", IS_DARK = false;
  function updateTheme() {
    IS_DARK = Settings.darkmode || Settings.oled;
    if (IS_DARK) { C = "#fff"; DC = "#000"; D = "rgba(255,255,255,0.1)"; }
    else { C = "#000"; DC = "#fff"; D = "rgba(0,0,0,0.05)"; }
  }

  // ---------- CSS Dinâmico (todas as limpezas + temas) ----------
  function buildCSS() {
    var css = [];
    // Temas
    if (Settings.oled) {
      css.push("html,body,ytm-app{background:#000!important;color:#fff!important}");
    }
    if (Settings.grayscale) css.push("html{filter:grayscale(100%)!important}");
    if (Settings.sepia) css.push("html{filter:sepia(100%)!important}");
    if (Settings.invert) css.push("html{filter:invert(100%)!important}");
    if (Settings.highcontrast) css.push("html{filter:contrast(150%)!important}");
    if (Settings.nightfilter) css.push("html::after{content:'';position:fixed;inset:0;background:rgba(255,160,0,.15);pointer-events:none;z-index:2147483646}");
    if (Settings.screendimmer) css.push("html::after{content:'';position:fixed;inset:0;background:rgba(0,0,0,.4);pointer-events:none;z-index:2147483646}");
    if (Settings.disableanimations) css.push("*{animation:none!important;transition:none!important}");
    if (Settings.neonglow) css.push("ytm-app{text-shadow:0 0 3px #0ff}");
    if (Settings.glasseffect) css.push("ytm-app,ytm-app *{backdrop-filter:blur(8px)}");
    if (Settings.matrix) css.push("html{filter:hue-rotate(90deg) saturate(2)}");
    if (Settings.cyberpunk) css.push("html{filter:hue-rotate(280deg) saturate(1.5)}");
    if (Settings.retro) css.push("html{filter:sepia(.5) contrast(1.2)}");

    // Shorts
    if (Settings.hideshorts) css.push("ytm-reel-shelf-renderer,ytm-shorts-lockup-view-model,.big-shorts-singleton{display:none!important}");
    if (Settings.hideshortsnav) css.push("ytm-pivot-bar-item-renderer:nth-child(4){display:none!important}");

    // Comunidade
    if (Settings.hidecomm) css.push("ytm-backstage-post-thread-renderer{display:none!important}");

    // Comentários
    if (Settings.hidecomments) css.push("#comments-button,ytm-comments-entry-point-header-renderer,ytm-comment-section-renderer{display:none!important}");

    // Chat
    if (Settings.hidechat) css.push("#chat-container,ytm-live-chat-header-renderer,ytm-live-chat-renderer{display:none!important}");

    // Marca d'água
    if (Settings.hidewatermark) css.push(".ytp-watermark{display:none!important}");

    // Cast / Create / Notif / Explore
    if (Settings.hidecast) css.push("ytm-cast-button-header{display:none!important}");
    if (Settings.hidecreate) css.push("ytm-pivot-bar-item-renderer:nth-child(3){display:none!important}");
    if (Settings.hidenotif) css.push("ytm-notification-button-renderer{display:none!important}");
    if (Settings.hideexplore) css.push("ytm-explore-button-renderer{display:none!important}");

    // Home feed
    if (Settings.hidehome) css.push("ytm-browse{display:none!important}");

    // Fim do vídeo
    if (Settings.hideendscreen) css.push(".html5-endscreen,.ytp-ce-element,.ytp-endscreen-content{display:none!important}");

    // Promoções
    if (Settings.hidepremium) css.push("ytm-mealbar-promo-renderer,ytm-button-renderer[target-id='premium']{display:none!important}");

    // Merch
    if (Settings.hidemerch) css.push("ytm-merch-shelf-renderer,.ytp-suggested-action{display:none!important}");

    // Info cards
    if (Settings.hideinfocards) css.push(".ytp-cards-teaser,.iv-branding{display:none!important}");

    // Pause overlay
    if (Settings.hidepauseoverlay) css.push(".ytp-pause-overlay,.ytp-scroll-min{display:none!important}");

    // Actions
    if (Settings.hideactions) css.push(".slim-video-action-bar-actions{display:none!important}");

    // Sub button
    if (Settings.hidesubbutton) css.push("ytm-subscribe-button-renderer{display:none!important}");

    // Share bar
    if (Settings.hidesharebar) css.push("ytm-slim-video-action-bar-renderer{display:none!important}");

    // Thumbnails
    if (Settings.hidethumbs) css.push("ytm-thumbnail-view-model,img.ytCoreImageHost{visibility:hidden!important}");

    // Channel name
    if (Settings.hidechannelname) css.push(".ytm-channel-name,.ytCoreImageHost~div{display:none!important}");

    // Views / date
    if (Settings.hideviews) css.push("ytm-video-with-context-renderer .ytm-video-info-renderer .ytm-video-info-metadata{display:none!important}");
    if (Settings.hideuploaddate) css.push(".ytm-video-info-renderer .ytm-video-info-metadata-item{display:none!important}");

    // Badges
    if (Settings.hideverified) css.push(".badge-style-type-verified,.yt-icon-badge{display:none!important}");
    if (Settings.hidelive) css.push(".badge-style-type-live-now,.ytm-live-badge{display:none!important}");

    // Watched
    if (Settings.hidewatched) css.push("ytm-video-with-context-renderer[is-watched]{opacity:0!important}");

    // Mix
    if (Settings.hidemix) css.push("ytm-radio-renderer,ytm-immersive-header-renderer{display:none!important}");

    // Promo banners
    if (Settings.hidepromobanners) css.push("ytm-banner-promo-renderer,ytm-statement-banner-renderer{display:none!important}");

    // Search bar / logo / back / hamburger
    if (Settings.hidesearchbar) css.push("ytm-searchbox{display:none!important}");
    if (Settings.hidelogo) css.push("ytm-home-logo{display:none!important}");
    if (Settings.hideback) css.push("ytm-topbar-menu-button-renderer:first-child{display:none!important}");
    if (Settings.hidehamburger) css.push("ytm-topbar-menu-button-renderer{display:none!important}");

    // Player controls
    if (Settings.hideplayercontrols) css.push(".ytp-chrome-bottom,.ytp-chrome-top{display:none!important}");

    // Like/dislike/save/share/download/more
    if (Settings.hidelike) css.push("like-button-view-model{display:none!important}");
    if (Settings.hidedislike) css.push("dislike-button-view-model{display:none!important}");
    if (Settings.hidesave) css.push("ytm-save-button-renderer{display:none!important}");
    if (Settings.hideshare) css.push("ytm-button-renderer[target-id='share']{display:none!important}");
    if (Settings.hidedownload) css.push("[data-action='download']{display:none!important}");
    if (Settings.hidemore) css.push("ytm-button-renderer[target-id='more']{display:none!important}");

    // Debug visual
    if (Settings.debug) css.push("body::before{content:'DEBUG ON';position:fixed;top:0;left:0;background:#f00;color:#fff;padding:2px 6px;z-index:2147483647;font-size:12px}");

    return css.join("\n");
  }

  var styleEl = null;
  function injectCSS() {
    try {
      if (!document.head) return;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "ytp-custom-styles";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = buildCSS();
    } catch (e) { /* silencioso */ }
  }

  // ---------- Aplicar Configurações ----------
  function applySettings() {
    try {
      updateTheme();
      injectCSS();

      // Dark mode via cookie
      try {
        if (Settings.darkmode || Settings.oled) {
          document.cookie = "PREF=f6=400; path=/; domain=.youtube.com";
        } else {
          document.cookie = "PREF=f6=0; path=/; domain=.youtube.com";
        }
      } catch (e) {}

      // Background play
      try {
        if (window.Android && window.Android.setBgPlay) {
          window.Android.setBgPlay(!!Settings.bgplay);
        }
      } catch (e) {}

      // Keep screen on
      try {
        if (window.Android && window.Android.keepScreenOn) {
          window.Android.keepScreenOn(!!Settings.keepscreen);
        }
      } catch (e) {}

      // 60fps
      try {
        localStorage.setItem("block_60fps", Settings.unlock60fps ? "false" : "true");
      } catch (e) {}

      // Player properties
      var v = qs("video");
      if (v) {
        if (Settings.loop) v.loop = true; else v.loop = false;
        var s = parseFloat(Settings.speed);
        if (!isNaN(s) && s > 0) v.playbackRate = s;
      }
    } catch (e) { /* silencioso */ }
  }

  // ---------- Adblock (fetch) ----------
  function initAdblock() {
    if (!Settings.adblock) return;
    try {
      var origFetch = window.fetch;
      window.fetch = function (input, init) {
        try {
          var url = (typeof input === "string") ? input : (input && input.url) || "";
          if (url.indexOf("googleads.g.doubleclick.net") > -1 ||
              url.indexOf("youtube.com/youtubei/v1/player/ad_break") > -1 ||
              url.indexOf("youtube.com/pagead/adview") > -1 ||
              url.indexOf("youtube.com/api/stats/ads") > -1) {
            return Promise.resolve(new Response("", { status: 200 }));
          }
          if (url.indexOf("youtube.com/youtubei/") > -1) {
            return origFetch.apply(this, arguments).then(function (response) {
              try {
                var clone = response.clone();
                return clone.json().then(function (data) {
                  delete data.adSlots;
                  delete data.playerAds;
                  delete data.adPlacements;
                  delete data.adBreakHeartbeatParams;
                  if (data[0] && data[0].playerResponse) {
                    delete data[0].playerResponse.adSlots;
                    delete data[0].playerResponse.playerAds;
                    delete data[0].playerResponse.adPlacements;
                    delete data[0].playerResponse.adBreakHeartbeatParams;
                  }
                  var body = JSON.stringify(data);
                  var headers = new Headers(response.headers);
                  headers.set("content-length", String(body.length));
                  headers.set("content-type", "application/json");
                  return new Response(body, { status: response.status, statusText: response.statusText, headers: headers });
                }).catch(function () { return response; });
              } catch (e) { return response; }
            });
          }
          return origFetch.apply(this, arguments);
        } catch (e) {
          return origFetch.apply(this, arguments);
        }
      };
    } catch (e) {}
  }

  // ---------- Adblock DOM ----------
  function adsBlockDOM() {
    if (!Settings.adblock) return;
    try {
      var ads = document.getElementsByTagName("ad-slot-renderer");
      for (var i = 0; i < ads.length; i++) { try { ads[i].remove(); } catch (e) {} }
      var interrupting = document.getElementsByClassName("ad-interrupting");
      if (interrupting.length > 0) {
        var vid = interrupting[0].getElementsByTagName("video")[0];
        if (vid) vid.currentTime = vid.duration;
        var skip = document.getElementsByClassName("ytp-ad-skip-button-modern")[0];
        if (skip) skip.click();
      }
      var promoted = document.getElementsByTagName("ytm-promoted-sparkles-web-renderer");
      for (var j = 0; j < promoted.length; j++) { try { promoted[j].remove(); } catch (e) {} }
    } catch (e) {}
  }

  // ---------- SponsorBlock ----------
  var sponsorSegments = [];
  function checkSponsors() {
    if (!Settings.sponsorblock) return;
    try {
      if (window.location.href.indexOf("watch") === -1) return;
      var vid = new URL(window.location.href).searchParams.get("v");
      if (!vid) return;
      fetch("https://sponsor.ajay.app/api/skipSegments?videoID=" + vid)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          sponsorSegments = [];
          if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
              if (data[i] && data[i].segment) sponsorSegments.push(data[i].segment);
            }
          }
          var player = qs("video");
          if (player) {
            player.ontimeupdate = function () {
              var cur = player.currentTime;
              for (var k = 0; k < sponsorSegments.length; k++) {
                var seg = sponsorSegments[k];
                if (Math.floor(cur) === Math.floor(seg[0])) {
                  player.currentTime = seg[1];
                }
              }
            };
          }
        })
        .catch(function () {});
    } catch (e) {}
  }

  // ---------- Dislikes ----------
  function fetchDislikes() {
    if (!Settings.dislikes) return;
    try {
      var vid = new URL(window.location.href).searchParams.get("v");
      if (!vid) return;
      fetch("https://returnyoutubedislikeapi.com/votes?videoId=" + vid)
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && typeof j.dislikes !== "undefined") {
            var n = j.dislikes;
            var txt;
            try {
              txt = new Intl.NumberFormat(document.documentElement.lang || "en", { notation: "compact" }).format(n);
            } catch (e) {
              txt = String(n);
            }
            var el = document.getElementById("ytp-dislikes");
            if (!el) {
              var container = document.getElementsByClassName("slim-video-information-like-count")[0];
              if (container && container.parentNode) {
                var span = document.createElement("span");
                span.id = "ytp-dislikes";
                span.style.marginLeft = "10px";
                span.style.fontSize = "13px";
                span.style.opacity = "0.9";
                container.parentNode.insertBefore(span, container.nextSibling);
              }
            }
            var e2 = document.getElementById("ytp-dislikes");
            if (e2) e2.textContent = txt + " dislikes";
          }
        })
        .catch(function () {});
    } catch (e) {}
  }

  // ---------- Gestos ----------
  var touchStartY = 0;
  var gestureVol = 1;
  var gestureBrt = 0.5;
  function initGestures() {
    if (!Settings.gestures) return;
    try {
      if (window.Android && window.Android.getVolume) gestureVol = Android.getVolume();
      if (window.Android && window.Android.getBrightness) gestureBrt = Android.getBrightness() / 100;
    } catch (e) {}
    try {
      document.body.addEventListener("touchstart", function (e) {
        touchStartY = e.changedTouches[0].screenY;
      }, { capture: true });
      document.body.addEventListener("touchmove", function (e) {
        try {
          if (e.touches.length !== 1) return;
          var cls = (e.target && e.target.className) ? String(e.target.className) : "";
          if (cls.indexOf("video-stream") === -1) return;
          var diff = touchStartY - e.touches[0].pageY;
          if (Math.abs(diff) < 10) return;
          var side = e.touches[0].pageX < (window.innerWidth / 2) ? "left" : "right";
          if (side === "right" && window.Android && window.Android.setVolume) {
            gestureVol += (diff > 0 ? 0.01 : -0.01);
            if (gestureVol > 1) gestureVol = 1;
            if (gestureVol < 0) gestureVol = 0;
            Android.setVolume(gestureVol);
          } else if (side === "left" && window.Android && window.Android.setBrightness) {
            gestureBrt += (diff > 0 ? 0.01 : -0.01);
            if (gestureBrt > 1) gestureBrt = 1;
            if (gestureBrt < 0) gestureBrt = 0;
            Android.setBrightness(gestureBrt);
          }
          touchStartY = e.touches[0].pageY;
        } catch (err) {}
      }, { capture: true });
    } catch (e) {}
  }

  // ---------- Copiar Link ----------
  function copyCurrentLink() {
    try {
      var url = window.location.href.split("&si=")[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          if (window.Android && Android.showToast) Android.showToast("Link copiado!");
        });
      } else {
        var ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        if (window.Android && Android.showToast) Android.showToast("Link copiado!");
      }
    } catch (e) {}
  }

  // ---------- Baixar Thumbnail ----------
  function downloadThumb() {
    try {
      var vid = new URL(window.location.href).searchParams.get("v");
      if (!vid) return;
      var url = "https://i.ytimg.com/vi/" + vid + "/maxresdefault.jpg";
      if (window.Android && Android.downvid) Android.downvid("thumb_" + vid + ".jpg", url, "image/jpeg");
      else window.open(url, "_blank");
    } catch (e) {}
  }

  // ---------- Limpar Cache ----------
  function clearCache() {
    try {
      if (window.Android && Android.clearAppCache) Android.clearAppCache();
      else if (window.Android && Android.showToast) Android.showToast("Função indisponível");
    } catch (e) {}
  }

  // ---------- Exportar / Importar ----------
  function exportSettings() {
    try {
      var data = {};
      for (var k in Settings) data[k] = Settings[k];
      var json = JSON.stringify(data);
      if (window.Android && Android.showToast) Android.showToast("Configurações copiadas");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(json);
      else {
        var ta = document.createElement("textarea");
        ta.value = json;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
    } catch (e) {}
  }

  function resetAll() {
    try {
      for (var k in DEFAULTS) {
        localStorage.setItem("ytp_" + k, String(DEFAULTS[k]));
      }
      if (window.Android && Android.showToast) Android.showToast("Resetado! Recarregando...");
      setTimeout(function () { location.reload(); }, 800);
    } catch (e) {}
  }

  // ---------- Hash handler (download, hearts, settings) ----------
  function handleHash() {
    try {
      var h = window.location.hash;
      if (h === "#download") {
        if (typeof window.ytproSabrDownload === "function") {
          window.ytproSabrDownload();
        } else if (window.Android && Android.showToast) {
          Android.showToast("Downloader não carregado (innertube.js)");
        }
        window.location.hash = "";
      }
    } catch (e) {}
  }

  // ============================================================
  // MENU — CONFIGURAÇÕES PREMIUM
  // ============================================================
  // Estrutura de grupos: [título, [ [label, key, tipo, opções], ... ] ]
  // tipo: "toggle" ou "select"
  var MENU_GROUPS = [
    ["REPRODUÇÃO", [
      ["Reprodução em Segundo Plano", "bgplay", "toggle"],
      ["Manter Tela Ligada", "keepscreen", "toggle"],
      ["Loop Automático", "loop", "toggle"],
      ["Auto-Play Próximo", "autoplaynext", "toggle"],
      ["Desbloquear 60FPS", "unlock60fps", "toggle"],
      ["Aumentar Volume 200%", "volboost", "toggle"],
      ["Velocidade Padrão", "speed", "select", ["0.5","0.75","1","1.25","1.5","2"]],
      ["Qualidade Padrão", "quality", "select", ["auto","1080p","720p","480p","360p"]],
      ["Passo de Avanço", "seekstep", "select", ["5","10","15","30"]],
      ["Auto-Legendas", "autocap", "toggle"],
      ["Tamanho das Legendas", "capfontsize", "select", ["80","100","125","150"]]
    ]],
    ["LIMPEZA / INTERFACE", [
      ["Forçar Tema Escuro", "darkmode", "toggle"],
      ["Tema OLED (Preto)", "oled", "toggle"],
      ["Ocultar Shorts (Home)", "hideshorts", "toggle"],
      ["Ocultar Shorts (Nav)", "hideshortsnav", "toggle"],
      ["Ocultar Posts Comunidade", "hidecomm", "toggle"],
      ["Ocultar Comentários", "hidecomments", "toggle"],
      ["Ocultar Chat ao Vivo", "hidechat", "toggle"],
      ["Ocultar Marca D'água", "hidewatermark", "toggle"],
      ["Ocultar Botão Cast", "hidecast", "toggle"],
      ["Ocultar Botão Criar", "hidecreate", "toggle"],
      ["Ocultar Notificações", "hidenotif", "toggle"],
      ["Ocultar Tendências", "hideexplore", "toggle"],
      ["Ocultar Feed Inicial", "hidehome", "toggle"],
      ["Ocultar Fim do Vídeo", "hideendscreen", "toggle"],
      ["Ocultar Promoções Premium", "hidepremium", "toggle"],
      ["Ocultar Merch Shelf", "hidemerch", "toggle"],
      ["Ocultar Info Cards", "hideinfocards", "toggle"],
      ["Ocultar Overlay de Pausa", "hidepauseoverlay", "toggle"],
      ["Ocultar Barra de Ações", "hideactions", "toggle"],
      ["Ocultar Botão Inscrever", "hidesubbutton", "toggle"],
      ["Ocultar Thumbnails", "hidethumbs", "toggle"],
      ["Ocultar Nome do Canal", "hidechannelname", "toggle"],
      ["Ocultar Visualizações", "hideviews", "toggle"],
      ["Ocultar Data de Upload", "hideuploaddate", "toggle"],
      ["Ocultar Selo Verificado", "hideverified", "toggle"],
      ["Ocultar Badge Live", "hidelive", "toggle"],
      ["Ocultar Vídeos Assistidos", "hidewatched", "toggle"],
      ["Ocultar Mix/Playlists", "hidemix", "toggle"],
      ["Ocultar Banners Promo", "hidepromobanners", "toggle"],
      ["Ocultar Barra de Pesquisa", "hidesearchbar", "toggle"],
      ["Ocultar Logo YouTube", "hidelogo", "toggle"],
      ["Ocultar Botão Voltar", "hideback", "toggle"],
      ["Ocultar Menu Hamburger", "hidehamburger", "toggle"],
      ["Ocultar Controles do Player", "hideplayercontrols", "toggle"],
      ["Ocultar Botão Curtir", "hidelike", "toggle"],
      ["Ocultar Botão Descurtir", "hidedislike", "toggle"],
      ["Ocultar Botão Salvar", "hidesave", "toggle"],
      ["Ocultar Botão Compartilhar", "hideshare", "toggle"],
      ["Ocultar Botão Baixar", "hidedownload", "toggle"],
      ["Ocultar Botão Mais", "hidemore", "toggle"]
    ]],
    ["FUNÇÕES CORE", [
      ["AdBlock Master", "adblock", "toggle"],
      ["Pular Patrocinadores", "sponsorblock", "toggle"],
      ["Retornar Deslikes", "dislikes", "toggle"],
      ["Controles de Gestos", "gestures", "toggle"],
      ["Gesto do Miniplayer", "miniplayergesture", "toggle"],
      ["Forçar Zoom", "forcezoom", "toggle"],
      ["Botão PiP", "pipbutton", "toggle"],
      ["Botão Fast Forward 10x", "fastforward", "toggle"],
      ["Auto-Like (experimental)", "autolike", "toggle"],
      ["Auto-Subscribe (experimental)", "autosubscribe", "toggle"]
    ]],
    ["CHEATS EXTRAS", [
      ["Spoof User Agent iOS", "spoofios", "toggle"],
      ["Spoof User Agent Desktop", "spoofdesktop", "toggle"],
      ["Esconder Idade Restrita", "hideage", "toggle"],
      ["Modo Cinema", "cinemamode", "toggle"],
      ["Tela Cheia Automática", "autofullscreen", "toggle"],
      ["Desativar Animações", "disableanimations", "toggle"],
      ["Alto Contraste", "highcontrast", "toggle"],
      ["Modo Escala de Cinza", "grayscale", "toggle"],
      ["Modo Sépia", "sepia", "toggle"],
      ["Inverter Cores", "invert", "toggle"],
      ["Filtro Noturno", "nightfilter", "toggle"],
      ["Escurecer Tela", "screendimmer", "toggle"],
      ["Modo Economia", "batterysaver", "toggle"],
      ["Modo Desempenho", "performancemode", "toggle"],
      ["Modo Turbo", "turbomode", "toggle"],
      ["Modo Experimental", "experimental", "toggle"],
      ["Modo Debug", "debug", "toggle"],
      ["Log de Eventos", "eventlog", "toggle"],
      ["Glassmorphism", "glasseffect", "toggle"],
      ["Neon Glow", "neonglow", "toggle"],
      ["Tema Retrô", "retro", "toggle"],
      ["Tema Matrix", "matrix", "toggle"],
      ["Tema Cyberpunk", "cyberpunk", "toggle"]
    ]],
    ["GEMINI AI", [
      ["Ativar Gemini", "gemini", "toggle"],
      ["Chat Único", "geminiSingleChat", "toggle"],
      ["Modelo Gemini", "geminiModel", "select", ["3.5 Flash-Lite","3.1 Pro","3.6 Flash","3.5 Flash-Lite Plus","3.1 Pro Plus","3.6 Flash Plus"]]
    ]]
  ];

  function openPremiumMenu() {
    try {
      var existing = document.getElementById("premium-cheat-menu");
      if (existing) { existing.remove(); return; }

      var overlay = document.createElement("div");
      overlay.id = "premium-cheat-menu";

      var css = [
        "#premium-cheat-menu{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:2147483647;display:flex;justify-content:center;align-items:center;font-family:'Courier New',monospace;color:#e0e0e0}",
        "#premium-cheat-menu .pcm-box{width:94%;max-width:460px;height:88%;background:#0a0a0c;border:2px solid #00ffcc;border-radius:12px;box-shadow:0 0 20px rgba(0,255,204,0.5);display:flex;flex-direction:column;overflow:hidden}",
        "#premium-cheat-menu .pcm-head{background:#111;padding:14px;border-bottom:2px solid #00ffcc;display:flex;justify-content:space-between;align-items:center}",
        "#premium-cheat-menu .pcm-title{font-size:16px;font-weight:bold;color:#00ffcc;text-shadow:0 0 10px #00ffcc;letter-spacing:2px}",
        "#premium-cheat-menu .pcm-close{color:#ff3366;font-size:26px;font-weight:bold;cursor:pointer;line-height:1}",
        "#premium-cheat-menu .pcm-body{padding:12px;overflow-y:auto;flex:1}",
        "#premium-cheat-menu .pcm-body::-webkit-scrollbar{width:6px}",
        "#premium-cheat-menu .pcm-body::-webkit-scrollbar-thumb{background:#00ffcc;border-radius:3px}",
        "#premium-cheat-menu .pcm-sec{font-size:13px;color:#00ffcc;margin:14px 0 8px 0;border-bottom:1px solid #333;padding-bottom:4px;letter-spacing:1px}",
        "#premium-cheat-menu .pcm-row{display:flex;justify-content:space-between;align-items:center;padding:9px 10px;background:#151518;border-radius:8px;margin-bottom:6px;border:1px solid #222}",
        "#premium-cheat-menu .pcm-row:hover{border-color:#00ffcc}",
        "#premium-cheat-menu .pcm-lbl{font-size:12px;flex:1}",
        "#premium-cheat-menu .pcm-sw{position:relative;display:inline-block;width:40px;height:20px;flex-shrink:0}",
        "#premium-cheat-menu .pcm-sw input{opacity:0;width:0;height:0}",
        "#premium-cheat-menu .pcm-sl{position:absolute;cursor:pointer;inset:0;background:#333;transition:.3s;border-radius:20px}",
        "#premium-cheat-menu .pcm-sl:before{position:absolute;content:'';height:16px;width:16px;left:2px;bottom:2px;background:#888;transition:.3s;border-radius:50%}",
        "#premium-cheat-menu .pcm-sw input:checked + .pcm-sl{background:#00ffcc;box-shadow:0 0 10px #00ffcc}",
        "#premium-cheat-menu .pcm-sw input:checked + .pcm-sl:before{transform:translateX(20px);background:#000}",
        "#premium-cheat-menu .pcm-select{background:#222;color:#00ffcc;border:1px solid #444;padding:4px;border-radius:4px;font-family:inherit;font-size:12px}",
        "#premium-cheat-menu .pcm-btn{background:#00ffcc;color:#000;border:0;padding:8px 12px;border-radius:6px;font-weight:bold;cursor:pointer;margin:3px;font-family:inherit;font-size:12px}",
        "#premium-cheat-menu .pcm-btn.danger{background:#ff3366;color:#fff}",
        "#premium-cheat-menu .pcm-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}",
        "#premium-cheat-menu .pcm-foot{text-align:center;color:#00ffcc;font-size:12px;padding:10px;border-top:1px solid #333;font-weight:bold;letter-spacing:2px}"
      ].join("\n");

      var styleTag = document.createElement("style");
      styleTag.textContent = css;
      overlay.appendChild(styleTag);

      var box = document.createElement("div");
      box.className = "pcm-box";

      var head = document.createElement("div");
      head.className = "pcm-head";
      head.innerHTML = '<div class="pcm-title">CONFIGURAÇÕES PREMIUM</div><div class="pcm-close">&times;</div>';
      head.querySelector(".pcm-close").addEventListener("click", function () { overlay.remove(); });
      box.appendChild(head);

      var body = document.createElement("div");
      body.className = "pcm-body";

      // Render groups
      for (var g = 0; g < MENU_GROUPS.length; g++) {
        var group = MENU_GROUPS[g];
        var title = group[0];
        var items = group[1];

        var sec = document.createElement("div");
        sec.className = "pcm-sec";
        sec.textContent = "\u25B6 " + title;
        body.appendChild(sec);

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var label = item[0];
          var key = item[1];
          var type = item[2];

          var row = document.createElement("div");
          row.className = "pcm-row";

          var lbl = document.createElement("span");
          lbl.className = "pcm-lbl";
          lbl.textContent = label;
          row.appendChild(lbl);

          if (type === "toggle") {
            var sw = document.createElement("label");
            sw.className = "pcm-sw";
            var cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = !!Settings[key];
            cb.setAttribute("data-key", key);
            cb.addEventListener("change", (function (k) {
              return function (ev) { saveSetting(k, ev.target.checked); };
            })(key));
            var slider = document.createElement("span");
            slider.className = "pcm-sl";
            sw.appendChild(cb);
            sw.appendChild(slider);
            row.appendChild(sw);
          } else if (type === "select") {
            var sel = document.createElement("select");
            sel.className = "pcm-select";
            sel.setAttribute("data-key", key);
            var opts = item[3] || [];
            for (var o = 0; o < opts.length; o++) {
              var opt = document.createElement("option");
              opt.value = opts[o];
              opt.textContent = opts[o];
              if (String(Settings[key]) === String(opts[o])) opt.selected = true;
              sel.appendChild(opt);
            }
            sel.addEventListener("change", (function (k) {
              return function (ev) { saveSetting(k, ev.target.value); };
            })(key));
            row.appendChild(sel);
          }
          body.appendChild(row);
        }
      }

      // Ferramentas
      var toolsSec = document.createElement("div");
      toolsSec.className = "pcm-sec";
      toolsSec.textContent = "\u25B6 FERRAMENTAS";
      body.appendChild(toolsSec);

      var tools = document.createElement("div");
      tools.className = "pcm-tools";

      function makeBtn(text, handler, danger) {
        var b = document.createElement("button");
        b.className = "pcm-btn" + (danger ? " danger" : "");
        b.textContent = text;
        b.addEventListener("click", handler);
        return b;
      }

      tools.appendChild(makeBtn("Baixar Vídeo", function () {
        if (typeof window.ytproSabrDownload === "function") window.ytproSabrDownload();
        else if (window.Android && Android.showToast) Android.showToast("Innertube.js não carregado");
      }));
      tools.appendChild(makeBtn("Baixar Thumbnail", downloadThumb));
      tools.appendChild(makeBtn("Copiar Link", copyCurrentLink));
      tools.appendChild(makeBtn("Limpar Cache", clearCache, true));
      tools.appendChild(makeBtn("Exportar Config", exportSettings));
      tools.appendChild(makeBtn("Resetar Tudo", resetAll, true));

      body.appendChild(tools);

      box.appendChild(body);

      var foot = document.createElement("div");
      foot.className = "pcm-foot";
      foot.textContent = "YOUTUBE PREMIUM";
      box.appendChild(foot);

      overlay.appendChild(box);
      document.documentElement.appendChild(overlay);
    } catch (e) {
      try { if (window.Android && Android.showToast) Android.showToast("Erro no menu: " + e.message); } catch (x) {}
    }
  }

  // ---------- Botão Flutuante (Engrenagem) ----------
  function addSettingsButton() {
    try {
      if (document.getElementById("ytp-gear-btn")) return;
      var btn = document.createElement("div");
      btn.id = "ytp-gear-btn";
      btn.style.cssText = "position:fixed!important;bottom:90px!important;right:16px!important;width:52px!important;height:52px!important;background:linear-gradient(135deg,#00ffcc,#0088ff)!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 0 16px rgba(0,255,204,0.7)!important;z-index:2147483646!important;cursor:pointer!important;";
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M19.14,12.94a7.07,7.07,0,0,0,0-1.88l2-1.58a.5.5,0,0,0,.12-.64l-1.9-3.3a.5.5,0,0,0-.6-.22l-2.36,1a7,7,0,0,0-1.62-.94l-.36-2.5A.5.5,0,0,0,14,2H10a.5.5,0,0,0-.5.42l-.36,2.5a7,7,0,0,0-1.62.94l-2.36-1a.5.5,0,0,0-.6.22L2.66,8.4a.5.5,0,0,0,.12.64l2,1.58a7.07,7.07,0,0,0,0,1.88l-2,1.58a.5.5,0,0,0-.12.64l1.9,3.3a.5.5,0,0,0,.6.22l2.36-1a7,7,0,0,0,1.62.94l.36,2.5A.5.5,0,0,0,10,22h4a.5.5,0,0,0,.5-.42l.36-2.5a7,7,0,0,0,1.62-.94l2.36,1a.5.5,0,0,0,.6-.22l1.9-3.3a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>';
      btn.addEventListener("click", openPremiumMenu);
      document.documentElement.appendChild(btn);
    } catch (e) {}
  }

  // ---------- Inicialização ----------
  function init() {
    try { applySettings(); } catch (e) {}
    try { initAdblock(); } catch (e) {}
    try { initGestures(); } catch (e) {}
    try { checkSponsors(); } catch (e) {}
    try { fetchDislikes(); } catch (e) {}
    try { addSettingsButton(); } catch (e) {}
  }

  // Roda quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  // Reage a navegação (SPA)
  window.addEventListener("load", function () {
    setTimeout(init, 500);
  });
  document.addEventListener("yt-navigate-finish", function () {
    setTimeout(init, 300);
  });

  // Hash handler (download, etc.)
  window.addEventListener("hashchange", handleHash);
  setTimeout(handleHash, 1000);

  // Loop de segurança: garante botão e CSS sempre presentes
  setInterval(function () {
    try { addSettingsButton(); } catch (e) {}
    try { injectCSS(); } catch (e) {}
    try { adsBlockDOM(); } catch (e) {}
    try { fetchDislikes(); } catch (e) {}
  }, 1500);
})();
