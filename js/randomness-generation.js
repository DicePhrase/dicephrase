"use strict";

// Functions related to pseudo-random number generation and usage.

// Define variables.
var webCryptoSupported;
var wordCountTextbox = document.getElementById("wordCountTextbox");

// Test for browser support for cryptographically secure window.crypto.getRandomValues and Uint8Array.
// Do lots of tests to be sure these features are supported. Browsers have had implementation issues in past versions, see the link below.
// These tests modified from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/crypto/getrandomvalues.js
if ("crypto" in window && !!window.crypto && "getRandomValues" in window.crypto && "Uint8Array" in window) {
	var testArray = new Uint8Array(1);
	var testValues = window.crypto.getRandomValues(testArray);
	var supportsGetRandomValues = testValues && !isNaN(testValues[0]);
	if (!!supportsGetRandomValues) {
		// The browser supports window.crypto.getRandomValues and Uint8Array.
		webCryptoSupported = true;
	}
}

// If window.crypto.getRandomValues and Uint8Array aren't supported, disable/hide interface features that have the class "requires-window-crypto".
if (!webCryptoSupported) {
	var dependentElements = document.getElementsByClassName("requires-window-crypto");
	for (var i = 0; i < dependentElements.length; i++) {
		dependentElements[i].style.display = "none";
	}
}

function returnRandomNumbers(min, max, desiredLength) {
	// Return a random number X digits long.
	var randomNumber = "";
	for (var i = 0; i < desiredLength; i++) {
		randomNumber += generateRandomInteger(min, (max + 1));
	}
	return randomNumber;
}

function putRandomNumbersInTextbox(min, max, desiredLength, outputArea) {
	// Get sets of random numbers for each word, with each set being <desiredLength> digits long, and append them together into a single number. Put the resulting number into a textbox.
	var randomNumber = "";
	for (var i = 0; i < parseInt(wordCountTextbox.value); i++) {
		randomNumber += returnRandomNumbers(min, max, desiredLength);
	}
	document.getElementById(outputArea).value = randomNumber;
	randomNumber = null;
}

function returnRandomSpecialCharacters(desiredLength) {
	// Return a random set of symbol characters X symbols long.
	var randomCharacters = "";
	var possibleCharacters = "!@#$%^&*()-_=+[]{}\\|;:,.<>/?'\"";
	for (var i = 0; i < desiredLength; i++) {
		randomCharacters += possibleCharacters.charAt(generateRandomInteger(0, possibleCharacters.length));
	}
	return randomCharacters;
}

function generateRandomInteger(min, max) {
	// Generate a single random integer between min (inclusive) and max (exclusive).
	// Use cryptographically secure window.crypto.getRandomValues.
	if (webCryptoSupported === true) {
		// This code modified from https://github.com/EFForg/OpenWireless/blob/master/app/js/diceware.js
		// Relevant info at https://github.com/EFForg/OpenWireless/pull/195
		// and https://stackoverflow.com/questions/18230217/javascript-generate-a-random-number-within-a-range-using-crypto-getrandomvalues
		
		var rval = 0;
		var range = max - min;
		
		var bitsNeeded = Math.ceil(Math.log2(range));
		if (bitsNeeded > 53) {
			console.log("We cannot generate numbers larger than 53 bits.");
			return false;
		}
		var bytesNeeded = Math.ceil(bitsNeeded / 8);
		var mask = Math.pow(2, bitsNeeded) - 1;
		// 7776 -> (2^13 = 8192) -1 == 8191 or 0x00001111 11111111
		
		// Create byte array and fill with N random numbers
		var byteArray = new Uint8Array(bytesNeeded);
		window.crypto.getRandomValues(byteArray);
		
		var p = (bytesNeeded - 1) * 8;
		for(var i = 0; i < bytesNeeded; i++ ) {
			rval += byteArray[i] * Math.pow(2, p);
			p -= 8;
		}
		
		// Use & to apply the mask and reduce the number of recursive lookups
		rval = rval & mask;
		
		if (rval >= range) {
			// Integer out of acceptable range
			return generateRandomInteger(min, max);
		}
		// Return an integer that falls within the range
		return min + rval;
	}
}
