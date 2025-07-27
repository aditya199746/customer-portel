// packages/apps/mf-account-overview/src/bootstrap.tsx
import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import AccountOverview from "./App";

interface AccountOverviewProps {
  customerIdRaw: string;
  accountId: string;
  accountIdFilter: string;
  customerId: string;
}

const client = new ApolloClient({
  uri: "http://localhost:4001/graphql",
  cache: new InMemoryCache(),
});

export default function Bootstrap(props: AccountOverviewProps) {
  return (
    <ApolloProvider client={client}>
      <AccountOverview {...props} />
    </ApolloProvider>
  );
}
