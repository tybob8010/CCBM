/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.8.2
*/

(function() {
    window.CCBM = window.CCBM || {
        isReady: true,

        configs: [],
        needsReload: false,

        registerConfig: function(id, name, callback) {
            this.configs.push({ id, name, callback });
        },

        removeModData: function(id) {
            try {
                if (Game.mods[id] && Game.mods[id].save) {
                    Game.mods[id].save = () => "";
                }
                delete Game.mods[id];
            } catch(e) {}

            this.configs = this.configs.filter(c => c.id !== id);

            Game.Notify('データ削除', id + ' のセーブデータを削除しました', [16, 5], 2);

            this.needsReload = true;
            this.openMainMenu();
        },

        handleClose: function() {
            if (this.needsReload) {
                Game.WriteSave();
                setTimeout(() => location.reload(), 300);
            }
        },
        
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;

            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                @keyframes ccacmX_Extreme {
                    from { left: -5px; }
                    to { left: 5px; }
                }

                @keyframes ccacmY_Extreme {
                    from { transform: translateY(0px); }
                    to { transform: translateY(-7px); }
                }

                @keyframes ccacmRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .ccbm-base {
                    position: absolute !important;
                    bottom: 50px !important;
                    right: 5px !important;
                    width: 48px;
                    height: 48px;
                    z-index: 1000000;
                }

                .ccbm-icon-shaker {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    animation:
                        ccacmX_Extreme 0.6s infinite alternate ease-in-out,
                        ccacmY_Extreme 0.3s infinite alternate ease-in-out;
                }

                #ccbm_icon_element {
                    width: 48px !important;
                    height: 48px !important;
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important;
                    cursor: pointer !important;
                    filter: drop-shadow(0px 0px 4px #000) !important;
                    position: relative;
                    z-index: 10;
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
                    animation: ccacmRotate 20s infinite linear;
                    pointer-events: none;
                }

                .ccbm-base:hover #ccbm_shine {
                    opacity: 0.6;
                    transition: opacity 0.3s ease-out;
                }

                .ccbm-row {
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin:4px 0;
                }
            `;
            document.head.appendChild(style);
        },

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
            shaker.className = 'ccbm-icon-shaker';

            const icon = document.createElement('div');
            icon.id = 'ccbm_icon_element';

            icon.onclick = () => {
                this.openMainMenu();
                PlaySound('snd/tick.mp3');
            };

            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
        },

        openMainMenu: function() {
            const closeText = this.needsReload ? '閉じる（再読み込み）' : '閉じる';

            Game.Prompt(`
                <h3>CCBM Settings</h3>
                <div class="block">
                    <div id="ccbm_config_list"></div>
                    <div class="line"></div>
                    <div id="ccbm_config_content"></div>
                </div>
            `, [
                [closeText, 'window.CCBM.handleClose(); Game.ClosePrompt();']
            ]);

            const list = l('ccbm_config_list');
            const content = l('ccbm_config_content');

            this.configs.forEach(cfg => {
                const row = document.createElement('div');
                row.className = 'ccbm-row';

                const name = document.createElement('span');
                name.textContent = cfg.name;

                const del = document.createElement('a');
                del.className = 'smallFancyButton option';
                del.style.color = '#f66';
                del.textContent = 'セーブ削除';

                del.onclick = () => {
                    this.removeModData(cfg.id);
                };

                row.appendChild(name);
                row.appendChild(del);
                list.appendChild(row);

                if (typeof cfg.callback === 'function') {
                    cfg.callback(content);
                }
            });

            const oldClose = Game.ClosePrompt;
            Game.ClosePrompt = function() {
                if (window.CCBM) window.CCBM.handleClose();
                oldClose();
                Game.ClosePrompt = oldClose;
            };
        }
    };

    Game.registerMod("CCBM", {
        init: function() {
            Game.registerHook('draw', () => {
                window.CCBM.drawIcon();
            });
        },

        save: function() {
            return JSON.stringify({ exists: true });
        },

        load: function() {}
    });
})();