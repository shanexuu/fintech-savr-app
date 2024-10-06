import { View, Text } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

const ExpenseData = ({ startDate, endDate, textStyles }) => {
  // Fetch transactions for the provided date range using React Query
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['expenses', startDate, endDate], // Add startDate and endDate as query keys to refetch data when these change
    queryFn: () =>
      fetch(
        `/api/transactions?start=${encodeURIComponent(
          startDate
        )}&end=${encodeURIComponent(endDate)}`
      ).then((res) => res.json()), // Fetch transaction data for the current month
  })

  // Display a loading spinner while the data is loading
  if (isTransactionsLoading) {
    return <Spinner visible={true} />
  }

  // Display an error message if there's an error loading the data
  if (transactionsError) {
    return (
      <View>
        <Text>Error loading data</Text>
      </View>
    )
  }

  // Calculate the total expenses by filtering for negative amounts and summing them up
  const totalExpenses = transactionsData?.items
    .filter((item) => item.amount < 0) // Filter for transactions where the amount is negative (expenses)
    .reduce((total, item) => total + item.amount, 0) // Sum up all the negative amounts (expenses)

  // Return the total expenses, formatted to show as a positive number
  return (
    <View>
      <Text className={`text-primary font-pmedium text-xl ${textStyles}`}>
        ${Math.abs(totalExpenses).toFixed(2)}{' '}
        {/* Display as a positive value */}
      </Text>
    </View>
  )
}

export default ExpenseData
