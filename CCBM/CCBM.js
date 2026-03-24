/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.6.2 - Position Restored to sectionLeft
*/

(function() {
    window.CCBM = {
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                /* 揺れと回転の定義 */
                @keyframes ccacmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccacmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                @keyframes ccacmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* ベースコンテナ：一番左のセクション(sectionLeft)内での絶対配置に変更 */
                .ccbm-base { 
                    position: absolute !important; 
                    bottom: 50px !important; 
                    right: 5px !important; 
                    width: 60px; height: 60px; 
                    z-index: 1000; 
                }
                .ccbm-icon-shaker { 
                    position: absolute; width: 48px; height: 48px; 
                    animation: ccacmX_Extreme 0.6s infinite alternate ease-in-out, ccacmY_Extreme 0.3s infinite alternate ease-in-out; 
                }
                #ccbm_icon_element { 
                    width: 48px !important; height: 48px !important; 
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; 
                    cursor: pointer !important; 
                    filter: drop-shadow(0px 0px 4px #000) !important; 
                    transition: transform 0.05s;
                }
                #ccbm_icon_element:active { transform: scale(0.9); }
                
                #ccbm_shine { 
                    position: absolute; width: 60px; height: 60px; top: -5px; left: -5px; 
                    background: url(img/shine.png) no-repeat center; background-size: contain; 
                    z-index: -1; opacity: 0; animation: ccacmRotate 20s infinite linear; 
                    pointer-events: none; transition: opacity 0.3s;
                }
                .ccbm-base:hover #ccbm_shine { opacity: 0.8; }

                /* Prompt内のボタン配置 */
                .ccbm-prompt-container { text-align: left; padding: 10px; max-height: 400px; overflow-y: auto; }
                .ccbm-button-row { margin: 8px 0; display: block; clear: both; }
                .ccbm-dummy { display: none; }
            `;
            document.head.appendChild(style);
        },

        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;
            
            // ターゲットを一番左のセクション(sectionLeft)に指定
            const target = l('sectionLeft');
            if (!target) return;

            this.injectStyle();
            
            const base = document.createElement('div');
            base.id = 'ccbm_base';
            base.className = 'ccbm-base';
            base.innerHTML = `
                <div id="ccbm_shine"></div>
                <div class="ccbm-icon-shaker">
                    <div id="ccbm_icon_element" title="CCBM Settings"></div>
                </div>
            `;
            
            const icon = base.querySelector('#ccbm_icon_element');
            // クリックイベント
            icon.addEventListener('click', (e) => {
                PlaySound('snd/tick.mp3');
                this.openMainMenu();
                e.stopPropagation();
            }, true);

            // bodyではなく、指定したセクションに追加
            target.appendChild(base);
        },

        callBJWriteButton: function(buttonId, targetProp = null, desc, label = null, callback = null, targetElementName) {
            const bj = window.betterJapanese;
            if (!bj) return;

            let targetElement = l(targetElementName);
            if (!targetElement) return;

            let container = document.createElement('div');
            container.className = 'ccbm-button-row';

            let btn = document.createElement('a');
            btn.id = buttonId;
            btn.className = 'smallFancyButton option';
            if (targetProp) btn.className += ` prefButton ${bj.config[targetProp] ? 'on' : 'off'}`;
            btn.innerText = desc + (targetProp ? (bj.config[targetProp] ? ' ON' : ' OFF') : '');

            btn.onclick = () => {
                if (targetProp) {
                    bj.toggleButton(buttonId, targetProp, desc);
                    btn.innerText = desc + (bj.config[targetProp] ? ' ON' : ' OFF');
                    btn.className = `smallFancyButton option prefButton ${bj.config[targetProp] ? 'on' : 'off'}`;
                }
                if (typeof callback === 'function') callback();
                PlaySound('snd/tick.mp3');
            };

            container.appendChild(btn);
            if (label) {
                let lbl = document.createElement('label');
                lbl.innerHTML = ` <small style="opacity:0.6;">(${label})</small>`;
                container.appendChild(lbl);
            }
            targetElement.parentNode.insertBefore(container, targetElement);
        },

        openMainMenu: function() {
            const bj = window.betterJapanese;
            if (!bj) return;

            Game.Prompt(`
                <h3>非公式日本語訳 詳細設定</h3>
                <div class="ccbm-prompt-container">
                    <div id="target_ignoreList"><div id="dummyIgnore" class="ccbm-dummy"></div></div>
                    <div class="line"></div>
                    <div id="target_settings"><div id="dummySetting" class="ccbm-dummy"></div></div>
                </div>
            `, ['閉じる'], null, 'settingsList');

            const w = this.callBJWriteButton.bind(this);
            w('openIgnoreWordList', null, '置き換え除外リスト', '単語指定', bj.openIgnorePrompt, 'dummyIgnore');
            w('toggleShowSpoilerAlertButton', 'showSpoilerAlert', '除外リスト表示確認', 'ネタバレ防止', null, 'dummyIgnore');
            
            const settings = [
                ['replaceBackgroundName', '背景名'],
                ['replaceMarketQuote', '在庫市場テキスト'],
                ['replaceGardenImage', '菜園画像'],
                ['replaceUpdateLog', '更新履歴'],
                ['replaceSpecialUpgrades', '特殊アップグレード'],
                ['replacePurchasedTag', '特殊タグ'],
                ['replaceBuildings', '施設固有表現'],
                ['beautifyAscendNumber', '昇天数短縮'],
                ['replaceCSS', 'CSS(かぎ括弧)'],
                ['replaceNews', 'ニュース欄'],
                ['replaceOthers', 'その他']
            ];
            settings.forEach(s => w('toggle' + s[0], s[0], s[1], null, null, 'dummySetting'));
        }
    };

    Game.registerMod("CCBM", {
        init: function() {
            // ゲーム画面の構築を待ってから配置
            setTimeout(() => window.CCBM.drawIcon(), 1000);
        }
    });
})();