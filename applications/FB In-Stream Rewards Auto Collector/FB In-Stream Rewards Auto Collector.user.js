// ==UserScript==
// @name         FB In-Stream Rewards Auto Collector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  FB In-Stream Rewards Auto Collector
// @author       JacobLinCool
// @match        https://www.facebook.com/*/videos/*
// @grant        none
// @require      https://github.com/JacobLinCool/PGUI/raw/main/PGUI.user.js?v=0.3
// ==/UserScript==

(function() {
    // Add Bootstrap CSS
    let bootstrap_tag = document.createElement("link");
    bootstrap_tag.rel = "stylesheet";
    bootstrap_tag.href = "https://bootswatch.com/4/flatly/bootstrap.min.css";
    document.body.appendChild(bootstrap_tag);

    // Append PGUI
    let ui = new PGUI();

    // Run Core Program
    let ac = window.ac = new autoCollector();

    // Add Title
    let plugin_title_wrap = document.createElement("div");
    plugin_title_wrap.id = "plugin_title_wrap";
    let plugin_title = document.createElement("div");
    plugin_title.id = "plugin_title";
    ui.style(`
        #plugin_title_wrap {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-color: rgba(0,0,0,0.05);
            margin: 0 0 8px 0;
            border-radius: 4px;
        }
    `);
    plugin_title.innerHTML = `<b style="font-size: 24px; color: #4267B2;">FACEBOOK</b><br><b style="font-size: 16px; color: #4267B2;">In-Stream Rewards</b><br><b style="font-size: 16px; color: #4267B2;">Auto Collector</b>`;
    plugin_title.innerHTML += `<br><span style="font-size: 10px;">developed by JacobLinCool</span>`;
    ui.elm("head").appendChild(plugin_title_wrap);
    plugin_title_wrap.appendChild(plugin_title);

    // Append Power Button
    let switch_button = document.createElement("button");
    switch_button.id = "switch_button";
    ui.style(`
        #switch_button {
            margin: 0 4px 0 0;
        }
    `);
    switch_button.classList.add("btn");
    switch_button.addEventListener("click", () => {
        if(ac.interval) {
            ac.stop();
            switch_button.innerHTML = "啟動";
            switch_button.classList.add("btn-success");
            switch_button.classList.remove("btn-danger");
        }
        else {
            ac.start();
            switch_button.innerHTML = "終止";
            switch_button.classList.add("btn-danger");
            switch_button.classList.remove("btn-success");
        }
    });
    switch_button.click();
    ui.elm("head").appendChild(switch_button);

    // Append Log Button
    let log_button = document.createElement("button");
    log_button.id = "log_button";
    ui.style(`
        #log_button {
            margin: 0 4px 0 0;
        }
    `);
    log_button.classList.add("btn", "btn-info");
    log_button.innerHTML = "日誌";
    log_button.addEventListener("click", () => {
        let dr = new PGUI_TOOLS.dr(ac.log);
        dr.open();
    });
    ui.elm("head").appendChild(log_button);

    // Core Program
    function autoCollector() {
        let console = ui.console;
        var self = this;
        self.start = () => {
            self.total = "已經獲得：\n\n";
            self.log += "\n-- 日誌紀錄開始 --\n";
            self.interval = setInterval(
                function() {
                    try {
                        let target = document.querySelectorAll(self.settings.target);
                        for(let i = 0; i < target.length; i++) {
                            if(!target[i].innerHTML.includes("領取")) continue;
                            target[i].click();
                            console.log(`[${new Date().toLocaleTimeString("en")}] 成功點擊領取按鈕`);
                            self.log += `${new Date().toLocaleTimeString()}  成功點擊領取按鈕\n`;
                            setTimeout(
                                (function(self) {
                                    return function() {
                                        let item = document.querySelector(self.settings.response).innerHTML;
                                        console.log(`[${new Date().toLocaleTimeString("en")}] 獲得物品：${item}`);
                                        self.log += `${new Date().toLocaleTimeString()}  獲得物品：${item}\n`;
                                        self.rewards.push(item);
                                        self.total += `${item}\n`;
                                        target[i].click();
                                    }
                                })(self), self.settings.return
                            );
                        }
                        if(Date.now()-self.time > self.settings.limit*60000) {
                            console.log("任務已執行"+parseInt((Date.now()-self.time)/60000)+"分鐘，暫停任務。");
                            self.log += `${new Date().toLocaleTimeString()}  任務已執行${parseInt((Date.now()-self.time)/60000)}分鐘，任務已暫停\n`;
                            self.stop();
                        }
                    } catch(e) {}
                }, self.settings.interval
            );
            self.time = Date.now();
            console.log(`[${new Date().toLocaleTimeString("en")}] 開始執行任務`);
            self.log += `${new Date().toLocaleTimeString()}  開始執行任務\n`;
            self.log += `${new Date().toLocaleTimeString()}  使用的設定如下\n${JSON.stringify(self.settings)}\n`;
        };
        self.stop = () => {
            clearInterval(self.interval);
            self.interval = 0;
            console.log(`[${new Date().toLocaleTimeString("en")}] 任務已終止`);
            self.log += `${new Date().toLocaleTimeString()}  任務已終止\n`;
        };
        self.set = (k,v) => {
            self.settings[k] = v;
            console.log(`已修改設定 ${k} 之值為 ${v}`);
            self.log += `${new Date().toLocaleTimeString()}  已修改設定 ${k} 之值為 ${v}\n`;
        };
        self.rewards = [];
        self.time = 0;
        self.interval = 0;
        self.settings = {
            target: ".oajrlxb2.s1i5eluu.gcieejh5.bn081pho.humdl8nn.izx4hr6d",
            response: ".oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.a5q79mjw.g1cxx5fr.ekzkrbhg.oo9gr5id.hzawbc8m",
            interval: 15000,
            return: 5000,
            limit: 360
        };
        self.total = "";
        self.help = "keywords: start(), stop(), set(key, value), total, settings, help";
        self.log = "";
    }
})();