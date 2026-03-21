/*
    CCACM (Cookie Clicker Auto Closing MOD)
    v.1.1.0
    
    CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
    (c) 2026 tybob
    https://github.com/tybob8010/CCBM/CCACM/README.md
*/

(function() {
    const MOD = {
        init: function() {
            this.name = 'CCACM';
            // デフォルト設定
            this.config = {
                enabled: 1,
                targetTime: "",
                lastExecutedDay: "",
                lastExecutedTime: ""
            };

            // 1. 共通コア(CCBM)にこのMODの設定画面を登録
            if (window.CCBM && typeof window.CCBM.registerConfig === 'function') {
                window.CCBM.registerConfig(
                    this.name,               // ID
                    '自動終了 (CCACM)',      // メニューに表示される名前
                    () => this.openConfigPrompt() // 呼ばれる関数
                );
                console.log(`[${this.name}] Registered to CCBM.`);
            } else {
                console.error(`[${this.name}] CCBM Core not found. Please check loading order.`);
            }

            // 2. 時刻チェックのメインループ (1秒おき)
            setInterval(() => {
                if (!this.config.enabled || !this.config.targetTime) return;

                const now = new Date();
                const todayStr = now.toLocaleDateString();
                const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                                       now.getMinutes().toString().padStart(2, '0');

                // 本日、すでに実行済みならスキップ
                if (this.config.lastExecutedDay === todayStr && 
                    this.config.lastExecutedTime === this.config.targetTime) return;

                // 指定時刻に到達
                if (currentTimeStr === this.config.targetTime) {
                    this.config.lastExecutedDay = todayStr;
                    this.config.lastExecutedTime = this.config.targetTime;
                    
                    Game.WriteSave();
                    Game.Notify('自動終了', '設定時刻です。終了します。', [23, 11], 3);

                    // セーブ後に終了処理へ
                    setTimeout(() => {
                        Game.WriteSave();
                        
                        // loader.user.js で定義された特権関数を呼ぶ
                        if (typeof window.closeCCACM === 'function') {
                            window.closeCCACM();
                        }

                        // 失敗時の予備動作
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

        // CCBMから呼び出される設定画面
        openConfigPrompt: function() {
            let content = `
                <h3>CCACM 自動終了設定</h3>
                <div class="block" style="text-align:center;">
                    <div class="listing">
                        <a class="smallFancyButton option ${this.config.enabled ? 'on' : 'off'}" id="ccacm_toggle_btn"
                        onclick="Game.mods['CCACM'].toggleEnabled();">
                            自動終了: ${this.config.enabled ? 'ON' : 'OFF'}
                        </a>
                    </div>
                    <div class="listing" style="margin-top:10px;">
                        <label>終了時刻を設定:</label><br>
                        <input type="time" id="CCACM_prompt_input" value="${this.config.targetTime}"
                            style="background: #000; color: #fff; border: 1px solid #444; padding: 4px; font-size: 18px; cursor: pointer; margin-top:5px;">
                    </div>
                </div>
            `;
            // 設定保存時に CCBM のメインメニューに戻るように設定
            Game.Prompt(content, [
                ['保存', 'Game.mods["CCACM"].updateTime(l("CCACM_prompt_input").value); Game.ClosePrompt();'],
                '閉じる'
            ]);
        },

        toggleEnabled: function() {
            this.config.enabled = !this.config.enabled;
            PlaySound('snd/tick.mp3');
            const btn = l('ccacm_toggle_btn');
            if (btn) {
                btn.className = `smallFancyButton option ${this.config.enabled ? 'on' : 'off'}`;
                btn.innerText = `自動終了: ${this.config.enabled ? 'ON' : 'OFF'}`;
            }
            Game.WriteSave();
        },

        updateTime: function(val) {
            if (!val) return;
            this.config.targetTime = val;
            Game.Notify('時刻保存', '終了時刻を ' + val + ' にセットしました。', [8, 35], 2);
            Game.WriteSave();
        },

        // ゲームのセーブ/ロードと連動
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

    // MODを登録
    Game.registerMod("CCACM", MOD);
})();