// customer-portal/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-env",
      "@babel/preset-react",
      ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
    ],
    plugins: [
      "react-native-worklets/plugin",
      ["babel-plugin-react-native-web", { commonjs: true }]
    ],
  };
};
