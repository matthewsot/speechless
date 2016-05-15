var wordsPerMinute = 120;
$("body").on("mouseup", ".kix-appview-editor", function (e) {
    if (e.which !== 1) return;

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
});