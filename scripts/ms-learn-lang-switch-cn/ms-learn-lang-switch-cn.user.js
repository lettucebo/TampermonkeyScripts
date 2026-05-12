// ==UserScript==
// @name         MS Learn Lang Switch (zh-CN)
// @name:zh-TW   MS Learn 中英快速切換 — 簡體中文
// @namespace    https://github.com/lettucebo/TampermonkeyScripts
// @version      0.3.0
// @description  Toggle Microsoft Learn / *.microsoft.com pages between English (en-us) and Simplified Chinese (zh-cn) with a floating top-right button.
// @description:zh-TW 在 Microsoft Learn 或任何 *.microsoft.com 頁面右上角加一個浮動按鈕，一鍵在英文 (en-us) 與簡體中文 (zh-cn) 之間切換。
// @author       lettucebo
// @match        https://*.microsoft.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @license      MIT
// @homepageURL  https://github.com/lettucebo/TampermonkeyScripts/tree/main/scripts/ms-learn-lang-switch-cn
// @supportURL   https://github.com/lettucebo/TampermonkeyScripts/issues
// @updateURL    https://raw.githubusercontent.com/lettucebo/TampermonkeyScripts/main/scripts/ms-learn-lang-switch-cn/ms-learn-lang-switch-cn.user.js
// @downloadURL  https://raw.githubusercontent.com/lettucebo/TampermonkeyScripts/main/scripts/ms-learn-lang-switch-cn/ms-learn-lang-switch-cn.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const m = location.href.match(/com\/(en-us|zh-cn)\//);
    if (m) {
        const isEn = m[1] === 'en-us';
        const style = document.createElement('style');
        style.innerHTML = `
#lang-switch {
    position:fixed;top:6px;right:6px;z-index:999;opacity:0.3;cursor:pointer;
    padding:2px 6px;background-color:cadetblue;color:white;font-size:11pt;
}
#lang-switch:hover {
    opacity: 1;
}
`;
        document.head.appendChild(style);
        const div = document.createElement('div');
        div.innerText = isEn ? '簡' : 'EN';
        div.id = 'lang-switch';
        div.onclick = function () {
            const toUrl = location.toString().replace(/com\/(en-us|zh-cn)\//, `com/${(isEn ? 'zh-cn' : 'en-us')}/`);
            location.href = toUrl;
        };
        document.body.appendChild(div);
    }
})();
