"use strict";

// Define variables.
var diceNumbers;
var countdown;
var concealment = true;
var concealmentBullets = "&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;&bullet;";
var wordList = document.getElementById("wordList").innerHTML;
var newPassphraseArea = document.getElementById("newPassphraseArea");
var clipboardCopyTextbox = document.getElementById("clipboardCopyTextbox");
var buttonToggleConceal = document.getElementById("buttonToggleConceal");
var buttonCopy = document.getElementById("buttonCopy");
var checkboxCapitalize = document.getElementById("checkboxCapitalize");
var checkboxSpaces = document.getElementById("checkboxSpaces");
var checkboxSpecialCharacters = document.getElementById("checkboxSpecialCharacters");
var checkboxNumerals = document.getElementById("checkboxNumerals");
var countdownMinutesText = document.getElementById("countdownMinutesText");
var countdownSecondsText = document.getElementById("countdownSecondsText");
var pluralMinutesText = document.getElementById("pluralMinutesText");
var pluralSecondsText = document.getElementById("pluralSecondsText");

// Add event listeners.
window.addEventListener("load", function() { notifyLoaded(); }, false);
window.addEventListener("beforeunload", function() { exitCleanup(); }, false);
buttonToggleConceal.addEventListener("click", function() { toggleConcealPassphrase(); }, false);
buttonCopy.addEventListener("click", function() { copyClipboard(); }, false);
checkboxCapitalize.addEventListener("change", function() { createPassphrase(); }, false);
checkboxSpaces.addEventListener("change", function() { createPassphrase(); }, false);
checkboxSpecialCharacters.addEventListener("change", function() { createPassphrase(); }, false);
checkboxNumerals.addEventListener("change", function() { createPassphrase(); }, false);

function notifyLoaded() {
	// Tell the event page that this page is loaded and ready to receive the dice numbers.
	chrome.runtime.getBackgroundPage(function(eventPage) {
		eventPage.sendDiceNumbers();
	});
}

function loadDiceNumbers(numbers) {
	// Load the dice numbers from the event page into the diceNumbers variable and create the passphrase.
	diceNumbers = numbers;
	createPassphrase();
	numbers = null;
}

function createPassphrase() {
	// Use the dice numbers to create a new passphrase.
	if (diceNumbers) {
		
		// Get the state of the checkboxes.
		var checkedCapitalize = checkboxCapitalize.checked;
		var checkedSpaces = checkboxSpaces.checked;
		var checkedSpecialCharacters = checkboxSpecialCharacters.checked;
		var checkedNumerals = checkboxNumerals.checked;
		
		// Put the dice roll numbers into an array, 5 digits long per unit.
		var diceRollArray = diceNumbers.match(/.{5}/g);
		// Iterate through the number array to get the corresponding words and put the words into their own array.
		var wordArray = [];
		var i;
		for (i = 0; i < diceRollArray.length; i++) {
			wordArray[i] = getWordFromNumber(diceRollArray[i]);
		}
		
		// Iterate through the word array to add capitalization if the option checkbox is checked.
		if (checkedCapitalize === true) {
			for (i = 0; i < wordArray.length; i++) {
				wordArray[i] = wordArray[i].charAt(0).toUpperCase() + wordArray[i].slice(1);
			}
		}
		
		// Iterate through the word array to add spaces if the option checkbox is checked.
		if (checkedSpaces === true) {
			for (i = 0; i < wordArray.length; i++) {
				// Don't add a space after the last word.
				if (i != (wordArray.length - 1)) {
					wordArray[i] = wordArray[i] + " ";
				}
			}
		}
		
		// Combine the word array together to make the passphrase.
		var passphrase = "";
		for (i = 0; i < wordArray.length; i++) {
			passphrase += wordArray[i];
		}
		
		// Add a random special character if the option checkbox is checked.
		if (checkedSpecialCharacters === true) {
			// Add a space before the special character if the spaces option checkbox is checked.
			if (checkedSpaces === true) {
				passphrase += " ";
			}
			passphrase += returnRandomSpecialCharacters(1);
		}
		// Add random numerals if the option checkbox is checked.
		if (checkedNumerals === true) {
			// Add a space before the numerals if the spaces option checkbox is checked.
			if (checkedSpaces === true) {
				passphrase += " ";
			}
			passphrase += returnRandomNumbers(0, 9, 4);
		}
		// Show the new passphrase if concealment isn't enabled.
		if (concealment === false) {
			newPassphraseArea.innerText = passphrase;
		}
		// Put the passphrase into the hidden textbox so it can be copied to the clipboard if the user clicks the Copy button.
		clipboardCopyTextbox.value = passphrase;
		diceRollArray = null;
		wordArray = null;
		passphrase = null;
	}
}

function getWordFromNumber(number) {
	// Look up a dice roll number in the Diceware word list to find the corresponding word.
	// Find the line containing the number.
	var regex = new RegExp("\^" + number + "\\t\\S\+\$", "m");
	var wordLine = wordList.match(regex).toString();
	// Find the word in the line.
	var word = wordLine.match(/\S+$/).toString();
	return word;
}

function toggleConcealPassphrase() {
	// Toggle concealment of the passphrase to prevent shoulder surfing. Leave the hidden textbox as-is.
	if (concealment === true) {
		// If the passphrase is concealed, show it by displaying the contents of the hidden textbox.
		newPassphraseArea.innerText = clipboardCopyTextbox.value;
		concealment = false;
		// Change the button from Show to Conceal.
		buttonToggleConceal.innerHTML = "<span class='fa fa-eye-slash'></span> Conceal it";
	} else {
		// If the passphrase is shown, conceal it.
		newPassphraseArea.innerHTML = concealmentBullets;
		concealment = true;
		// Change the button from Conceal to Show.
		buttonToggleConceal.innerHTML = "<span class='fa fa-eye'></span> Show it";
	}
}

function copyClipboard() {
	// Copy the passphrase to the clipboard. To do this, the textbox needs to be un-hidden temporarily.
	clipboardCopyTextbox.className = "";
	clipboardCopyTextbox.focus();
	clipboardCopyTextbox.select();
	document.execCommand('copy');
	clipboardCopyTextbox.blur();
	clipboardCopyTextbox.className = "hidden";
}

// Display a countdown timer.
countdown = setInterval(function(){
	// Subtract time from textbox values.
	if (countdownMinutesText.innerHTML > 0 && countdownSecondsText.innerHTML <= 0) {
		countdownMinutesText.innerHTML--;
		countdownSecondsText.innerHTML = 60;
	}
	countdownSecondsText.innerHTML--;
	// Add preceding "0" if seconds are less than 10.
	if (countdownSecondsText.innerHTML < 10) {
		countdownSecondsText.innerHTML = "0" + countdownSecondsText.innerHTML;
	}
	// Change from plural to singular wording if needed.
	pluralMinutesText.className = "";
	pluralSecondsText.className = "";
	if (countdownMinutesText.innerHTML == 1) {
		pluralMinutesText.className = "hidden";
	}
	if (countdownSecondsText.innerHTML == 1) {
		pluralSecondsText.className = "hidden";
	}
	// If timer is done, stop and close the window for security purposes.
	if (countdownMinutesText.innerHTML <= 0 && countdownSecondsText.innerHTML <= 0) {
		clearInterval(countdown);
		window.close();
	}
}, 1000);

function exitCleanup() {
	// Clear out sensitive data when exiting the page.
	diceNumbers = null;
	newPassphraseArea.innerHTML = concealmentBullets;
	clipboardCopyTextbox.value = "";
}
