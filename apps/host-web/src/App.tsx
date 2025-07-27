// import React, { Suspense } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

// const AccountOverview = React.lazy(
//   () => import("mf_account_overview/bootstrap")
// );
// const TransactionHistory = React.lazy(
//   () => import("mf_transaction_history/bootstrap")
// );

// const client = new ApolloClient({
//   uri: "http://localhost:4001/graphql",
//   cache: new InMemoryCache(),
// });

// const LoadingFallback = ({ message }: { message: string }) => (
//   <View style={styles.loading}><Text>{message}</Text></View>
// );

// export default function App() {
//   const props = {
//     customerIdRaw: "1",
//     accountId: "1",
//     accountIdFilter: "1",
//     customerId: "1",
//   };

//   return (
//     <ApolloProvider client={client}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Enterprise Customer Portal</Text>
//         </View>

//         <View style={styles.content}>
//           <View style={styles.section}>
//             <Suspense fallback={<Text>Loading Account Overview…</Text>}>
//               <AccountOverview {...props} />
//             </Suspense>
//           </View>

//           <View style={styles.section}>
//             <Suspense fallback={<Text>Loading Transaction History…</Text>}>
//               <TransactionHistory accountId={props.accountId} />
//             </Suspense>
//           </View>
//         </View>
//       </View>
//     </ApolloProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f5f5f5" },
//   header: {
//     backgroundColor: "#0066cc",
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   title: { color: "#ffffff", fontSize: 24, fontWeight: "700" },
//   content: { flex: 1, flexDirection: "row", padding: 20, gap: 20 },
//   section: { flex: 1 },
//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   loadingText: { fontSize: 16, color: "#666666" },
// });


// apps/host-web/src/App.tsx
import React, { Suspense, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const AccountOverview = React.lazy(() => import('mf_account_overview/bootstrap'));
const TransactionHistory = React.lazy(() => import('mf_transaction_history/bootstrap'));

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});

const LoadingFallback = ({ message }: { message: string }) => (
  <View style={styles.loading}><Text>{message}</Text></View>
);

export default function App() {
  const defaultProps = {
    customerIdRaw: '1',
    accountId: '1',
    accountIdFilter: '1',
    customerId: '1',
  };

  const [mfProps, setMfProps] = useState(defaultProps);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const injected = (window as any).__EXPO_PROPS__;
      if (injected) setMfProps(injected);
      const handler = (e: any) => setMfProps(e.detail);
      window.addEventListener('ExpoProps', handler);
      return () => window.removeEventListener('ExpoProps', handler);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Enterprise Customer Portal</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.section}>
            <Suspense fallback={<LoadingFallback message="Loading Account Overview…" />}>
              <AccountOverview {...mfProps} />
            </Suspense>
          </View>
          <View style={styles.section}>
            <Suspense fallback={<LoadingFallback message="Loading Transaction History…" />}>
              <TransactionHistory accountId={mfProps.accountId} />
            </Suspense>
          </View>
        </View>
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
  },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  content: { flex: 1, flexDirection: 'row', padding: 20, gap: 20 },
  section: { flex: 1 },
  loading: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
});
