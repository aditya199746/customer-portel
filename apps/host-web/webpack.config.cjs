const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("../../package.json").dependencies;

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    mode: argv.mode || isDevelopment,
    entry: "./src/index.tsx",

    output: {
      publicPath: "auto",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },

    resolve: {
      fallback: {
        fs: false,
        os: false,
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util/"),
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
        process: require.resolve("process/browser"),
      },
      extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".web.js", ".js"],
      alias: {
        "react-native$": "react-native-web",
        "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$":
          "react-native-web/dist/vendor/react-native/NativeEventEmitter",
        "react-native/Libraries/vendor/emitter/EventEmitter$":
          "react-native-web/dist/vendor/react-native/emitter/EventEmitter",
        "react-native/Libraries/EventEmitter/NativeEventEmitter$":
          "react-native-web/dist/vendor/react-native/NativeEventEmitter",
      },
    },

    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },

    module: {
      rules: [
        // ✅ Disable source-map-loader (fixes "interface is reserved")
        {
          test: /\.js$/,
          enforce: "pre",
          use: [],
          exclude: /.*/, // disables all pre-processing like source-map-loader
        },
        // ✅ TSX/TS support for all MFs
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "../mf-account-overview/src"),
            path.resolve(__dirname, "../mf-transaction-history/src"),
          ],
          use: {
            loader: "babel-loader",
            options: {
              sourceType: "unambiguous",
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
              plugins: [["babel-plugin-react-native-web", { commonjs: true }]],
            },
          },
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: "asset/resource",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "host_web",
        remotes: {
          mf_account_overview:
            "mf_account_overview@http://localhost:3001/remoteEntry.js",
          mf_transaction_history:
            "mf_transaction_history@http://localhost:3002/remoteEntry.js",
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
        title: "Customer Portal",
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ],

    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },

    experiments: {
      topLevelAwait: true, // just in case required by remote MFs
    },
  };
};
