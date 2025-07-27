import path from "path";
import { fileURLToPath } from "url";
import * as Repack from "@callstack/repack";

// 🛠 Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Import ModuleFederationPlugin dynamically for ESM
const ModuleFederationPlugin = (
  await import("webpack/lib/container/ModuleFederationPlugin.js")
).default;

export default {
  ...Repack.defaultConfig,
  context: __dirname,
  entry: path.resolve(__dirname, "src/index.ts"),

  output: {
    uniqueName: "host-native-new",
    publicPath: "auto",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".mjs"],
    alias: {
      "react-native$": "react-native-web",
    },
    fullySpecified: false,
  },

  module: {
    rules: [
      {
        test: /\.m?js$/, // FIX 1: parse modern .mjs as JS
        type: "javascript/auto",
      },
      {
        test: /\.m?js$/, // FIX 2: disable strict ESM "fullySpecified" mode
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      // ✅ Main TS/JS loader
      {
        test: /\.[jt]sx?$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "../../node_modules/@callstack/repack"),
        ],
        use: {
          loader: "babel-loader",
          options: {
            sourceType: "module",
            presets: [
              "@babel/preset-env",
              "@babel/preset-typescript",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: [
              "react-native-worklets/plugin",
              ["babel-plugin-react-native-web", { commonjs: true }],
            ], // ✅ Reanimated → Worklets
          },
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host_native_new",
      remotes: {
        mf_account_overview: "mf_account_overview@dynamic",
        mf_transaction_history: "mf_transaction_history@dynamic",
      },
      shared: {
        react: { singleton: true, eager: true },
        "react-native": { singleton: true, eager: true },
        "react-native-web": { singleton: true, eager: true },
      },
    }),
  ],
  devServer: {
  static: path.join(__dirname, "public"), // or wherever index.html is
  port: 8080,
  hot: true,
  historyApiFallback: true,
  allowedHosts: "all", // for LAN access
},
};
