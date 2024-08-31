import React from 'react'
import { View, FlatList, Text } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'
import TransactionItem from './TransactionItem' // Import the TransactionItem component

const TransactionList = () => {
  // Fetch transactions
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetch('/api/transactions').then((res) => res.json()),
  })

  // Fetch accounts
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
  })

  if (isTransactionsLoading || isAccountsLoading) {
    return <Spinner visible={true} />
  }

  if (transactionsError || accountsError) {
    return (
      <View>
        <Text>Error loading data</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={transactionsData?.items}
      renderItem={({ item }) => (
        <TransactionItem
          item={item}
          accountsData={accountsData}
        />
      )}
      keyExtractor={(item) => item._id}
    />
  )
}

export default TransactionList
