// ==UserScript==
// @name         CCBM_Loader
// @version      v1.0.3
// @namespace    https://github.com/tybob8010/CCBM/
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    const BASE_URL = 'https://tybob8010.github.io/CCBM/';

    // ★重要：userscript権限で関数を作る
    function closeByTM() {
        console.log("[CCACM] Closing via TM privilege");
        window.close();
    }

    // ★それをページに渡す
    unsafeWindow.closeCCACM = closeByTM;

    const loadModules = async () => {
        try {
            const res = await fetch(`${BASE_URL}modules.json?t=${Date.now()}`);
            const data = await res.json();

            for (const path of data.active_modules) {
                const url = `${BASE_URL}${path}`;
                Game.LoadMod(url);
                console.log("[CCBM] Load:", url);
            }

            Game.Notify('CCBM起動', 'CCBMが起動しました。', [16, 5], 2);

        } catch (e) {
            console.error('[CCBM] Failed to load :', e);
        }
    };

    const boot = setInterval(() => {
        if (typeof Game !== 'undefined' && Game.ready) {
            clearInterval(boot);
            loadModules();
        }
    }, 1000);

})();