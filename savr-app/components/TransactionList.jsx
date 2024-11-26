import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, Text } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import TransactionItem from './TransactionItem'
import { supabase } from '../utils/SupabaseConfig'
import { useFocusEffect } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'

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
    const transactionDate = new Date(transaction.date).toDateString()
    if (!groups[transactionDate]) {
      groups[transactionDate] = []
    }
    groups[transactionDate].push(transaction)
    return groups
  }, {})
}

const TransactionList = ({ initialItemsToShow = 10, showDateTitle = true }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow) // Items to show initially and incrementally

  const fetchTransactions = async (limit = itemsToShow) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('all_transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching transactions:', error)
        setError('Failed to fetch transactions')
        return
      }

      setTransactions(data)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and refetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions()
    }, [itemsToShow]) // Refetch if itemsToShow changes
  )

  const loadMoreTransactions = () => {
    setItemsToShow((prevItems) => prevItems + initialItemsToShow)
  }

  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
  })

  if (loading) {
    return <Spinner visible={true} />
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    )
  }

  const groupedTransactions = groupTransactionsByDate(
    transactions?.slice(0, itemsToShow)
  )

  return (
    <FlatList
      data={Object.keys(groupedTransactions)} // Date keys
      renderItem={({ item: dateKey }) => (
        <View>
          {showDateTitle && (
            <Text className="font-bold text-lg px-4">
              {formatTransactionDate(dateKey)}
            </Text>
          )}

          {/* Map through transactions of the same date */}
          {groupedTransactions[dateKey].map((transaction) => (
            <TransactionItem
              key={transaction.id}
              item={transaction}
              accountsData={accountsData}
            />
          ))}
        </View>
      )}
      keyExtractor={(item) => item}
      onEndReached={loadMoreTransactions} // Load more when end is reached
      onEndReachedThreshold={0.5} // Fetch more when halfway through the list
      windowSize={5}
    />
  )
}

export default TransactionList
