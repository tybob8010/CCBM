// ==UserScript==
// @name         CCBM_Loader
// @namespace    https://github.com/tybob8010/CCBM/
// @author       tybob8010(ぼぶ)
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant window.close
// @run-at document-start
// ==/UserScript==

(function() {

    //====================================================================================================
    //初期宣言
    //====================================================================================================
    
    const BASE_URL = 'https://tybob8010.github.io/CCBM/';

    //CCACM
    window.closeCCACM = function() {
        console.log("[CCACM] This tab will close shortly...");
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
            data.active_modules.forEach(path => {
                const parts = path.split('/');
                const file = parts[parts.length - 1];
                const id = file.replace('.js', '');
                if (removed[id]) {
                    console.log(`[CCBM] Skip removed mod: ${id}`);
                    return;
                }
                const url = `${BASE_URL}${path}`;
                Game.LoadMod(url);
                console.log(`[CCBM] Official Load: ${url}`);
            });
            Game.Notify('CCBM起動', 'CCBMが起動しました。', [16, 5], 2);
        } catch (e) {
            console.error('[CCBM] Failed to load :', e);
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