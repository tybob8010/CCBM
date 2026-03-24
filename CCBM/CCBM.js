/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.2.7 - Standard Layout & Stable Positioning
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
                /* アニメーション */
                @keyframes ccbmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes ccbmX { from { left: -5px; } to { left: 5px; } }
                @keyframes ccbmY { from { transform: translateY(0px); } to { transform: translateY(-7px); } }

                .ccbm-base { position: absolute !important; bottom: 50px !important; right: 5px !important; width: 48px; height: 48px; z-index: 1000000; pointer-events: none; }
                
                /* Shine設定：CCACM（サイズ60px, 透明度0.6）に完全準拠 */
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
                    transition: opacity 0.3s ease-out;
                }
                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine { opacity: 0.6; }

                .ccbm-icon-shaker { position: absolute; width: 48px; height: 48px; z-index: 10; animation: ccbmX 0.6s infinite alternate ease-in-out, ccbmY 0.3s infinite alternate ease-in-out; pointer-events: none; }
                #ccbm_icon_element { width: 48px !important; height: 48px !important; background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; cursor: pointer !important; filter: drop-shadow(0px 0px 4px #000) !important; position: relative; z-index: 20; pointer-events: auto; }

                /* レイアウト用：flexを使って横並びを安定させる */
                .ccbm-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    text-align: left;
                }
                .ccbm-label {
                    width: 180px;
                    flex-shrink: 0;
                    margin-right: 15px;
                }
                .ccbm-desc {
                    flex-grow: 1;
                    font-size: 12px;
                    color: #ccc;
                    line-height: 1.2;
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
            const shine = document.createElement('div');
            shine.id = 'ccbm_shine';
            const shaker = document.createElement('div');
            shaker.className = 'ccbm-icon-shaker';
            const icon = document.createElement('div');
            icon.id = 'ccbm_icon_element';
            
            icon.onmouseover = () => {
                Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCBM 統合設定</b></div>', 'this');
            };
            icon.onmouseout = () => { Game.tooltip.hide(); };

            icon.onclick = (e) => { 
                PlaySound('snd/tick.mp3'); 
                this.openMainMenu(); 
                e.preventDefault();
                e.stopPropagation();
            };
            
            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
        },

        openMainMenu: function() {
            const ccacm = Game.mods['CCACM'];
            if (!ccacm) return;
            const isEnabled = ccacm.config.enabled;

            // ウィンドウサイズを固定せず、中身の横幅だけを指定（これが一番ズレない）
            let content = `
                <div style="width: 600px; min-height: 150px;">
                    <div class="ccbm-row">
                        <div class="ccbm-label">
                            <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" style="width:100%;" onclick="Game.mods['CCACM'].toggleEnabled(); Game.ClosePrompt(); Game.mods['CCBM'].openMainMenu();">
                                自動終了: ${isEnabled ? 'ON' : 'OFF'}
                            </a>
                        </div>
                        <div class="ccbm-desc">指定時刻にゲームをセーブして自動的に終了します。</div>
                    </div>

                    <div class="ccbm-row" style="${isEnabled ? '' : 'opacity:0.2; pointer-events:none;'}">
                        <div class="ccbm-label">
                            <input type="time" id="ccbm_target_time" style="background:#000; color:#fff; border:1px solid #444; padding:4px; width:100%; box-sizing:border-box;" value="${ccacm.config.targetTime}">
                        </div>
                        <div class="ccbm-desc">自動終了を実行させる時刻を設定します。</div>
                    </div>

                    <div class="ccbm-row" style="${isEnabled ? '' : 'opacity:0.2; pointer-events:none;'}">
                        <div class="ccbm-label">
                            <a class="option smallFancyButton" style="width:100%;" onclick="Game.mods['CCACM'].updateTime(l('ccbm_target_time').value);">
                                時刻を保存
                            </a>
                        </div>
                        <div class="ccbm-desc">設定した時刻を保存します。</div>
                    </div>
                </div>
            `;

            Game.Prompt(`<h3>CCBM 統合設定</h3>` + content, ['閉じる']);
        }
    };

    Game.registerMod("CCBM", {
        init: function() { 
            Game.registerHook('draw', () => { window.CCBM.drawIcon(); }); 
        }
    });
})();