import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useQuery, gql } from "@apollo/client";
import { Card, Button } from "ui-kit";
import { EventBus, EVENTS } from "event-bus";

const GET_ACCOUNT_DATA = gql`
  query GetAccountData(
    $customerIdRaw: ID!,
    $accountId: String!,
    $accountIdFilter: ID!,
    $customerId: String!
  ) {
    Customer(id: $customerIdRaw) {
      id
      name
      email
    }
    allAccounts(filter: {
      customerId: $customerId,
      id: $accountIdFilter
    }) {
      id
      accountNumber
      balance
      currency
    }
    allTransactions(
      filter: { accountId: $accountId }
      perPage: 3
      sortField: "date"
      sortOrder: "DESC"
    ) {
      id
      type
      amount
      description
      date
    }
  }
`;

interface Transaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  date: string;
}

interface AccountOverviewProps {
  customerIdRaw: string;
  accountId: string;
  accountIdFilter: string;
  customerId: string;
}

export default function AccountOverview({
  customerIdRaw,
  accountId,
  accountIdFilter,
  customerId
}: AccountOverviewProps) {
  const { data, loading, error } = useQuery(GET_ACCOUNT_DATA, {
    variables: {
      customerIdRaw,
      accountId,
      accountIdFilter,
      customerId
    }
  });

  if (loading) return <Text>Loading account overview...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const customer = data?.Customer;
  const account = data?.allAccounts?.[0];
  const recentTransactions: Transaction[] = data?.allTransactions || [];

  const handleTransactionSelect = (transaction: Transaction) => {
    EventBus.publish(EVENTS.TRANSACTION_SELECTED, {
      transactionId: transaction.id,
      accountId: account?.id,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Overview</Text>

      {customer && (
        <Card style={styles.card}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerEmail}>{customer.email}</Text>
        </Card>
      )}

      {account && (
        <Card style={styles.card}>
          <Text style={styles.accountNumber}>Account: {account.accountNumber}</Text>
          <Text style={styles.balance}>
            Balance: ₹{account.balance.toFixed(2)} {account.currency}
          </Text>
        </Card>
      )}

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.transactionCard}>
            <View style={styles.transactionRow}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>{item.description}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.type === "CREDIT" ? "#22c55e" : "#ef4444" }
                  ]}
                >
                  {item.type === "CREDIT" ? "+" : "-"}₹{Math.abs(item.amount).toFixed(2)}
                </Text>
              </View>
              <Button
                title="View Details"
                onPress={() => handleTransactionSelect(item)}
                variant="secondary"
              />
            </View>
          </Card>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  card: { marginBottom: 16, padding: 12 },
  customerName: { fontSize: 20, fontWeight: "600" },
  customerEmail: { fontSize: 14, color: "#666" },
  accountNumber: { fontSize: 18, fontWeight: "600" },
  balance: { fontSize: 16, marginTop: 8 },
  transactionCard: { marginBottom: 8, padding: 8 },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  transactionInfo: { flex: 1 },
  transactionDesc: { fontSize: 16 },
  transactionDate: { fontSize: 14, color: "#666", marginTop: 4 },
  transactionAmount: { fontSize: 16, fontWeight: "600", marginTop: 4 }
});