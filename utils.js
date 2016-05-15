var utils = {};

utils.observe = function (el, config, callback, observeOnce) {
    observeOnce = (typeof observeOnce !== "undefined") && observeOnce;

    var observer = new MutationObserver(function(mutations) {
        if (observeOnce) {
            observer.disconnect();
        }
        
        callback(mutations);
    });

    observer.observe(el, config);

    return observer;
};

utils.stopEvent = function (e) {
    utils.recipe(e, ["preventDefault", "stopPropagation"]);
};

utils.keyFromKeyCode = function (shifted, keyCode) {
    var specialKeys = { 191: "/", 27: "Escape", 16: "Shift", 17: "Control", 18: "Alt", 8: "Backspace", 32: " ", 13: "Enter", 9: "Tab", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown" };
    var shiftedSpecialKeys = { 191: "?" };
    if (typeof specialKeys[keyCode] !== "undefined") {
        if (shifted && typeof shiftedSpecialKeys[keyCode] !== "undefined") {
            return shiftedSpecialKeys[keyCode];
        }
        return specialKeys[keyCode];
    } else {
        var c = String.fromCharCode(keyCode);
        if(!shifted) return c.toLowerCase();

        var shifts = { "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+" };
        var foundShift = shifts[c];
        if (typeof foundShift === "undefined") {
            return c.toUpperCase();
        } else {
            return shifts[c];
        }
    }
}

utils.createKeyboardEvent = function (type, info) {
    var e = new KeyboardEvent(type, info);
    if(e.keyCode == 0) {
        /* http://jsbin.com/awenaq/3/edit?js,output */
        e = document.createEventObject ?
            document.createEventObject() : document.createEvent("Events");
      
        if(e.initEvent){
          e.initEvent(type, true, true);
        }

        for (var prop in info) {
            e[prop] = info[prop];
        }
    }

    return e;
}

utils.runInPage = function (script) {
    if (actionPluginPlatform === "firefox") {
        var th = document.body;
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.innerHTML = script;
        th.appendChild(s);
        return;
    }
    window.location = "javascript:" + script;
};