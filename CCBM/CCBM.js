/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.3.1 - BetterJapanese Motion & Visual Standard
*/

(function() {
    window.CCBM = {
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                /* --- 命の宿るウェーブ動き (BetterJapanese Motion) --- */
                @keyframes ccbmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                /* 左右のゆらぎ */
                @keyframes ccbmX { 
                    0% { left: -8px; } 
                    100% { left: 8px; } 
                }
                /* 上下の浮遊感（少しディレイをかけるとより「うぇーぶ」っぽくなります） */
                @keyframes ccbmY { 
                    0% { transform: translateY(0px); } 
                    100% { transform: translateY(-12px); } 
                }

                .ccbm-base { position: absolute !important; bottom: 60px !important; right: 10px !important; width: 48px; height: 48px; z-index: 1000000; pointer-events: none; }
                
                /* Shine：回転 */
                #ccbm_shine { 
                    position: absolute; width: 64px; height: 64px; top: -8px; left: -8px; 
                    background: url(img/shine.png) no-repeat center; background-size: contain; 
                    z-index: 1; opacity: 0; animation: ccbmRotate 15s infinite linear; 
                    pointer-events: none; transition: opacity 0.4s ease-out;
                }
                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine { opacity: 0.7; }

                /* アイコン本体のウェーブ動き：XとYを組み合わせて8の字のような軌道にする */
                .ccbm-icon-shaker { 
                    position: absolute; width: 48px; height: 48px; z-index: 10; 
                    animation: ccbmX 1.8s infinite alternate ease-in-out, ccbmY 1.2s infinite alternate ease-in-out; 
                    pointer-events: none; 
                }
                
                #ccbm_icon_element { 
                    width: 48px !important; height: 48px !important; 
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; 
                    cursor: pointer !important; filter: drop-shadow(0px 0px 6px #000) !important; 
                    position: relative; z-index: 20; pointer-events: auto; 
                }

                /* --- BetterJapanese リスト表示 --- */
                #prompt.ccbm-window { width: 40vw !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; }
                .ccbm-section-title { text-align: center; color: #ecc606; font-weight: bold; font-size: 18px; margin: 10px 0; border-bottom: 1px solid #444; padding-bottom: 8px; }
                
                .ccbm-list-item { 
                    display: flex; align-items: center; margin: 6px 0; padding: 10px; 
                    background: #222; border: 1px solid #333; text-align: left; transition: 0.1s; 
                }
                .ccbm-list-item:hover { background: #333; border-color: #666; }
                .ccbm-label-box { width: 160px; flex-shrink: 0; margin-right: 20px; text-align: right; }
                .ccbm-desc-box { flex-grow: 1; font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.4; }
                .ccbm-input { background: #000; color: #fff; border: 1px solid #555; padding: 4px; width: 100%; box-sizing: border-box; text-align: center; }
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
                <div style="padding: 0 5px;">
                    <div class="ccbm-list-item">
                        <div class="ccbm-label-box">
                            <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" style="width:140px; margin:0;" onclick="Game.mods['CCACM'].toggleEnabled(); Game.ClosePrompt(); Game.mods['CCBM'].openMainMenu();">
                                自動終了：${isEnabled ? 'ON' : 'OFF'}
                            </a>
                        </div>
                        <div class="ccbm-desc-box">（指定時刻にゲームをセーブして自動的に終了します。）</div>
                    </div>
                    <div class="ccbm-list-item" style="${isEnabled ? '' : 'opacity:0.3; pointer-events:none;'}">
                        <div class="ccbm-label-box">
                            <input type="time" id="ccbm_time_val" class="ccbm-input" value="${ccacm.config.targetTime}">
                        </div>
                        <div class="ccbm-desc-box">（自動終了を実行させる時刻を設定します。）</div>
                    </div>
                    <div class="ccbm-list-item" style="${isEnabled ? '' : 'opacity:0.3; pointer-events:none;'}">
                        <div class="ccbm-label-box">
                            <a class="option smallFancyButton" style="width:140px; margin:0;" onclick="Game.mods['CCACM'].updateTime(l('ccbm_time_val').value); PlaySound('snd/tick.mp3');">
                                設定を保存
                            </a>
                        </div>
                        <div class="ccbm-desc-box">（変更した時刻設定を反映させます。）</div>
                    </div>
                </div>
            `;
            Game.Prompt(`<h3>CCBM 統合設定</h3>` + content, ['閉じる'], null, 'ccbm-window');
        }
    };

    Game.registerMod("CCBM", {
        init: function() { Game.registerHook('draw', () => { window.CCBM.drawIcon(); }); }
    });
})();