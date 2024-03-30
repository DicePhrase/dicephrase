"use strict";

// Define variables.
var diceNumbers;

// Add event listeners.
chrome.runtime.onMessage.addListener(receiveDiceNumbers);
chrome.alarms.onAlarm.addListener(function(alarm) { clearClipboard(); });

function receiveDiceNumbers(request, sender, sendResponse) {
	// Receive the dice numbers from popup.html and open results.html in a new tab.
	diceNumbers = request.diceNumbers;
	sendResponse({ data: "received" });
	var resultsWindow = chrome.tabs.create({ url: "results.html" });
	// When the new tab has completed loading, start sending the dice numbers.
	chrome.tabs.onUpdated.addListener(function (tabId, tabInfo) {
	  if (tabInfo.status === "complete") {
			sendDiceNumbers();
		}
	});
	request = null;
}

function sendDiceNumbers() {
	// Send the dice numbers to results.html.
	if (diceNumbers) {
		var send = chrome.runtime.sendMessage({ diceNumbers: diceNumbers },
			function(response) {
				// Ensure the dice numbers were received on the results page.
				if (response.data === "received") {
					// Clear the clipboard after a time limit for security purposes.
					chrome.alarms.create("clearClipboard", { delayInMinutes: 10.0 });
					// Clear out dice numbers for security.
					diceNumbers = null;
				}
			}
		)
	}
}

async function clearClipboard() {
	// Open offscreen page to clear the clipboard.
  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL("offscreen-copy.html"),
    reasons: ["CLIPBOARD"],
    justification: "Required by Chrome to copy text."
  });
}
