/***** YOUTUBE PREMIUM - VERSAO FORÇADA *****/
(function() {
    // Se já rodou, não roda de novo
    if (window.YTPREM_FORCED) return;
    window.YTPREM_FORCED = true;

    // Função para criar o botão
    function criarBotao() {
        // Se o botão já existe, não cria de novo
        if (document.getElementById("btn-premium")) return;

        var btn = document.createElement("div");
        btn.id = "btn-premium";
        btn.style.cssText = `
            position: fixed !important;
            bottom: 100px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            background: linear-gradient(135deg, #00ffcc, #0088ff) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 0 20px rgba(0,255,204,0.8) !important;
            z-index: 2147483647 !important;
            cursor: pointer !important;
            font-size: 30px !important;
            color: #000 !important;
            font-weight: bold !important;
        `;
        btn.innerHTML = "⚙";
        
        // Adiciona ao body ou documentElement, o que existir primeiro
        if (document.body) {
            document.body.appendChild(btn);
        } else if (document.documentElement) {
            document.documentElement.appendChild(btn);
        } else {
            return; // Tenta de novo no próximo intervalo
        }

        // Evento de clique para abrir o menu
        btn.onclick = function() {
            var menu = document.getElementById("menu-premium");
            if (menu) {
                menu.remove();
                return;
            }

            var htmlMenu = `
            <div id="menu-premium" style="
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0,0,0,0.95) !important;
                z-index: 2147483647 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                font-family: Arial, sans-serif !important;
                color: #fff !important;
            ">
                <div style="
                    width: 90% !important;
                    max-width: 400px !important;
                    height: 80% !important;
                    background: #111 !important;
                    border: 2px solid #00ffcc !important;
                    border-radius: 15px !important;
                    padding: 20px !important;
                    overflow-y: auto !important;
                    box-shadow: 0 0 30px #00ffcc !important;
                ">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #00ffcc; padding-bottom:10px; margin-bottom:15px;">
                        <h2 style="margin:0; color:#00ffcc; font-size:18px;">CONFIGURAÇÕES PREMIUM</h2>
                        <span onclick="document.getElementById('menu-premium').remove()" style="color:#ff3366; font-size:24px; cursor:pointer;">&times;</span>
                    </div>

                    <div style="margin-bottom:10px; font-weight:bold; color:#00ffcc;">▶ REPRODUÇÃO</div>
                    ${criarLinhaToggle('Segundo Plano', 'bgplay', true)}
                    ${criarLinhaToggle('Manter Tela Ligada', 'keepscreen', false)}
                    ${criarLinhaToggle('Loop Automático', 'loop', false)}
                    ${criarLinhaToggle('Desbloquear 60FPS', 'unlock60fps', false)}
                    ${criarLinhaVelocidade()}

                    <div style="margin-top:15px; margin-bottom:10px; font-weight:bold; color:#00ffcc;">🛡️ LIMPEZA</div>
                    ${criarLinhaToggle('Tema Escuro', 'darkmode', true)}
                    ${criarLinhaToggle('Tema OLED', 'oled', false)}
                    ${criarLinhaToggle('Ocultar Shorts (Home)', 'hideshorts', true)}
                    ${criarLinhaToggle('Ocultar Shorts (Nav)', 'hideshortsnav', true)}
                    ${criarLinhaToggle('Ocultar Comentários', 'hidecomments', false)}
                    ${criarLinhaToggle('Ocultar Chat', 'hidechat', false)}
                    ${criarLinhaToggle('Ocultar Fim do Vídeo', 'hideendscreen', true)}
                    ${criarLinhaToggle('Ocultar Tela Inicial', 'hidehome', false)}
                    ${criarLinhaToggle('Ocultar Marca D\'água', 'hidewatermark', false)}

                    <div style="margin-top:15px; margin-bottom:10px; font-weight:bold; color:#00ffcc;">⚙️ FUNÇÕES</div>
                    ${criarLinhaToggle('AdBlock Master', 'adblock', true)}
                    ${criarLinhaToggle('Pular Patrocinadores', 'sponsorblock', true)}
                    ${criarLinhaToggle('Controles de Gestos', 'gestures', true)}
                    ${criarLinhaToggle('Modo Debug', 'debug', false)}

                    <div style="margin-top:15px; margin-bottom:10px; font-weight:bold; color:#00ffcc;">🔧 FERRAMENTAS</div>
                    <button onclick="if(window.Android && Android.clearAppCache) Android.clearAppCache()" style="width:100%; padding:10px; background:#d32f2f; color:white; border:none; border-radius:5px; margin-bottom:10px; font-weight:bold;">Limpar Cache</button>
                    <button onclick="if(window.ytproSabrDownload) window.ytproSabrDownload()" style="width:100%; padding:10px; background:#00ffcc; color:black; border:none; border-radius:5px; font-weight:bold;">Baixar Vídeo</button>

                    <div style="margin-top:20px; text-align:center; color:#666; font-size:12px;">YOUTUBE PREMIUM v50</div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML("beforeend", htmlMenu);
        };
    }

    // Funções auxiliares para gerar o HTML do menu
    function criarLinhaToggle(nome, key, padrao) {
        var val = localStorage.getItem("ytp_" + key);
        var checked = (val === null ? padrao : val === "true") ? "checked" : "";
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; border-radius:8px; margin-bottom:8px;">
            <span>${nome}</span>
            <input type="checkbox" ${checked} onchange="localStorage.setItem('ytp_${key}', this.checked); if('${key}'==='darkmode'||'${key}'==='oled') location.reload();">
        </div>`;
    }

    function criarLinhaVelocidade() {
        var vel = localStorage.getItem("ytp_speed") || "1";
        var ops = ["0.5", "1", "1.5", "2"].map(v => `<option value="${v}" ${vel === v ? 'selected' : ''}>${v}</option>`).join('');
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:10px; border-radius:8px; margin-bottom:8px;">
            <span>Velocidade Padrão</span>
            <select onchange="localStorage.setItem('ytp_speed', this.value)" style="background:#000; color:#fff; border:1px solid #00ffcc; padding:5px; border-radius:5px;">${ops}</select>
        </div>`;
    }

    // Loop para garantir que o botão apareça
    // Tenta a cada 1 segundo, para sempre (se a página recarregar, ele recria)
    setInterval(criarBotao, 1000);
})();
