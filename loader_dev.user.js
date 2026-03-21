// ==UserScript==
// @name         CCBM_dev
// @namespace    https://github.com/tybob8010/CCBM/
// @version      9.9.9
// @author       tybob8010(ぼぶ)
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// ==/UserScript==

(function() {
    //====================================================================================================
    //初期宣言
    //====================================================================================================
    
    // 【重要】GitHub Pagesではなく、GitHubのdevブランチを直接参照するように変更
    const BASE_URL = 'https://raw.githubusercontent.com/tybob8010/CCBM/tree/dev/';
    
    // 特権関数の定義（CCACMが終了するために必要）
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
            const res = await fetch(`${BASE_URL}modules.json?t=${Date.now()}`);
            const data = await res.json();
            
            data.active_modules.forEach(path => {
                const url = `${BASE_URL}${path}`;
                Game.LoadMod(url); 
                console.log(`[CCBM-Dev] Official Load: ${url}`);
            });
            
            // 開発版であることがわかるように通知を少し変更
            Game.Notify('CCBM Dev起動', '開発用ブランチから読み込みました', [16, 5], 2);
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