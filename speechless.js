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
            var seconds = Math.round((minutes - Math.floor(minutes)) * 60);
            if (seconds.toString().length === 1) {
                seconds = "0" + seconds.toString();
            } else if (seconds.toString().length === 0) {
                seconds = "00";
            }

            var time = Math.floor(minutes) + ":" + seconds;

            $("#docs-notice").text(words + " words, " + time);
        }, true, true);
    } else {
        $("#docs-notice").text("");
    }
}

//Refresh the time-to-speak whenever the user makes a selection or types something
$("body").on("mouseup", ".kix-appview-editor", function (e) {
    if (e.which !== 1) return;
    refresh();
});

$(".docs-texteventtarget-iframe").contents().find("[contenteditable=\"true\"]").keydown(function (e) {
    if ((e.keyCode !== 65 || e.ctrlKey != true) && e.shiftKey != true) return;
    setTimeout(refresh, 100);
});
