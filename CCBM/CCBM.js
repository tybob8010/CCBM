/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.8 - Authentic Full-Width List Layout
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

                /* --- リストレイアウトの再定義 --- */
                .ccbm-menu-container {
                    text-align: left !important;
                    padding: 8px 0 !important;
                    width: 100%;
                }

                .ccbm-section-title {
                    width: 100%;
                    text-align: center;
                    color: #ecc606;
                    font-weight: bold;
                    font-size: 16px;
                    margin: 10px 0;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #444;
                }

                /* 各行の定義：画像のような横長のリスト */
                .ccbm-listing {
                    width: 100%;
                    padding: 6px 16px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                /* ボタンと入力欄の固定幅 */
                .ccbm-control {
                    min-width: 150px;
                    margin-right: 15px;
                    flex-shrink: 0;
                }

                /* 説明文のスタイル */
                .ccbm-desc {
                    font-size: 12px;
                    color: #ccc;
                    line-height: 1.2;
                }

                .ccbm-input-time {
                    background: #000;
                    color: #fff;
                    border: 1px solid #444;
                    font-size: 16px;
                    padding: 3px 6px;
                    border-radius: 4px;
                    width: 140px;
                    box-sizing: border-box;
                }

                .ccbm-disabled {
                    opacity: 0.2;
                    pointer-events: none;
                    filter: grayscale(1);
                }

                /* ボタンが改行されないように */
                .smallFancyButton.ccbm-btn {
                    width: 100%;
                    margin: 0 !important;
                    text-align: center;
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
            if (!ccacm) return;

            const isEnabled = ccacm.config.enabled;
            let content = `
                <div class="ccbm-menu-container">
                    
                    <div class="ccbm-section-title">CCACM (自動終了設定)</div>

                    <div class="ccbm-listing">
                        <div class="ccbm-control">
                            <a class="option smallFancyButton ccbm-btn ${isEnabled ? 'on' : 'off'}" 
                               onclick="Game.mods['CCACM'].toggleEnabled();">
                                自動終了: ${isEnabled ? 'ON' : 'OFF'}
                            </a>
                        </div>
                        <div class="ccbm-desc">（指定時刻にゲームをセーブして自動的に終了します。）</div>
                    </div>

                    <div class="ccbm-listing ${isEnabled ? '' : 'ccbm-disabled'}">
                        <div class="ccbm-control">
                            <input type="time" id="ccbm_target_time" class="ccbm-input-time" value="${ccacm.config.targetTime}">
                        </div>
                        <div class="ccbm-desc">（終了させる時刻を設定します。24時間表記）</div>
                    </div>

                    <div class="ccbm-listing ${isEnabled ? '' : 'ccbm-disabled'}">
                        <div class="ccbm-control">
                            <a class="option smallFancyButton ccbm-btn" 
                               onclick="Game.mods['CCACM'].updateTime(l('ccbm_target_time').value);">
                                時刻を保存
                            </a>
                        </div>
                        <div class="ccbm-desc">（設定した時刻を保存します。）</div>
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