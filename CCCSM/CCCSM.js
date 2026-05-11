/*
    CCCSM (Cookie Clicker Cloud Save MOD)
    v.1.0.1
*/

(function() {

    Game.registerMod("CCCSM", {

        enabled: true,
        webhook: '',
        interval: 10,
        lastBackup: '未実行',
        timer: null,
        isSending: false,

        init: function() {

            const MOD = this;

            //=========================
            //CCBM設定画面登録
            //=========================

            if (window.CCBM) {

                window.CCBM.registerConfig(
                    "CCCSM",
                    "CCCSM Cloud Save",
                    function(content) {

                        const box = document.createElement('div');
                        box.className = 'block';

                        box.innerHTML = `
                            <div class="listing">
                                <b>Discord Webhook URL</b>
                            </div>

                            <div class="listing">
                                <input
                                    id="cccsm_webhook"
                                    type="text"
                                    value="${MOD.webhook}"
                                    placeholder="https://discord.com/api/webhooks/..."
                                    style="width:100%;">
                            </div>

                            <div class="listing" style="margin-top:10px;">
                                <b>Backup Interval (minutes)</b>
                            </div>

                            <div class="listing">
                                <input
                                    id="cccsm_interval"
                                    type="number"
                                    min="1"
                                    value="${MOD.interval}"
                                    style="width:80px;">
                            </div>

                            <div class="listing" style="margin-top:10px;">

                                <a class="smallFancyButton" id="cccsm_toggle">
                                    ${MOD.enabled ?
                                        '自動バックアップ OFF' :
                                        '自動バックアップ ON'}
                                </a>

                                <a class="smallFancyButton" id="cccsm_backup_now">
                                    今すぐバックアップ
                                </a>

                                <a class="smallFancyButton" id="cccsm_save_settings">
                                    設定保存
                                </a>

                            </div>

                            <div class="listing" style="margin-top:10px;">
                                <b>Last Backup :</b>
                                <span id="cccsm_last_backup">
                                    ${MOD.lastBackup}
                                </span>
                            </div>
                        `;

                        content.appendChild(box);

                        //=========================
                        //自動バックアップON/OFF
                        //=========================

                        l('cccsm_toggle').onclick = function() {

                            MOD.enabled = !MOD.enabled;

                            this.textContent =
                                MOD.enabled ?
                                '自動バックアップ ON' :
                                '自動バックアップ OFF';

                            MOD.restartTimer(true);

                            Game.WriteSave();

                            Game.Notify(
                                'CCCSM',
                                MOD.enabled ?
                                '自動バックアップON' :
                                '自動バックアップOFF',
                                [16, 5],
                                2
                            );
                        };

                        //=========================
                        //手動バックアップ
                        //=========================

                        l('cccsm_backup_now').onclick =
                            async function() {

                            if (MOD.isSending) return;

                            this.classList.add('off');
                            this.style.pointerEvents = 'none';

                            await MOD.sendSaveAsFile();

                            this.classList.remove('off');
                            this.style.pointerEvents = '';
                        };

                        //=========================
                        //設定保存
                        //=========================

                        l('cccsm_save_settings').onclick =
                            function() {

                            MOD.webhook =
                                l('cccsm_webhook')
                                .value
                                .trim();

                            MOD.interval =
                                Math.max(
                                    1,
                                    parseInt(
                                        l('cccsm_interval').value
                                    ) || 10
                                );

                            l('cccsm_interval').value =
                                MOD.interval;

                            MOD.restartTimer(true);

                            Game.WriteSave();

                            Game.Notify(
                                'CCCSM',
                                '設定を保存しました',
                                [16, 5],
                                2
                            );
                        };
                    }
                );
            }

            //=========================
            //起動
            //=========================

            this.restartTimer();

            console.log(
                `[CCCSM] Loaded Interval:${this.interval}min`
            );
        },

        //=========================
        //タイマー再構築
        //=========================

        restartTimer: function(skipImmediate=false) {

            if (this.timer) {

                clearInterval(this.timer);

                this.timer = null;
            }

            if (!this.enabled) return;

            // 初回即時バックアップ
            if (!skipImmediate) {

                this.sendSaveAsFile();
            }

            // 定期バックアップ
            this.timer = setInterval(() => {

                this.sendSaveAsFile();

            }, this.interval * 60 * 1000);
        },

        //=========================
        //バックアップ送信
        //=========================

        sendSaveAsFile: async function() {

            if (this.isSending) {

                console.warn(
                    '[CCCSM] Already Sending'
                );

                return;
            }

            this.isSending = true;

            try {

                if (!Game || !Game.ready) return;

                if (!this.enabled) return;

                if (!this.webhook) {

                    console.warn(
                        '[CCCSM] Webhook URL Empty'
                    );

                    return;
                }

                const saveData =
                    Game.WriteSave(1);

                const timestamp =
                    new Date()
                    .toISOString()
                    .replace(/[:.]/g, '-');

                const fileName =
                    `cookie_save_${timestamp}.txt`;

                const blob =
                    new Blob(
                        [saveData],
                        {
                            type: 'text/plain'
                        }
                    );

                const formData =
                    new FormData();

                formData.append(
                    'file',
                    blob,
                    fileName
                );

                formData.append(
                    'payload_json',
                    JSON.stringify({
                        content:
                            `🍪 Cookie Clicker Backup\n` +
                            `Time : ${new Date().toLocaleString()}`
                    })
                );

                const response =
                    await fetch(
                        this.webhook,
                        {
                            method: 'POST',
                            body: formData
                        }
                    );

                if (response.ok) {

                    this.lastBackup =
                        new Date().toLocaleString();

                    if (l('cccsm_last_backup')) {

                        l('cccsm_last_backup').textContent =
                            this.lastBackup;
                    }

                    console.log(
                        `[CCCSM] Backup Success : ${fileName}`
                    );

                    Game.Notify(
                        'CCCSM',
                        'バックアップ完了',
                        [16, 5],
                        1
                    );

                } else {

                    console.error(
                        '[CCCSM] Upload Failed :',
                        response.status
                    );

                    Game.Notify(
                        'CCCSM',
                        `送信失敗 : ${response.status}`,
                        [16, 5],
                        2
                    );
                }

            } catch(err) {

                console.error(
                    '[CCCSM] Error :',
                    err
                );

                Game.Notify(
                    'CCCSM',
                    'バックアップエラー',
                    [16, 5],
                    2
                );

            } finally {

                this.isSending = false;
            }
        },

        //=========================
        //保存
        //=========================

        save: function() {

            return JSON.stringify({

                enabled: this.enabled,

                webhook: this.webhook,

                interval: this.interval,

                lastBackup: this.lastBackup
            });
        },

        //=========================
        //読み込み
        //=========================

        load: function(str) {

            if (!str) return;

            try {

                const data =
                    JSON.parse(str);

                if (
                    typeof data.enabled !==
                    'undefined'
                ) {

                    this.enabled =
                        data.enabled;
                }

                if (
                    typeof data.webhook ===
                    'string'
                ) {

                    this.webhook =
                        data.webhook;
                }

                if (
                    typeof data.interval ===
                    'number'
                ) {

                    this.interval =
                        Math.max(
                            1,
                            data.interval
                        );
                }

                if (
                    typeof data.lastBackup ===
                    'string'
                ) {

                    this.lastBackup =
                        data.lastBackup;
                }

            } catch(e) {

                console.error(
                    '[CCCSM] Load Failed',
                    e
                );
            }
        }
    });

})();