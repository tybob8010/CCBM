# CookieClickerBasicMOD (CCBM)

## Latest Version : `v.2.0.0` (Auto Loader)

**CookieClickerBasicMod (CCBM)** は、ブラウザ版 [CookieClicker](https://orteil.dashnet.org/cookieclicker/) に便利な機能を追加する非公式MODです。

「Auto Loader」をインストールするだけで、さまざまなMODを統合管理し、常に最新の状態で利用できます。

※本MODは**非公式**です。

※Steam版には対応しておりません。

※ライセンスについては [LICENSE](LICENSE) をご確認ください。

---

## 💬 サポート・連絡先
不明点、要望、バグ報告は [Discordサーバー](https://discord.com/invite/PYQr6WN9a3) までお寄せください。

© 2026 tybob

---

## 🌐導入方法
TampermonkeyなどのUserScript拡張機能を利用して、MODを起動させます。

### 1. 拡張機能をインストールする
お使いのブラウザに合わせて Tampermonkey をインストールしてください。
* [Chrome / EdgeなどChromium系統のブラウザ](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja)
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### 2. Auto Loader をインストールする
以下のリンクをクリックして、各MODを管理するUserScriptをインストールします。
* **[CCBM Auto Loader をインストールする](https://tybob8010.github.io/CookieClickerBasicMOD/loader.user.js)**

### 3. 「インストール」をクリック
Tampermonkeyの確認画面が表示されるので、「インストール」ボタンを押してください。

> [!IMPORTANT]
> すでに Cookie Clicker を開いている場合は、インストール後にページを再読み込み（F5キー、Ctrl+R等）してください。画面左側に**歯車アイコン**が表示されれば成功です。

---

## 📦 収録MOD一覧
現在、以下のMODが自動的に読み込まれます。

| MOD名 | 略称 | 機能概要 |
| :--- | :--- | :--- |
| CookieClickerBasicMOD | `CCBM` | 共通の歯車アイコンを表示し、各MODの設定を統合管理します。 |
| CookieClickerAutoClosingMOD | `CCACM` | 指定した時刻に自動でセーブを行い、タブを閉じます。 |

---

## 📜使い方
1. ゲーム画面左側に表示される**歯車アイコン**をクリックします。
2. 統合設定メニューが開くので、設定したいMOD（例：自動終了設定）を選択します。
3. 各MOD専用のウィンドウで設定を行い、「保存」を押せば完了です。

---

## 📝 更新履歴
### v.1.0.0

*2026/03/21公開*

**CCBMリリース**
* **システム統合**: 各MODを個別にインストールする必要がなくなりました。
* **CCBM実装**: 設定画面を一つの歯車アイコンに集約しました。
* **自動更新対応**: 今後はGitHub上の更新が自動的にユーザー環境へ反映されます。