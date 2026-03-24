/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.3.0 - BetterJapanese Visual Standard
*/

(function() {
    window.CCBM = {
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                /* アイコン系 */
                @keyframes ccbmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .ccbm-base { position: absolute !important; bottom: 50px !important; right: 5px !important; width: 48px; height: 48px; z-index: 1000000; pointer-events: none; }
                #ccbm_shine { position: absolute; width: 60px; height: 60px; top: -10px; left: -5px; background: url(img/shine.png) no-repeat center; background-size: contain; z-index: 1; opacity: 0; animation: ccbmRotate 20s infinite linear; pointer-events: none; transition: opacity 0.3s ease-out; }
                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine { opacity: 0.6; }
                .ccbm-icon-shaker { position: absolute; width: 48px; height: 48px; z-index: 10; pointer-events: none; }
                #ccbm_icon_element { width: 48px !important; height: 48px !important; background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; cursor: pointer !important; filter: drop-shadow(0px 0px 4px #000) !important; position: relative; z-index: 20; pointer-events: auto; }

                /* --- BetterJapanese Style Implementation --- */
                #prompt.ccbm-window {
                    width: 40vw !important; /* BJと同じ幅指定 */
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                }

                .ccbm-section-title {
                    text-align: center;
                    color: #ecc606;
                    font-weight: bold;
                    font-size: 18px;
                    margin: 10px 0;
                }

                /* BJの #prompt label > li を再現 */
                .ccbm-list-item {
                    display: flex;
                    align-items: center;
                    margin: 5px 0;
                    padding: 8px 12px;
                    background: #222; /* BJのリスト背景色 */
                    border: 1px solid #444;
                    text-align: left;
                    transition: background 0.1s;
                }

                .ccbm-list-item:hover {
                    background: #333; /* ホバーで少し明るく */
                }

                .ccbm-label-box {
                    width: 160px;
                    flex-shrink: 0;
                    margin-right: 15px;
                }

                .ccbm-desc-box {
                    flex-grow: 1;
                    font-size: 12px;
                    color: #ccc;
                    line-height: 1.4;
                }

                /* BJ風の入力フォーム */
                .ccbm-input {
                    background: #000;
                    color: #fff;
                    border: 1px solid #666;
                    padding: 4px;
                    width: 100%;
                    box-sizing: border-box;
                    text-align: center;
                    font-family: inherit;
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
            base.innerHTML = `<div id="ccbm_shine"></div><div class="ccbm-icon-shaker"><div id="ccbm_icon_element"></div></div>`;
            base.querySelector('#ccbm_icon_element').onclick = () => { PlaySound('snd/tick.mp3'); this.openMainMenu(); };
            target.appendChild(base);
        },

        openMainMenu: function() {
            const ccacm = Game.mods['CCACM'];
            if (!ccacm) return;
            const isEnabled = ccacm.config.enabled;

            let content = `
                <div class="ccbm-section-title">CCACM (自動終了設定)</div>
                <div style="padding: 0 10px;">
                    
                    <div class="ccbm-list-item">
                        <div class="ccbm-label-box">
                            <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" style="width:100%; margin:0;" onclick="Game.mods['CCACM'].toggleEnabled(); Game.ClosePrompt(); Game.mods['CCBM'].openMainMenu();">
                                自動終了：${isEnabled ? 'ON' : 'OFF'}
                            </a>
                        </div>
                        <div class="ccbm-desc-box">指定時刻にゲームをセーブして自動的に終了します。</div>
                    </div>

                    <div class="ccbm-list-item" style="${isEnabled ? '' : 'opacity:0.3; pointer-events:none;'}">
                        <div class="ccbm-label-box">
                            <input type="time" id="ccbm_time_val" class="ccbm-input" value="${ccacm.config.targetTime}">
                        </div>
                        <div class="ccbm-desc-box">自動終了を実行させる時刻を設定します。</div>
                    </div>

                    <div class="ccbm-list-item" style="${isEnabled ? '' : 'opacity:0.3; pointer-events:none;'}">
                        <div class="ccbm-label-box">
                            <a class="option smallFancyButton" style="width:100%; margin:0;" onclick="Game.mods['CCACM'].updateTime(l('ccbm_time_val').value); PlaySound('snd/tick.mp3');">
                                設定を保存
                            </a>
                        </div>
                        <div class="ccbm-desc-box">変更した時刻設定を保存します。</div>
                    </div>

                </div>
            `;

            // 'ccbm-window' クラスを付与してCSS制御
            Game.Prompt(`<h3>CCBM 統合設定</h3>` + content, ['閉じる'], null, 'ccbm-window');
        }
    };

    Game.registerMod("CCBM", {
        init: function() { Game.registerHook('draw', () => { window.CCBM.drawIcon(); }); }
    });
})();