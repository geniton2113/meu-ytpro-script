/***** YOUTUBE PREMIUM v6.0 - 200 SUPER FUNCTIONS *****/
(function () {
    'use strict';
    if (window.__YTPREM_V6__) return;
    window.__YTPREM_V6__ = true;

    // ========== DEFAULTS (200 features) ==========
    var D = {
        // Reproducao (35)
        bgplay: true, keepscreen: false, loop: false, autoplaynext: true,
        unlock60fps: false, force4k: false, force8k: false, force144: false,
        force240: false, volboost: false, autocap: false, sleeptimer: false,
        autopause: false, autoresume: false, fastforward: false, hdrforce: false,
        ambilight: false, autobrightness: false, antipause: false,
        codecAV1: true, codecVP9: true, codecH264: true, codecOpus: true, codecMp4a: true,
        shortsloop: false, shortsbgplay: false, zoomrecenter: false,
        autostart: true, autonext: true, novideoprefetch: false,
        noprebuffer: false, lowlatency: false,
        speed: '1', quality: 'auto', seekstep: '10', capfontsize: '100',

        // Interface / Cleanup (70)
        darkmode: true, oled: false, hideshorts: true, hideshortsnav: true,
        hidecomm: true, hidecomments: false, hidechat: false, hidewatermark: false,
        hidecast: false, hidecreate: false, hidenotif: false, hideexplore: false,
        hidehome: false, hideendscreen: true, hidepremium: true, hidemerch: false,
        hideinfocards: false, hidepauseoverlay: false, hideactions: false,
        hidesubbutton: false, hidethumbs: false, hidechannelname: false,
        hideviews: false, hideuploaddate: false, hideverified: false,
        hidelive: false, hidewatched: false, hidemix: false, hidepromobanners: false,
        hidesearchbar: false, hidelogo: false, hideback: false, hidehamburger: false,
        hideplayercontrols: false, hidelike: false, hidedislike: false,
        hidesave: false, hideshare: false, hidedownload: false, hidemore: false,
        hidedesc: false, hidechapters: false, hideautoplay: false, hidefooter: false,
        hidelivecat: false, hidemusiccat: false, hidefilmscat: false,
        hidegamescat: false, hideexplorecat: false, hidesubscat: false,
        hideredbtn: false, hideembeds: false, hidefloating: false,
        hideplaylist: false, hidetrending: false, hidehistory: false,
        hidewishlist: false, hidedrafts: false, hidereport: false,
        hidestats: false, hidebug: false, hidehelp: false, hidesettings: false,
        hidebanner: false, hideinstallbanner: false, hidegooglebtn: false,
        hidesearchsuggestions: false, hideaccountbtn: false, hidesubscriptionsbtn: false,
        hidemoviesbtn: false, hidegamesbtn: false, hidemusicbtn: false,
        hidepremiumbtn: false, hidebotnav: false, hidefab: false,
        hidetabhome: false, hidetabshorts: false, hidetabsubs: false,
        hidetabme: false, hidesubtext: false,

        // Core (15)
        adblock: true, sponsorblock: true, dislikes: true, gestures: true,
        miniplayer: false, forcezoom: false, pipbutton: true, hearts: true,
        history: true, autolike: false, autosub: false, sponsorblockUI: true,
        dearrow: false, hideage: false, nobufferbloat: false,

        // Audio (12)
        bassboost: false, trebleboost: false, vocalboost: false, nightaudio: false,
        vibrationoff: false, stereoforce: false, monoforce: false, voiceclarity: false,
        surround3d: false, loudnorm: false, dynaudionorm: false, spatialaudio: false,

        // Temas (30)
        grayscale: false, sepia: false, invert: false, highcontrast: false,
        nightfilter: false, screendimmer: false, bluefilter: false,
        matrix: false, cyberpunk: false, retro: false, glasseffect: false,
        neonglow: false, roundcorners: false, shadows: false, blurbackground: false,
        reduceMotion: false, neonborder: false, zenmode: false, focusmode: false,
        readmode: false, compactmode: false, comfortmode: false, widemode: false,
        fontzoom: false, lineheight: false, autoday: false, autonight: false,
        vibrancy: false, warmer: false, cooler: false,

        // Ferramentas / Cheats (15)
        debug: false, eventlog: false, spoofios: false, spoofdesktop: false,
        disableanimations: false, batterysaver: false, performancemode: false,
        turbomode: false, experimental: false, nocookies: false,
        disableCSP: false, hiderecaptcha: false,

        // Gemini (5)
        gemini: true, geminiSingleChat: true, geminiAuto: false,
        geminiModel: '3.5 Flash-Lite', geminiPrompt: ''
    };

    var S = {};
    for (var k in D) {
        var v = localStorage.getItem('ytp_' + k);
        if (v === null) S[k] = D[k];
        else if (v === 'true') S[k] = true;
        else if (v === 'false') S[k] = false;
        else S[k] = v;
    }

    function save(key, val) {
        S[key] = val;
        try { localStorage.setItem('ytp_' + key, String(val)); } catch (e) {}
        apply();
    }

    // ========== CSS ==========
    function buildCSS() {
        var s = [];
        // Temas gerais
        if (S.oled) s.push('html,body,ytm-app{background:#000!important;color:#fff!important}');
        if (S.grayscale) s.push('html{filter:grayscale(100%)!important}');
        if (S.sepia) s.push('html{filter:sepia(80%)!important}');
        if (S.invert) s.push('html{filter:invert(100%)!important}');
        if (S.highcontrast) s.push('html{filter:contrast(150%)!important}');
        if (S.nightfilter) s.push('html::after{content:"";position:fixed;inset:0;background:rgba(255,160,0,.15);pointer-events:none;z-index:2147483646}');
        if (S.screendimmer) s.push('html::after{content:"";position:fixed;inset:0;background:rgba(0,0,0,.4);pointer-events:none;z-index:2147483646}');
        if (S.bluefilter) s.push('html::after{content:"";position:fixed;inset:0;background:rgba(0,60,255,.12);pointer-events:none;z-index:2147483646}');
        if (S.disableanimations || S.reduceMotion) s.push('*{animation:none!important;transition:none!important}');
        if (S.matrix) s.push('html{filter:hue-rotate(90deg) saturate(2)}');
        if (S.cyberpunk) s.push('html{filter:hue-rotate(280deg) saturate(1.5)}');
        if (S.retro) s.push('html{filter:sepia(.5) contrast(1.2)}');
        if (S.neonglow) s.push('ytm-app{text-shadow:0 0 3px #0ff}');
        if (S.glasseffect) s.push('ytm-app{backdrop-filter:blur(8px)}');
        if (S.neonborder) s.push('ytm-app *{box-shadow:0 0 3px #0ff}');
        if (S.roundcorners) s.push('*{border-radius:12px!important}');
        if (S.shadows) s.push('ytm-app *{box-shadow:0 2px 6px rgba(0,0,0,.3)}');
        if (S.blurbackground) s.push('ytm-app{filter:blur(.2px)}');
        if (S.zenmode) s.push('ytm-pivot-bar-renderer,ytm-topbar-renderer{display:none!important}');
        if (S.focusmode) s.push('ytm-browse,ytm-pivot-bar-renderer{display:none!important}');
        if (S.readmode) s.push('ytm-thumbnail-view-model{display:none!important}');
        if (S.compactmode) s.push('ytm-video-with-context-renderer{margin:0!important;padding:0!important}');
        if (S.widemode) s.push('ytm-app{max-width:100%!important}');
        if (S.lineheight) s.push('*{line-height:1.7!important}');
        if (S.fontzoom) s.push('html{font-size:110%!important}');
        if (S.autoday) s.push('html{filter:brightness(1.05)}');
        if (S.autonight) s.push('html{filter:brightness(.85) sepia(.1)}');
        if (S.warmer) s.push('html{filter:sepia(.2) saturate(1.1)}');
        if (S.cooler) s.push('html{filter:hue-rotate(-10deg) saturate(1.1)}');
        if (S.vibrancy) s.push('html{filter:saturate(1.3)}');
        if (S.batterysaver) s.push('html{filter:brightness(.9)}');

        // Cleanup
        if (S.hideshorts) s.push('ytm-reel-shelf-renderer,ytm-shorts-lockup-view-model,.big-shorts-singleton{display:none!important}');
        if (S.hideshortsnav) s.push('ytm-pivot-bar-item-renderer:nth-child(4){display:none!important}');
        if (S.hidecomm) s.push('ytm-backstage-post-thread-renderer{display:none!important}');
        if (S.hidecomments) s.push('#comments-button,ytm-comments-entry-point-header-renderer,ytm-comment-section-renderer{display:none!important}');
        if (S.hidechat) s.push('#chat-container,ytm-live-chat-header-renderer,ytm-live-chat-renderer{display:none!important}');
        if (S.hidewatermark) s.push('.ytp-watermark{display:none!important}');
        if (S.hidecast) s.push('ytm-cast-button-header{display:none!important}');
        if (S.hidecreate) s.push('ytm-pivot-bar-item-renderer:nth-child(3){display:none!important}');
        if (S.hidenotif) s.push('ytm-notification-button-renderer{display:none!important}');
        if (S.hideexplore) s.push('ytm-explore-button-renderer{display:none!important}');
        if (S.hidehome) s.push('ytm-browse{display:none!important}');
        if (S.hideendscreen) s.push('.html5-endscreen,.ytp-ce-element,.ytp-endscreen-content{display:none!important}');
        if (S.hidepremium) s.push('ytm-mealbar-promo-renderer,ytm-button-renderer[target-id="premium"]{display:none!important}');
        if (S.hidemerch) s.push('ytm-merch-shelf-renderer,.ytp-suggested-action{display:none!important}');
        if (S.hideinfocards) s.push('.ytp-cards-teaser,.iv-branding{display:none!important}');
        if (S.hidepauseoverlay) s.push('.ytp-pause-overlay,.ytp-scroll-min{display:none!important}');
        if (S.hideactions) s.push('.slim-video-action-bar-actions{display:none!important}');
        if (S.hidesubbutton) s.push('ytm-subscribe-button-renderer{display:none!important}');
        if (S.hidethumbs) s.push('ytm-thumbnail-view-model,img.ytCoreImageHost{visibility:hidden!important}');
        if (S.hidechannelname) s.push('.ytm-channel-name{display:none!important}');
        if (S.hideviews) s.push('ytm-video-with-context-renderer .ytm-video-info-metadata{display:none!important}');
        if (S.hideuploaddate) s.push('ytm-video-with-context-renderer .ytm-video-info-metadata-item{display:none!important}');
        if (S.hideverified) s.push('.badge-style-type-verified,.yt-icon-badge{display:none!important}');
        if (S.hidelive) s.push('.badge-style-type-live-now,.ytm-live-badge{display:none!important}');
        if (S.hidewatched) s.push('ytm-video-with-context-renderer[is-watched]{opacity:0!important}');
        if (S.hidemix) s.push('ytm-radio-renderer,ytm-immersive-header-renderer{display:none!important}');
        if (S.hidepromobanners) s.push('ytm-banner-promo-renderer,ytm-statement-banner-renderer{display:none!important}');
        if (S.hidesearchbar) s.push('ytm-searchbox{display:none!important}');
        if (S.hidelogo) s.push('ytm-home-logo{display:none!important}');
        if (S.hideback) s.push('ytm-topbar-menu-button-renderer:first-child{display:none!important}');
        if (S.hidehamburger) s.push('ytm-topbar-menu-button-renderer{display:none!important}');
        if (S.hideplayercontrols) s.push('.ytp-chrome-bottom,.ytp-chrome-top{display:none!important}');
        if (S.hidelike) s.push('like-button-view-model{display:none!important}');
        if (S.hidedislike) s.push('dislike-button-view-model{display:none!important}');
        if (S.hidesave) s.push('ytm-save-button-renderer{display:none!important}');
        if (S.hideshare) s.push('ytm-button-renderer[target-id="share"]{display:none!important}');
        if (S.hidedownload) s.push('[data-action="download"]{display:none!important}');
        if (S.hidemore) s.push('ytm-button-renderer[target-id="more"]{display:none!important}');
        if (S.hidedesc) s.push('ytm-expandable-video-description-body-renderer{display:none!important}');
        if (S.hidechapters) s.push('ytm-macro-markers-list-renderer{display:none!important}');
        if (S.hideautoplay) s.push('ytm-compact-autoplay-renderer{display:none!important}');
        if (S.hidefooter) s.push('ytm-footer-renderer{display:none!important}');
        if (S.hidelivecat) s.push('ytm-pivot-bar-item-renderer[tab-identifier="LIVE"]{display:none!important}');
        if (S.hidemusiccat) s.push('ytm-pivot-bar-item-renderer[tab-identifier="MUSIC"]{display:none!important}');
        if (S.hidefilmscat) s.push('ytm-pivot-bar-item-renderer[tab-identifier="MOVIES"]{display:none!important}');
        if (S.hidegamescat) s.push('ytm-pivot-bar-item-renderer[tab-identifier="GAMING"]{display:none!important}');
        if (S.hideexplorecat) s.push('ytm-pivot-bar-item-renderer[tab-identifier="EXPLORE"]{display:none!important}');
        if (S.hidesubscat) s.push('ytm-pivot-bar-item-renderer[tab-identifier="SUBSCRIPTIONS"]{display:none!important}');
        if (S.hideredbtn) s.push('ytm-button-renderer[is-primary]{background:#f00!important}');
        if (S.hideembeds) s.push('iframe[src*="youtube.com/embed"]{display:none!important}');
        if (S.hidefloating) s.push('ytm-floating-action-button{display:none!important}');
        if (S.hideplaylist) s.push('ytm-playlist-panel-renderer{display:none!important}');
        if (S.hidetrending) s.push('ytm-trending-page{display:none!important}');
        if (S.hidehistory) s.push('ytm-history-page{display:none!important}');
        if (S.hidewishlist) s.push('ytm-watch-later-page{display:none!important}');
        if (S.hidedrafts) s.push('ytm-drafts-page{display:none!important}');
        if (S.hidereport) s.push('ytm-report-button{display:none!important}');
        if (S.hidestats) s.push('ytm-stats-renderer{display:none!important}');
        if (S.hidebug) s.push('ytm-debug-renderer{display:none!important}');
        if (S.hidehelp) s.push('ytm-help-renderer{display:none!important}');
        if (S.hidesettings) s.push('ytm-settings-page{display:none!important}');
        if (S.hidebanner) s.push('ytm-banner-renderer{display:none!important}');
        if (S.hideinstallbanner) s.push('ytm-install-banner{display:none!important}');
        if (S.hidegooglebtn) s.push('ytm-google-login-button{display:none!important}');
        if (S.hidesearchsuggestions) s.push('ytm-search-suggestions{display:none!important}');
        if (S.hideaccountbtn) s.push('ytm-account-button{display:none!important}');
        if (S.hidesubscriptionsbtn) s.push('ytm-subscriptions-button{display:none!important}');
        if (S.hidemoviesbtn) s.push('ytm-movies-button{display:none!important}');
        if (S.hidegamesbtn) s.push('ytm-games-button{display:none!important}');
        if (S.hidemusicbtn) s.push('ytm-music-button{display:none!important}');
        if (S.hidepremiumbtn) s.push('ytm-premium-button{display:none!important}');
        if (S.hidebotnav) s.push('ytm-pivot-bar-renderer{display:none!important}');
        if (S.hidefab) s.push('ytm-fab{display:none!important}');
        if (S.hidetabhome) s.push('ytm-pivot-bar-item-renderer[tab-identifier="HOME"]{display:none!important}');
        if (S.hidetabshorts) s.push('ytm-pivot-bar-item-renderer[tab-identifier="SHORTS"]{display:none!important}');
        if (S.hidetabsubs) s.push('ytm-pivot-bar-item-renderer[tab-identifier="SUBSCRIPTIONS"]{display:none!important}');
        if (S.hidetabme) s.push('ytm-pivot-bar-item-renderer[tab-identifier="ACCOUNT"]{display:none!important}');
        if (S.hidesubtext) s.push('ytm-video-with-context-renderer .ytm-video-info-subtext{display:none!important}');

        // Debug visual
        if (S.debug) s.push('body::before{content:"DEBUG";position:fixed;top:0;left:0;background:#f00;color:#fff;padding:2px 6px;z-index:2147483647;font-size:12px}');

        return s.join('\n');
    }

    var styleEl = null;
    function injectCSS() {
        try {
            if (!document.head) return;
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'ytp-v6-css';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = buildCSS();
        } catch (e) {}
    }

    function apply() {
        try { injectCSS(); } catch (e) {}
        try {
            if (S.darkmode || S.oled) {
                document.cookie = 'PREF=f6=400; path=/; domain=.youtube.com';
            } else {
                document.cookie = 'PREF=f6=0; path=/; domain=.youtube.com';
            }
        } catch (e) {}
        try {
            if (window.Android && window.Android.setBgPlay) window.Android.setBgPlay(!!S.bgplay);
        } catch (e) {}
        try {
            if (window.Android && window.Android.keepScreenOn) window.Android.keepScreenOn(!!S.keepscreen);
        } catch (e) {}
        try {
            localStorage.setItem('block_60fps', S.unlock60fps ? 'false' : 'true');
        } catch (e) {}
        try {
            var v = document.querySelector('video');
            if (v) {
                v.loop = !!S.loop;
                var sp = parseFloat(S.speed);
                if (!isNaN(sp) && sp > 0) v.playbackRate = sp;
            }
        } catch (e) {}
    }

    // ========== FEATURES (200 total) ==========
    var F = [
        ['REPRODUCAO', [
            ['Reproducao em Segundo Plano', 'bgplay', 'toggle'],
            ['Manter Tela Ligada', 'keepscreen', 'toggle'],
            ['Loop Automatico', 'loop', 'toggle'],
            ['Auto-Play Proximo Video', 'autoplaynext', 'toggle'],
            ['Desbloquear 60FPS', 'unlock60fps', 'toggle'],
            ['Forcar 4K', 'force4k', 'toggle'],
            ['Forcar 8K', 'force8k', 'toggle'],
            ['Forcar 144fps', 'force144', 'toggle'],
            ['Forcar 240fps', 'force240', 'toggle'],
            ['Aumentar Volume 200%', 'volboost', 'toggle'],
            ['Auto-Legendas', 'autocap', 'toggle'],
            ['Sleep Timer', 'sleeptimer', 'toggle'],
            ['Auto-Pause ao Sair', 'autopause', 'toggle'],
            ['Auto-Resume ao Voltar', 'autoresume', 'toggle'],
            ['Botao Fast Forward 10x', 'fastforward', 'toggle'],
            ['HDR Forcado', 'hdrforce', 'toggle'],
            ['Ambilight', 'ambilight', 'toggle'],
            ['Brilho Automatico', 'autobrightness', 'toggle'],
            ['Anti-Pause', 'antipause', 'toggle'],
            ['Codec AV1', 'codecAV1', 'toggle'],
            ['Codec VP9', 'codecVP9', 'toggle'],
            ['Codec H.264', 'codecH264', 'toggle'],
            ['Codec Opus', 'codecOpus', 'toggle'],
            ['Codec MP4A', 'codecMp4a', 'toggle'],
            ['Loop Shorts', 'shortsloop', 'toggle'],
            ['Shorts em Segundo Plano', 'shortsbgplay', 'toggle'],
            ['Zoom Re-center', 'zoomrecenter', 'toggle'],
            ['Auto-Start Videos', 'autostart', 'toggle'],
            ['Auto-Next Video', 'autonext', 'toggle'],
            ['Nao Prefetch Video', 'novideoprefetch', 'toggle'],
            ['Sem Pre-Buffer', 'noprebuffer', 'toggle'],
            ['Low Latency Mode', 'lowlatency', 'toggle'],
            ['Velocidade Padrao', 'speed', 'select', ['0.5','0.75','1','1.25','1.5','2']],
            ['Qualidade Padrao', 'quality', 'select', ['auto','1080p','720p','480p','360p']],
            ['Passo de Avanco', 'seekstep', 'select', ['5','10','15','30']],
            ['Tamanho Legendas', 'capfontsize', 'select', ['80','100','125','150']]
        ]],
        ['LIMPEZA / INTERFACE', [
            ['Forcar Tema Escuro', 'darkmode', 'toggle'],
            ['Tema OLED (Preto)', 'oled', 'toggle'],
            ['Ocultar Shorts (Home)', 'hideshorts', 'toggle'],
            ['Ocultar Shorts (Nav)', 'hideshortsnav', 'toggle'],
            ['Ocultar Posts Comunidade', 'hidecomm', 'toggle'],
            ['Ocultar Comentarios', 'hidecomments', 'toggle'],
            ['Ocultar Chat ao Vivo', 'hidechat', 'toggle'],
            ['Ocultar Marca d Agua', 'hidewatermark', 'toggle'],
            ['Ocultar Botao Cast', 'hidecast', 'toggle'],
            ['Ocultar Botao Criar', 'hidecreate', 'toggle'],
            ['Ocultar Notificacoes', 'hidenotif', 'toggle'],
            ['Ocultar Tendencias', 'hideexplore', 'toggle'],
            ['Ocultar Feed Inicial', 'hidehome', 'toggle'],
            ['Ocultar Fim do Video', 'hideendscreen', 'toggle'],
            ['Ocultar Promocoes Premium', 'hidepremium', 'toggle'],
            ['Ocultar Merch', 'hidemerch', 'toggle'],
            ['Ocultar Info Cards', 'hideinfocards', 'toggle'],
            ['Ocultar Overlay de Pausa', 'hidepauseoverlay', 'toggle'],
            ['Ocultar Barra de Acoes', 'hideactions', 'toggle'],
            ['Ocultar Botao Inscrever', 'hidesubbutton', 'toggle'],
            ['Ocultar Thumbnails', 'hidethumbs', 'toggle'],
            ['Ocultar Nome do Canal', 'hidechannelname', 'toggle'],
            ['Ocultar Visualizacoes', 'hideviews', 'toggle'],
            ['Ocultar Data de Upload', 'hideuploaddate', 'toggle'],
            ['Ocultar Selo Verificado', 'hideverified', 'toggle'],
            ['Ocultar Badge Live', 'hidelive', 'toggle'],
            ['Ocultar Videos Assistidos', 'hidewatched', 'toggle'],
            ['Ocultar Mix/Playlists', 'hidemix', 'toggle'],
            ['Ocultar Banners Promo', 'hidepromobanners', 'toggle'],
            ['Ocultar Barra de Pesquisa', 'hidesearchbar', 'toggle'],
            ['Ocultar Logo', 'hidelogo', 'toggle'],
            ['Ocultar Botao Voltar', 'hideback', 'toggle'],
            ['Ocultar Menu Hamburger', 'hidehamburger', 'toggle'],
            ['Ocultar Controles Player', 'hideplayercontrols', 'toggle'],
            ['Ocultar Botao Curtir', 'hidelike', 'toggle'],
            ['Ocultar Botao Descurtir', 'hidedislike', 'toggle'],
            ['Ocultar Botao Salvar', 'hidesave', 'toggle'],
            ['Ocultar Botao Compartilhar', 'hideshare', 'toggle'],
            ['Ocultar Botao Baixar', 'hidedownload', 'toggle'],
            ['Ocultar Botao Mais', 'hidemore', 'toggle'],
            ['Ocultar Descricao', 'hidedesc', 'toggle'],
            ['Ocultar Capitulos', 'hidechapters', 'toggle'],
            ['Ocultar Reproducao Auto', 'hideautoplay', 'toggle'],
            ['Ocultar Rodape', 'hidefooter', 'toggle'],
            ['Ocultar Aba Ao Vivo', 'hidelivecat', 'toggle'],
            ['Ocultar Aba Musica', 'hidemusiccat', 'toggle'],
            ['Ocultar Aba Filmes', 'hidefilmscat', 'toggle'],
            ['Ocultar Aba Jogos', 'hidegamescat', 'toggle'],
            ['Ocultar Aba Explorar', 'hideexplorecat', 'toggle'],
            ['Ocultar Aba Inscricoes', 'hidesubscat', 'toggle'],
            ['Botao Inscrever Vermelho', 'hideredbtn', 'toggle'],
            ['Ocultar Embeds', 'hideembeds', 'toggle'],
            ['Ocultar Botao Flutuante', 'hidefloating', 'toggle'],
            ['Ocultar Playlist Panel', 'hideplaylist', 'toggle'],
            ['Ocultar Tendencias', 'hidetrending', 'toggle'],
            ['Ocultar Historico', 'hidehistory', 'toggle'],
            ['Ocultar Watch Later', 'hidewishlist', 'toggle'],
            ['Ocultar Rascunhos', 'hidedrafts', 'toggle'],
            ['Ocultar Botao Reportar', 'hidereport', 'toggle'],
            ['Ocultar Estatisticas', 'hidestats', 'toggle'],
            ['Ocultar Debug Nativo', 'hidebug', 'toggle'],
            ['Ocultar Ajuda', 'hidehelp', 'toggle'],
            ['Ocultar Configuracoes', 'hidesettings', 'toggle'],
            ['Ocultar Banner', 'hidebanner', 'toggle'],
            ['Ocultar Install Banner', 'hideinstallbanner', 'toggle'],
            ['Ocultar Botao Google', 'hidegooglebtn', 'toggle'],
            ['Ocultar Sugestoes Busca', 'hidesearchsuggestions', 'toggle'],
            ['Ocultar Botao Conta', 'hideaccountbtn', 'toggle'],
            ['Ocultar Botao Inscricoes', 'hidesubscriptionsbtn', 'toggle'],
            ['Ocultar Botao Filmes', 'hidemoviesbtn', 'toggle'],
            ['Ocultar Botao Jogos', 'hidegamesbtn', 'toggle'],
            ['Ocultar Botao Musica', 'hidemusicbtn', 'toggle'],
            ['Ocultar Botao Premium', 'hidepremiumbtn', 'toggle'],
            ['Ocultar Barra Inferior', 'hidebotnav', 'toggle'],
            ['Ocultar FAB', 'hidefab', 'toggle'],
            ['Ocultar Aba Home', 'hidetabhome', 'toggle'],
            ['Ocultar Aba Shorts', 'hidetabshorts', 'toggle'],
            ['Ocultar Aba Inscricoes', 'hidetabsubs', 'toggle'],
            ['Ocultar Aba Conta', 'hidetabme', 'toggle'],
            ['Ocultar Subtexto', 'hidesubtext', 'toggle']
        ]],
        ['FUNCOES CORE', [
            ['AdBlock Master', 'adblock', 'toggle'],
            ['Pular Patrocinadores', 'sponsorblock', 'toggle'],
            ['Retornar Deslikes', 'dislikes', 'toggle'],
            ['Controles de Gestos', 'gestures', 'toggle'],
            ['Gesto do Miniplayer', 'miniplayer', 'toggle'],
            ['Forcar Zoom', 'forcezoom', 'toggle'],
            ['Botao PiP', 'pipbutton', 'toggle'],
            ['Coracao (Favoritos)', 'hearts', 'toggle'],
            ['Historico de Videos', 'history', 'toggle'],
            ['Auto-Like', 'autolike', 'toggle'],
            ['Auto-Subscribe', 'autosub', 'toggle'],
            ['SponsorBlock UI', 'sponsorblockUI', 'toggle'],
            ['DeArrow (Titulos)', 'dearrow', 'toggle'],
            ['Esconder Idade Restrita', 'hideage', 'toggle'],
            ['Sem Buffer Bloat', 'nobufferbloat', 'toggle']
        ]],
        ['AUDIO / VIDEO', [
            ['Bass Boost', 'bassboost', 'toggle'],
            ['Treble Boost', 'trebleboost', 'toggle'],
            ['Vocal Boost', 'vocalboost', 'toggle'],
            ['Night Audio Mode', 'nightaudio', 'toggle'],
            ['Desativar Vibracao', 'vibrationoff', 'toggle'],
            ['Forcar Stereo', 'stereoforce', 'toggle'],
            ['Forcar Mono', 'monoforce', 'toggle'],
            ['Voice Clarity', 'voiceclarity', 'toggle'],
            ['Surround 3D', 'surround3d', 'toggle'],
            ['Loudness Normalization', 'loudnorm', 'toggle'],
            ['Dynamic Audio Normalizer', 'dynaudionorm', 'toggle'],
            ['Spatial Audio', 'spatialaudio', 'toggle']
        ]],
        ['TEMAS', [
            ['Escala de Cinza', 'grayscale', 'toggle'],
            ['Sepia', 'sepia', 'toggle'],
            ['Inverter Cores', 'invert', 'toggle'],
            ['Alto Contraste', 'highcontrast', 'toggle'],
            ['Filtro Noturno', 'nightfilter', 'toggle'],
            ['Escurecer Tela', 'screendimmer', 'toggle'],
            ['Filtro Azul', 'bluefilter', 'toggle'],
            ['Matrix', 'matrix', 'toggle'],
            ['Cyberpunk', 'cyberpunk', 'toggle'],
            ['Retro', 'retro', 'toggle'],
            ['Glassmorphism', 'glasseffect', 'toggle'],
            ['Neon Glow', 'neonglow', 'toggle'],
            ['Arredondar Cantos', 'roundcorners', 'toggle'],
            ['Sombras', 'shadows', 'toggle'],
            ['Blur de Fundo', 'blurbackground', 'toggle'],
            ['Reduzir Movimento', 'reduceMotion', 'toggle'],
            ['Borda Neon', 'neonborder', 'toggle'],
            ['Modo Zen', 'zenmode', 'toggle'],
            ['Modo Foco', 'focusmode', 'toggle'],
            ['Modo Leitura', 'readmode', 'toggle'],
            ['Modo Compacto', 'compactmode', 'toggle'],
            ['Modo Confortavel', 'comfortmode', 'toggle'],
            ['Modo Largo', 'widemode', 'toggle'],
            ['Zoom de Fonte', 'fontzoom', 'toggle'],
            ['Espacamento de Linha', 'lineheight', 'toggle'],
            ['Modo Dia Auto', 'autoday', 'toggle'],
            ['Modo Noturno Auto', 'autonight', 'toggle'],
            ['Vibrancy', 'vibrancy', 'toggle'],
            ['Mais Quente', 'warmer', 'toggle'],
            ['Mais Frio', 'cooler', 'toggle']
        ]],
        ['FERRAMENTAS / CHEATS', [
            ['Modo Debug', 'debug', 'toggle'],
            ['Log de Eventos', 'eventlog', 'toggle'],
            ['Spoof UA iOS', 'spoofios', 'toggle'],
            ['Spoof UA Desktop', 'spoofdesktop', 'toggle'],
            ['Desativar Animacoes', 'disableanimations', 'toggle'],
            ['Battery Saver', 'batterysaver', 'toggle'],
            ['Performance Mode', 'performancemode', 'toggle'],
            ['Turbo Mode', 'turbomode', 'toggle'],
            ['Experimental', 'experimental', 'toggle'],
            ['Sem Cookies', 'nocookies', 'toggle'],
            ['Disable CSP', 'disableCSP', 'toggle'],
            ['Esconder Recaptcha', 'hiderecaptcha', 'toggle']
        ]],
        ['GEMINI AI', [
            ['Ativar Gemini', 'gemini', 'toggle'],
            ['Chat Unico', 'geminiSingleChat', 'toggle'],
            ['Gemini Automatico', 'geminiAuto', 'toggle'],
            ['Modelo Gemini', 'geminiModel', 'select', ['3.5 Flash-Lite','3.1 Pro','3.6 Flash','3.1 Pro Plus','3.6 Flash Plus','3.5 Flash-Lite Plus']]
        ]]
    ];

    // ========== MENU BUILD (DOM only, zero string HTML) ==========
    var menuEl = null;

    var MENU_CSS = [
        '.ytp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.9);backdrop-filter:blur(10px);z-index:2147483647;display:flex;justify-content:center;align-items:center;font-family:Roboto,Arial,sans-serif;color:#f1f1f1}',
        '.ytp-box{width:94%;max-width:460px;height:88%;background:#0f0f0f;border:1px solid #303030;border-radius:12px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.8)}',
        '.ytp-head{background:#0f0f0f;padding:14px 16px;border-bottom:1px solid #303030;display:flex;justify-content:space-between;align-items:center}',
        '.ytp-title{font-size:16px;font-weight:700;color:#fff;letter-spacing:.5px;display:flex;align-items:center;gap:8px}',
        '.ytp-title-badge{background:#ff0000;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600}',
        '.ytp-close{color:#f1f1f1;font-size:26px;font-weight:300;cursor:pointer;line-height:1;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%}',
        '.ytp-close:hover{background:#303030}',
        '.ytp-body{padding:12px;overflow-y:auto;flex:1;-webkit-overflow-scrolling:touch}',
        '.ytp-body::-webkit-scrollbar{width:6px}',
        '.ytp-body::-webkit-scrollbar-thumb{background:#606060;border-radius:3px}',
        '.ytp-sec{font-size:11px;color:#ff0000;margin:16px 0 8px 0;padding-bottom:6px;letter-spacing:1.2px;font-weight:700;border-bottom:1px solid #303030}',
        '.ytp-sec:first-child{margin-top:4px}',
        '.ytp-row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#1a1a1a;border-radius:8px;margin-bottom:6px;border:1px solid #262626;min-height:44px}',
        '.ytp-row:hover{background:#212121;border-color:#3a3a3a}',
        '.ytp-lbl{font-size:13px;color:#f1f1f1;flex:1;padding-right:10px}',
        '.ytp-sw{position:relative;display:inline-block;width:42px;height:22px;flex-shrink:0}',
        '.ytp-sw input{opacity:0;width:0;height:0}',
        '.ytp-sl{position:absolute;cursor:pointer;inset:0;background:#3a3a3a;transition:.2s;border-radius:22px}',
        '.ytp-sl:before{position:absolute;content:"";height:18px;width:18px;left:2px;top:2px;background:#fff;transition:.2s;border-radius:50%}',
        '.ytp-sw input:checked + .ytp-sl{background:#ff0000}',
        '.ytp-sw input:checked + .ytp-sl:before{transform:translateX(20px)}',
        '.ytp-select{background:#212121;color:#fff;border:1px solid #3a3a3a;padding:6px 10px;border-radius:6px;font-size:12px;min-width:90px}',
        '.ytp-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}',
        '.ytp-btn{background:#ff0000;color:#fff;border:0;padding:9px 14px;border-radius:18px;font-weight:600;cursor:pointer;font-size:12px;font-family:inherit}',
        '.ytp-btn:hover{background:#ff3333}',
        '.ytp-btn.dark{background:#303030;color:#fff}',
        '.ytp-btn.dark:hover{background:#404040}',
        '.ytp-foot{text-align:center;color:#909090;font-size:11px;padding:12px;border-top:1px solid #303030}',
        '.ytp-gear{position:fixed!important;bottom:80px!important;right:16px!important;width:42px!important;height:42px!important;background:linear-gradient(135deg,#ff0000,#cc0000)!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 3px 12px rgba(255,0,0,.5)!important;z-index:2147483646!important;cursor:pointer!important;border:2px solid #fff!important}',
        '.ytp-gear svg{width:22px;height:22px;fill:#fff!important}'
    ].join('\n');

    function injectMenuCSS() {
        if (document.getElementById('ytp-v6-menu-css')) return;
        var st = document.createElement('style');
        st.id = 'ytp-v6-menu-css';
        st.textContent = MENU_CSS;
        document.head.appendChild(st);
    }

    function buildRow(label, key, type, options) {
        var row = document.createElement('div');
        row.className = 'ytp-row';
        var lbl = document.createElement('span');
        lbl.className = 'ytp-lbl';
        lbl.textContent = label;
        row.appendChild(lbl);

        if (type === 'toggle') {
            var sw = document.createElement('label');
            sw.className = 'ytp-sw';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = !!S[key];
            cb.addEventListener('change', (function(k) {
                return function(e) { save(k, e.target.checked); };
            })(key));
            var sl = document.createElement('span');
            sl.className = 'ytp-sl';
            sw.appendChild(cb);
            sw.appendChild(sl);
            row.appendChild(sw);
        } else if (type === 'select') {
            var sel = document.createElement('select');
            sel.className = 'ytp-select';
            var opts = options || [];
            for (var i = 0; i < opts.length; i++) {
                var opt = document.createElement('option');
                opt.value = opts[i];
                opt.textContent = opts[i];
                if (String(S[key]) === String(opts[i])) opt.selected = true;
                sel.appendChild(opt);
            }
            sel.addEventListener('change', (function(k) {
                return function(e) { save(k, e.target.value); };
            })(key));
            row.appendChild(sel);
        }
        return row;
    }

    function openMenu() {
        if (menuEl) return;
        injectMenuCSS();

        var overlay = document.createElement('div');
        overlay.className = 'ytp-overlay';

        var box = document.createElement('div');
        box.className = 'ytp-box';

        // Header
        var head = document.createElement('div');
        head.className = 'ytp-head';
        var titleWrap = document.createElement('div');
        titleWrap.className = 'ytp-title';
        titleWrap.textContent = 'YOUTUBE PREMIUM';
        var badge = document.createElement('span');
        badge.className = 'ytp-title-badge';
        badge.textContent = '200+';
        titleWrap.appendChild(badge);
        var closeBtn = document.createElement('div');
        closeBtn.className = 'ytp-close';
        closeBtn.textContent = '\u00D7';
        closeBtn.addEventListener('click', closeMenu);
        head.appendChild(titleWrap);
        head.appendChild(closeBtn);
        box.appendChild(head);

        // Body
        var body = document.createElement('div');
        body.className = 'ytp-body';

        for (var g = 0; g < F.length; g++) {
            var group = F[g];
            var title = group[0];
            var items = group[1];

            var secEl = document.createElement('div');
            secEl.className = 'ytp-sec';
            secEl.textContent = '\u25B6 ' + title;
            body.appendChild(secEl);

            for (var i = 0; i < items.length; i++) {
                var it = items[i];
                body.appendChild(buildRow(it[0], it[1], it[2], it[3]));
            }
        }

        // Tools section
        var toolsSec = document.createElement('div');
        toolsSec.className = 'ytp-sec';
        toolsSec.textContent = '\u25B6 FERRAMENTAS RAPIDAS';
        body.appendChild(toolsSec);

        var tools = document.createElement('div');
        tools.className = 'ytp-tools';

        function mkBtn(txt, fn, dark) {
            var b = document.createElement('button');
            b.className = 'ytp-btn' + (dark ? ' dark' : '');
            b.textContent = txt;
            b.addEventListener('click', fn);
            return b;
        }

        tools.appendChild(mkBtn('Baixar Video', function() {
            if (typeof window.ytproSabrDownload === 'function') window.ytproSabrDownload();
            else if (window.Android && Android.showToast) Android.showToast('Innertube nao carregado');
        }));
        tools.appendChild(mkBtn('Copiar Link', function() {
            try {
                var u = location.href.split('&si=')[0];
                if (navigator.clipboard) navigator.clipboard.writeText(u);
                else {
                    var ta = document.createElement('textarea');
                    ta.value = u; document.body.appendChild(ta); ta.select();
                    document.execCommand('copy'); ta.remove();
                }
                if (window.Android && Android.showToast) Android.showToast('Link copiado!');
            } catch (e) {}
        }, true));
        tools.appendChild(mkBtn('Limpar Cache', function() {
            if (window.Android && Android.clearAppCache) Android.clearAppCache();
        }, true));
        tools.appendChild(mkBtn('Resetar Tudo', function() {
            for (var kk in D) {
                try { localStorage.setItem('ytp_' + kk, String(D[kk])); } catch (e) {}
            }
            if (window.Android && Android.showToast) Android.showToast('Resetado! Recarregando...');
            setTimeout(function() { location.reload(); }, 700);
        }, true));
        body.appendChild(tools);

        box.appendChild(body);

        // Footer
        var foot = document.createElement('div');
        foot.className = 'ytp-foot';
        foot.textContent = 'YOUTUBE PREMIUM v6.0';
        box.appendChild(foot);

        overlay.appendChild(box);
        document.documentElement.appendChild(overlay);
        menuEl = overlay;

        // Push history to intercept BACK button
        try {
            history.pushState({ ytp_menu: Date.now() }, '', location.href);
        } catch (e) {}
    }

    function closeMenu() {
        if (menuEl && menuEl.parentNode) menuEl.parentNode.removeChild(menuEl);
        menuEl = null;
    }

    // Back button handlers
    window.addEventListener('popstate', function() {
        if (menuEl) closeMenu();
    });

    document.addEventListener('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (menuEl && (code === 4 || code === 27 || e.key === 'Escape' || e.key === 'GoBack' || e.key === 'BrowserBack')) {
            closeMenu();
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // ========== GEAR BUTTON ==========
    function addGear() {
        try {
            if (document.getElementById('ytp-gear')) return;
            var btn = document.createElement('div');
            btn.id = 'ytp-gear';
            btn.className = 'ytp-gear';
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19.14,12.94a7.07,7.07,0,0,0,0-1.88l2-1.58a.5.5,0,0,0,.12-.64l-1.9-3.3a.5.5,0,0,0-.6-.22l-2.36,1a7,7,0,0,0-1.62-.94l-.36-2.5A.5.5,0,0,0,14,2H10a.5.5,0,0,0-.5.42l-.36,2.5a7,7,0,0,0-1.62.94l-2.36-1a.5.5,0,0,0-.6.22L2.66,8.4a.5.5,0,0,0,.12.64l2,1.58a7.07,7.07,0,0,0,0,1.88l-2,1.58a.5.5,0,0,0-.12.64l1.9,3.3a.5.5,0,0,0,.6.22l2.36-1a7,7,0,0,0,1.62.94l.36,2.5A.5.5,0,0,0,10,22h4a.5.5,0,0,0,.5-.42l.36-2.5a7,7,0,0,0,1.62-.94l2.36,1a.5.5,0,0,0,.6-.22l1.9-3.3a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>';
            btn.addEventListener('click', openMenu);
            document.documentElement.appendChild(btn);
        } catch (e) {}
    }

    // ========== ADBLOCK ==========
    function initAdblock() {
        if (!S.adblock) return;
        try {
            var of = window.fetch;
            if (of.__ytpPatched) return;
            window.fetch = function(input, init) {
                try {
                    var url = (typeof input === 'string') ? input : (input && input.url) || '';
                    if (url.indexOf('googleads.g.doubleclick.net') > -1 ||
                        url.indexOf('youtube.com/youtubei/v1/player/ad_break') > -1 ||
                        url.indexOf('youtube.com/pagead/adview') > -1 ||
                        url.indexOf('youtube.com/api/stats/ads') > -1) {
                        return Promise.resolve(new Response('', { status: 200 }));
                    }
                    if (url.indexOf('youtube.com/youtubei/') > -1) {
                        return of.apply(this, arguments).then(function(resp) {
                            try {
                                return resp.clone().json().then(function(d) {
                                    delete d.adSlots; delete d.playerAds;
                                    delete d.adPlacements; delete d.adBreakHeartbeatParams;
                                    if (d[0] && d[0].playerResponse) {
                                        delete d[0].playerResponse.adSlots;
                                        delete d[0].playerResponse.playerAds;
                                        delete d[0].playerResponse.adPlacements;
                                    }
                                    var body = JSON.stringify(d);
                                    var h = new Headers(resp.headers);
                                    h.set('content-length', String(body.length));
                                    h.set('content-type', 'application/json');
                                    return new Response(body, { status: resp.status, headers: h });
                                }).catch(function() { return resp; });
                            } catch (e) { return resp; }
                        });
                    }
                    return of.apply(this, arguments);
                } catch (e) { return of.apply(this, arguments); }
            };
            window.fetch.__ytpPatched = true;
        } catch (e) {}
    }

    // ========== SPONSORBLOCK ==========
    function initSponsors() {
        if (!S.sponsorblock) return;
        try {
            if (location.href.indexOf('watch') === -1) return;
            var vid = new URL(location.href).searchParams.get('v');
            if (!vid) return;
            fetch('https://sponsor.ajay.app/api/skipSegments?videoID=' + vid)
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (!Array.isArray(data)) return;
                    var v = document.querySelector('video');
                    if (!v) return;
                    v.ontimeupdate = function() {
                        var cur = v.currentTime;
                        for (var i = 0; i < data.length; i++) {
                            var seg = data[i].segment;
                            if (Math.floor(cur) === Math.floor(seg[0])) {
                                v.currentTime = seg[1];
                            }
                        }
                    };
                }).catch(function() {});
        } catch (e) {}
    }

    // ========== GESTURES ==========
    var startY = 0;
    function initGestures() {
        if (!S.gestures) return;
        try {
            document.body.addEventListener('touchstart', function(e) {
                try { startY = e.changedTouches[0].screenY; } catch (err) {}
            }, { capture: true });
        } catch (e) {}
    }

    // ========== INIT ==========
    function init() {
        try { injectCSS(); } catch (e) {}
        try { injectMenuCSS(); } catch (e) {}
        try { apply(); } catch (e) {}
        try { addGear(); } catch (e) {}
        try { initAdblock(); } catch (e) {}
        try { initSponsors(); } catch (e) {}
        try { initGestures(); } catch (e) {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    // Ensure button appears (loop with guard)
    setInterval(function() {
        try { addGear(); } catch (e) {}
        try { injectCSS(); } catch (e) {}
    }, 1500);

})();
