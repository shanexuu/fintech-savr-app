import { View, Text, FlatList, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from '../../components'
import { icons } from '../../constants'

import { TransactionList } from '../../components'

const Transactions = () => {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex "
    >
      <View className="h-full bg-white">
        <Header
          headertext="Transactions"
          icon={icons.Info}
          containerStyle="mb-8 px-4"
        />

        <View className="flex flex-row justify-between items-center">
          <TransactionList />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Transactions
