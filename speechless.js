var wordsPerMinute = 120;

function refresh() {
    if (docs.hasSelection()) {
        docs.getSelection(function (textEl) {
            var text = "";
            // Slightly sketch way of doing this
            $(textEl).children().each(function () {
                text = text.trim() + " " + $(this).text().trim();
            });
            text = text.trim().replace("\n", " ");

            var words = text.split(' ').length;
            var minutes = words / wordsPerMinute;

            var time = moment().add(minutes, "minutes").fromNow();

            $("#docs-notice").text(words + " words, " + time + "");
        }, true, true);
    } else {
        $("#docs-notice").text("");
    }
}

$("body").on("mouseup", ".kix-appview-editor", function (e) {
    if (e.which !== 1) return;

    refresh();
});

$(".docs-texteventtarget-iframe").contents().find("[contenteditable=\"true\"]").keydown(function (e) {
    if (e.keyCode !== 65 || e.ctrlKey != true) return;

    setTimeout(refresh, 100);
});