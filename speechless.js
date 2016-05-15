setInterval(function () {
    if (docs.hasSelection()) {
        docs.getSelection(function (text) {
            $("#docs-notice").text(text.split(' ').length + " words");
        }, true, false);
    }
}, 5000);