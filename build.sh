#!/bin/bash

# Fail and exit.
fail () {
	echo >&2 "$@"
	echo >&2 "The build has failed."
	exit 1
}

# Check if Jekyll is installed. If so, build the documentation.
echo "Building the documentation with Jekyll..."
if command -v jekyll 2>/dev/null; then
	# Jekyll is installed.
	jekyll clean --source ./doc --destination ./doc/_site || fail "`jekyll clean` failed."
	jekyll build --source ./doc --destination ./doc/_site || fail "`jekyll build` failed."
	echo "Done building documentation."
else
	fail "Jekyll is required but is not installed. To install Jekyll, see https://jekyllrb.com/."
fi

# Prepare package files for Chrome and Firefox in /pkg.
echo "Preparing package files..."
rm -rf pkg
mkdir -p pkg/chrome pkg/firefox
rsync -r --exclude "pkg" --exclude ".git*" --exclude "package-lock.json" --exclude "node_modules" --exclude "event-page.html" --exclude "js/event-page.js" ./ pkg/chrome/
rsync -r --exclude "pkg" --exclude ".git*" --exclude "package-lock.json" --exclude "node_modules" --exclude "offscreen-copy.html" --exclude "js/offscreen-copy.js" --exclude "js/service-worker.js" ./ pkg/firefox/

# Edit manifest.json for Chrome compatibility, including:
# - Remove "page" property from "background" object, Chrome doesn't support it, and only supports "service_worker".
#   https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/basics
echo "Editing manifest.json for Chrome compatibility..."
# Remove %chrome-only% tags.
sed -i 's/\(%chrome-only%\|%end-chrome-only%\)//g' pkg/chrome/manifest.json
# Remove data between %firefox-only% tags.
sed -zi 's/%firefox-only%[^%]*%end-firefox-only%//g' pkg/chrome/manifest.json
echo "Done editing manifest.json for Chrome compatibility."

# Edit manifest.json for Firefox compatibility, including:
# - Remove "offline_enabled" property, Firefox doesn't support it.
#   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/offline_enabled
# - Remove "minimum_chrome_version" property, which isn't relevant to Firefox.
# - Remove "sandbox" values from "extension_pages" property. Mozilla requested its removal during review on Dec 23, 2019.
# - Remove "sandbox" property of "content_security_policy" object, Firefox doesn't support it.
#   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
# - Remove "sandbox" object, Firefox doesn't support it.
#   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
# - Change "incognito" property value, Firefox only supports "spanning" value.
#   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/incognito
# - Remove "service_worker" property from "background" object, Firefox doesn't support it, and only supports "page".
#   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
# - Remove "offscreen" permissions property, Firefox doesn't support it.
#   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
echo "Editing manifest.json for Firefox compatibility..."
# Remove %firefox-only% tags.
sed -i 's/\(%firefox-only%\|%end-firefox-only%\)//g' pkg/firefox/manifest.json
# Remove data between %chrome-only% tags.
sed -zi 's/%chrome-only%[^%]*%end-chrome-only%//g' pkg/firefox/manifest.json
echo "Done editing manifest.json for Firefox compatibility."

# Package Chrome extension.
echo "Packaging Chrome extension..."
pushd pkg/chrome
zip -r ../dicephrase-chrome.zip ./
popd
echo "Done packaging Chrome extension."
# Package Firefox extension.
echo "Packaging Firefox extension..."
if command -v web-ext 2>/dev/null; then
	web-ext build --source-dir pkg/firefox --artifacts-dir pkg
	echo "Done packaging Firefox extension."
else
	fail "Web-ext is required but is not installed. To install web-ext, see https://www.npmjs.com/package/web-ext."
fi
echo "Done packaging."

# List files that contain version numbers.
echo "These files may contain version numbers that need to be manually updated for a new release:"
grep -irlE --exclude="*.svg" --exclude-dir="fw" --exclude-dir=".git" --exclude-dir="pkg" "version.+[0-9]" ./ || fail

echo "The build completed successfully."
exit 0
