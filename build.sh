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
rsync -r --exclude "pkg" --exclude ".git*" ./ pkg/chrome/
rsync -r --exclude "pkg" --exclude ".git*" ./ pkg/firefox/

# Edit manifest.json for Firefox compatibility.
echo "Editing manifest.json for Firefox compatibility..."
# Remove "offline_enabled" key, Firefox doesn't support it.
# https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/offline_enabled
sed -i "/\"offline_enabled\"/d" pkg/firefox/manifest.json
# Remove "sandbox" key, Firefox doesn't support it.
# https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
sed -i '\%"sandbox"%,\%},%d' pkg/firefox/manifest.json
# Change "incognito" key, Firefox only supports "spanning" value.
# https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/incognito
sed -i "s/\"incognito\": \"split\"/\"incognito\": \"spanning\"/" pkg/firefox/manifest.json
# Remove "persistent" property from "background" key, Firefox doesn't support it.
# https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background
sed -i "s/\"page\": \"event-page.html\",/\"page\": \"event-page.html\"/" pkg/firefox/manifest.json
sed -i "/\"persistent\"/d" pkg/firefox/manifest.json
echo "Done editing manifest.json."

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
