#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APK_DIR="$SCRIPT_DIR/apk"
PACKAGE="com.gamesworkshop.w40k"
APKEEP="${APKEEP:-apkeep}"

mkdir -p "$APK_DIR"

echo "Downloading $PACKAGE from Google Play..."
"$APKEEP" -a "$PACKAGE" "$APK_DIR"

# Show what was downloaded
echo ""
echo "Downloaded files:"
ls -lh "$APK_DIR"/*.apk 2>/dev/null || ls -lh "$APK_DIR"/*.xapk 2>/dev/null || echo "No APK files found in $APK_DIR"
