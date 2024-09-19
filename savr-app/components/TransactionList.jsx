import React from 'react'
import { View, FlatList, Text } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'
import TransactionItem from './TransactionItem'

const formatTransactionDate = (dateString) => {
  const today = new Date()
  const transactionDate = new Date(dateString)

  const isToday = transactionDate.toDateString() === today.toDateString()
  const isYesterday =
    transactionDate.toDateString() ===
    new Date(today.setDate(today.getDate() - 1)).toDateString()

  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'

  return transactionDate.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: 'long', // e.g., "July"
    year: 'numeric',
  })
}

const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const transactionDate = new Date(transaction.created_at).toDateString()
    if (!groups[transactionDate]) {
      groups[transactionDate] = []
    }
    groups[transactionDate].push(transaction)
    return groups
  }, {})
}
const TransactionList = ({ itemsToShow, showDateTitle = true }) => {
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

  const groupedTransactions = groupTransactionsByDate(
    transactionsData?.items?.slice(0, itemsToShow)
  )

  return (
    <FlatList
      data={Object.keys(groupedTransactions)} // Date keys
      renderItem={({ item: dateKey }) => (
        <View>
          {showDateTitle && (
            <Text className="font-bold text-lg">
              {formatTransactionDate(dateKey)}
            </Text>
          )}

          {/* Map through transactions of the same date */}
          {groupedTransactions[dateKey].map((transaction) => (
            <TransactionItem
              key={transaction._id}
              item={transaction}
              accountsData={accountsData}
            />
          ))}
        </View>
      )}
      keyExtractor={(item) => item}
      windowSize={5}
    />
  )
}

export default TransactionList
