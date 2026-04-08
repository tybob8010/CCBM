/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.0.2pre
*/

(function() {


    //=========================
    //CCBM設定
    //=========================

    window.CCBM = window.CCBM || {
        configs: [],
        removedMods: {},
        registerConfig: function(id, name, callback) {
            if (this.configs.some(c => c.id === id)) return;
            this.configs.push({ id, name, callback });
        },


        //=========================
        //削除・復元
        //=========================

        removeMod: function(id) {
            Game.Prompt(`
                <h3 style="color:#ff3333;">⚠ MOD削除の確認</h3>
                <div class="block">
                    <div class="description" style="color:#ff4444;font-weight:bold;">
                        「${id}」を削除します。<br><br>
                        ・MOD本体は無効化されます<br>
                        ・セーブデータ内のMOD設定も削除されます<br><br>
                        この操作は再読み込みで戻せます
                    </div>
                </div>
            `, [
                ['削除する', `window.CCBM.confirmRemove("${id}")`],
                'キャンセル'
            ]);
        },

        confirmRemove: function(id) {

                this.removedMods[id] = 1;

                // MOD停止フラグ
                if (Game.mods[id]) {
                    Game.mods[id].disabled = true;
                }

                // セーブデータ削除
                if (Game.modSaveData && Game.modSaveData[id]) {
                    delete Game.modSaveData[id];
                }

                // ★ここが重要：mods自体も削除
                if (Game.mods[id]) {
                    delete Game.mods[id];
                }

                Game.Notify(id + '削除', 'MODとセーブデータを削除しました', [16, 5], 2);

                Game.WriteSave();

                Game.ClosePrompt();
                setTimeout(() => this.openMainMenu(), 50);
            },

        restoreMod: function(id) {
            if (!this.removedMods[id]) return;

            delete this.removedMods[id];
            this.configs = this.configs.filter(c => c.id !== id);

            Game.Notify(id + '復元', 'MODを再読み込みします', [16, 5], 2);

            const BASE_URL = 'https://tybob8010.github.io/CCBM/';
            Game.LoadMod(`${BASE_URL}${id}/${id}.js?t=${Date.now()}`);

            Game.WriteSave();

            Game.ClosePrompt();
            setTimeout(() => window.CCBM.openMainMenu(), 100);
        },


        //=========================
        //スタイル
        //=========================
        
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
                    margin-left:10px;
                }
            `;
            document.head.appendChild(style);
        },


        //=========================
        //アイコン
        //=========================
        
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
                window.CCBM.openMainMenu();
                PlaySound('snd/tick.mp3');
            };

            shaker.appendChild(icon);
            base.appendChild(shine);
            base.appendChild(shaker);
            target.appendChild(base);
        },


        //=========================
        //window
        //=========================
        
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

                const btn = document.createElement('span');
                btn.className = 'ccbm-delete';

                if (this.removedMods[cfg.id]) {
                    btn.textContent = '再読み込み';
                    btn.onclick = () => window.CCBM.restoreMod(cfg.id);
                } else {
                    btn.textContent = '削除';
                    btn.onclick = () => window.CCBM.removeMod(cfg.id);
                }

                row.appendChild(name);
                row.appendChild(btn);
                list.appendChild(row);

                if (!this.removedMods[cfg.id] && typeof cfg.callback === 'function') {
                    cfg.callback(content);
                }

            });
        }
    };


    //=========================
    //MOD登録
    //=========================
    Game.registerMod("CCBM", {
        init: function() {
            Game.mods["CCBM"].confirmRemove = window.CCBM.confirmRemove.bind(window.CCBM);
            Game.mods["CCBM"].removeMod = window.CCBM.removeMod.bind(window.CCBM);
            Game.mods["CCBM"].restoreMod = window.CCBM.restoreMod.bind(window.CCBM);
            
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