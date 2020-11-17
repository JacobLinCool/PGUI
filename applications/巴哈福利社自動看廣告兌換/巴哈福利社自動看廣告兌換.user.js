// ==UserScript==
// @name         巴哈福利社自動看廣告兌換
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  巴哈福利社自動看廣告兌換
// @author       JacobLinCool
// @match        https://fuli.gamer.com.tw/*
// @grant        none
// @require      https://github.com/JacobLinCool/PGUI/raw/main/PGUI.user.js?v=0.3
// ==/UserScript==

(async function () {
    // Just Wait 2 Seconds Before Program Start
    await wait(2000);

    // Initialize Some Data About Program Version And Date
    if( !localStorage["auto_ad_program_v"] || localStorage["auto_ad_program_v"] < 1 ) {
        localStorage["auto_ad_program_v"] = 1;
        localStorage["auto_ad_program_d"] = JSON.stringify({d: (function(){let d = new Date(); return d.getFullYear()*1e4 + d.getMonth()*1e2 + d.getDate();})(),sn: []});
    }

    // Parse Data
    let lsd = JSON.parse(localStorage["auto_ad_program_d"]);
    if(lsd.d < (function(){let d = new Date(); return d.getFullYear()*1e4 + d.getMonth()*1e2 + d.getDate();})()) {
        lsd.sn = [];
        lsd.d = (function(){let d = new Date(); return d.getFullYear()*1e4 + d.getMonth()*1e2 + d.getDate();})();
        localStorage["auto_ad_program_d"] = JSON.stringify(lsd);
    }

    // Check Location
    if( location.pathname == "/" ) {
        window.addEventListener("message", e => {
            if(e.data.finished) {
                window.aapw.close();
            }
        }, false);
        let list = Array.from(document.querySelectorAll(".card-content"));
        list.forEach(item => {
            if(item.querySelector(".type-tag").innerHTML == "抽抽樂") {
                let link = document.createElement("a");
                link.classList.add("card-btn", "c-accent-o", "run_program_auto_btn");
                link.style.position = "absolute";
                link.style.bottom = "10px";
                link.style.left = "10px";
                link.style.width = "min(30%, 60px)";
                link.innerHTML = "自動執行";
                link.target = "_blank";
                link.href = item.parentElement.href;

                if(lsd.sn.includes((new URL(link.href)).searchParams.get("sn"))) link.innerHTML = "今日兌畢";
                item.appendChild(link);
                link.addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.aapw = window.open(link.href+"&auto=1", "popUpWindow","height=400,width=700,left=100,top=100");
                });
            }
        });
        let ui = new PGUI;
        // Append Power Button
        let switch_button = document.createElement("button");
        switch_button.id = "switch_button";
        ui.style(`
            #switch_button {
                margin: 0 4px 0 0;
                position: relative;
            }
        `);
        switch_button.innerHTML = "自動執行所有抽獎";
        switch_button.classList.add("card-btn", "c-primary");
        switch_button.addEventListener("click", () => {
            run_all();
            switch_button.innerHTML = "正在自動執行所有抽獎";
            switch_button.classList.remove("c-primary");
            switch_button.classList.add("c-accent-o");

        });
        ui.elm("head").appendChild(switch_button);

        window.run_all = async function() {
            let btn = Array.from(document.querySelectorAll(".run_program_auto_btn"));
            for(let i = 0; i < btn.length; i++) {
                ui.console.log("Running Program No." + (i+1) + "  " + btn[i].parentElement.querySelector(".items-title").innerHTML);
                if(btn[i].innerHTML == "今日兌畢") continue;
                btn[i].click();
                await new Promise(resolve => {
                    window.addEventListener("message", e => {
                        if(e.data.finished) resolve(true);
                    }, false, {once: true});
                });
                ui.console.log("Finished Program No." + (i+1));
            }
            await wait(1000);
            ui.console.log("All Programs Have Been Finished.");
            switch_button.innerHTML = "已自動執行所有抽獎";
            switch_button.classList.add("c-primary");
            switch_button.classList.remove("c-accent-o");
        };
    }
    else if( location.href.search(/shop_detail.php\?sn=/) > 0 ) {
        window.addEventListener("message", e => {
            if(e.data.ok) {
                window.ad_finished = true;
            }
        }, false);
        try {
            document.title = "[自動執行中] " + document.title;
            if((new URL(location)).searchParams.get("auto")) sessionStorage["auto_ad_program_fa"] = 1;
            let free_btn = document.querySelector(".btn-base.c-accent-o ");
            if( free_btn.innerHTML == "本日免費兌換次數已用盡" ) {
                let sn = (new URL(document.location)).searchParams.get("sn");
                lsd.sn.push(sn);
                localStorage["auto_ad_program_d"] = JSON.stringify(lsd);
                if(window.opener && sessionStorage["auto_ad_program_fa"]) {
                    window.opener.postMessage({finished: true, sn: sn}, "*");
                }
                else {
                    alert("本日免費兌換次數已用盡");
                }
                return;
            }
            free_btn.style.position = "fixed";
            free_btn.style.bottom = "10px";
            let f1 = free_btn.onclick;
            f1();
            log("已按下免費看廣告按鈕，三秒後執行下個動作。");
            await wait(3000);
            document.querySelector(".dialogify__content.dialogify__fixedwidth").querySelector(".btn.btn-insert.btn-primary").click();
            log("已按下廣告播放按鈕，三秒後執行下個動作。");
            sessionStorage["auto_ad_program_retry"] = 0;
            let err = await new Promise(resolve => {
                setTimeout(()=>{if(!window.ad_finished) resolve("Ad Did Not Finish.");}, 50000);
            });
            if(err) throw new Error(err);
        } catch(e) {
            log(["發生錯誤", e]);
            let retried = parseInt(sessionStorage["auto_ad_program_retry"] || 0);
            if( retried < 3) {
                log("將於五秒後重新嘗試。");
                await wait(5000);
                sessionStorage["auto_ad_program_retry"] = (retried+1);
                location.reload();
            }
        }
    }
    else if( location.href.search(/buyD.php\?ad=1/) > 0 ) {
        if( document.querySelector("#remain-gold").innerHTML.replace(/,/g, "") == document.querySelector("#gold").value ) {
            document.title = "[自動執行中] " + document.title;
            log("確認為免費項目，同意購買。");
            document.querySelector("#agree-confirm").click();
            await wait(1000);
            buy();
            await wait(1000);
            sessionStorage["auto_ad_program_retry"] = 0;
            document.querySelector(".dialogify__content.dialogify__fixedwidth").querySelector(".btn.btn-insert.btn-primary").click();
        }
    }
    else if( location.href.search(/message_done.php\?type=3/) > 0 ) {
        document.title = "[自動執行中] " + document.title;
        sessionStorage["auto_ad_program_retry"] = 0;
        document.querySelector(".btn.btn--primary").click();
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