// ==UserScript==
// @name         巴哈福利社自動看廣告兌換 輔助套件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  巴哈福利社自動看廣告兌換 輔助套件
// @author       JacobLinCool
// @match        https://*.safeframe.googlesyndication.com/safeframe/*
// @grant        none
// ==/UserScript==

(async function() {
    await wait(3000);
    log("偵測及確認廣告長度中...");
    await wait(7000);
    try {
        let ad_length = (parseInt(document.querySelector("#count_down").innerHTML) + 2) * 1000;
        log("偵測到廣告剩餘長度為 " + (ad_length/1000 - 2) + " 秒，於此後執行下個動作。");
        if(isNaN(ad_length)) {
            log("無法偵測廣告長度，將於 30 秒後執行下個動作。");
           ad_length = 30000;
        }
        await wait(ad_length);
        document.querySelector("#close_button").click();
    } catch(e) {
        log(["發生錯誤", e]);
        log("將於五秒後重新嘗試。");
        await wait(5000);
        location.reload();
    }

    function wait(t=1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(t);
            }, t);
        });
    }
    function log(item="Event") {
        return console.log(new Date(), item);
    }
})();