/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.0.0
    
    各MODの管理
    (c) 2026 tybob
*/

(function() {
    // グローバルオブジェクトとして CCBM を定義
    window.CCBM = {
        name: 'CCBM-Core',
        modules: {}, // 各MODの登録情報を格納

        // 他のMODが自身の情報を登録するための関数
        // id: MODのID, name: 表示名, callback: 設定画面を開く関数
        registerConfig: function(id, name, callback) {
            this.modules[id] = { name: name, callback: callback };
            console.log(`[CCBM] Module registered: ${name} (${id})`);
        },

        init: function() {
            // 1. 共通スタイルの追加
            const style = document.createElement('style');
            style.innerHTML = `
                /* 共通アイコンの配置 */
                .ccbm-base {
                    position: absolute !important;
                    bottom: 50px !important;
                    right: 5px;
                    width: 48px;
                    height: 48px;
                    z-index: 1000000;
                    pointer-events: none;
                }
                /* 歯車アイコンの見た目 */
                #ccbm_main_icon {
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
                #ccbm_main_icon:hover {
                    filter: drop-shadow(0px 0px 6px #fff) brightness(1.1) !important;
                }
                /* アイコン背後の光（任意） */
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
                    pointer-events: none;
                    transition: opacity 0.3s;
                }
                .ccbm-base:hover #ccbm_shine {
                    opacity: 0.4;
                }
            `;
            document.head.appendChild(style);

            this.prepareIcon();
            console.log("[CCBM] Core Initialized.");
        },

        // アイコンを画面に配置
        prepareIcon: function() {
            if (l('ccbm_base')) return;

            const target = l('sectionLeft');
            if (target) {
                const base = document.createElement('div');
                base.id = 'ccbm_base';
                base.className = 'ccbm-base';

                const shine = document.createElement('div');
                shine.id = 'ccbm_shine';

                const icon = document.createElement('div');
                icon.id = 'ccbm_main_icon';

                // ホバーとクリックの動作
                icon.onmouseover = () => {
                    Game.tooltip.draw(icon, '<div style="padding:8px;width:150px;text-align:center;"><b>CCBM 統合設定</b><br>クリックでメニューを表示</div>', 'this');
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
            } else {
                // ロードがまだなら再試行
                setTimeout(() => this.prepareIcon(), 1000);
            }
        },

        // 各MODのボタンを並べたメインメニューを表示
        openMainMenu: function() {
            let content = `<h3>Cookie Clicker Basic Mod 統合設定</h3>`;
            content += `<div class="block" style="text-align:center; padding:10px;">`;
            
            const moduleKeys = Object.keys(this.modules);
            
            if (moduleKeys.length === 0) {
                content += `<p>読み込まれたMODモジュールがありません。</p>`;
            } else {
                moduleKeys.forEach(id => {
                    const mod = this.modules[id];
                    content += `
                        <div class="listing" style="margin: 8px 0;">
                            <a class="option smallFancyButton" style="display:inline-block; width:200px;" 
                               onclick="CCBM.modules['${id}'].callback(); PlaySound('snd/tick.mp3');">
                                ${mod.name} 設定
                            </a>
                        </div>`;
                });
            }
            
            content += `</div>`;

            // ゲームのプロンプト機能で表示
            Game.Prompt(content, ['閉じる']);
        }
    };

    // Cookie ClickerにMODとして登録
    Game.registerMod("CCBM", {
        init: function() {
            window.CCBM.init();
        }
    });
})();