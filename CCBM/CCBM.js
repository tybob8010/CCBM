/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.1.0
*/

(function() {

    //=========================
    //CCBM設定
    //=========================

    window.CCBM = window.CCBM || {
        configs: [],
        removedMods: {},
        disabledMods: {},
        registerConfig: function(id, name, callback) {
            if (this.configs.some(c => c.id === id)) return;
            this.configs.push({ id, name, callback });
        },


        //=========================
        //リロード警告
        //=========================

        confirmReload: function(callback) {
            if (localStorage.getItem("ccbm_noReloadWarn") === "1") {
                callback();
                return;
            }
            Game.Prompt(`
                <h3>確認</h3>
                <div class="block">
                    <div class="description">
                        この操作はゲームの再読み込みが必要です。<br><br>
                        よろしいですか？
                    </div>
                    <div style="margin-top:10px;">
                        <label style="cursor:pointer;">
                            <input type="checkbox" id="ccbm_no_warn">
                            次回から表示しない
                        </label>
                    </div>
                </div>
            `, [
                ['実行する', `
                    if (l('ccbm_no_warn') && l('ccbm_no_warn').checked) {
                        localStorage.setItem("ccbm_noReloadWarn","1");
                    }
                    window.CCBM._doReloadAction()
                `],
                'キャンセル'
            ]);
            this._pendingAction = callback;
        },
        _doReloadAction: function() {
            if (this._pendingAction) {
                this._pendingAction();
                this._pendingAction = null;
            }
        },


        //=========================
        //削除・復元・有効化
        //=========================

        removeMod: function(id) {
            Game.Prompt(`
                <h3>MOD削除の確認</h3>
                <div class="block">
                    <div class="description" style="color:#ff5555;font-weight:bold;">
                        「${id}」を削除します。<br><br>
                        ・MOD本体は無効化されます<br>
                        ・セーブデータ内のMOD設定も削除されます<br><br>
                        ※再読み込みで復元可能
                    </div>
                </div>
            `, [
                ['削除する', `window.CCBM.confirmRemove("${id}")`],
                'キャンセル'
            ]);
        },

        confirmRemove: function(id) {
            this.confirmReload(() => {
                this.removedMods[id] = 1;
                if (Game.mods[id] && Game.mods[id].save) {
                    try { Game.mods[id].save = function(){ return ''; }; } catch(e) {}
                }
                if (Game.mods[id]) {
                    try { Game.mods[id].disabled = true; } catch(e) {}
                }
                if (Game.modSaveData && Game.modSaveData[id]) {
                    delete Game.modSaveData[id];
                }
                if (Game.mods[id]) {
                    delete Game.mods[id];
                }
                this.configs = this.configs.filter(c => c.id !== id);
                Game.WriteSave();
                location.reload();
            });
        },

        restoreMod: function(id) {
            if (!this.removedMods[id]) return;
            this.confirmReload(() => {
                delete this.removedMods[id];
                Game.WriteSave();
                location.reload();
            });
        },
        toggleMod: function(id) {
            this.confirmReload(() => {
                if (this.disabledMods[id]) {
                    delete this.disabledMods[id];
                } else {
                    this.disabledMods[id] = 1;
                }
                Game.WriteSave();
                location.reload();
            });
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
        //ウィンドウ
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
            list.innerHTML = '';
            content.innerHTML = '';
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
                } else if (this.disabledMods[cfg.id]) {
                    btn.textContent = '有効化';
                    btn.onclick = () => window.CCBM.toggleMod(cfg.id);
                } else {
                    btn.textContent = '無効化';
                    btn.onclick = () => window.CCBM.toggleMod(cfg.id);
                }
                row.appendChild(name);
                row.appendChild(btn);
                list.appendChild(row);
                if (!this.removedMods[cfg.id] && !this.disabledMods[cfg.id] && typeof cfg.callback === 'function') {
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
            Game.mods["CCBM"].toggleMod = window.CCBM.toggleMod.bind(window.CCBM);
            Game.registerHook('draw', () => {
                window.CCBM.drawIcon();
            });
        },
        save: function() {
            return JSON.stringify({
                removedMods: window.CCBM.removedMods,
                disabledMods: window.CCBM.disabledMods // ★追加
            });
        },
        load: function(str) {
            if (!str) return;
            try {
                const data = JSON.parse(str);
                if (data.removedMods) window.CCBM.removedMods = data.removedMods;
                if (data.disabledMods) window.CCBM.disabledMods = data.disabledMods;
            } catch(e) {}
        }
    });

})();