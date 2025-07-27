import { AppRegistry } from "react-native";
import App from "./App";
import { ScriptManager, Federated } from "@callstack/repack/client";

const ip = "192.168.0.101"; // your actual LAN IP

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const resolveURL = Federated.createURLResolver({
    containers: {
      mf_account_overview: `http://${ip}:3001/[name][ext]`,
      mf_transaction_history: `http://${ip}:3002/[name][ext]`,
    },
  });

  const url = resolveURL(scriptId, caller);
  if (url) return { url };
});

AppRegistry.registerComponent("main", () => App);
