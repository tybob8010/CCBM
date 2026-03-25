/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.8.0
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
                setTimeout(() => {
                    location.reload();
                }, 300);
            }
        },
        
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                .ccbm-base { 
                    position: absolute !important; 
                    bottom: 50px !important; 
                    right: 5px !important; 
                    width: 60px; height: 60px; 
                    z-index: 1000000; 
                }

                .ccbm-icon-shaker { 
                    position: absolute; width: 48px; height: 48px; 
                }

                #ccbm_icon_element { 
                    width: 48px !important; height: 48px !important; 
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; 
                    cursor: pointer !important; 
                    filter: drop-shadow(0px 0px 4px #000) !important; 
                }

                .ccbm-prompt-container { padding: 10px; text-align:left; }

                .ccbm-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 4px 0;
                }

                .ccbm-delete-btn {
                    background: #400;
                    color: #f66;
                    padding: 2px 6px;
                    border: 1px solid #a33;
                    cursor: pointer;
                }

                .ccbm-delete-btn:hover {
                    background: #800;
                    color: #fff;
                }
            `;
            document.head.appendChild(style);
        },

        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;
            const target = l('sectionLeft');
            if (!target) return;

            this.injectStyle();
            
            const html = `
                <div id="ccbm_base" class="ccbm-base">
                    <div class="ccbm-icon-shaker">
                        <div id="ccbm_icon_element" title="CCBM Settings"></div>
                    </div>
                </div>
            `;
            target.insertAdjacentHTML('beforeend', html);

            const icon = document.getElementById('ccbm_icon_element');
            if (icon) {
                icon.onclick = () => {
                    this.openMainMenu();
                    PlaySound('snd/tick.mp3');
                };
            }
        },

        openMainMenu: function() {
            const closeText = this.needsReload ? '閉じる（再読み込み）' : '閉じる';

            Game.Prompt(`
                <h3>CCBM Settings</h3>
                <div class="ccbm-prompt-container">
                    <div id="ccbm_config_list"></div>
                    <div id="ccbm_config_content" style="margin-top:10px;"></div>
                </div>
            `, [
                [closeText, 'window.CCBM.handleClose(); Game.ClosePrompt();']
            ]);

            const list = document.getElementById('ccbm_config_list');
            const content = document.getElementById('ccbm_config_content');
            if (!list || !content) return;

            this.configs.forEach(cfg => {
                const row = document.createElement('div');
                row.className = 'ccbm-row';

                const name = document.createElement('span');
                name.textContent = cfg.name;

                const del = document.createElement('span');
                del.className = 'ccbm-delete-btn';
                del.textContent = 'セーブデータを削除';

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

            // 外クリック検知（CookieClicker再現）
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