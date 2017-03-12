!(function ($, undefined) {
    /// adapted http://jsfiddle.net/drzaus/Hgjfh/5/

    var get_selector = function (element) {
        var pieces = [];

        for (; element && element.tagName !== undefined; element = element.parentNode) {
            if (element.className) {
                var classes = element.className.split(' ');
                for (var i in classes) {
                    if (classes.hasOwnProperty(i) && classes[i]) {
                        pieces.unshift(classes[i]);
                        pieces.unshift('.');
                    }
                }
            }
            if (element.id && !/\s/.test(element.id)) {
                pieces.unshift(element.id);
                pieces.unshift('#');
            }
            pieces.unshift(element.tagName);
            pieces.unshift(' > ');
        }

        return pieces.slice(1).join('');
    };

    $.fn.getSelector = function (only_one) {
        if (true === only_one) {
            return get_selector(this[0]);
        } else {
            return $.map(this, function (el) {
                return get_selector(el);
            });
        }
    };

})(window.jQuery);

// Copy provided text to the clipboard.
function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
};

chrome.extension.sendRequest({
  "action": "getOptions",
  "args": []
}, function(response){ 
    var result = [];
    console.info(deepAutofillChromeExtensionSettings);
    $("input:enabled, select:enabled, textarea:enabled").not(':button,:hidden,input[type=submit],input[readonly]').each(function(){
        var field = {
            "selector": $(this).getSelector().join(" "),
            "random": "A bunch of another random values: {{internet.email}}, {{helpers.createCard}} {{address.secondaryAddress}}",
            "static": "A static value"
        }
        result.push(field);
    });  

    var settings = {};
    settings[deepAutofillChromeExtensionSettings] = {
        "randomLocale" : "de",                      
        "fields" : result
    };
 
    var txt = JSON.stringify(settings, null, "\t").split("\n");
    txt.pop();
    txt.shift();
    copyTextToClipboard(txt.join("\n"));

});  