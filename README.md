# LDC-Tools — Microsoft Learning Download Center 批次下載

> 一個 Tampermonkey userscript，讓你在
> [Microsoft Learning Download Center](https://learningdownloadcenter.microsoft.com/)
> 一次勾選多門課程並批次下載到本機指定資料夾，自動依
> `{課程編號} {課程名稱}/{課程編號}-{語言}/` 結構整理。

## 它做什麼

預設 LDC 網站的「Download」按鈕一次只能下載一門課程，且每次都要逐一打開。
本 userscript 在原網站上加：

- 每個課程列項旁邊一個 ✅ checkbox
- 頁首一條工具列：選資料夾／全選／清除／下載
- 浮動進度面板（含失敗重試、複製錯誤清單）
- 下載前的確認對話框（顯示課程數／檔案數／總大小／目的地）

下載到本機後資料夾結構長這樣：

```
你選的資料夾/
├─ AZ-040T00 Automate Administration with PowerShell/
│  ├─ AZ-040T00-English/
│  │  ├─ AZ-040T00A-ENU-Change-Log.pdf
│  │  ├─ AZ-040T00A-ENU-Powerpoint.zip
│  │  └─ AZ-040T00A-ENU-TrainerPrepGuide.pdf
│  └─ AZ-040T00-Japanese/
│     ├─ AZ-040T00-PowerPoint.ja-JP.zip
│     └─ AZ-040T00-Readme.ja-JP.txt
└─ AI-3017 Microsoft AI for business leaders/
   ├─ AI-3017-Arabic/
   ├─ AI-3017-Chinese Simplified/
   └─ ...
```

## 瀏覽器需求

**Chromium 系列瀏覽器（Chrome / Edge / Brave / Opera 等）**。
腳本使用
[File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)
直接寫入你選的資料夾，目前 Firefox 不支援。

## 安裝

1. 安裝 [Tampermonkey](https://www.tampermonkey.net/)
   （Chrome / Edge / Brave 商店都有）
2. 點以下連結，Tampermonkey 會自動跳出安裝對話框：

   👉 **[安裝 ldc-batch-download.user.js](https://raw.githubusercontent.com/lettucebo/LDC-Tools/main/src/ldc-batch-download.user.js)**

3. 點 **Install**
4. 打開 <https://learningdownloadcenter.microsoft.com/>
   登入後頁首應該會出現藍色的「LDC Batch Downloader」工具列

> **若點連結沒跳安裝對話框、反而看到原始程式碼**：
>
> - 確認你已安裝 Tampermonkey 擴充並且已啟用
> - Chrome 117+ 需要在 `chrome://extensions` 開啟 Tampermonkey 的 **Developer mode** 才能讓 userscript 觸發安裝對話框
> - 仍不行就改手動：開 Tampermonkey 後台 → **Utilities** → **Import from URL** 貼上面那個 raw URL

## 自動更新

腳本 header 有設定 `@updateURL` / `@downloadURL` 指向 GitHub raw，Tampermonkey
預設**每天**會檢查一次新版（可在 Tampermonkey 設定 → **Externals** → *Update interval*
調整成立刻、每小時或關閉）。

當 GitHub 上的 `@version` 比本地高時，Tampermonkey 會自動下載新版並提示。

立即手動觸發：

- Tampermonkey 後台 → 找到 **LDC Batch Downloader** → 右側 **last updated** 欄
  點 ⟳ icon → 強制檢查
- 或在 Tampermonkey icon 選單點 **Check for userscript updates**

## 使用步驟

1. **第一次使用**：點頁首的 `📁 Choose folder`，選擇要把課程存到哪個本機資料夾
   （例：`D:\OneDrive\MTT\Decks` 或任何位置）
   - 瀏覽器會跳出資料夾選擇器並要求授權
   - 授權之後會記住這個資料夾，下次不用重選
2. **勾選課程**：把想下載的課程列項勾起來（可以跨類別、跨語言）
3. **下載**：點 `⬇ Download selected`
   - 會先彈出確認對話框（課程數／檔案數／總大小）
   - 點 `Start download` 開始下載
4. 浮動進度面板會即時顯示每個檔案的狀態
   - 已存在且大小相同的檔案會自動跳過（可重跑同一批）
   - 失敗的檔案在面板顯示，可以「複製錯誤清單」

## Tampermonkey 選單命令

點 Tampermonkey icon → LDC Batch Downloader 可看到：

- `LDC: Reset chosen folder` — 清除已記住的資料夾，下次會再問
- `LDC: Set concurrency (1-4)` — 改並行下載數（預設 2）
- `LDC: Token status` — 顯示目前認證 token 還有多久過期

## 行為細節

| 情境 | 處理 |
|---|---|
| 同檔已存在且大小相同 | 跳過 |
| 同檔已存在但大小不同 | 覆寫（v1 預設策略） |
| 大檔（100MB+） | 串流寫入（`response.body.pipeTo`），不會把整檔放進記憶體 |
| 網路錯誤 / 5xx | 自動重試 3 次（1s → 3s → 9s 退避） |
| 429 限流 | 依 `Retry-After` 暫停，並把全域並行降到 1 |
| 401 token 過期 | 暫停整批，提示重新整理頁面 |
| 下載中關掉分頁 | 整批中止；下次重跑會自動跳過已完成檔案 |
| 多分頁同時開 | `navigator.locks` 互斥，第二個分頁會被擋下 |

## 已知限制

- ❌ 不支援 Firefox（沒有 File System Access API）
- ❌ 不支援跨 session 的中斷續傳（瀏覽器重開後得整批重跑，但已下載的會自動跳過）
- ❌ 不支援個別檔案排除（一旦勾選課程，該課程所有檔案都會下載）
- ❌ 不支援自動展開所有類別「下載全站」（避免誤操作）

## 開發

```powershell
# 跑純函式測試
node test\pure-modules.test.js

# 語法檢查
node --check src\ldc-batch-download.user.js
```

## 架構

`src/ldc-batch-download.user.js` 是單檔 IIFE，內部模組化：

| 模組 | 職責 |
|---|---|
| `tokenInterceptor` | `document-start` hook `fetch` + XHR，攔截 SPA 的 Bearer token；解 JWT exp 預判過期 |
| `api` | `getSearchTree()` / `downloadStream()`；HTTP error 分類 |
| `courseParser` | 解析 row title (`AZ-040T00: ... (Japanese)`)，轉 canonical 資料夾名 |
| `pathSanitizer` | Windows 非法字元 / reserved name / 長度限制 |
| `treeIndex` | 從 `/api/search` 結果建立 lookup 表，分類 category vs course |
| `fsaWriter` | File System Access API 包裝，IndexedDB 持久化 handle |
| `selection` | 選取狀態（keyed by 穩定 ID） |
| `orchestrator` | 並行 queue、retry、跳過已存在、`navigator.locks` 多分頁鎖 |
| `ui` | 工具列、checkbox 注入、進度面板、preflight 對話框 |

逆向工程出的 LDC API：

- `GET /api/search` — 一次回完整課程樹，含每個檔案的 `versionId/url/language/size`
- `GET /api/download?blobPath=X&versionId=Y` — 回傳檔案 binary（需 `Authorization: Bearer ...`）

## 授權

MIT
