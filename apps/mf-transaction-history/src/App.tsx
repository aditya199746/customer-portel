import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Platform, Alert } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { Card, Button } from 'ui-kit';
import { EventBus, EVENTS } from 'event-bus';

const GET_TRANSACTIONS = gql`
  query GetTransactions($accountId: String!) {
    allTransactions(filter: { accountId: $accountId }) {
      id
      type
      amount
      description
      date
    }
  }
`;

interface TransactionHistoryProps {
  accountId: string;
}

export default function TransactionHistory({ accountId }: TransactionHistoryProps) {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const { data, loading, error } = useQuery(GET_TRANSACTIONS, {
  variables: { accountId },
});

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.TRANSACTION_SELECTED,
      (eventData: any) => {
        setSelectedTransactionId(eventData.transactionId);
      }
    );
    return unsubscribe;
  }, []);

  const downloadCSV = () => {
    if (!data?.allTransactions) return;

    const csvContent = [
      'ID,Type,Amount,Description,Date',
      ...data.allTransactions.map((t: any) => 
        `${t.id},${t.type},${t.amount},"${t.description}",${t.date}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareTransactions = () => {
    Alert.alert(
      'Share Transactions',
      'This would open the native share sheet on mobile devices',
      [{ text: 'OK' }]
    );
  };

  if (loading) return <Text>Loading transactions...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const transactions = data?.allTransactions || [];
  const selectedTransaction = transactions.find((t: any) => t.id === selectedTransactionId);

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Transaction History</Text>
        
        {Platform.OS === 'web' ? (
          <Button
            title="Download CSV"
            onPress={downloadCSV}
            variant="secondary"
          />
        ) : (
          <Button
            title="Share"
            onPress={shareTransactions}
            variant="secondary"
          />
        )}
      </View>

      {selectedTransaction && (
        <Card style={{ backgroundColor: '#e3f2fd', borderColor: '#2196f3' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
            Selected Transaction Details
          </Text>
          <Text>ID: {selectedTransaction.id}</Text>
          <Text>Type: {selectedTransaction.type}</Text>
          <Text>Amount: ₹{selectedTransaction.amount.toFixed(2)}</Text>
          <Text>Description: {selectedTransaction.description}</Text>
          <Text>Date: {selectedTransaction.date}</Text>
        </Card>
      )}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={selectedTransactionId === item.id ? { borderColor: '#2196f3', borderWidth: 2 } : {}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16 }}>{item.description}</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  ID: {item.id} | {item.date}
                </Text>
                <Text style={{ 
                  fontSize: 16,
                  fontWeight: '600',
                  color: item.type === 'CREDIT' ? '#22c55e' : '#ef4444'
                }}>
                  {item.type === 'CREDIT' ? '+' : '-'}₹{Math.abs(item.amount).toFixed(2)}
                </Text>
              </View>
            </View>
          </Card>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}
