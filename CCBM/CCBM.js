/*
    CCBM (Cookie Clicker Basic MOD)
    STABLE FIX
*/

(function() {

    window.CCBM = window.CCBM || {
        configs: [],
        removedMods: {},

        registerConfig: function(id, name, callback) {
            this.configs.push({ id, name, callback });
        },

        // =========================
        // スタイル
        // =========================
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;

            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                @keyframes ccbmX { from { left:-5px } to { left:5px } }
                @keyframes ccbmY { from { transform:translateY(0)} to { transform:translateY(-7px)} }
                @keyframes ccbmRot { from { transform:rotate(0)} to { transform:rotate(360deg)} }

                .ccbm-base {
                    position:absolute;
                    bottom:50px;
                    right:5px;
                    width:60px;height:60px;
                    z-index:1000000;
                }

                .ccbm-shaker {
                    position:absolute;
                    width:48px;height:48px;
                    animation: ccbmX 0.6s infinite alternate, ccbmY 0.3s infinite alternate;
                }

                #ccbm_icon {
                    width:48px;height:48px;
                    background:url(img/icons.png) -192px 0;
                    cursor:pointer;
                    filter: drop-shadow(0 0 4px #000);
                }

                #ccbm_shine {
                    position:absolute;
                    width:60px;height:60px;
                    top:-5px;left:-5px;
                    background:url(img/shine.png) no-repeat center;
                    background-size:contain;
                    opacity:0;
                    animation: ccbmRot 20s linear infinite;
                }

                .ccbm-base:hover #ccbm_shine {
                    opacity:0.8;
                }

                .ccbm-row {
                    display:flex;
                    justify-content:space-between;
                    margin:4px 0;
                }

                .ccbm-delete {
                    color:#f66;
                    cursor:pointer;
                }
            `;
            document.head.appendChild(style);
        },

        // =========================
        // アイコン
        // =========================
        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;

            const target = l('sectionLeft');
            if (!target) return;

            this.injectStyle();

            const base = document.createElement('div');
            base.id = 'ccbm_base';
            base.className = 'ccbm-base';

            const shine = document.createElement('div');
            shine.id = 'ccbm_shine';

            const shaker = document.createElement('div');
            shaker.className = 'ccbm-shaker';

            const icon = document.createElement('div');
            icon.id = 'ccbm_icon';

            icon.onclick = () => {
                this.openMainMenu();
                PlaySound('snd/tick.mp3');
            };

            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
        },

        // =========================
        // メニュー（これが本体）
        // =========================
        openMainMenu: function() {
            Game.Prompt(`
                <h3>CCBM Settings</h3>
                <div id="ccbm_config_list"></div>
                <div id="ccbm_config_content"></div>
            `, ['閉じる']);

            const list = document.getElementById('ccbm_config_list');
            const content = document.getElementById('ccbm_config_content');

            if (!list || !content) return;

            this.configs.forEach(cfg => {
                const row = document.createElement('div');
                row.className = 'ccbm-row';

                const name = document.createElement('span');
                name.textContent = cfg.name;

                row.appendChild(name);
                list.appendChild(row);

                if (typeof cfg.callback === 'function') {
                    cfg.callback(content);
                }
            });
        }
    };

    // =========================
    // MOD登録
    // =========================
    Game.registerMod("CCBM", {
        init: function() {
            Game.registerHook('draw', () => {
                window.CCBM.drawIcon();
            });
        },

        save: function() {
            return JSON.stringify({
                removedMods: window.CCBM.removedMods
            });
        },

        load: function(str) {
            if (!str) return;
            try {
                const data = JSON.parse(str);
                if (data.removedMods) {
                    window.CCBM.removedMods = data.removedMods;
                }
            } catch(e) {}
        }
    });

})();