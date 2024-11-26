import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../utils/SupabaseConfig'
import dayjs from 'dayjs'

const CurrentMonthIncome = ({ textStyles }) => {
  const [totalIncome, setTotalIncome] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch total income for the current month
  const fetchCurrentMonthIncome = async () => {
    try {
      const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')
      const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD')

      // Query Supabase for income transactions within the current month
      const { data: transactionData, error } = await supabase
        .from('all_transactions')
        .select('amount, category_group, date')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .not('category_group', 'is', null)
        .gt('amount', 0)

      if (error) throw error

      // Calculate the total income from the fetched transactions
      const income = transactionData
        ? transactionData.reduce(
            (total, transaction) => total + parseFloat(transaction.amount),
            0
          )
        : 0

      setTotalIncome(income)
    } catch (err) {
      setError('Error fetching income data')
      console.error('Error fetching income data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentMonthIncome()
  }, [])

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    )
  }

  return (
    <View>
      <Text className={`text-primary font-pmedium text-xl ${textStyles}`}>
        ${totalIncome.toFixed(2)}
      </Text>
    </View>
  )
}

export default CurrentMonthIncome
