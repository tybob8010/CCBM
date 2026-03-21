// ==UserScript==
// @name         Cookie Clicker Basic Mod (CCBM)
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// ==/UserScript==

(function() {
    const BASE_URL = 'https://<あなたのユーザー名>.github.io/CookieClickerBasicMod/';
    
    const loadModules = async () => {
        try {
            // 1. 配信中のモジュールリストを取得
            const res = await fetch(`${BASE_URL}modules.json?t=${Date.now()}`);
            const data = await res.json();
            
            // 2. Game.LoadMod を使って各JSを読み込む
            data.active_modules.forEach(path => {
                const url = `${BASE_URL}${path}`;
                Game.LoadMod(url); 
                console.log(`[CCBM] Official Load: ${url}`);
            });
            
            Game.Notify('CCBM Online', 'GitHubから最新のモジュールを読み込みました');
        } catch (e) {
            console.error('[CCBM] Failed to load modules:', e);
        }
    };

    // ゲームの起動を確認してから実行
    const boot = setInterval(() => {
        if (typeof Game !== 'undefined' && Game.ready) {
            clearInterval(boot);
            loadModules();
        }
    }, 1000);
})();