// ==UserScript==
// @name         PGUI
// @date         2020.11.21
// @version      0.3.2
// @description  PGUI
// @author       JacobLinCool
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function(){
    window.PGUI_DATA = {
        UI: [],
        DOC_READER: []
    };

    let pgui_style = window.PGUI_STYLE = document.createElement("style");
    pgui_style.id = "PGUI_GLOBAL_STYLE";
    window.document.body.appendChild(pgui_style);
})();

window.PGUI = function() {
    let self = this;
    let uid = this.uid = Math.floor(1e6+Math.random()*9e6).toString(36);
    PGUI_DATA.UI.push(uid);
    /* Config */
    this.cfg = {
        draggable: true,
        auto_scroll: true
    };

    /* Style Sheet */
    let style_sheet = document.createElement("style");
    style_sheet.id = "style_sheet_"+uid;
    window.document.body.appendChild(style_sheet);

    /* Plugin Button */
    let plugin_button = document.createElement("div");
    plugin_button.id = "plugin_button_"+uid;
    window.document.body.appendChild(plugin_button);
    style_sheet.innerHTML += `
        #plugin_button_${uid} {
            position: fixed;
            z-index: 10000;
            right: 10px;
            bottom: 10px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 5px 0px #8e8e8e;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #plugin_button_${uid}:hover {
            box-shadow: 0 0 10px 0px #8e8e8e;
        }
        #plugin_button_icon_${uid} {
            font-size: 31px;
        }
    `;
    let plugin_button_icon = document.createElement("span");
    plugin_button_icon.id = "plugin_button_icon_"+uid;
    plugin_button_icon.innerHTML = "⚙";
    plugin_button.appendChild(plugin_button_icon);

    plugin_button.addEventListener("click", () => {
        plugin_board.style.display = (plugin_board.style.display == "block") ? "none" : "block";
    });

    /* Plugin Menu */
    let plugin_board = document.createElement("div");
    plugin_board.id = "plugin_board_"+uid;
    window.document.body.appendChild(plugin_board);
    style_sheet.innerHTML += `
        #plugin_board_${uid} {
            position: fixed;
            z-index: 9999;
            right: 10px;
            bottom: 60px;
            border-radius: 5px;
            width: 240px;
            height: min(500px, calc(100vh - 80px));
            background-color: rgba(255, 255, 255, 0.8);
            border: solid 1px #8e8e8e;
            padding: 8px 0;
            display: none;
        }
        #plugin_board_${uid}:hover {
            border: solid 1px #424242;
        }
    `;
    let plugin_board_head = document.createElement("div");
    plugin_board_head.id = "plugin_board_head_"+uid;
    plugin_board.appendChild(plugin_board_head);
    style_sheet.innerHTML += `
        #plugin_board_head_${uid} {
            width: 100%;
            height: 40%;
            padding: 0 4px;
            overflow: auto;
        }
    `;
    let plugin_console = document.createElement("div");
    plugin_console.id = "plugin_console_"+uid;
    plugin_board.appendChild(plugin_console);
    style_sheet.innerHTML += `
        #plugin_console_${uid} {
            width: 100%;
            height: 60%;
            padding: 4px 4px 0 4px;
            overflow: auto;
            border-top: solid 1px rgba(0,0,0,0.6);
        }
        .plugin_console_log {
            color: #3498db;
        }
        .plugin_console_warn {
            color: #f39c12;
        }
        .plugin_console_error {
            color: #e74c3c;
        }
    `;

    /* Console */
    this.console = {
        log: function(...data) {
            let new_log = document.createElement("div");
            new_log.classList.add("plugin_console_log");
            for(let i = 0; i < data.length; i++) {
                new_log.innerHTML += JSON.stringify(data[i], null, 2) + "  ";
            }
            plugin_console.appendChild(new_log);
            if(self.cfg.auto_scroll) plugin_console.scrollTop = plugin_console.scrollHeight;
        },
        warn: function(...data) {
            let new_warn = document.createElement("div");
            new_warn.classList.add("plugin_console_warn");
            for(let i = 0; i < data.length; i++) {
                new_warn.innerHTML += JSON.stringify(data[i], null, 2) + "  ";
            }
            plugin_console.appendChild(new_warn);
            if(self.cfg.auto_scroll) plugin_console.scrollTop = plugin_console.scrollHeight;
        },
        error: function(...data) {
            let new_error = document.createElement("div");
            new_error.classList.add("plugin_console_error");
            for(let i = 0; i < data.length; i++) {
                new_error.innerHTML += JSON.stringify(data[i], null, 2) + "  ";
            }
            plugin_console.appendChild(new_error);
            if(self.cfg.auto_scroll) plugin_console.scrollTop = plugin_console.scrollHeight;
        }
    };
    this.console.info = this.console.log;
    this.console.err = this.console.error;

    /* Draggable */
    let dragging_plugin_button = false, dragging_plugin_board = false, ox, oy;
    plugin_button.addEventListener("mousedown", e => { dragging_plugin_button = true; ox = e.clientX; oy = e.clientY; });
    plugin_board.addEventListener("mousedown", e => { if(plugin_board == e.target) { dragging_plugin_board = true; ox = e.clientX; oy = e.clientY; } });
    document.body.addEventListener("mousemove", e => {
        if(self.cfg.draggable) {
            if(dragging_plugin_button) {
                e.preventDefault();
                let dx = ox - e.clientX, dy = oy - e.clientY;
                ox = e.clientX; oy = e.clientY;
                plugin_button.style.left = (plugin_button.offsetLeft - dx) + "px";
                plugin_button.style.top = (plugin_button.offsetTop - dy) + "px";
                plugin_button.style.right = plugin_button.style.bottom = "unset";
            }
            if(dragging_plugin_board) {
                e.preventDefault();
                let dx = ox - e.clientX, dy = oy - e.clientY;
                ox = e.clientX; oy = e.clientY;
                plugin_board.style.left = (plugin_board.offsetLeft - dx) + "px";
                plugin_board.style.top = (plugin_board.offsetTop - dy) + "px";
                plugin_board.style.right = plugin_board.style.bottom = "unset";
            }
        }
    });
    document.body.addEventListener("mouseup", e => { dragging_plugin_button = false; dragging_plugin_board = false; });

    /* Methods */
    this.style = function(css="") {
        style_sheet.innerHTML += css;
        return style_sheet.innerHTML;
    };
    this.element = function(target=null) {
        if(target === null) {
            return null;
        }
        else {
            switch(target) {
                case "button":
                    return plugin_button;
                case "icon":
                    return plugin_button_icon;
                case "board":
                    return plugin_board;
                case "head":
                    return plugin_board_head;
                case "console":
                    return plugin_console;
                default:
                    return null;
            };
        }
    };
    this.elm = this.element;
    this.remove = function() {
        for(let i = 0; i < PGUI_DATA.UI.length; i ++)
            if(PGUI_DATA.UI[i] == self.uid) PGUI_DATA.UI.splice(i, 1);
        style_sheet.remove();
        plugin_button.remove();
        plugin_board.remove();
        Object.keys(self).forEach(c => { delete self[c]; });
        return null;
    };
};

window.PGUI_TOOLS = {
    document_reader: function(data="") {
        let rdr = this;
        this.rid = Math.floor(1e6+Math.random()*9e6).toString(36);
        PGUI_DATA.DOC_READER.push(this.rid);
        this.show = false;
        this.body = document.createElement("div");
        this.body.id = "document_reader_" + this.rid;
        PGUI_STYLE.innerHTML += `
            #document_reader_${this.rid} {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: calc(100% - 32px);
                height: calc(100% - 32px);
                z-index: 999999;
                background-color: rgba(255,255,255,0.9);
                margin: 16px;
                border-radius: 10px;
                border: solid 1px lightgray;
                box-shadow: 0 0 0px 30px rgba(0,0,0,0.6);
            }
        `;
        document.body.appendChild(this.body);
        let cross = document.createElement("span");
        cross.id = "document_reader_cross_" + this.rid;
        cross.innerHTML = "⤬";
        PGUI_STYLE.innerHTML += `
            #document_reader_cross_${this.rid} {
                position: absolute;
                right: 8px;
                top: 2px;
                font-size: 24px;
                cursor: pointer;
            }
        `;
        cross.addEventListener("click", () => {
            rdr.close();
        });
        this.body.appendChild(cross);
        let content = document.createElement("pre");
        content.id = "document_reader_content_" + this.rid;
        content.innerHTML = data;
        PGUI_STYLE.innerHTML += `
            #document_reader_content_${this.rid} {
                position: absolute;
                left: 8px;
                top: 2px;
                font-size: 16px;
                width: calc(100% - 64px);
                height: calc(100% - 36px);
                overflow: auto;
            }
        `;
        this.body.appendChild(content);

        this.open = function() {
            rdr.body.style.display = "block";
            rdr.show = true;
        };
        this.close = function() {
            rdr.body.style.display = "none";
            rdr.show = false;
        };
        this.remove = function() {
            for(let i = 0; i < PGUI_DATA.DOC_READER.length; i ++)
                if(PGUI_DATA.DOC_READER[i] == rdr.rid) PGUI_DATA.DOC_READER.splice(i, 1);
            rdr.body.remove();
            Object.keys(rdr).forEach(c => { delete rdr[c]; });
            return null;
        };
    },
    select_element: function(callback=null) {
        return new Promise(resolve => {
            setTimeout(() => {
                document.body.addEventListener("click", e => {
                    e.preventDefault(); e.stopPropagation();
                    if(typeof callback == "function") callback(e.target);
                    resolve(e.target);
                }, {once: true});
            }, 20);
        });
    },
    finding_elements: async function(css_query_string, number=1, interval=100) {
        let d = await new Promise(resolve => {
            let itv = setInterval(() => {
                if(document.querySelectorAll(css_query_string).length >= number) resolve(itv);
            }, interval);
        });
        clearInterval(d);
        return Array.from(document.querySelectorAll(css_query_string));
    }
};

PGUI_TOOLS.dr = PGUI_TOOLS.doc_rdr = PGUI_TOOLS.doc_reader = PGUI_TOOLS.document_reader;
PGUI_TOOLS.se = PGUI_TOOLS.sel_elm = PGUI_TOOLS.select_element;
PGUI_TOOLS.fe = PGUI_TOOLS.find_elm = PGUI_TOOLS.finding_elm = PGUI_TOOLS.finding_element = PGUI_TOOLS.finding_elements;
