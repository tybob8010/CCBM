/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.0
    
    各MODの管理・統合設定メニュー
    (c) 2026 tybob
*/

(function() {
    window.CCBM = {
        name: 'CCBM-Core',
        modules: {},

        registerConfig: function(id, name, callback) {
            this.modules[id] = { name: name, callback: callback };
            console.log(`[CCBM] Module registered: ${name} (${id})`);
        },

        init: function() {
            // 1. スタイルの追加（絶対にはみ出さない、最前面の設定）
            const style = document.createElement('style');
            style.innerHTML = `
                .ccbm-base {
                    position: fixed !important; /* absoluteからfixedに変更し、スクロールに影響されないように */
                    bottom: 15px !important;
                    left: 15px !important; /* 左下に配置（他MODのアイコンと重なりにくくするため） */
                    width: 48px;
                    height: 48px;
                    z-index: 10000000; /* 最大級の優先度 */
                }
                #ccbm_main_icon {
                    width: 48px !important;
                    height: 48px !important;
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important;
                    cursor: pointer !important;
                    filter: drop-shadow(0px 0px 4px #000) !important;
                    transition: transform 0.1s ease-out, filter 0.1s;
                }
                #ccbm_main_icon:hover {
                    transform: scale(1.1) rotate(30deg);
                    filter: drop-shadow(0px 0px 8px #fff) brightness(1.2) !important;
                }
                #ccbm_shine {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    top: -16px;
                    left: -16px;
                    background: url(img/shine.png) no-repeat center;
                    background-size: contain;
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.5s;
                    pointer-events: none;
                }
                .ccbm-base:hover #ccbm_shine {
                    opacity: 0.5;
                }
            `;
            document.head.appendChild(style);

            // 2. 描画監視ループ（画面が書き換えられても自動で再設置する）
            this.retryInterval = setInterval(() => {
                // sectionLeft、または最悪 body があれば設置を試みる
                const target = l('sectionLeft') || document.body;
                if (target && !l('ccbm_base')) {
                    this.prepareIcon(target);
                }
            }, 1000);

            console.log("[CCBM] Core Initialized with watcher.");
        },

        prepareIcon: function(target) {
            const base = document.createElement('div');
            base.id = 'ccbm_base';
            base.className = 'ccbm-base';

            const shine = document.createElement('div');
            shine.id = 'ccbm_shine';

            const icon = document.createElement('div');
            icon.id = 'ccbm_main_icon';

            icon.onmouseover = () => {
                Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCBM 統合設定</b><br><small>読み込まれた全MODの設定にアクセスできます</small></div>', 'this');
            };
            icon.onmouseout = () => { Game.tooltip.hide(); };
            
            icon.onclick = (e) => {
                PlaySound('snd/tick.mp3');
                this.openMainMenu();
                e.preventDefault();
                e.stopPropagation();
            };

            base.appendChild(shine);
            base.appendChild(icon);
            target.appendChild(base);
        },

        openMainMenu: function() {
            let content = `<h3>Cookie Clicker Basic Mod 統合設定</h3>`;
            content += `<div class="block" style="text-align:center; padding:10px;">`;
            
            const moduleKeys = Object.keys(this.modules);
            
            if (moduleKeys.length === 0) {
                content += `<p style="color:#ccc;">有効なMODが見つかりません。<br><small>modules.json の読み込みを確認してください。</small></p>`;
            } else {
                moduleKeys.forEach(id => {
                    const mod = this.modules[id];
                    content += `
                        <div class="listing" style="margin: 10px 0;">
                            <a class="option smallFancyButton" style="display:inline-block; width:220px; font-size:16px;" 
                                onclick="CCBM.modules['${id}'].callback(); PlaySound('snd/tick.mp3');">
                                ${mod.name}
                            </a>
                        </div>`;
                });
            }
            
            content += `</div>`;
            Game.Prompt(content, ['閉じる']);
        }
    };

    // MODとして登録
    Game.registerMod("CCBM", {
        init: function() {
            window.CCBM.init();
        }
    });
})();