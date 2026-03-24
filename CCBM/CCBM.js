/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.2.6 - Layout Stabilitiy & Shine Match
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

                /* アイコンベース */
                .ccbm-base { position: absolute !important; bottom: 50px !important; right: 5px !important; width: 48px; height: 48px; z-index: 1000000; pointer-events: none; }
                
                /* --- Shine設定：CCACMに完全準拠 --- */
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

                /* --- ウィンドウのガタつき防止：CSS側で完全に上書き --- */
                #prompt {
                    width: 800px !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    margin: 0 !important;
                    transition: none !important; /* アニメーションによるカクつきを防止 */
                }
                
                #prompt h3 { text-align: center !important; }
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
            
            // ツールチップ追加（CCACM風）
            icon.onmouseover = () => {
                Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCBM 統合設定</b><br>クリックで設定を開く</div>', 'this');
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

            let content = `
                <div style="width:100%; color:#eee; text-align:left;">
                    <div style="text-align:center !important; color:#ecc606; font-weight:bold; font-size:18px; margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:8px;">
                        CCACM (自動終了設定)
                    </div>
                    
                    <div style="display:flex; align-items:center; padding:10px 15px; border-bottom:1px solid rgba(255,255,255,0.1);">
                        <div style="width:180px; flex-shrink:0; margin-right:20px;">
                            <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" style="width:100%; margin:0; padding:4px 0; display:block; text-align:center;" onclick="Game.mods['CCACM'].toggleEnabled();">
                                自動終了: ${isEnabled ? 'ON' : 'OFF'}
                            </a>
                        </div>
                        <div style="flex-grow:1; font-size:12px; color:#ccc;">指定時刻にゲームをセーブして自動的に終了します。</div>
                    </div>

                    <div style="display:flex; align-items:center; padding:10px 15px; border-bottom:1px solid rgba(255,255,255,0.1); ${isEnabled ? '' : 'opacity:0.2; pointer-events:none;'}">
                        <div style="width:180px; flex-shrink:0; margin-right:20px;">
                            <input type="time" id="ccbm_target_time" style="background:#000; color:#fff; border:1px solid #444; font-size:16px; padding:4px; width:100%; box-sizing:border-box;" value="${ccacm.config.targetTime}">
                        </div>
                        <div style="flex-grow:1; font-size:12px; color:#ccc;">自動終了を実行させる時刻を設定します。</div>
                    </div>

                    <div style="display:flex; align-items:center; padding:10px 15px; ${isEnabled ? '' : 'opacity:0.2; pointer-events:none;'}">
                        <div style="width:180px; flex-shrink:0; margin-right:20px;">
                            <a class="option smallFancyButton" style="width:100%; margin:0; padding:4px 0; display:block; text-align:center;" onclick="Game.mods['CCACM'].updateTime(l('ccbm_target_time').value);">
                                時刻を保存
                            </a>
                        </div>
                        <div style="flex-grow:1; font-size:12px; color:#ccc;">設定した時刻を保存します。</div>
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