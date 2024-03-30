"use strict";

// Clear the clipboard.
var clipboardClearTextbox = document.getElementById("clipboardClearTextbox");
clipboardClearTextbox.focus();
clipboardClearTextbox.select();
document.execCommand('copy');
clipboardClearTextbox.blur();
window.close();
