// ==UserScript==
// @name          CCBM_dev
// @namespace     https://github.com/tybob8010/CCBM/
// @version       9.9.13
// @author        tybob8010(ぼぶ)
// @match         https://orteil.dashnet.org/cookieclicker/
// @grant         window.close
// @run-at        document-start
// ==/UserScript==

(function() {
    //====================================================================================================
    //初期宣言
    //====================================================================================================

    const BASE_URL = 'https://raw.githubusercontent.com/tybob8010/CCBM/dev/';

    window.closeCCACM = function() {
        console.log("[CCBM-Dev] Closing tab via dev loader...");
        window.close();
    };

    //====================================================================================================
    //読み込み
    //====================================================================================================

    const loadModules = async () => {
        try {
            const res = await fetch(`${BASE_URL}modules.json?t=${Date.now()}`);
            const data = await res.json();

            let removed = {};
            try {
                const save = JSON.parse(localStorage.getItem('CookieClickerGame'));
                if (save && save.mods && save.mods.CCBM) {
                    const parsed = JSON.parse(save.mods.CCBM);
                    if (parsed.removedMods) removed = parsed.removedMods;
                }
            } catch(e) {}

            // 順番保証しつつ Game.LoadMod 使用
            for (const path of data.active_modules) {
                const parts = path.split('/');
                const file = parts[parts.length - 1];
                const id = file.replace('.js', '');

                if (removed[id]) {
                    console.log(`[CCBM-Dev] Skip removed mod: ${id}`);
                    continue;
                }

                const url = `${BASE_URL}${path}?t=${Date.now()}`;

                Game.LoadMod(url);
                console.log(`[CCBM-Dev] Official Load: ${url}`);
            }

            Game.Notify('CCBM Dev起動', '開発ブランチから読み込みました', [16, 5], 2);

        } catch (e) {
            console.error('[CCBM-Dev] Failed to load modules:', e);
        }
    };

    //====================================================================================================
    //実行
    //====================================================================================================

    const boot = setInterval(() => {
        if (typeof Game !== 'undefined' && Game.ready) {
            clearInterval(boot);
            loadModules();
        }
    }, 1000);

})();