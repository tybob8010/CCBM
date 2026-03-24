/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.6.6
*/

(function() {
    window.CCBM = window.CCBM || {
        isReady: true,

        configs: [],

        registerConfig: function(id, name, callback) {
            this.configs.push({ id, name, callback });
        },
        
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                @keyframes ccacmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccacmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                @keyframes ccacmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .ccbm-base { 
                    position: absolute !important; 
                    bottom: 50px !important; 
                    right: 5px !important; 
                    width: 60px; height: 60px; 
                    z-index: 1000000; 
                }
                .ccbm-icon-shaker { 
                    position: absolute; width: 48px; height: 48px; 
                    animation: ccacmX_Extreme 0.6s infinite alternate ease-in-out, ccacmY_Extreme 0.3s infinite alternate ease-in-out; 
                }
                #ccbm_icon_element { 
                    width: 48px !important; height: 48px !important; 
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; 
                    cursor: pointer !important; 
                    filter: drop-shadow(0px 0px 4px #000) !important; 
                }
                
                #ccbm_shine { 
                    position: absolute; width: 60px; height: 60px; top: -5px; left: -5px; 
                    background: url(img/shine.png) no-repeat center; background-size: contain; 
                    z-index: -1; opacity: 0; animation: ccacmRotate 20s infinite linear; 
                    pointer-events: none; transition: opacity 0.3s;
                }
                .ccbm-base:hover #ccbm_shine { opacity: 0.8; }

                .ccbm-prompt-container { text-align: left; padding: 10px; }
                .ccbm-button-row { margin: 8px 0; display: block; clear: both; }
            `;
            document.head.appendChild(style);
        },

        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;
            const target = l('sectionLeft');
            if (!target) return;

            this.injectStyle();
            
            const html = `
                <div id="ccbm_base" class="ccbm-base">
                    <div id="ccbm_shine"></div>
                    <div class="ccbm-icon-shaker">
                        <div id="ccbm_icon_element" title="CCBM Settings" onclick="CCBM.openMainMenu(); PlaySound('snd/tick.mp3');"></div>
                    </div>
                </div>
            `;
            target.insertAdjacentHTML('beforeend', html);
        },

        openMainMenu: function() {
            Game.Prompt(`
                <h3>CCBM Settings</h3>
                <div class="ccbm-prompt-container">
                    <div id="ccbm_config_list"></div>
                </div>
            `, ['閉じる']);

            const container = document.getElementById('ccbm_config_list');
            if (!container) return;

            this.configs.forEach(cfg => {
                const row = document.createElement('div');
                row.className = 'ccbm-button-row';

                const btn = document.createElement('a');
                btn.className = 'smallFancyButton option';
                btn.textContent = cfg.name;

                btn.onclick = () => {
                    if (typeof cfg.callback === 'function') {
                        cfg.callback();
                    }
                    PlaySound('snd/tick.mp3');
                };

                row.appendChild(btn);
                container.appendChild(row);
            });
        }
    };

    Game.registerMod("CCBM", {
        init: function() {
            Game.registerHook('draw', () => {
                window.CCBM.drawIcon();
            });
        }
    });
})();