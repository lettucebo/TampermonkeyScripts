[English](./README.md) | 繁體中文

# GitHub Docs Lang Switch (zh-CN)

> 套用範圍（`@match`）：`https://docs.github.com/*/*`

## 功能說明

在每個帶有語系區段的 [docs.github.com](https://docs.github.com/) 頁面右上角（`top: 6px`）加上一個浮動小按鈕，用來在英文與簡體中文之間切換：

- 當網址包含 `/en/` 時，按鈕顯示 **簡**，點擊後會跳到對應的 `/zh/` 頁面。
- 當網址包含 `/zh/` 時，按鈕顯示 **EN**，點擊後會跳到對應的 `/en/` 頁面。

按鈕預設半透明，滑鼠移過去才變成完全不透明，閱讀時不會擋到內容。

## 安裝

1. 先安裝使用者腳本管理器，例如 [Tampermonkey](https://www.tampermonkey.net/)（支援 Chrome、Edge、Firefox、Safari）。
2. 點擊安裝連結：
   [安裝 `github-docs-lang-switch-cn.user.js`](https://raw.githubusercontent.com/lettucebo/TampermonkeyScripts/main/scripts/github-docs-lang-switch-cn/github-docs-lang-switch-cn.user.js)
3. 在 Tampermonkey 的安裝畫面按下確認。

Tampermonkey 後續會依照預設更新排程，從這個 repo 的 raw URL 自動更新腳本。

## 運作原理

腳本以 `/com\/(en|zh)\//` 這個正規式檢查 `location.href`，藉此判斷目前的語系區段。GitHub Docs 使用的是**只有兩個字母的語系代碼**（`en`、`zh`、`ja`、`ko` ⋯），直接接在 `docs.github.com/` 後面 — 這跟 Microsoft Learn 使用 `en-us`、`zh-cn` 這類帶連字號的代碼不一樣。點擊按鈕時，腳本用同一組 `/com\/(en|zh)\//` 來組出目標網址，這樣 match 與 replace 才會一致。

如果網址沒有語系區段（例如根目錄 `https://docs.github.com/`），腳本不會做任何事。

## 相對於原始 gist 的 Bug 修正

repo 版修掉了原始 gist（`lettucebo/a69c5d5cb2f09bbff962568a8e14206c`）裡的兩個 bug：

- **`@updateURL` / `@downloadURL` 指錯 gist。** gist 版的 `@updateURL` 與 `@downloadURL` 指到完全不相關的 **Microsoft Learn** zh-CN gist（`lettucebo/75f05f94...`）。實際影響是：Tampermonkey 下一次自動更新時，會把這個腳本悄悄換成 MS Learn 腳本的內容，使用者就會發現 GitHub Docs 切換按鈕整個變成另一支腳本。repo 版改成指向自己在這個 repo 裡的 raw URL，更新時就會留在這支腳本本身。
- **點擊事件的 URL replace 正規式從未命中。** gist 版偵測語系用的是 `/com\/(en|zh)\//`（正確），但改寫網址時卻用 `/com\/(en-us|zh-cn)\//`（錯誤 — 這個 pattern 是給 Microsoft Learn 用的，永遠不會 match 到 docs.github.com 的網址）。結果就是：按鈕有跑出來，但點下去沒反應。repo 版把 match 跟 replace 都改成 `/com\/(en|zh)\//`，按鈕就能正常切換頁面。

## 從 gist 版（≤ v0.2）升級

`@namespace` 從 `http://tampermonkey.net/` 改成 `https://github.com/lettucebo/TampermonkeyScripts`，因此 Tampermonkey 會把 repo 版視為**不同的腳本**，而不是覆蓋原本的 gist 版。為了避免兩支同時運作：

1. 打開 Tampermonkey 管理面板。
2. 刪除原本從 gist 安裝的 `GitHub 中英快速切換 - CN` 條目。
3. 再用上方的安裝連結安裝 repo 版。

## License

[MIT](https://opensource.org/licenses/MIT)
