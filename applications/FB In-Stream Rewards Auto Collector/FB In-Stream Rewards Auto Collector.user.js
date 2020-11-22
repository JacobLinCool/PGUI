// ==UserScript==
// @name         FB In-Stream Rewards Auto Collector
// @namespace    http://tampermonkey.net/
// @version      0.2
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
        self.exc = new exc_handler();
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
                            setTimeout(function() {
                                let target = document.querySelectorAll(self.settings.target);
                                let item = document.querySelector(self.settings.response).innerHTML;
                                console.log(`[${new Date().toLocaleTimeString("en")}] 獲得物品：${item}`);
                                self.log += `${new Date().toLocaleTimeString()}  獲得物品：${item}\n`;
                                self.rewards.push(item);
                                self.total += `${item}\n`;
                                for(let i = 0; i < target.length; i++) {
                                    if(target[i].innerHTML.includes("關閉")) target[i].click();
                                };
                            }, self.settings.return);
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
            response: ".d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.a5q79mjw.g1cxx5fr.ekzkrbhg.oo9gr5id.hzawbc8m",
            interval: 3000,
            return: 5000,
            limit: 360
        };
        self.total = "";
        self.help = "keywords: start(), stop(), set(key, value), total, settings, help";
        self.log = "";
    }

    function exc_handler() {
        let self = this;
        self.cycle = 0;
        self.last_duration = 0;
        self.clicked_play_btn = 0;
        self.id = setInterval(async () => {
            try {
                let player = document.querySelectorAll("video")[0];

                if(player.paused) {
                    let play_btn = document.querySelector(".oajrlxb2.g5ia77u1.gcieejh5.bn081pho.humdl8nn.izx4hr6d.rq0escxv.nhd2j8a9.q9uorilb.p7hjln8o.qjjbsfad.fv0vnmcu.w0hvl6rk.ggphbty4.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.l9j0dhe7.abiwlrkh.p8dawk7l.i2p6rm4e.jnigpg78.byekypgc");
                    play_btn.click();
                    self.clicked_play_btn++;
                }
                await wait(3000);
                if(self.last_duration == player.duration) {
                    throw new Error("Unknown Problem");
                }

                self.last_duration = player.duration;
                self.cycle++;
            }
            catch(e) {
                if(e == "Unknown Problem" && self.id) {
                    console.log("[Exception Handler] Trying Reload This Page To Solve The Unknown Problem.");
                    location.reload(true);
                }
            }
        }, 10000);
        self.stop = function() {clearInterval(self.id); self.id = 0;};
    }

    async function check_live() {
        if(document.querySelector(".jbu8tgem").innerText.includes("直播")) {
            document.querySelector(".jbu8tgem").parentElement.parentElement.querySelector(`[role=presentation]`).click();
            await wait(1000);
            document.querySelector(".jbu8tgem").parentElement.parentElement.querySelector(`[role=presentation]`).click();
        }
    }

    function wait(t=1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(t);
            }, t);
        });
    }
})();