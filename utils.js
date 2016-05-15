var utils = {};

utils.getStorageItem = function (c_name, defaultValue, isBool) {
    var item = localStorage.getItem(c_name);
    if (item !== null) return isBool ? (unescape(item).toLowerCase() === "true") : unescape(item);
    
    return defaultValue;
};

//Thanks! http://stackoverflow.com/questions/5391628/javascript-multiline-string
utils.funcString = function(func) {var matches = func.toString().match(/function\s*\(\)\s*\{\s*\/\*\!?\s*([\s\S]+?)\s*\*\/\s*\}/);if (!matches){ return false; }return matches[1];};

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

utils.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

utils.notify = function (title, actionText, actionCallback, time) {
    if (typeof time === "undefined") time = 2100;

    var notifyBox = $("<div></div>", { "id": "action-notify-box" }).attr("is-hovered", false)
        .append($("<p></p>").text(title))
        .append($("<p></p>", { "class": "action-close-notify-button" }).text("+").click(function () {
            $("#action-notify-box").remove();
        }));

    if (actionText !== false) {
        notifyBox.append($("<a>" + actionText + "</a>", { "class": "action-notify-action" }).click(function () {
            notifyBox.fadeOut();
            actionCallback();
        }));
    }

    $("#action-notify-box").stop().remove();

    notifyBox.hide();
    $("body").append(notifyBox);
    notifyBox.fadeIn();
    
    if (time === false) {
        return;
    }
    
    notifyBox.hover(function () {
        notifyBox.stop().css("opacity", 1);
        notifyBox.attr("is-hovered", true);
        clearTimeout(timeout);
    }, function () {
        notifyBox.attr("is-hovered", false);
        timeout = setTimeout(tryRemove, time);
    });
    
    function tryRemove() {
        if (notifyBox.attr("is-hovered").toLowerCase() === "true") {
            notifyBox.attr("do-remove", true);
            return;
        }
        notifyBox.fadeOut(function () {
            notifyBox.remove();
        });
    }

    var timeout = setTimeout(tryRemove, time);
}

utils.ask = function (title, prompt, choices, callback) {
    var promptBox = $("<div></div>", { "id": "action-prompt-box" })
                        .append($("<h1></h1>").text(title))
                        .append($("<p></p>").text(prompt))
                        .append($("<ul></ul>"));

    for (var choice in choices) {
        promptBox.find("ul").append($("<li></li>", { "class": "blue action-button" }).attr("data-value", choices[choice]).text(choice).click(function () {
            $("#action-prompt-box").fadeOut(function () {
                $(this).remove();
            });
            callback($(this).attr("data-value"));
        }));
    }

    $("#action-prompt-box").stop().remove();

    promptBox.hide();
    $("body").append(promptBox);
    promptBox.fadeIn();
}

// Runs each "step" method on an object in sequence, with no arguments
utils.recipe = function (obj, steps) {
    for (var i = 0; i < steps.length; i++) {
        obj[steps[i]]();
    }
};

utils.imageDatas = {
    "cog.black": action.urlRoot + "/Content/Images/Addon/Misc/1.0.582/cog.black.png",
    "checkmark.blue": action.urlRoot + "/Content/Images/Addon/Misc/1.0.582/checkmark.blue.png",
    "checkmark.white": action.urlRoot + "/Content/Images/Addon/Misc/1.0.582/checkmark.white.png",
    "logo.white": action.urlRoot + "/Content/Images/Addon/Misc/1.0.582/logo.white.png",
    "logo.blue": action.urlRoot + "/Content/Images/Addon/Misc/1.0.582/logo.blue.png",
    //CC-BY Calendar icon by Flaticon http://www.flaticon.com/authors/simpleicon
    "calendar.dark": action.urlRoot + "/Content/Images/Addon/Misc/1.0.582/calendar.dark.png",
    "expand": action.urlRoot + "/Content/Images/Addon/Misc/1.0.667/expand.png",
    "minimize": action.urlRoot + "/Content/Images/Addon/Misc/1.0.667/minimize.png",

    "checkbox.unchecked": action.urlRoot + "/Content/Images/Addon/Misc/1.0.736/checkbox.unchecked.grey.png",
    "checkbox.checked": action.urlRoot + "/Content/Images/Addon/Misc/1.0.736/checkbox.checked.grey.png"
};

utils.replaceWithResources = function (dictionary) {
    if (actionPluginPlatform === "userscript") return;
    
    for (var prop in dictionary) {
        if (typeof dictionary[prop] === "string" && dictionary[prop].indexOf(action.urlRoot + "/Content/Images/Addon") === 0) {
            var secondHalf = dictionary[prop].split(action.urlRoot + "/Content/Images/Addon/")[1];
            
            switch (actionPluginPlatform) {
                case "chrome":
                    dictionary[prop] = chrome.extension.getURL("data/images/mirror/" + secondHalf);
                    break;
                case "firefox":
                    dictionary[prop] = self.options.imageURLs[secondHalf];
                    break;
            }
        }
    }
};

utils.replaceWithResources(utils.imageDatas);

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

//Thanks! https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
utils.rgb2hex = function(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}