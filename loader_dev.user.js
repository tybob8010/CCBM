// ==UserScript==
// @name          CCBM_dev
// @namespace    https://github.com/tybob8010/CCBM/
// @version      9.9.12
// @author       tybob8010(ぼぶ)
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// ==/UserScript==

(function() {
    //====================================================================================================
    //初期宣言
    //====================================================================================================

    // devブランチを直接参照
    const BASE_URL = 'https://raw.githubusercontent.com/tybob8010/CCBM/refs/heads/dev/';

    // 特権関数の定義
    window.closeCCACM = function() {
        console.log("[CCBM-Dev] Closing tab via dev loader...");
        window.close();
    };


    //====================================================================================================
    //読み込み
    //====================================================================================================

    const loadModules = async () => {
        try {
            // devブランチの modules.json を取得
            const cacheBust = `?t=${Date.now()}`;
            const res = await fetch(`${BASE_URL}modules.json${cacheBust}`);
            const data = await res.json();

            // 【修正】読み込みの「順番」を保証する
            // ログにある TypeError で処理が止まらないよう、1つずつ確実に読み込む
            for (const path of data.active_modules) {
                const url = `${BASE_URL}${path}${cacheBust}`;

                try {
                    // MIMEタイプ制限を回避するため fetch + eval を使用
                    const scriptRes = await fetch(url);
                    if (!scriptRes.ok) throw new Error(`HTTP ${scriptRes.status}`);
                    const code = await scriptRes.text();

                    // 取得したスクリプトを実行
                    eval(code);
                    console.log(`[CCBM-Dev] Official Load: ${url}`);
                } catch (err) {
                    console.error(`[CCBM-Dev] Load Failed: ${url}`, err);
                    // 失敗しても止まらずに次へ
                }
            }

            // 全てのスクリプト注入後に通知を表示
            if (typeof Game.Notify !== 'undefined') {
                Game.Notify('CCBM Dev起動', '開発用ブランチから読み込みました', [16, 5], 2);
            }
        } catch (e) {
            console.error('[CCBM-Dev] Failed to load modules:', e);
        }
    };


    //====================================================================================================
    //実行
    //====================================================================================================

    const boot = setInterval(() => {
        // Game.readyに加え、UIが構築されているかを確認
        if (typeof Game !== 'undefined' && Game.ready && document.getElementById('topBar')) {
            clearInterval(boot);
            loadModules();
        }
    }, 1000);
})();