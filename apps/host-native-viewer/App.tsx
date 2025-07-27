import React, { useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

const HOST_WEB_URL = "http://192.168.0.101:3000"; // Replace with your actual LAN IP

const propsToSend = {
  customerIdRaw: "1",
  accountId: "1",
  customerId: "1",
  accountIdFilter: "1",
};

export default function App() {
  const webViewRef = useRef<WebView>(null);

  const onLoadEnd = () => {
    const injectedJS = `
      window.dispatchEvent(new CustomEvent('ExpoProps', { detail: ${JSON.stringify(
        propsToSend
      )} }));
      true;
    `;
    webViewRef.current?.injectJavaScript(injectedJS);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Portal (Mobile)</Text>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: HOST_WEB_URL }}
        onLoadEnd={onLoadEnd}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#0066cc",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  webview: { flex: 1 },
});
