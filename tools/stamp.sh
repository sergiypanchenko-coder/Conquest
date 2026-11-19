#!/bin/sh
# Stamp a new version into the game and version.json before every release.
# Installed home-screen apps compare the two and update themselves (see "self-update" in play.html).
set -e
cd "$(dirname "$0")/.."
V=$(date -u +%Y%m%d-%H%M%S)
sed -i.bak "s/const BUILD='[^']*';/const BUILD='$V';/" play.html && rm -f play.html.bak
printf '{"build":"%s"}\n' "$V" > version.json
grep -q "const BUILD='$V';" play.html && echo "stamped $V"
