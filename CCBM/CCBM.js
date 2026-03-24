/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.5.5 - Absolute Integration with BetterJapanese Logic
*/

(function() {
    window.CCBM = {
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                /* CCACM Extreme Motion */
                @keyframes ccacmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccacmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                @keyframes ccacmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .ccbm-base { position: absolute !important; bottom: 50px !important; right: 5px !important; width: 48px; height: 48px; z-index: 1000000; pointer-events: none; }
                .ccbm-icon-shaker { 
                    position: absolute; width: 48px; height: 48px; z-index: 10; 
                    animation: ccacmX_Extreme 0.6s infinite alternate ease-in-out, ccacmY_Extreme 0.3s infinite alternate ease-in-out; 
                    pointer-events: none; 
                }
                #ccbm_icon_element { 
                    width: 48px !important; height: 48px !important; 
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; 
                    cursor: pointer !important; filter: drop-shadow(0px 0px 4px #000) !important; 
                    position: relative; z-index: 20; pointer-events: auto; transition: filter 0.1s;
                }
                #ccbm_icon_element:hover { filter: drop-shadow(0px 0px 6px rgba(255,255,255,0.7)) !important; }
                #ccbm_shine { 
                    position: absolute; width: 60px; height: 60px; top: -10px; left: -5px; 
                    background: url(img/shine.png) no-repeat center; background-size: contain; 
                    z-index: 1; opacity: 0; animation: ccacmRotate 20s infinite linear; 
                    pointer-events: none; transition: opacity 0.3s ease-out;
                }
                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine { opacity: 0.6; }

                /* Prompt Adjustments */
                .ccbm-prompt-container { text-align: left; padding: 10px; }
                .ccbm-dummy { display: inline-block; width: 0; height: 0; }
            `;
            document.head.appendChild(style);
        },

        drawIcon: function() {
            if (document.getElementById('ccbm_base')) return;
            const target = l('sectionLeft') || l('wrapper');
            if (!target) return;
            this.injectStyle();
            const base = document.createElement('div');
            base.id = 'ccbm_base';
            base.className = 'ccbm-base';
            base.innerHTML = `<div id="ccbm_shine"></div><div class="ccbm-icon-shaker"><div id="ccbm_icon_element"></div></div>`;
            const icon = base.querySelector('#ccbm_icon_element');
            icon.onclick = (e) => { PlaySound('snd/tick.mp3'); this.openMainMenu(); e.preventDefault(); e.stopPropagation(); };
            target.appendChild(base);
        },

        // 提示された BetterJapanese の writeButton を CCBM 内で再現 (thisをbjに固定して実行)
        callBJWriteButton: function(buttonId, targetProp = null, desc, label = null, callback = null, targetElementName) {
            const bj = window.betterJapanese;
            if (!bj) return;

            let targetElement = l(targetElementName);
            if (!targetElement) return;

            targetElement.parentNode.insertBefore(document.createElement('br'), targetElement);

            let elementButton = document.createElement('a');
            elementButton.className = 'smallFancyButton option';
            // bj.config を参照するように修正
            if (targetProp) elementButton.className += ` prefButton ${bj.config[targetProp] ? 'on' : 'off'}`;
            elementButton.id = buttonId;

            let onclickStr = targetProp ? `betterJapanese.toggleButton('${buttonId}', '${targetProp}', '${desc}');` : '';
            if (callback && typeof callback === 'function') onclickStr += `(${callback.toString()})()`;

            elementButton.setAttribute(Game.clickStr, onclickStr);
            elementButton.innerText = desc;
            if (targetProp) elementButton.innerText += ` ${bj.config[targetProp] ? loc('ON') : loc('OFF')}`;

            targetElement.parentNode.insertBefore(elementButton, targetElement);

            if (label) {
                let elementLabel = document.createElement('label');
                elementLabel.innerText = ` (${label})`;
                targetElement.parentNode.insertBefore(elementLabel, targetElement);
            }
        },

        openMainMenu: function() {
            const bj = window.betterJapanese;
            if (!bj) return;

            Game.Prompt(`
                <h3>非公式日本語訳 詳細設定</h3>
                <div class="ccbm-prompt-container">
                    <div>ゲームの処理を変更している翻訳処理について利用するか設定できます。</div>
                    ${!bj.config.replaceJP ? '<p style="color: red; font-weight: bold;">「日本語訳の改善」がオフのため、下記の設定は無効です。</p>' : ''}
                    <div class="line"></div>
                    <div id="target_ignoreList"><div id="dummyIgnore" class="ccbm-dummy"></div></div>
                    <div class="line"></div>
                    <div id="target_settings"><div id="dummySetting" class="ccbm-dummy"></div></div>
                </div>
            `, ['閉じる'], null, 'settingsList');

            // 提示されたロジックに基づき、ダミー要素の手前にボタンを挿入していく
            const w = this.callBJWriteButton;
            
            w('openIgnoreWordList', null, '置き換え除外リスト', '非公式翻訳に置き換えたくない単語を指定することができます。', bj.openIgnorePrompt, 'dummyIgnore');
            w('toggleShowSpoilerAlertButton', 'showSpoilerAlert', '除外リスト表示確認', '除外リストを表示する際にネタバレに対する確認を表示します。', null, 'dummyIgnore');
            
            w('toggleReplaceBackgroundNameButton', 'replaceBackgroundName', '背景名', '背景の名前を翻訳します。', null, 'dummySetting');
            w('toggleReplaceMarketQuoteButton', 'replaceMarketQuote', '在庫市場のフレーバーテキスト', '在庫市場のフレーバーテキストを翻訳します。', null, 'dummySetting');
            w('toggleReplaceGardenImageButton', 'replaceGardenImage', '菜園情報の画像', '菜園情報内で表示される画像を置き換えます。', null, 'dummySetting');
            w('toggleReplaceUpdateLogButton', 'replaceUpdateLog', '情報欄及び更新履歴', '情報欄を詳しい内容に置き換えます。', null, 'dummySetting');
            w('toggleReplaceSpecialUpgradesButton', 'replaceSpecialUpgrades', '特殊なアップグレード', '特殊なフレーバーテキストを追加します。', null, 'dummySetting');
            w('toggleReplacePurchasedTagButton', 'replacePurchasedTag', '特殊なタグ', '英語以外では変化しない特殊なタグを追加します。', null, 'dummySetting');
            w('toggleReplaceBuildingsButton', 'replaceBuildings', '施設固有の表現', '施設によって異なる表現を追加します。', null, 'dummySetting');
            w('toggleBeautifyAscendNumber', 'beautifyAscendNumber', 'ヘブンリーチップスの短縮表記', '入手数を短縮表記にします。', null, 'dummySetting');
            w('toggleReplaceCSSButton', 'replaceCSS', 'CSSの変更', 'かぎ括弧に変更します。', null, 'dummySetting');
            w('toggleReplaceNewsButton', 'replaceNews', 'ニュース欄の改善', 'ニュース欄の挙動を置き換えます。', null, 'dummySetting');
            w('toggleReplaceOthersButton', 'replaceOthers', 'そのほか微小な改善', 'ツールチップなどの翻訳を置き換えます。', null, 'dummySetting');
        }
    };

    Game.registerMod("CCBM", {
        init: function() { Game.registerHook('draw', () => { window.CCBM.drawIcon(); }); }
    });
})();