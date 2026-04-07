/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.0.1pre5
*/

(function() {

    window.CCBM = window.CCBM || {
        configs: [],
        removedMods: {},
        modulePaths: {},

        registerConfig: function(id, name, callback) {
            this.configs.push({ id, name, callback });
        },

        // =========================
        // 歯車
        // =========================
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;

            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                .ccbm-base {
                    position:absolute;
                    bottom:50px;
                    right:5px;
                    width:60px;height:60px;
                    z-index:1000000;
                }
                #ccbm_icon {
                    width:48px;height:48px;
                    background:url(img/icons.png) -192px 0;
                    cursor:pointer;
                }
            `;
            document.head.appendChild(style);
        },

        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;

            const target = l('sectionLeft');
            if (!target) return;

            this.injectStyle();

            const div = document.createElement('div');
            div.id = 'ccbm_base';
            div.className = 'ccbm-base';

            const icon = document.createElement('div');
            icon.id = 'ccbm_icon';

            icon.onclick = () => {
                this.openMainMenu();
            };

            div.appendChild(icon);
            target.appendChild(div);
        },

        openMainMenu: function() {
            Game.Prompt(`<h3>CCBM</h3>`, ['閉じる']);
        }
    };

    // =========================
    // ★最重要
    // =========================
    Game.registerMod("CCBM", {
        init: function() {

            // ★これがないと全部壊れる
            if (window.CCBM && typeof window.CCBM.loadModules === 'function') {
                window.CCBM.loadModules();
            }

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