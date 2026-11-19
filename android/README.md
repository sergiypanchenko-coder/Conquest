# Conquest for Android

A Trusted Web Activity: the app opens https://conquest-murex.vercel.app/play full screen,
so the game updates with the website and works offline once it has loaded.

The site proves it owns the app with `/.well-known/assetlinks.json`, which lists the
SHA-256 fingerprint of the signing key. Keep that key (`conquest-release.jks`) and its
password safe and out of this repository: every later version of the app must be signed
with the same key.

Build:

    export ANDROID_HOME=/path/to/android-sdk
    export CQ_KEYSTORE=/path/to/conquest-release.jks CQ_KEYSTORE_PASS=...
    gradle assembleRelease

The APK is written to `app/build/outputs/apk/release/app-release.apk`.
Raise `versionCode` in `app/build.gradle` for each new APK.
