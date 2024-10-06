import { View, Text } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'

const CurrentMonthExpense = ({ textStyles }) => {
  // Fetch the transactions data
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetch('/api/transactions').then((res) => res.json()),
  })

  const getCurrentYearAndMonth = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    return { currentYear, currentMonth }
  }

  // Function to calculate total expenses for the current month
  const calculateCurrentMonthExpenses = (transactions) => {
    const { currentYear, currentMonth } = getCurrentYearAndMonth()

    return (
      transactions
        ?.filter((transaction) => {
          const transactionDate = new Date(transaction.date)
          const transactionYear = transactionDate.getFullYear()
          const transactionMonth = transactionDate.getMonth()

          // Filter for current month and year, and for expenses (negative amounts)
          return (
            transactionYear === currentYear &&
            transactionMonth === currentMonth &&
            transaction.amount < 0
          )
        })
        .reduce((total, transaction) => total + transaction.amount, 0) || 0
    )
  }

  // Calculate total current month expenses
  const totalExpenses = calculateCurrentMonthExpenses(transactionsData?.items)

  if (isTransactionsLoading) {
    return <Text>Loading...</Text>
  }

  if (transactionsError) {
    return (
      <View>
        <Text>Error loading transactions</Text>
      </View>
    )
  }

  return (
    <View>
      <Text className={`text-primary font-pmedium text-xl ${textStyles}`}>
        ${Math.abs(totalExpenses).toFixed(2)}
      </Text>
    </View>
  )
}

export default CurrentMonthExpense
