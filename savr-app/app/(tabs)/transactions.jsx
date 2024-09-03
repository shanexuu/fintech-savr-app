import { View, Text, FlatList, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TransactionList } from '../../components'

const Transactions = () => {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="h-full flex-1 bg-white"
    >
      <TransactionList itemsToShow="20" />
    </SafeAreaView>
  )
}

export default Transactions
