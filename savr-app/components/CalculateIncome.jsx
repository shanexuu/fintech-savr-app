import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/SupabaseConfig'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import dayjs from 'dayjs'

const CalculateIncome = ({ category }) => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()

  // State to hold the calculated monthly income
  const [monthlyIncomeByCategory, setMonthlyIncomeByCategory] = useState({})

  const calculateMonthlyIncome = async (email) => {
    try {
      // Get the start and end of the current month using dayjs
      const startOfMonth = dayjs().startOf('month').format()
      const endOfMonth = dayjs().endOf('month').format()

      // Fetch the income data from Supabase table for the user and filter by date and category_id
      const { data: incomeData, error: incomeError } = await supabase
        .from('transaction')
        .select('amount, category_id, created_at') // Fetch amount, category_id, and created_at
        .eq('user', email) // Use email to query the user's data
        .gte('created_at', startOfMonth) // Only get records from the current month
        .lte('created_at', endOfMonth)

      if (incomeError) {
        console.error('Error fetching income data:', incomeError)
        return
      }

      // Object to store income totals by category, initializing with 0 for all categories
      const incomeByCategory = {}

      // Initialize the selected category with 0 even if no income data is available
      incomeByCategory[category.id] = 0

      // If income data is not null or empty, process the income data
      if (incomeData && incomeData.length > 0) {
        // Loop through each income record and calculate the total income per category
        incomeData.forEach((income) => {
          // If the category already has an entry in incomeByCategory, add to it
          if (!incomeByCategory[income.category_id]) {
            incomeByCategory[income.category_id] = 0
          }
          // Add the income amount to the corresponding category
          incomeByCategory[income.category_id] += parseFloat(income.amount)
        })
      }

      // Set the calculated income by category in the state
      setMonthlyIncomeByCategory(incomeByCategory)
    } catch (error) {
      console.error('Unexpected error calculating monthly income:', error)
      // In case of an error, set the specific category income to 0
      setMonthlyIncomeByCategory({ [category.id]: 0 })
    }
  }

  // Use useEffect to call the calculation function when the component mounts
  useEffect(() => {
    if (email) {
      calculateMonthlyIncome(email)
    }
  }, [email]) // Fetch income data when email becomes available

  // Access the income by the given category ID, return 0 if not found
  const monthlyIncome = monthlyIncomeByCategory[category.id] || 0

  return (
    <View>
      <Text>
        Category {category.id} Income: ${monthlyIncome.toFixed(2)}
      </Text>
    </View>
  )
}

export default CalculateIncome
