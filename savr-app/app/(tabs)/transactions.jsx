import { View, Text, FlatList, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TransactionList } from '../../components'

const Transactions = () => {
  return (
    <View className="h-full bg-white">
      <TransactionList itemsToShow="40" />
    </View>
  )
}

export default Transactions
