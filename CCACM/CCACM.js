/*
    CCACM (Cookie Clicker Auto Closing MOD)
    v.1.1.1
*/

(function() {
    const MOD = {
        init: function() {
            this.name = 'CCACM';

            this.config = {
                enabled: 1,
                targetTime: "",
                lastExecutedDay: "",
                lastExecutedTime: ""
            };

            if (window.CCBM && typeof window.CCBM.registerConfig === 'function') {
                window.CCBM.registerConfig(
                    this.name,
                    '自動終了 (CCACM)',
                    (container) => this.renderConfig(container)
                );
                console.log(`[${this.name}] Registered to CCBM.`);
            } else {
                console.error(`[${this.name}] CCBM Core not found.`);
            }

            setInterval(() => {
                if (!this.config.enabled || !this.config.targetTime) return;

                const now = new Date();
                const todayStr = now.toLocaleDateString();
                const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                                       now.getMinutes().toString().padStart(2, '0');

                if (this.config.lastExecutedDay === todayStr && 
                    this.config.lastExecutedTime === this.config.targetTime) return;

                if (currentTimeStr === this.config.targetTime) {
                    this.config.lastExecutedDay = todayStr;
                    this.config.lastExecutedTime = this.config.targetTime;
                    
                    Game.WriteSave();
                    Game.Notify('自動終了', '設定時刻です。終了します。', [23, 11], 3);

                    setTimeout(() => {
                        Game.WriteSave();
                        
                        if (typeof window.closeCCACM === 'function') {
                            window.closeCCACM();
                            return;
                        }

                        setTimeout(() => {
                            window.open('javascript:window.close()', '_self');
                            window.close();
                        }, 500);

                        setTimeout(() => {
                            if (!window.closed) window.location.replace("about:blank");
                        }, 1500);
                    }, 2000);
                }
            }, 1000);

            console.log(`[${this.name}] Logic Initialized.`);
        },

        renderConfig: function(container) {
            const wrap = document.createElement('div');
            wrap.style.textAlign = 'center';

            const toggle = document.createElement('a');
            toggle.className = `smallFancyButton option ${this.config.enabled ? 'on' : 'off'}`;
            toggle.textContent = `自動終了: ${this.config.enabled ? 'ON' : 'OFF'}`;

            toggle.onclick = () => {
                this.toggleEnabled();
                toggle.className = `smallFancyButton option ${this.config.enabled ? 'on' : 'off'}`;
                toggle.textContent = `自動終了: ${this.config.enabled ? 'ON' : 'OFF'}`;
            };

            const input = document.createElement('input');
            input.type = 'time';
            input.value = this.config.targetTime;
            input.style = "background:#000;color:#fff;border:1px solid #444;padding:4px;font-size:18px;margin-top:5px;";

            const save = document.createElement('a');
            save.className = 'smallFancyButton option';
            save.textContent = '保存';

            save.onclick = () => {
                this.updateTime(input.value);
            };

            wrap.appendChild(toggle);
            wrap.appendChild(document.createElement('br'));
            wrap.appendChild(input);
            wrap.appendChild(document.createElement('br'));
            wrap.appendChild(save);

            container.appendChild(wrap);
        },

        toggleEnabled: function() {
            this.config.enabled = !this.config.enabled;
            PlaySound('snd/tick.mp3');

            Game.Notify(`自動終了 ${this.config.enabled ? '有効' : '無効'}化`, 
                        `自動終了が${this.config.enabled ? '有効' : '無効'}になりました。`, [1, 7], 0.75);
            
            Game.WriteSave();
        },

        updateTime: function(val) {
            if (!val) return;
            this.config.targetTime = val;
            Game.Notify('時刻保存', '終了時刻を ' + val + ' にセットしました。', [8, 35], 2);
            Game.WriteSave();
        },

        save: function() { return JSON.stringify(this.config); },
        load: function(str) {
            if (str) {
                try {
                    const loaded = JSON.parse(str);
                    this.config = Object.assign(this.config, loaded);
                } catch(e) {
                    console.error("[CCACM] Load error:", e);
                }
            }
        }
    };

    Game.registerMod("CCACM", MOD);
})();