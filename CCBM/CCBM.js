/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.2.8 - Beautiful List Layout (BetterJapanese Style)
*/

(function() {
    window.CCBM = {
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                /* アイコンアニメーション */
                @keyframes ccbmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes ccbmX { from { left: -5px; } to { left: 5px; } }
                @keyframes ccbmY { from { transform: translateY(0px); } to { transform: translateY(-7px); } }

                .ccbm-base { position: absolute !important; bottom: 50px !important; right: 5px !important; width: 48px; height: 48px; z-index: 1000000; pointer-events: none; }
                
                /* Shine：サイズと透明度をCCACM(60px/0.6)に固定 */
                #ccbm_shine { 
                    position: absolute; width: 60px; height: 60px; top: -10px; left: -5px; 
                    background: url(img/shine.png) no-repeat center; background-size: contain; 
                    z-index: 1; opacity: 0; animation: ccbmRotate 20s infinite linear; 
                    pointer-events: none; transition: opacity 0.3s ease-out;
                }
                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine { opacity: 0.6; }

                .ccbm-icon-shaker { position: absolute; width: 48px; height: 48px; z-index: 10; animation: ccbmX 0.6s infinite alternate ease-in-out, ccbmY 0.3s infinite alternate ease-in-out; pointer-events: none; }
                #ccbm_icon_element { width: 48px !important; height: 48px !important; background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; cursor: pointer !important; filter: drop-shadow(0px 0px 4px #000) !important; position: relative; z-index: 20; pointer-events: auto; }

                /* --- BetterJapanese風リストレイアウト --- */
                .ccbm-list-container { width: 100%; margin-top: 8px; }
                .ccbm-list-item { 
                    display: flex; 
                    align-items: center; 
                    margin: 4px 0; 
                    padding: 4px 8px; 
                    border: 1px solid transparent;
                }
                .ccbm-list-item:hover { background: rgba(255,255,255,0.05); }

                /* 左側：操作エリア（ボタンや入力欄） */
                .ccbm-op-area { 
                    width: 160px; 
                    flex-shrink: 0; 
                    text-align: right; 
                    margin-right: 15px; 
                }
                
                /* 右側：説明文エリア */
                .ccbm-desc-area { 
                    flex-grow: 1; 
                    text-align: left; 
                    font-size: 12px; 
                    color: rgba(255,255,255,0.7); 
                    line-height: 1.3;
                    pointer-events: none;
                }

                .ccbm-input-time { 
                    background: #000; color: #fff; border: 1px solid #444; 
                    padding: 2px 4px; font-size: 14px; width: 100%; box-sizing: border-box; 
                    text-align: center;
                }
                
                /* ウィンドウ自体の安定化 */
                #prompt { min-width: 600px !important; }
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
            const shine = document.createElement('div');
            shine.id = 'ccbm_shine';
            const shaker = document.createElement('div');
            shaker.className = 'ccbm-icon-shaker';
            const icon = document.createElement('div');
            icon.id = 'ccbm_icon_element';
            icon.onclick = () => { PlaySound('snd/tick.mp3'); this.openMainMenu(); };
            
            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
        },

        openMainMenu: function() {
            const ccacm = Game.mods['CCACM'];
            if (!ccacm) return;
            const isEnabled = ccacm.config.enabled;

            let content = `
                <div class="ccbm-list-container">
                    <div style="text-align:center; color:#ecc606; font-weight:bold; margin-bottom:12px; border-bottom:1px solid #444; padding-bottom:4px;">
                        CCACM (自動終了設定)
                    </div>

                    <div class="ccbm-list-item">
                        <div class="ccbm-op-area">
                            <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" style="width:140px; margin:0;" 
                               onclick="Game.mods['CCACM'].toggleEnabled(); Game.ClosePrompt(); Game.mods['CCBM'].openMainMenu();">
                               自動終了：${isEnabled ? 'ON' : 'OFF'}
                            </a>
                        </div>
                        <div class="ccbm-desc-area">（指定時刻にゲームをセーブして自動的に終了します。）</div>
                    </div>

                    <div class="ccbm-list-item" style="${isEnabled ? '' : 'opacity:0.3;'}">
                        <div class="ccbm-op-area">
                            <input type="time" id="ccbm_time_in" class="ccbm-input-time" value="${ccacm.config.targetTime}">
                        </div>
                        <div class="ccbm-desc-area">（自動終了を実行させる時刻を設定します。）</div>
                    </div>

                    <div class="ccbm-list-item" style="${isEnabled ? '' : 'opacity:0.3;'}">
                        <div class="ccbm-op-area">
                            <a class="option smallFancyButton" style="width:140px; margin:0;" 
                               onclick="Game.mods['CCACM'].updateTime(l('ccbm_time_in').value);">
                               時刻を保存
                            </a>
                        </div>
                        <div class="ccbm-desc-area">（変更した時刻設定を保存します。反映には保存が必要です。）</div>
                    </div>
                </div>
            `;

            Game.Prompt(`<h3>CCBM 統合設定</h3>` + content, ['閉じる']);
        }
    };

    Game.registerMod("CCBM", {
        init: function() { Game.registerHook('draw', () => { window.CCBM.drawIcon(); }); }
    });
})();