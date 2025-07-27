module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    "react-native-reanimated/plugin",
    ["babel-plugin-react-native-web", { commonjs: true }]
  ]
};
