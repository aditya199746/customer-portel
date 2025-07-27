const Repack = require("@callstack/repack");

module.exports = {
  entry: "./src/index.ts",
  output: { uniqueName: "host_native_new" },
  plugins: [
    new Repack.plugins.ModuleFederationPluginV2({
      name: "host-native-new",
      remotes: {
        mf_account_overview: "mf_account_overview@dynamic",
        mf_transaction_history: "mf_transaction_history@dynamic"
      },
      shared: {
        react: { singleton: true, eager: true },
        "react-native": { singleton: true, eager: true }
      }
    })
  ]
};
