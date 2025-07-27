const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("../../package.json").dependencies;

module.exports = (env, argv) => ({
  mode: argv.mode || "development",
  entry: "./src/index.tsx",

  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
  },

  resolve: {
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".web.js", ".js"],
    alias: {
      "react-native$": "react-native-web",
    },
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              [
                "@babel/preset-typescript",
                { isTSX: true, allExtensions: true },
              ],
            ],
            plugins: [["babel-plugin-react-native-web", { commonjs: true }]],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },

  devServer: {
    port: 3002,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "mf_transaction_history",
      filename: "remoteEntry.js",
      exposes: {
        "./bootstrap": "./src/bootstrap.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        "react-native-web": { singleton: true },
        "@apollo/client": { singleton: true },
        graphql: { singleton: true, requiredVersion: deps.graphql },
        "ui-kit": { singleton: true },
        "event-bus": { singleton: true },
        "graphql-tag": { singleton: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Account Transaction MF",
    }),
  ],
});
