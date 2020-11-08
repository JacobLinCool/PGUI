// ==UserScript==
// @name         PGUI
// @date         2020.11.08
// @version      0.1.3
// @description  PGUI
// @author       JacobLinCool
// @match        http://*/*
// @grant        none
// ==/UserScript==

window.PGUI = function() {
    let self = this;
    let uid = this.uid = Math.floor(1e6+Math.random()*9e6).toString(36);
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
            min-width: 40px;
            min-height: 40px;
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
            width: calc(100% - 8px);
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
};
