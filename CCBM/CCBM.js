/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.2 - DOM Insertion Fix
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

        // アイコンを実際に描画する関数
        drawIcon: function() {
            // すでに存在するか、親要素がない場合は何もしない
            if (document.getElementById('ccbm_base')) return;
            const target = document.getElementById('wrapper'); // sectionLeftより確実
            if (!target) return;

            const base = document.createElement('div');
            base.id = 'ccbm_base';
            base.style.cssText = `
                position: absolute;
                bottom: 60px;
                right: 20px;
                width: 48px;
                height: 48px;
                z-index: 1000000;
                cursor: pointer;
                background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px;
                filter: drop-shadow(0px 0px 4px #000);
                pointer-events: auto;
            `;

            base.onclick = (e) => {
                PlaySound('snd/tick.mp3');
                this.openMainMenu();
                e.preventDefault();
            };

            base.onmouseover = () => Game.tooltip.draw(base, 'CCBM 統合設定', 'this');
            base.onmouseout = () => Game.tooltip.hide();

            target.appendChild(base);
            console.log("[CCBM] Icon injected into wrapper.");
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
            // 描画フックに登録（毎フレーム実行されるが、drawIcon側で重複チェックしている）
            Game.registerHook('draw', () => {
                window.CCBM.drawIcon();
            });
        }
    });
})();