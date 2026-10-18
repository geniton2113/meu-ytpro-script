/***** YOUTUBE PREMIUM - VERSAO SEGURA *****/
(function() {
    if (window.YTPREM_SAFE) return;
    window.YTPREM_SAFE = true;

    function criarBotao() {
        if (document.getElementById("btn-premium")) return;

        var btn = document.createElement("div");
        btn.id = "btn-premium";
        btn.style.cssText = "position:fixed!important;bottom:100px!important;right:20px!important;width:60px!important;height:60px!important;background:#00ffcc!important;border-radius:50%!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:30px!important;cursor:pointer!important;color:#000!important;font-weight:bold!important;";
        btn.innerHTML = "&#9881;";

        if (document.body) {
            document.body.appendChild(btn);
        } else {
            return;
        }

        btn.onclick = function() {
            if (document.getElementById("menu-premium")) return;

            var html = '<div id="menu-premium" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:2147483647;display:flex;justify-content:center;align-items:center;font-family:Arial,sans-serif;color:#fff;">';
            html += '<div style="width:90%;max-width:400px;height:80%;background:#111;border:2px solid #00ffcc;border-radius:15px;padding:20px;overflow-y:auto;box-shadow:0 0 30px #00ffcc;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ffcc;padding-bottom:10px;margin-bottom:15px;">';
            html += '<h2 style="margin:0;color:#00ffcc;font-size:18px;">CONFIGURAÇÕES PREMIUM</h2>';
            html += '<span onclick="document.getElementById(\'menu-premium\').remove()" style="color:#ff3366;font-size:24px;cursor:pointer;">&times;</span>';
            html += '</div>';

            html += '<div style="margin-bottom:10px;font-weight:bold;color:#00ffcc;">REPRODUCAO</div>';
            html += linhaToggle('Segundo Plano', 'bgplay', true);
            html += linhaToggle('Manter Tela Ligada', 'keepscreen', false);
            html += linhaToggle('Loop Automatico', 'loop', false);
            html += linhaToggle('Desbloquear 60FPS', 'unlock60fps', false);
            html += linhaVelocidade();

            html += '<div style="margin-top:15px;margin-bottom:10px;font-weight:bold;color:#00ffcc;">LIMPEZA</div>';
            html += linhaToggle('Tema Escuro', 'darkmode', true);
            html += linhaToggle('Tema OLED', 'oled', false);
            html += linhaToggle('Ocultar Shorts (Home)', 'hideshorts', true);
            html += linhaToggle('Ocultar Shorts (Nav)', 'hideshortsnav', true);
            html += linhaToggle('Ocultar Comentarios', 'hidecomments', false);
            html += linhaToggle('Ocultar Chat', 'hidechat', false);
            html += linhaToggle('Ocultar Fim do Video', 'hideendscreen', true);
            html += linhaToggle('Ocultar Tela Inicial', 'hidehome', false);
            html += linhaToggle('Ocultar Marca D agua', 'hidewatermark', false);

            html += '<div style="margin-top:15px;margin-bottom:10px;font-weight:bold;color:#00ffcc;">FUNCOES</div>';
            html += linhaToggle('AdBlock Master', 'adblock', true);
            html += linhaToggle('Pular Patrocinadores', 'sponsorblock', true);
            html += linhaToggle('Controles de Gestos', 'gestures', true);
            html += linhaToggle('Modo Debug', 'debug', false);

            html += '<div style="margin-top:15px;margin-bottom:10px;font-weight:bold;color:#00ffcc;">FERRAMENTAS</div>';
            html += '<button onclick="if(window.Android && Android.clearAppCache) Android.clearAppCache()" style="width:100%;padding:10px;background:#d32f2f;color:white;border:none;border-radius:5px;margin-bottom:10px;font-weight:bold;">Limpar Cache</button>';
            html += '<button onclick="if(window.ytproSabrDownload) window.ytproSabrDownload()" style="width:100%;padding:10px;background:#00ffcc;color:black;border:none;border-radius:5px;font-weight:bold;">Baixar Video</button>';

            html += '<div style="margin-top:20px;text-align:center;color:#666;font-size:12px;">YOUTUBE PREMIUM v50</div>';
            html += '</div></div>';

            document.body.insertAdjacentHTML("beforeend", html);
        };
    }

    function linhaToggle(nome, key, padrao) {
        var val = localStorage.getItem("ytp_" + key);
        var checked = (val === null ? padrao : val === "true") ? "checked" : "";
        var id = "chk_" + key;
        return '<div style="display:flex;justify-content:space-between;align-items:center;background:#222;padding:10px;border-radius:8px;margin-bottom:8px;">' +
               '<span>' + nome + '</span>' +
               '<input type="checkbox" id="' + id + '" ' + checked + ' onchange="localStorage.setItem(\'ytp_' + key + '\', this.checked); if(\'' + key + '\'===\'darkmode\'||\'' + key + '\'===\'oled\') location.reload();">' +
               '</div>';
    }

    function linhaVelocidade() {
        var vel = localStorage.getItem("ytp_speed") || "1";
        var ops = "";
        var vels = ["0.5", "1", "1.5", "2"];
        for (var i = 0; i < vels.length; i++) {
            ops += '<option value="' + vels[i] + '"' + (vel === vels[i] ? ' selected' : '') + '>' + vels[i] + '</option>';
        }
        return '<div style="display:flex;justify-content:space-between;align-items:center;background:#222;padding:10px;border-radius:8px;margin-bottom:8px;">' +
               '<span>Velocidade Padrao</span>' +
               '<select onchange="localStorage.setItem(\'ytp_speed\', this.value)" style="background:#000;color:#fff;border:1px solid #00ffcc;padding:5px;border-radius:5px;">' + ops + '</select>' +
               '</div>';
    }

    setInterval(criarBotao, 1000);
})();
