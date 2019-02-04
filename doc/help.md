---
layout: default
title: Help
---

#### Contents
- [What is DicePhrase?](#what-is-dicephrase)
- [Why passphrases instead of passwords?](#why-passphrases-instead-of-passwords)
- [Why use dice?](#why-use-dice)
- [When should I use passphrases?](#when-should-i-use-passphrases)
- [How can I memorize a passphrase?](#how-can-i-memorize-a-passphrase)
- [How many words should I use?](#how-many-words-should-i-use)
- [Are numerals and special characters necessary?](#are-numerals-and-special-characters-necessary)
- [Password manager applications](#password-manager-applications)
- [Help improve DicePhrase](#help-improve-dicephrase)
- [DicePhrase's security design](#dicephrases-security-design)
- [Reporting security vulnerabilities](#reporting-security-vulnerabilities)
- [Support](#support)
- [Copyright and licences](#copyright-and-licences)

---

### What is DicePhrase?

DicePhrase is a browser extension that helps you easily create strong, memorable passphrases, such as `FragrantRenewedAnyoneBakedPossum` or `BazookaClangUnstuckTransferQuoteJokingly`, by rolling six-sided dice to randomly select from a set of 7776 possible words. This system is more unpredictable than picking words on your own or trusting computer-generated randomness.

It's based on best practice techniques for creating passphrases by the [Electronic Frontier Foundation](https://www.eff.org/dice) and security technologist [Micah Lee](https://firstlook.org/theintercept/2015/03/26/passphrases-can-memorize-attackers-cant-guess/).

---

### Why passphrases instead of passwords?

Long, random passphrases are more secure because they're more difficult for an attacker to guess than simple passwords. While `Batman1989` is easily guessed and `&1KJl6a8y$g*01W}i21!MZ` is too hard to remember, random passphrases like `DonutConfinedCurveHurricaneJuggleWidget` are strong and memorable.

Passphrases don't need to be personal to be memorable. Personal things like birthdays, addresses, anniversaries, names, lyrics, books, movies, etc. are not very secret; anyone can find out your address, pet's name, or favourite songs. Picking words randomly ensures your passphrase is unbiased and unpredictable.

---

### Why use dice?

Depending on the threats you're trying to protect against, it may be safer to use dice to create passphrases than to have the computer generate random numbers. Generally, the main threat of concern here is random number generation software with flaws in its implementation that cause predictable output. The output may *look* completely random to you, but can potentially be predictable in some way. You wouldn't want people to predict your passphrase, right?

The complex systems that computers use for creating randomness are more prone to errors and hacking than physical dice, and even the best software can still have undiscovered bugs in its code. There are numerous [examples](https://blog.cryptographyengineering.com/2013/09/18/the-many-flaws-of-dualecdrbg/) of [weaknesses](https://bugs.chromium.org/p/chromium/issues/detail?id=552749) and [fatal](http://www.theregister.co.uk/2013/08/12/android_bug_batters_bitcoin_wallets/) [flaws](https://www.wired.com/2017/02/russians-engineer-brilliant-slot-machine-cheat-casinos-no-fix/) in computer-based random number generators, whereas dice are a more reliable and transparent source of true randomness.

Dice can be purchased at toy stores, dollar stores, or online from the [Electronic Frontier Foundation](https://supporters.eff.org/shop/eff-passphrase-dice) or [eBay](https://www.ebay.com). You can also make your own dice out of materials like clay or wood. Rolling multiple dice at once can make passphrase generation quicker.

If you don't need this high level of unpredictability for your passphrases, DicePhrase can generate cryptographically secure pseudo-random numbers without dice when you click "Skip" in the main popup window. However, cryptographically secure pseudo-randomness is still not truly random, so using dice is recommended for making the most secure passphrases.

Under no circumstances should you try to input random numbers into the dice roll text box by "bashing the keyboard" or using your own mind to think up numbers. Keyboard layouts and human minds have too much bias to be random, as both will undoubtedly favour some numbers over others. Either roll real dice or let the computer automatically generate pseudo-random numbers.

---

### When should I use passphrases?

Passphrases are ideal when used to encrypt information. They're perfect as the master password for a [password manager](#password-manager-applications) so you only need to remember a single strong passphrase. They're also great for securing WiFi networks, disk encryption, PGP or SSH encryption keys, and any other encryption system. Use them whenever you need memorable authentication in general.

For online accounts, having strong passphrases is good but may not be enough protection from attackers who use techniques like [phishing](https://en.wikipedia.org/wiki/Phishing) to steal credentials. You should enable [Two-Factor Authentication](https://www.turnon2fa.com/), which adds a second step to the login process, and consider saving unique passphrases for each account in a [password manager](#password-manager-applications).

---

### How can I memorize a passphrase?

Through repetition, you'll quickly remember a passphrase. If necessary, temporarily write it on a piece of paper; then after a few days of repeated use, when confident that you've memorized the passphrase, destroy the paper.

You should save all your passphrases in a [password manager](#password-manager-applications) application so you only need to memorize the master passphrase that unlocks the database, and it's no longer critical for you to remember any of the passphrases contained in the database.

---

### How many words should I use?

The more words in your passphrase, the stronger it is. With each additional word, exponentially more time is needed for an attacker to guess the passphrase.

The table below shows how long it might take an attacker to guess different lengths of passphrases by [brute-force](https://en.wikipedia.org/wiki/Brute-force_attack), a process that involves trying every possible combination of words until the correct passphrase is found.

Number of words | Average brute-force time | Rating
--------------- | ------------------------ | ------
3 or fewer      | Less than 1 second       | Unsafe
4               | 30 minutes               | Unsafe
5               | 5.4 months               | Dubious
6               | 3,505 years              | Safe
7               | 27,255,688 years         | Very safe
8               | 211,940,235,585 years    | Very safe

This example assumes the adversary is capable of one trillion guesses per second, a rate that was [known to be possible](https://www.wired.com/2014/10/snowdens-first-emails-to-poitras/) in 2013 and that will only [become faster](https://theintercept.com/2017/05/11/nyu-accidentally-exposed-military-code-breaking-computer-project-to-entire-internet/) and common to more attackers as technology improves. A 5-word passphrase may take 5.4 months to crack today, but in the future it will take only days and eventually just minutes.

If the adversary can access raw encrypted information, such as a password manager database file or an encrypted disk, he or she can steal a copy of the data and mount an offline brute-force attack, guessing passphrases at top speed with low risk of detection. But if the attacker is trying to access an online resource, such as a website account, the brute-force guessing speed will not only be greatly limited by connecting to a remote server, but the server may also lock out the attacker after too many incorrect password guesses.

If unsure about how many words to use, consider the value of what you're trying to protect, who might want to access it, how capable they are of accessing it, and what the consequences would be if it became compromised.

---

### Are numerals and special characters necessary?

If a passphrase is long enough, such as 6 random words or more, then it may not need numbers or special characters (eg. 0123456789 or ~!@#$%^&*). A long passphrase composed only of words made from alphabetical letters may be strong enough on its own.

Numbers and special characters can make your passphrase less memorable. For example, consider `ChattingImprintPlayroomIllusionKoala` versus `ChattingImprintPlayroom{9167`. Both offer roughly the same level of security, but the first one is easier to memorize.

Sometimes, when using spaces to separate the words, as in `Chatting Imprint Playroom Illusion Koala`, it's still easy to memorize and the spaces may qualify as special characters, depending on the website or service's requirements.

---

### Password manager applications

Password managers keep an encrypted, searchable database of all your passphrases, making it easy to have different passphrases for every website or service. The only passphrase you need to remember is the master one to unlock the database.

Program | Operating systems | Free & open source | Cost
------- | ----------------- | ------------------ | ----
[KeePassX](https://www.keepassx.org/) | Mac, Windows, GNU/Linux | Yes | Free or donation
[MiniKeePass](https://minikeepass.github.io/) | iOS | Yes | Free or donation
[KeePassDroid](http://www.keepassdroid.com/) | Android | Yes | Free or donation
[Password Safe](https://pwsafe.org/) | Windows | Yes | Free or donation
[1Password](https://1password.com/) | Mac, Windows, iOS, Android | No | $

Use a long passphrase as the master password. The master password must be *very* strong, otherwise anyone who manages to access the database file could break into all of your accounts.

Also, make sure to keep backup copies of the database file on separate hard drives in case of computer failure.

---

### Help improve DicePhrase

Anyone is welcome to help build this program. Together, we can make it even better. You can help by:

- Reporting software bugs or suggesting new ideas on the [issue tracker](https://github.com/dicephrase/dicephrase/issues).
- Submitting code changes or fixes.
- Translating it into other languages.
- Auditing the code and [reporting security issues](#reporting-security-vulnerabilities).
- Telling your friends about DicePhrase and/or sharing it with them.

Development happens on the [DicePhrase project](https://github.com/dicephrase/dicephrase) on GitHub. If you don't have a GitHub account, you'll need to sign up for one first. If you'd rather not create an account, you can make contact through [alternate channels](#support).

By submitting code changes, you agree to [licence](#copyright-and-licences) your work under the GNU General Public License, version 3 or later. By submitting documentation changes, you agree to licence your work under the [GNU Free Documentation License](https://www.gnu.org/licenses/fdl.html), version 1.3 or later.

---

### DicePhrase's security design

DicePhrase protects the confidentiality of your passphrases while you create them, preventing a variety of potential threats. However, there are related threats that are outside the scope of DicePhrase that you may need to prevent on your own.

##### DicePhrase guards against these threats
- It's very hard for attackers to guess randomly-generated passphrases. Even if the attackers know personal information about you, such as your address or pet's name, it won't help them crack randomly-generated passphrases.
- If the software random number generator is faulty, resulting in predictable output, passphrases created by rolling dice will still be unpredictable.
- Nobody who has casual access to your computer can determine how you customize passphrases. Your customization preferences aren't saved.
- Other people looking at your screen won't necessarily see the passphrases you create. Passphrases are concealed from view until you click the Show button. You can also copy a passphrase without seeing it by using the Copy button.
- Sensitive data isn't left lying around after you're done with it. After 10 minutes, tabs containing passphrases close and the clipboard is cleared automatically. (However, the clipboard can't be cleared if you quit the browser prior to the time limit expiring. Also, if the time limit hasn't yet expired and you create another passphrase, the timer will reset back to 10 minutes.)
- DicePhrase uses the minimum browser permissions necessary to do its job. It only has permission to modify data you copy and paste and to use the Alarms API so the clipboard can be cleared automatically after a timer expires. It cannot read the clipboard's contents.
- Your passphrases and dice roll numbers never leave your computer because the extension can't make any network connections. Due to its strict [Content Security Policy](https://developer.chrome.com/extensions/contentSecurityPolicy), DicePhrase is forced to operate completely offline.
- Both the Google and Firefox accounts used for managing DicePhrase on the Chrome Web Store and Mozilla AMO are guarded with two-factor authentication to prevent attackers from accessing the accounts and publishing malicious, backdoored updates to the extension.
- Management of DicePhrase will never be transferred to a malicious third party. Developers sometimes sell ownership of their browser extensions to buyers who later [transform them into adware or malware](http://arstechnica.com/security/2014/01/malware-vendors-buy-chrome-extensions-to-send-adware-filled-updates/), but DicePhrase will not participate in such transfers.

##### DicePhrase doesn't guard against these threats
- It's ultimately your decision where to keep passphrases safe because DicePhrase doesn't save them. A [password manager](#password-manager-applications) is the ideal tool for this. Make sure you keep backup copies of the password manager database file on separate hard drives.
- If malware exists on your computer, it may be sending your passphrases to an attacker. Preventing malware is a broad topic, but here is some [basic introductory advice](https://gist.github.com/grugq/353b6fc9b094d5700c70).
- You might need more than just a strong passphrase to protect online accounts from threats like [phishing](https://en.wikipedia.org/wiki/Phishing). Many websites support [Two-Factor Authentication](https://www.turnon2fa.com/), which adds an additional layer of protection.
- If a browser or operating system vulnerability is exploited, DicePhrase could be affected too because extensions are dependent on the browser and OS for security. Always keep your browser and OS updated to the latest versions.
- DicePhrase can't prevent you from trying to input random numbers by "bashing the keyboard" or using your mind to think up numbers. This is not very random, you should roll real dice instead.
- DicePhrase's feature for generating random numbers without dice is not guaranteed to be secure because it depends on the computer's ability to generate pseudo-randomness. DicePhrase uses the browser's cryptographically secure [pseudo-random number generator](https://developer.mozilla.org/en/docs/Web/API/RandomSource/getRandomValues), but due to the complexity in how computers generate randomness, that generator could still be faulty. Instead, you should roll real dice to ensure total unpredictability.
- Because the cryptographic signing keys for Chrome and Firefox extensions on the Chrome Web Store and AMO are controlled by Google and Mozilla, if an attacker obtained these keys from Google or Mozilla then they could be used to serve malicious DicePhrase updates to you. The likelihood of this happening is low.

If you need security beyond this design, then you should create passphrases offline by printing the [word list](https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt) on paper and rolling dice to look up words manually instead of using DicePhrase.

---

### Reporting security vulnerabilities

To help ensure DicePhrase remains as safe as possible for users, you're encouraged to audit its [code](https://github.com/dicephrase/dicephrase) for undiscovered security issues. Vulnerabilities of interest include anything that affects the confidentiality or integrity of user-generated passphrases, as well as anything that affects DicePhrase's ability to guard against [specific threats](#dicephrase-guards-against-these-threats), excluding the categories of [other threats](#dicephrase-doesnt-guard-against-these-threats) that DicePhrase doesn't guard against.

If you find a security vulnerability, please report it by sending detailed information on how to reproduce it [here](https://www.lucaspetter.com/contact/), preferably using encrypted messaging. Please consider allowing up to 90 days for the vulnerability to be fixed before publicly discussing it.

---

### Support

If you need assistance with DicePhrase and your issue wasn't resolved by reading this help document, you can get in touch [here](https://www.lucaspetter.com/contact/) or on [Twitter](https://twitter.com/lucasbpetter).

---

### Copyright and licences

DicePhrase is copyright © 2019 [Lucas Bleackley Petter](https://www.lucaspetter.com/).

This program is free software: you can redistribute it and/or modify it under the terms of the [GNU General Public License](https://www.gnu.org/licenses/gpl.html) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

Permission is also granted to copy, distribute and/or modify DicePhrase's documentation under the terms of the [GNU Free Documentation License](https://www.gnu.org/licenses/fdl.html), Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. A copy of the license is included in the section entitled "GNU Free Documentation License".

The full text of both licences is bundled with DicePhrase [here](../../LICENSE.txt).

#### Credit to third-party software used in DicePhrase
- [Bootstrap](https://getbootstrap.com/) is copyright © 2011-2016 Twitter, Inc., licenced under the [MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE).
- "external-link-ltr-icon.svg" is part of [MediaWiki](https://www.mediawiki.org/), copyright © 2016 MediaWiki collaborators, licenced under the [GNU GPL 2.0](https://www.mediawiki.org/wiki/Download) licence.
- [Font Awesome](http://fontawesome.io/) is copyright © 2016 Dave Gandy, licenced under the [MIT and SIL OFL 1.1 Licenses](http://fontawesome.io/license/).
- The [Long Wordlist](https://www.eff.org/dice) is copyright © 2016 Electronic Frontier Foundation, licenced under the [Creative Commons Attribution 3.0](https://www.eff.org/copyright) licence.
- [Modernizr](https://modernizr.com/) is copyright © 2016 Modernizr collaborators, licenced under the [MIT License](https://github.com/Modernizr/Modernizr/blob/master/readme.md).
- [OpenWireless](https://github.com/efforg/OpenWireless/) is copyright © 2014 Electronic Frontier Foundation and other contributors, licenced under the [Apache 2.0](https://github.com/EFForg/OpenWireless/blob/master/LICENSE) licence.
