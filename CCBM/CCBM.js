/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.0.1pre3
*/

(function() {

    //====================================================================================================
    //初期化
    //====================================================================================================

    window.CCBM = window.CCBM || {};

    window.CCBM.isReady = true;
    window.CCBM.configs = window.CCBM.configs || [];
    window.CCBM.removedMods = window.CCBM.removedMods || {};
    window.CCBM.modulePaths = window.CCBM.modulePaths || {};

    Object.assign(window.CCBM, {

        registerConfig: function(id, name, callback) {
            this.configs.push({ id, name, callback });
        },

        removeMod: function(id) {
            Game.Notify(id + '削除', id + 'を削除しました', [16, 5], 1.5);
            this.removedMods[id] = 1;

            if (Game.modSaveData && Game.modSaveData[id]) {
                delete Game.modSaveData[id];
            }

            if (Game.mods[id]) {
                delete Game.mods[id];
            }

            Game.WriteSave();
            this.openMainMenu();
        },

        restoreMod: function(id) {
            if (!this.removedMods[id]) return;

            delete this.removedMods[id];

            Game.Notify(id + '読み込み', id + ' を再読み込みします', [16, 5], 1.5);
            Game.WriteSave();

            if (this.modulePaths && this.modulePaths[id]) {
                Game.LoadMod(this.modulePaths[id]);
            }

            this.openMainMenu();
        },

    //====================================================================================================
    //歯車
    //====================================================================================================

        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;

            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                @keyframes ccacmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccacmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                @keyframes ccacmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .ccbm-base { 
                    position: absolute !important; 
                    bottom: 50px !important; 
                    right: 5px !important; 
                    width: 60px; height: 60px; 
                    z-index: 1000000; 
                }

                .ccbm-icon-shaker { 
                    position: absolute; width: 48px; height: 48px; 
                    animation: ccacmX_Extreme 0.6s infinite alternate ease-in-out,
                               ccacmY_Extreme 0.3s infinite alternate ease-in-out; 
                }

                #ccbm_icon_element { 
                    width: 48px !important; height: 48px !important; 
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; 
                    cursor: pointer !important; 
                    filter: drop-shadow(0px 0px 4px #000) !important; 
                }

                #ccbm_shine { 
                    position: absolute; width: 60px; height: 60px;
                    top: -5px; left: -5px; 
                    background: url(img/shine.png) no-repeat center;
                    background-size: contain; 
                    z-index: -1;
                    opacity: 0;
                    animation: ccacmRotate 20s infinite linear; 
                    pointer-events: none;
                    transition: opacity 0.3s;
                }

                .ccbm-base:hover #ccbm_shine { opacity: 0.8; }

                .ccbm-prompt-container { padding: 10px; text-align:left; }

                .ccbm-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 4px 0;
                }

                .ccbm-mod-name {
                    font-weight: bold;
                }

                .ccbm-delete {
                    color: #f66;
                    cursor: pointer;
                    font-size: 12px;
                }

                .ccbm-delete:hover {
                    color: #f00;
                    text-decoration: underline;
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
                    <div id="ccbm_shine"></div>
                    <div class="ccbm-icon-shaker">
                        <div id="ccbm_icon_element"></div>
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

//====================================================================================================
//ウィンドウ表示
//====================================================================================================

        openMainMenu: function() {
            Game.Prompt(`
                <h3>CCBM Settings</h3>
                <div class="ccbm-prompt-container">
                    <div id="ccbm_config_list"></div>
                    <div id="ccbm_config_content" style="margin-top:10px;"></div>
                </div>
            `, ['閉じる']);

            const list = document.getElementById('ccbm_config_list');
            const content = document.getElementById('ccbm_config_content');
            if (!list || !content) return;

            this.configs.forEach(cfg => {
                const row = document.createElement('div');
                row.className = 'ccbm-row';

                const name = document.createElement('span');
                name.className = 'ccbm-mod-name';
                name.textContent = cfg.name;

                const btn = document.createElement('span');
                btn.className = 'ccbm-delete';

                if (this.removedMods[cfg.id]) {
                    btn.textContent = '再読み込み';
                    btn.onclick = () => this.restoreMod(cfg.id);
                } else {
                    btn.textContent = 'このmodを削除';
                    btn.onclick = () => this.removeMod(cfg.id);
                }

                row.appendChild(name);
                row.appendChild(btn);
                list.appendChild(row);

                if (!this.removedMods[cfg.id] && typeof cfg.callback === 'function') {
                    cfg.callback(content);
                }
            });
        }

    });

    //====================================================================================================
    //読み込み
    //====================================================================================================

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