/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.7 - Authentic List UI Style
*/

(function() {
    window.CCBM = {
        name: 'CCBM-Core',
        modules: {},
        
        registerConfig: function(id, name, callback) {
            this.modules[id] = { name: name, callback: callback };
        },

        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                @keyframes ccbmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccbmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                
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
                    animation: ccbmX_Extreme 0.6s infinite alternate ease-in-out, ccbmY_Extreme 0.3s infinite alternate ease-in-out;
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
                }

                /* --- 画像のスタイルを再現 --- */
                .ccbm-menu-container {
                    text-align: left !important;
                    padding: 4px 16px !important;
                }

                .ccbm-section-title {
                    width: 100%;
                    text-align: center;
                    color: #ecc606;
                    font-weight: bold;
                    margin: 12px 0 8px 0;
                    border-bottom: 1px solid #444;
                    padding-bottom: 4px;
                }

                .ccbm-listing {
                    padding: 4px 0;
                    margin: 2px 0;
                    text-align: left !important;
                }

                /* ボタンを左固定、テキストをその右に配置 */
                .ccbm-btn {
                    margin: 0 10px 0 0 !important;
                    min-width: 140px;
                    display: inline-block;
                    vertical-align: middle;
                }

                .ccbm-desc {
                    display: inline;
                    font-size: 11px;
                    color: #ccc;
                    vertical-align: middle;
                }

                .ccbm-input-time {
                    background: #000;
                    color: #fff;
                    border: 1px solid #666;
                    font-size: 14px;
                    padding: 2px 4px;
                    margin: 0 10px 0 0;
                    border-radius: 4px;
                    vertical-align: middle;
                }

                .ccbm-disabled {
                    opacity: 0.2;
                    pointer-events: none;
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
            const shaker = document.createElement('div');
            shaker.className = 'ccbm-icon-shaker';
            const icon = document.createElement('div');
            icon.id = 'ccbm_icon_element';
            icon.onclick = () => { PlaySound('snd/tick.mp3'); this.openMainMenu(); };
            shaker.appendChild(icon);
            base.appendChild(shaker);
            target.appendChild(base);
        },

        openMainMenu: function() {
            const ccacm = Game.mods['CCACM'];
            if (!ccacm) {
                Game.Prompt(`<h3>CCBM 統合設定</h3><div class="block">CCACMが見つかりません</div>`, ['閉じる']);
                return;
            }

            const isEnabled = ccacm.config.enabled;
            let content = `
                <h3>CCBM 統合設定</h3>
                <div class="block ccbm-menu-container">
                    
                    <div class="ccbm-section-title">CCACM (自動終了設定)</div>

                    <div class="ccbm-listing">
                        <a class="option smallFancyButton ccbm-btn ${isEnabled ? 'on' : 'off'}" 
                           onclick="Game.mods['CCACM'].toggleEnabled();">
                            自動終了: ${isEnabled ? 'ON' : 'OFF'}
                        </a>
                        <label class="ccbm-desc">（指定時刻にゲームをセーブして自動的に終了します。）</label>
                    </div>

                    <div class="ccbm-listing ${isEnabled ? '' : 'ccbm-disabled'}">
                        <input type="time" id="ccbm_target_time" class="ccbm-input-time" value="${ccacm.config.targetTime}">
                        <label class="ccbm-desc">（終了させる時刻を設定します。24時間表記）</label>
                    </div>

                    <div class="ccbm-listing ${isEnabled ? '' : 'ccbm-disabled'}">
                        <a class="option smallFancyButton ccbm-btn" 
                           onclick="Game.mods['CCACM'].updateTime(l('ccbm_target_time').value);">
                            時刻を保存
                        </a>
                        <label class="ccbm-desc">（設定した時刻を保存します。）</label>
                    </div>

                </div>
            `;

            Game.Prompt(content, ['閉じる']);
        }
    };

    Game.registerMod("CCBM", {
        init: function() {
            Game.registerHook('draw', () => { window.CCBM.drawIcon(); });
        }
    });
})();