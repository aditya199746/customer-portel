import React, { Suspense } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Federated } from "@callstack/repack/client";

// ✅ Lazy load micro frontends from Module Federation
const AccountOverview = React.lazy(() =>
  Federated.importModule("mf_account_overview", "./App")
);
const TransactionHistory = React.lazy(() =>
  Federated.importModule("mf_transaction_history", "./App")
);

const client = new ApolloClient({
  uri: "http://localhost:4001/graphql",
  cache: new InMemoryCache(),
});

const LoadingFallback = ({ message }: { message: string }) => (
  <View style={styles.loading}>
    <Text>{message}</Text>
  </View>
);

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Text style={styles.header}>Mobile Portal</Text>

        <Suspense fallback={<LoadingFallback message="Loading Account Overview..." />}>
          <AccountOverview
            customerIdRaw="1"
            accountId="1"
            customerId="1"
            accountIdFilter="1"
          />
        </Suspense>

        <Suspense fallback={<LoadingFallback message="Loading Transactions..." />}>
          <TransactionHistory accountId="1" />
        </Suspense>
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  loading: { padding: 20, alignItems: "center" },
});
