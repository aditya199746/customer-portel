// packages/apps/mf-account-overview/src/bootstrap.tsx
import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import TransactionHistory from './App';

interface AccountOverviewProps{
  accountId: string
}

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql', cache: new InMemoryCache()
});

export default function Bootstrap(props: AccountOverviewProps) {
  return (
    <ApolloProvider client={client}>
      <TransactionHistory {...props} />
    </ApolloProvider>
  );
}
