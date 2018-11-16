"use strict";

// Define variables.
var resultsWindow;
var diceNumbers;
var clipboardClearTextbox = document.getElementById("clipboardClearTextbox");

// Add event listeners.
window.addEventListener("beforeunload", function() { exitCleanup(); }, false);
chrome.alarms.onAlarm.addListener(function(alarm) { clearClipboard(); });

function createNewTab(numbers) {
	// Receive the dice numbers from popup.html and open results.html in a new tab.
	resultsWindow = window.open("results.html");
	diceNumbers = numbers;
	numbers = null;
}

function sendDiceNumbers() {
	// Send the dice numbers to results.html.
	if (diceNumbers) {
		resultsWindow.loadDiceNumbers(diceNumbers);
		// Clear the clipboard after a time limit for security purposes.
		chrome.alarms.create("clearClipboard", { delayInMinutes: 10.0 });
		// Unload this event page.
		window.close();
	}
}

function clearClipboard() {
	// Clear the clipboard.
	clipboardClearTextbox.focus();
	clipboardClearTextbox.select();
	document.execCommand('copy');
	clipboardClearTextbox.blur();
}

function exitCleanup() {
	// Clear out sensitive data when exiting the page.
	diceNumbers = null;
}
