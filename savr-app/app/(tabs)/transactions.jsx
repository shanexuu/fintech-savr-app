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
          containerStyle="mb-4 px-4"
          modalTitle="Your Budget 💸"
          modalContent={
            'Setting a budget not only allows you to keep track of your hand-earned pennies but also brings to life a lot of features we have to offer.\n\n' +
            'Here, you can set up budgets for your income and expenses and track spending against them.'
          }
        />

        <View className="flex flex-row justify-between items-center">
          <TransactionList />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Transactions
