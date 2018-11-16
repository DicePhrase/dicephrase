#!/bin/sh

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
	echo "The Jekyll build is done."
else
	fail "Jekyll is required but it's not installed. To install Jekyll, see https://jekyllrb.com/."
fi

# List files that contain version numbers.
echo "These files may contain version numbers that need to be manually updated for a new release:"
grep -irlE --exclude="*.svg" --exclude-dir="fw" --exclude-dir=".git" "version.+[0-9]" ./ || fail

echo "The build completed successfully."
exit 0
