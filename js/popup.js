"use strict";

// Define variables.
var inputForm = document.getElementById("inputForm");
var wordCountTextbox = document.getElementById("wordCountTextbox");
var diceRollsNeededText = document.getElementById("diceRollsNeededText");
var diceRollInputSection = document.getElementById("diceRollInputSection");
var diceRollTextbox = document.getElementById("diceRollTextbox");
var diceRollsRemainingText = document.getElementById("diceRollsRemainingText");
var skipButton = document.getElementById("skipButton");
var continueButton = document.getElementById("continueButton");

// Add event listeners.
window.addEventListener("beforeunload", function() { exitCleanup(); }, false);
inputForm.addEventListener("submit", function(event) { displayPassphrase(); event.preventDefault(); }, false);
skipButton.addEventListener("click", function() { skipRollingDice(); }, false);
wordCountTextbox.addEventListener("change", function() { calculateDiceRollsNeeded(this.value); calculateDiceRollsRemaining(); }, false);
diceRollTextbox.addEventListener("input", function() { allowOnlyDiceNumbers(this.value); calculateDiceRollsRemaining(); }, false);

function calculateDiceRollsNeeded(numberOfWords) {
	// Calculate how many dice rolls are needed based on the desired number of passphrase words.
	if ((isNaN(numberOfWords) === false) && (numberOfWords !== "")) {
		diceRollsNeededText.innerText = numberOfWords * 5;
	}
}

function allowOnlyDiceNumbers(textInput) {
	// When the user types into the text box, prevent anything other than numbers 1-6 from being entered.
	diceRollTextbox.value = textInput.replace(/[^1-6]+/g, "");
}

function calculateDiceRollsRemaining() {
	// Calculate how many dice rolls are remaining for the user to type based on the number of rolls needed.
	// Display the result beside the dice roll textbox.
	var diceRollsNeeded = diceRollsNeededText.innerText;
	if (diceRollTextbox.value.length === 0) {
		// User hasn't entered any dice rolls.
		diceRollsRemainingText.innerText = "";
		continueButton.disabled = true;
		diceRollTextbox.disabled = false;
		return false;
	} else if (diceRollTextbox.value.length < diceRollsNeeded) {
		// User still has more rolls to do.
		diceRollsRemainingText.innerText = (diceRollsNeeded - diceRollTextbox.value.length) + " remaining";
		continueButton.disabled = true;
		diceRollTextbox.disabled = false;
		return false;
	} else if (diceRollTextbox.value.length > diceRollsNeeded) {
		// There are more rolls than necessary, remove the extra ones.
		diceRollTextbox.value = diceRollTextbox.value.substring(0, diceRollsNeeded);
	}
	if (diceRollTextbox.value.length == diceRollsNeeded) {
		// User has entered the required amount of dice roll numbers.
		diceRollsRemainingText.innerHTML = "<span class='fa fa-check' aria-hidden='true'></span>";
		diceRollTextbox.disabled = true;
		diceRollTextbox.blur();
		continueButton.disabled = false;
		continueButton.focus();
		return true;
	}
}

function skipRollingDice() {
	// If the user chose to skip rolling dice, then run the PRNG, put the output in the textbox, and display the passphrase.
	putRandomNumbersInTextbox(1, 6, 5, "diceRollTextbox");
	displayPassphrase();
}

function displayPassphrase() {
	// Re-run the calculation for remaining dice rolls.
	if (calculateDiceRollsRemaining()) {
		// Pass the dice numbers to the event page.
		var send = chrome.runtime.sendMessage({ diceNumbers: diceRollTextbox.value },
			function(response) {
				// Ensure the dice numbers were received on the event page before closing this popup.
				if (response.data === "received") {
					window.close();
				}
			}
		);
	}
}

function exitCleanup() {
	// Clear out sensitive data when exiting the page.
	diceRollTextbox.value = null;
	wordCountTextbox.value = 6;
}
