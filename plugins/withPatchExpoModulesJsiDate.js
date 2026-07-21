const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('expo/config-plugins');

const BROKEN =
  'guard milliseconds.isFinite, abs(milliseconds) <= maxJavaScriptDateMilliseconds else {';

const FIXED = `guard milliseconds.isFinite,
    milliseconds >= -maxJavaScriptDateMilliseconds,
    milliseconds <= maxJavaScriptDateMilliseconds else {`;

/**
 * Xcode toolchains can fail to type-check abs(Double) in expo-modules-jsi.
 * Patch during prebuild so `expo run:ios` works even without a fresh npm install.
 */
function withPatchExpoModulesJsiDate(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const target = path.join(
        config.modRequest.projectRoot,
        'node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI/Coding/JavaScriptCodable+Date.swift'
      );

      if (!fs.existsSync(target)) {
        return config;
      }

      const source = fs.readFileSync(target, 'utf8');
      if (!source.includes(BROKEN)) {
        return config;
      }

      fs.writeFileSync(target, source.replace(BROKEN, FIXED));
      return config;
    },
  ]);
}

module.exports = withPatchExpoModulesJsiDate;
