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
          modalTitle="Transaction 💰"
          modalContent={
            'Your transactions are all shown here, including the categoty for each one.\n\n' +
            "If you'd like to allowcate a transaction to a differeent, tap the categoty button."
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
