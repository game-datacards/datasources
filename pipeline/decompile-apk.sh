#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APK_DIR="$SCRIPT_DIR/apk"
OUT_DIR="$SCRIPT_DIR/decompiled"
if [ -n "${JAVA_HOME:-}" ]; then
    export JAVA_HOME
fi

# If an XAPK exists but no APK, extract the base APK from the XAPK bundle
XAPK_FILE=$(find "$APK_DIR" -name "*.xapk" -type f | head -1)
APK_FILE=$(find "$APK_DIR" -name "*.apk" -type f | head -1)

if [ -z "$APK_FILE" ] && [ -n "$XAPK_FILE" ]; then
    echo "Found XAPK bundle: $XAPK_FILE"
    echo "Extracting base APK..."
    unzip -o "$XAPK_FILE" "*.apk" -d "$APK_DIR"
    APK_FILE=$(find "$APK_DIR" -name "com.gamesworkshop.w40k.apk" -type f | head -1)
fi

if [ -z "$APK_FILE" ]; then
    echo "Error: No APK file found in $APK_DIR"
    echo "Run download-apk.sh first."
    exit 1
fi

echo "Decompiling: $APK_FILE"
echo "Output: $OUT_DIR"

# Remove previous decompilation if it exists
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

apktool d "$APK_FILE" -o "$OUT_DIR" -f

echo ""
echo "Decompilation complete."
echo "Contents:"
ls "$OUT_DIR"
