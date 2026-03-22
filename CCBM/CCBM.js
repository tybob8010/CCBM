/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.5 - Enhanced UI (Left-aligned & Structured)
*/

(function() {
    // 1. オブジェクト定義（initの外側）
    window.CCBM = {
        name: 'CCBM-Core',
        modules: {},
        
        registerConfig: function(id, name, callback) {
            this.modules[id] = { name: name, callback: callback };
        },

        // スタイルシートの注入（統合メニュー用）
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

                /* --- 設定画面のスタイル (強制左寄せ) --- */
                .ccbm-menu-container {
                    text-align: left !important; /* 強制左寄せ */
                    padding: 10px 15px !important;
                }

                .ccbm-subtitle {
                    font-size: 16px;
                    color: #ccc;
                    border-left: 4px solid #ecc606; /* 左側の黄色の線 */
                    padding-left: 8px;
                    margin: 15px 0 10px 0;
                    font-weight: bold;
                    text-align: left !important;
                }

                .ccbm-row {
                    margin-bottom: 10px;
                    text-align: left !important;
                }

                /* ボタンの改行を防ぎ、左に寄せる */
                .ccbm-btn-left {
                    display: inline-block !important;
                    margin: 4px 0 !important;
                    white-space: nowrap !important; /* 改行禁止 */
                    text-align: center !important;
                    float: left !important; /* 左に寄せる */
                    clear: both; /* 他のボタンと重ならないように */
                }

                .ccbm-config-disabled {
                    opacity: 0.3;
                    pointer-events: none;
                    filter: grayscale(1);
                }

                .ccbm-input-time {
                    background: #000;
                    color: #fff;
                    border: 1px solid #666;
                    font-size: 16px;
                    padding: 4px;
                    margin: 5px 0;
                    border-radius: 4px;
                    display: block; /* 一行占有 */
                    clear: both;
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
                e.preventDefault(); e.stopPropagation();
            };
            icon.onmouseover = () => Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCBM 統合設定</b><br>クリックで設定画面を開く</div>', 'this');
            icon.onmouseout = () => Game.tooltip.hide();
            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
        },

        // 統合メインメニュー
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
                    
                    <div class="ccbm-subtitle">CCACM (自動終了設定)</div>

                    <div class="ccbm-row">
                        <a class="option ccbm-btn-left ${isEnabled ? 'on' : 'off'}" 
                           onclick="Game.mods['CCACM'].toggleEnabled();">
                            自動終了 (CCACM): ${isEnabled ? 'ON' : 'OFF'}
                        </a>
                    </div>

                    <div id="ccbm_ccacm_detail" class="ccbm-row ${isEnabled ? '' : 'ccbm-config-disabled'}">
                        <div style="font-size:12px; color:#aaa; margin-bottom:4px; text-align:left;">終了時刻を指定してください:</div>
                        <input type="time" id="ccbm_target_time" class="ccbm-input-time" value="${ccacm.config.targetTime}">
                        
                        <a class="option ccbm-btn-left" 
                           onclick="Game.mods['CCACM'].updateTime(l('ccbm_target_time').value);">
                            設定時刻を保存
                        </a>
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