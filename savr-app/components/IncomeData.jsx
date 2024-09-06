import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

const IncomeData = ({ startDate, endDate, textStyles }) => {
  const {
    data: incomeData,
    isLoading: isIncomeLoading,
    error: incomeError,
  } = useQuery({
    queryKey: ['income', startDate, endDate],
    queryFn: () =>
      fetch(
        `/api/income?start=${encodeURIComponent(
          startDate
        )}&end=${encodeURIComponent(endDate)}`
      ).then((res) => res.json()),
  })

  // Function to calculate the total amount
  const calculateTotalAmount = () => {
    if (!incomeData?.items) return 0 // Ensure we don't calculate if data is not available

    return incomeData.items.reduce((total, item) => {
      const transactionTotal = item.transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      )
      return total + transactionTotal
    }, 0)
  }

  const totalAmount = calculateTotalAmount()

  if (isIncomeLoading) {
    return <Spinner visible={true} />
  }

  if (incomeError) {
    return (
      <View>
        <Text>Error loading income data: {incomeError.message}</Text>
      </View>
    )
  }

  return (
    <View>
      <Text className={`text-primary font-pmedium text-xl ${textStyles}`}>
        ${totalAmount}
      </Text>
      {/* <FlatList
        data={incomeData?.items?.flatMap((item) => item.transactions)}
        keyExtractor={(item, index) => index.toString()} // Ensures each item has a unique key
        renderItem={({ item }) => (
          <Text>Transaction Amount: {item.amount}</Text>
        )}
      /> */}
    </View>
  )
}

export default IncomeData
