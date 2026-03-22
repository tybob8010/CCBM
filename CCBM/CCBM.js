/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.5 - Left-aligned UI & Enhanced Animation
*/

(function() {
    window.CCBM = {
        name: 'CCBM-Core',
        modules: {},
        
        registerConfig: function(id, name, callback) {
            this.modules[id] = { name: name, callback: callback };
            console.log(`[CCBM] Module registered: ${name} (${id})`);
        },

        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                @keyframes ccbmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccbmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                @keyframes ccbmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .ccbm-base {
                    position: absolute !important;
                    bottom: 50px !important;
                    right: 5px !important;
                    width: 48px;
                    height: 48px;
                    z-index: 1000000;
                    pointer-events: none;
                }

                .ccbm-icon-shaker {
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    z-index: 10;
                    animation:
                        ccbmX_Extreme 0.6s infinite alternate ease-in-out,
                        ccbmY_Extreme 0.3s infinite alternate ease-in-out;
                    pointer-events: none;
                }

                #ccbm_icon_element {
                    width: 48px !important;
                    height: 48px !important;
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important;
                    cursor: pointer !important;
                    filter: drop-shadow(0px 0px 4px #000) !important;
                    position: relative;
                    z-index: 20;
                    pointer-events: auto;
                    transition: filter 0.1s ease-out;
                }

                #ccbm_icon_element:hover {
                    filter: drop-shadow(0px 0px 6px rgba(255,255,255,0.7)) brightness(1.0) !important;
                }

                #ccbm_shine {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    top: -10px;
                    left: -5px;
                    background: url(img/shine.png) no-repeat center;
                    background-size: contain;
                    z-index: 1;
                    opacity: 0;
                    animation: ccbmRotate 20s infinite linear;
                    pointer-events: none;
                }

                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine {
                    opacity: 0.6;
                    transition: opacity 0.3s ease-out;
                }

                /* 設定画面用：左揃えと無効化のスタイル */
                .ccbm-config-container {
                    text-align: left; /* 左揃えに変更 */
                    padding: 10px 20px;
                }
                .ccbm-config-disabled {
                    opacity: 0.4;
                    pointer-events: none;
                    filter: grayscale(1);
                }
                .ccbm-label {
                    font-size: 13px;
                    color: #ccc;
                    margin-bottom: 5px;
                    display: inline-block;
                }
            `;
            document.head.appendChild(style);
        },

        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;
            const target = document.getElementById('sectionLeft') || document.getElementById('wrapper');
            if (!target) return;

            this.injectStyle();

            const base = document.createElement('div');
            base.id = 'ccbm_base';
            base.className = 'ccbm-base';

            const shine = document.createElement('div');
            shine.id = 'ccbm_shine';

            const shaker = document.createElement('div');
            shaker.className = 'ccbm-icon-shaker';

            const icon = document.createElement('div');
            icon.id = 'ccbm_icon_element';

            icon.onclick = (e) => {
                PlaySound('snd/tick.mp3');
                this.openMainMenu();
                e.preventDefault();
                e.stopPropagation();
            };

            icon.onmouseover = () => Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCBM 設定</b><br>クリックで設定画面を開く</div>', 'this');
            icon.onmouseout = () => Game.tooltip.hide();

            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
        },

        openMainMenu: function() {
            const ccacm = Game.mods['CCACM'];
            if (!ccacm) {
                Game.Prompt(`<h3>CCBM 設定</h3><div class="block">CCACMが見つかりません</div>`, ['閉じる']);
                return;
            }

            const isEnabled = ccacm.config.enabled;
            let content = `
                <h3>CCBM 設定</h3>
                <div class="block ccbm-config-container">
                    <div class="listing">
                        <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" id="ccbm_ccacm_toggle"
                           style="margin-bottom:10px;"
                           onclick="Game.mods['CCACM'].toggleEnabled();">
                            自動終了 (CCACM): ${isEnabled ? 'ON' : 'OFF'}
                        </a>
                    </div>

                    <div id="ccbm_ccacm_detail" class="${isEnabled ? '' : 'ccbm-config-disabled'}" 
                         style="margin-top:5px; border-top: 1px solid #444; padding-top:10px;">
                        <span class="ccbm-label">終了時刻設定:</span><br>
                        <input type="time" id="ccbm_target_time" value="${ccacm.config.targetTime}" 
                            style="background:#000; color:#fff; border:1px solid #666; font-size:18px; margin:8px 0; padding:2px 5px; border-radius:4px;">
                        <br>
                        <a class="option smallFancyButton" onclick="Game.mods['CCACM'].updateTime(l('ccbm_target_time').value);">時刻を保存</a>
                    </div>
                </div>
            `;

            Game.Prompt(content, ['閉じる']);
        }
    };

    Game.registerMod("CCBM", {
        init: function() {
            console.log("[CCBM] Init called.");
            Game.registerHook('draw', () => {
                window.CCBM.drawIcon();
            });
        }
    });
})();