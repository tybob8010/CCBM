/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.0 - Drawing Fix
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
            // 1. スタイルの追加
            const style = document.createElement('style');
            style.innerHTML = `
                .ccbm-base {
                    position: absolute !important;
                    bottom: 50px !important;
                    right: 5px;
                    width: 48px;
                    height: 48px;
                    z-index: 1000000;
                }
                #ccbm_main_icon {
                    width: 48px !important;
                    height: 48px !important;
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important;
                    cursor: pointer !important;
                    filter: drop-shadow(0px 0px 4px #000) !important;
                }
            `;
            document.head.appendChild(style);

            // 2. 【最重要】ゲームの描画が終わるたびにアイコンがあるか確認する
            // これにより、他MODが画面を書き換えてアイコンが消えても、即座に復活します。
            const self = this;
            const evalDraw = () => {
                if (!l('ccbm_base')) self.prepareIcon();
            };

            // ゲームのメインループ（ロジック更新）の後に描画チェックを挟む
            Game.registerHook('draw', evalDraw);

            console.log("[CCBM] Core Initialized with Draw Hook.");
        },

        prepareIcon: function() {
            const target = l('sectionLeft');
            if (!target) return;

            const base = document.createElement('div');
            base.id = 'ccbm_base';
            base.className = 'ccbm-base';

            const icon = document.createElement('div');
            icon.id = 'ccbm_main_icon';

            icon.onclick = (e) => {
                PlaySound('snd/tick.mp3');
                this.openMainMenu();
                e.preventDefault();
                e.stopPropagation();
            };

            base.appendChild(icon);
            target.appendChild(base);
        },

        openMainMenu: function() {
            let content = `<h3>CCBM 統合設定</h3><div class="block" style="text-align:center; padding:10px;">`;
            const keys = Object.keys(this.modules);
            if (keys.length === 0) {
                content += `<p>モジュール未登録</p>`;
            } else {
                keys.forEach(id => {
                    content += `
                        <div class="listing" style="margin: 8px 0;">
                            <a class="option smallFancyButton" style="width:200px;" 
                               onclick="CCBM.modules['${id}'].callback(); Game.ClosePrompt();">
                                ${this.modules[id].name}
                            </a>
                        </div>`;
                });
            }
            content += `</div>`;
            Game.Prompt(content, ['閉じる']);
        }
    };

    Game.registerMod("CCBM", { init: () => window.CCBM.init() });
})();