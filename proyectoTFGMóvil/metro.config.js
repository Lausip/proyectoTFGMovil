/* istanbul ignore next */
const { getDefaultConfig } = require("@expo/metro-config");
/* istanbul ignore next */
const defaultConfig = getDefaultConfig(__dirname);
/* istanbul ignore next */
defaultConfig.resolver.assetExts.push("cjs");
/* istanbul ignore next */
module.exports = defaultConfig;