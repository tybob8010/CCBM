/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.2.0 - Forced Layout & Expanded Width
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
                /* アイコン用 */
                @keyframes ccbmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccbmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                .ccbm-base { position: absolute !important; bottom: 50px !important; right: 5px !important; width: 48px; height: 48px; z-index: 1000000; pointer-events: none; }
                .ccbm-icon-shaker { position: absolute; width: 48px; height: 48px; z-index: 10; animation: ccbmX_Extreme 0.6s infinite alternate ease-in-out, ccbmY_Extreme 0.3s infinite alternate ease-in-out; pointer-events: none; }
                #ccbm_icon_element { width: 48px !important; height: 48px !important; background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; cursor: pointer !important; filter: drop-shadow(0px 0px 4px #000) !important; position: relative; z-index: 20; pointer-events: auto; }

                /* --- ウィンドウサイズを強制的に広げる --- */
                #prompt {
                    width: 800px !important; 
                    margin-left: -400px !important; 
                    text-align: left !important;
                }

                /* 1枚目の画像のようなリストレイアウトを再現 */
                .ccbm-row {
                    display: flex !important;
                    align-items: center !important;
                    padding: 8px 15px !important;
                    border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                }

                .ccbm-label-area {
                    width: 180px !important;
                    flex-shrink: 0 !important;
                    margin-right: 20px !important;
                }

                .ccbm-desc-area {
                    flex-grow: 1 !important;
                    font-size: 12px !important;
                    color: #ccc !important;
                    line-height: 1.4 !important;
                }

                .ccbm-input-time {
                    background: #000 !important;
                    color: #fff !important;
                    border: 1px solid #444 !important;
                    font-size: 16px !important;
                    padding: 4px !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }

                .ccbm-disabled {
                    opacity: 0.2 !important;
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(style);
        },

        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;
            const target = l('sectionLeft') || l('wrapper');
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
            
            // 構造を極限までシンプルにし、flexで制御
            let content = `
                <div id="ccbm_container" style="width:100%; color:#eee;">
                    <div style="text-align:center; color:#ecc606; font-weight:bold; font-size:18px; margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:8px;">
                        CCACM (自動終了設定)
                    </div>

                    <div class="ccbm-row">
                        <div class="ccbm-label-area">
                            <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" style="width:100%; margin:0;" onclick="Game.mods['CCACM'].toggleEnabled();">
                                自動終了: ${isEnabled ? 'ON' : 'OFF'}
                            </a>
                        </div>
                        <div class="ccbm-desc-area">
                            指定時刻にゲームをセーブして自動的に終了します。
                        </div>
                    </div>

                    <div class="ccbm-row ${isEnabled ? '' : 'ccbm-disabled'}">
                        <div class="ccbm-label-area">
                            <input type="time" id="ccbm_target_time" class="ccbm-input-time" value="${ccacm.config.targetTime}">
                        </div>
                        <div class="ccbm-desc-area">
                            自動終了を実行させる時刻を設定します。
                        </div>
                    </div>

                    <div class="ccbm-row ${isEnabled ? '' : 'ccbm-disabled'}">
                        <div class="ccbm-label-area">
                            <a class="option smallFancyButton" style="width:100%; margin:0;" onclick="Game.mods['CCACM'].updateTime(l('ccbm_target_time').value);">
                                時刻を保存
                            </a>
                        </div>
                        <div class="ccbm-desc-area">
                            変更した時刻設定を保存します。反映には保存が必要です。
                        </div>
                    </div>
                </div>
            `;

            // 第一引数にタイトル、第二引数にコンテンツを入れる標準形式
            Game.Prompt(`<h3>CCBM 統合設定</h3>` + content, ['閉じる']);
        }
    };

    Game.registerMod("CCBM", {
        init: function() {
            Game.registerHook('draw', () => { window.CCBM.drawIcon(); });
        }
    });
})();