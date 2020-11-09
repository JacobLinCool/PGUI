# PGUI
Just a toolkit includes simple graphical user interface and some tools.

## PGUI
```javascript
window.PGUI
```

### Usage
```javascript
let ui = new PGUI;
```

### Structure & Methods
```javascript
ui.uid = "ID";
ui.cfg = { Configurations };

ui.console = { log: function(data), warn: function(data), error: function(data) };
ui.element = function("element_name");
ui.elm = ui.element;
ui.style = function("css_code");
```


## PGUI TOOLS
```javascript
window.PGUI_TOOLS
```

### Methods & Usage
```javascript
let doc_reader = new PGUI_TOOLS.document_reader("string");
PGUI_TOOLS.dr = PGUI_TOOLS.doc_rdr = PGUI_TOOLS.doc_reader = PGUI_TOOLS.document_reader;

PGUI_TOOLS.select_element().then(dom_element => { console.log(dom_element) });
PGUI_TOOLS.se = PGUI_TOOLS.sel_elm = PGUI_TOOLS.select_element;
```
