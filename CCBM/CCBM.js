/*
    CCBM (Cookie Clicker Basic MOD)
    v.1.5.0 - Integrated with BetterJapanese UI
*/

(function() {
    window.CCBM = {
        injectStyle: function() {
            if (document.getElementById('ccbm_styles')) return;
            const style = document.createElement('style');
            style.id = 'ccbm_styles';
            style.innerHTML = `
                /* --- CCACM から完全移植したアニメーション --- */
                @keyframes ccacmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccacmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                @keyframes ccacmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .ccbm-base { 
                    position: absolute !important; 
                    bottom: 50px !important; 
                    right: 5px !important; 
                    width: 48px; height: 48px; z-index: 1000000; pointer-events: none; 
                }

                .ccbm-icon-shaker { 
                    position: absolute; width: 48px; height: 48px; z-index: 10; 
                    animation: 
                        ccacmX_Extreme 0.6s infinite alternate ease-in-out, 
                        ccacmY_Extreme 0.3s infinite alternate ease-in-out; 
                    pointer-events: none; 
                }

                #ccbm_icon_element { 
                    width: 48px !important; height: 48px !important; 
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; 
                    cursor: pointer !important; filter: drop-shadow(0px 0px 4px #000) !important; 
                    position: relative; z-index: 20; pointer-events: auto; 
                    transition: filter 0.1s ease-out;
                }
                #ccbm_icon_element:hover {
                    filter: drop-shadow(0px 0px 6px rgba(255,255,255,0.7)) brightness(1.0) !important;
                }

                #ccbm_shine { 
                    position: absolute; width: 60px; height: 60px; top: -10px; left: -5px; 
                    background: url(img/shine.png) no-repeat center; background-size: contain; 
                    z-index: 1; opacity: 0; animation: ccacmRotate 20s infinite linear; 
                    pointer-events: none; transition: opacity 0.3s ease-out;
                }
                .ccbm-base:has(#ccbm_icon_element:hover) #ccbm_shine { opacity: 0.6; }

                /* BetterJapanese風のリストアイテム調整 */
                .ccbm-list-item { display: flex; align-items: center; margin: 4px 0; padding: 4px 10px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); }
                .ccbm-desc-area { flex-grow: 1; font-size: 12px; color: rgba(255,255,255,0.7); margin-left: 10px; }
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
            base.innerHTML = `
                <div id="ccbm_shine"></div>
                <div class="ccbm-icon-shaker">
                    <div id="ccbm_icon_element"></div>
                </div>
            `;
            
            const icon = base.querySelector('#ccbm_icon_element');
            icon.onmouseover = () => { 
                Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCBM 統合設定</b><br>クリックで設定画面を開く</div>', 'this'); 
            };
            icon.onmouseout = () => { Game.tooltip.hide(); };
            icon.onclick = (e) => { 
                PlaySound('snd/tick.mp3'); 
                this.openMainMenu(); 
                e.preventDefault(); 
                e.stopPropagation(); 
            };
            target.appendChild(base);
        },

        // BetterJapanese の writeButton がない場合のための互換用関数
        writeButton: function(id, configKey, name, desc, callback, targetId) {
            const bj = window.betterJapanese;
            const target = l(targetId);
            if (!target) return;

            // BetterJapanese があれば本家の関数を使う
            if (bj && typeof bj.writeButton === 'function') {
                bj.writeButton(id, configKey, name, desc, callback, targetId);
                return;
            }

            // なければ CCBM 独自で簡易ボタンを作成
            const div = document.createElement('div');
            div.className = 'ccbm-list-item';
            div.innerHTML = `
                <div class="ccbm-op-area"><a class="option smallFancyButton" id="${id}">${name}</a></div>
                <div class="ccbm-desc-area">${desc}</div>
            `;
            if (callback) div.querySelector('a').onclick = callback;
            target.appendChild(div);
        },

        openMainMenu: function() {
            const bj = window.betterJapanese;
            const ccacm = Game.mods['CCACM'];
            
            // UI表示用の判定
            const isReplaceJP = (bj && bj.config) ? bj.config.replaceJP : true;

            Game.Prompt(`
                <h3>非公式日本語訳 詳細設定</h3>
                <div>ゲームの処理を変更している翻訳処理について利用するか設定できます。<br>バグがあった場合、これらの翻訳はゲーム内容に影響を及ぼす可能性があります。</div>
                ${!isReplaceJP ? '<div class="line"></div><p style="color: red; font-weight: bold;">「日本語訳の改善」がオフのため、下記の設定はすべてオフとして処理されます。</p>' : ''}
                <div class="line"></div>
                <div class="listing" style="width: 100%; text-align: left; padding: 0px 10px;">
                    <div id="dummyIgnoreListJP"></div>
                </div>
                <div class="line"></div>
                <div>これらの設定の変更は再起動後に適用されます。</div>
                <div class="listing" style="width: 100%; text-align: left; padding: 0px 10px;">
                    <div id="dummySettingJP"></div>
                </div>
                ${ccacm ? `
                <div class="line"></div>
                <div class="ccbm-section-title">CCACM 連携設定</div>
                <div class="listing" style="width: 100%; text-align: left; padding: 0px 10px;">
                    <div id="dummyCCACM"></div>
                </div>` : ''}
            `, ['閉じる'], null, 'settingsList');

            // BetterJapanese 関連のボタン描画
            if (bj) {
                this.writeButton('openIgnoreWordList', null, '置き換え除外リスト', '非公式翻訳に置き換えたくない単語を指定することができます。', bj.openIgnorePrompt, 'dummyIgnoreListJP');
                this.writeButton('toggleShowSpoilerAlertButton', 'showSpoilerAlert', '除外リスト表示確認', '除外リストを表示する際にネタバレに対する確認を表示します。', null, 'dummyIgnoreListJP');
                this.writeButton('toggleReplaceBackgroundNameButton', 'replaceBackgroundName', '背景名', '背景の名前を翻訳します。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceMarketQuoteButton', 'replaceMarketQuote', '在庫市場のフレーバーテキスト', '在庫市場のフレーバーテキストを翻訳し、日本語で表示されるようにします。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceGardenImageButton', 'replaceGardenImage', '菜園情報の画像', '菜園情報内で表示される画像を日本語のものに置き換えます。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceUpdateLogButton', 'replaceUpdateLog', '情報欄及び更新履歴', '情報欄を詳しい内容に置き換え、更新履歴の日本語版を追加します。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceSpecialUpgradesButton', 'replaceSpecialUpgrades', '特殊なアップグレード', 'アップグレードに英語以外では存在しない特殊なフレーバーテキストや概要を追加します。', null, 'dummySettingJP');
                this.writeButton('toggleReplacePurchasedTagButton', 'replacePurchasedTag', '特殊なタグ', '英語以外では変化しない特殊なタグを追加します。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceBuildingsButton', 'replaceBuildings', '施設固有の表現', '一部の説明欄において施設によって異なる表現を追加します。', null, 'dummySettingJP');
                this.writeButton('toggleBeautifyAscendNumber', 'beautifyAscendNumber', 'ヘブンリーチップスの短縮表記', '画面右上および転生時のヘブンリーチップス入手数を短縮表記にし、改行しないようにします。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceCSSButton', 'replaceCSS', 'CSSの変更', 'フレーバーテキストの囲み文字をかぎ括弧に変更します。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceNewsButton', 'replaceNews', 'ニュース欄の改善', 'ニュース欄の挙動および翻訳を置き換えます。', null, 'dummySettingJP');
                this.writeButton('toggleReplaceOthersButton', 'replaceOthers', 'そのほか微小な改善', 'ツールチップなどの翻訳を置き換えます。', null, 'dummySettingJP');
            }

            // CCACM 関連の項目も追加 (もし CCACM が導入されていれば)
            if (ccacm) {
                const isEnabled = ccacm.config.enabled;
                const ccacmContainer = l('dummyCCACM');
                if (ccacmContainer) {
                    ccacmContainer.innerHTML = `
                        <div class="ccbm-list-item">
                            <a class="option smallFancyButton ${isEnabled ? 'on' : 'off'}" onclick="Game.mods['CCACM'].toggleEnabled(); Game.ClosePrompt(); Game.mods['CCBM'].openMainMenu();">自動終了：${isEnabled ? 'ON' : 'OFF'}</a>
                            <span class="ccbm-desc-area">指定時刻に自動終了します。</span>
                        </div>
                    `;
                }
            }
        }
    };

    Game.registerMod("CCBM", {
        init: function() { 
            Game.registerHook('draw', () => { window.CCBM.drawIcon(); }); 
        }
    });
})();