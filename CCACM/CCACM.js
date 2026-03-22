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
            // 【統合対応】CCBM側のメインメニューを再描画して表示を更新する
            if (window.CCBM && typeof window.CCBM.openMainMenu === 'function') {
                window.CCBM.openMainMenu();
            }
        },

        toggleEnabled: function() {
            this.config.enabled = !this.config.enabled;
            PlaySound('snd/tick.mp3');
            
            // 通知
            Game.Notify(`自動終了 ${this.config.enabled ? '有効' : '無効'}化`, 
                        `自動終了が${this.config.enabled ? '有効' : '無効'}になりました。`, [1, 7], 0.75);
            
            Game.WriteSave();
            
            // 【統合対応】ボタンを押した瞬間にCCBM側のメニュー（ロック状態）を更新
            if (window.CCBM && typeof window.CCBM.openMainMenu === 'function') {
                window.CCBM.openMainMenu();
            }
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