/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.0.0
*/

(function() {
    // 1. オブジェクト定義（initの外側）
    window.CCBM = {
        name: 'CCBM-Core',
        modules: {},
        
        registerConfig: function(id, name, callback) {
            this.modules[id] = { name: name, callback: callback };
            console.log(`[CCBM] Module registered: ${name} (${id})`);
        },

        // スタイルシートの生成（CCACMのアニメーション設定を統合）
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                /* アイコンの揺れアニメーション（左右・極端） */
                @keyframes ccbmX_Extreme { from { left: -5px; } to { left: 5px; } }
                /* アイコンの跳ねアニメーション（上下・鋭い） */
                @keyframes ccbmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                /* 背後Shineの回転アニメーション */
                @keyframes ccbmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* 歯車アイコンのベースコンテナ */
                .ccbm-base {
                    position: absolute !important;
                    bottom: 50px !important;    /* CCACMの位置に合わせる */
                    right: 5px !important;      /* sectionLeftの端に寄せる */
                    width: 48px;
                    height: 48px;
                    z-index: 1000000;
                    pointer-events: none;
                }

                /* アニメーションを適用するラッパー */
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

                /* 歯車アイコン本体 */
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

                /* ホバー時に光らせる演出 */
                #ccbm_icon_element:hover {
                    filter: drop-shadow(0px 0px 6px rgba(255,255,255,0.7)) brightness(1.0) !important;
                }

                /* アイコン背後の回転する光(shine.png) */
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

                /* ホバー時のみShineを表示 */
                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine {
                    opacity: 0.6;
                    transition: opacity 0.3s ease-out;
                }
            `;
            document.head.appendChild(style);
        },

        // アイコンを実際に描画する関数
        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;
            
            // CCACMと同じく sectionLeft を優先、なければ wrapper
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
                e.preventDefault();
                e.stopPropagation();
            };

            icon.onmouseover = () => Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCBM 統合設定</b><br>クリックで設定画面を開く</div>', 'this');
            icon.onmouseout = () => Game.tooltip.hide();

            // 組み立て
            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
            
            console.log("[CCBM] Enhanced Icon injected.");
        },

        openMainMenu: function() {
            let content = `<h3>CCBM 統合設定</h3><div class="block" style="text-align:center; padding:10px;">`;
            const keys = Object.keys(this.modules);
            if (keys.length === 0) {
                content += `<p>登録モジュールなし</p>`;
            } else {
                keys.forEach(id => {
                    content += `<div class="listing"><a class="option smallFancyButton" onclick="CCBM.modules['${id}'].callback();">${this.modules[id].name}</a></div>`;
                });
            }
            content += `</div>`;
            Game.Prompt(content, ['閉じる']);
        }
    };

    // 2. MOD登録
    Game.registerMod("CCBM", {
        init: function() {
            console.log("[CCBM] Init called.");
            // 描画フックに登録
            Game.registerHook('draw', () => {
                window.CCBM.drawIcon();
            });
        }
    });
})();