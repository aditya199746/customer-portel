import React from 'react';
import { View, Text } from 'react-native';
import { EventBus } from 'event-bus';

export default function AccountOverview() {
  return (
    <View>
      <Text onPress={() => EventBus.publish('transaction.select', { id: 2 })}>
        Account Number: 123456
      </Text>
    </View>
  );
}
