import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

const ExpenseData = ({ startDate, endDate, textStyles }) => {
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () =>
      fetch(
        `/api/transactions?start=${encodeURIComponent(
          startDate
        )}&end=${encodeURIComponent(endDate)}`
      ).then((res) => res.json()),
  })
  if (isTransactionsLoading) {
    return <Spinner visible={true} />
  }

  if (transactionsError) {
    return (
      <View>
        <Text>Error loading data</Text>
      </View>
    )
  }

  // Filter and calculate total expenses (negative amounts)
  const totalExpenses = transactionsData?.items
    .filter((item) => item.amount < 0) // Filter for negative amounts
    .reduce((total, item) => total + item.amount, 0) // Sum up the negative amounts

  return (
    <View>
      <Text className={`text-primary font-pmedium text-xl ${textStyles}`}>
        ${Math.abs(totalExpenses.toFixed(2))}
      </Text>
    </View>
  )
}

export default ExpenseData
