import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '@clerk/clerk-expo'
import { icons } from '../constants'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { calculateTotalActualExpense } from '../utils/CalculateExpense'
import { calculateTotalExpectedExpense } from '../utils/TotalExpense'

const ExpenseItem = ({ expense, category, onExpenseDataFetched }) => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()
  const { icon, color, name, amount } = expense
  const [monthlyExpense, setMonthlyExpense] = useState(null)
  const [totalExpense, setTotalExpense] = useState(null)

  useEffect(() => {
    const fetchExpenseData = async (email) => {
      if (email) {
        const actualExpense = await calculateTotalActualExpense(expense.name)
        const expectedExpense = await calculateTotalExpectedExpense(email)

        const totalExpense = Math.abs(
          actualExpense.expenseByCategoryGroup[expense.name] || 0
        )
        const monthlyExpense =
          expectedExpense.expenseByCategory[category.id] || 0

        setTotalExpense(totalExpense)
        setMonthlyExpense(monthlyExpense)
        // Pass the fetched data to the parent component
        if (onExpenseDataFetched) {
          onExpenseDataFetched(expense.id, totalExpense, monthlyExpense)
        }
      }
    }

    fetchExpenseData(email)
  }, [email, expense, category.id])

  const onExpenseClick = (expense) => {
    router.push({
      pathname: '/(budget)/expense-detail',
      params: {
        expenseId: expense.id,
        categoryId: category.id,
      },
    })
  }

  // Calculate the percentage of total income relative to expected income
  const progressPercentage =
    monthlyExpense && totalExpense
      ? Math.min(
          (parseFloat(totalExpense) / parseFloat(monthlyExpense)) * 100,
          100
        )
      : 0

  return (
    <TouchableOpacity
      className="flex mx-4 mb-5 bg-white rounded-3xl shadow-md px-4 py-6 mt-5"
      onPress={() => onExpenseClick(expense)}
    >
      <View className="flex flex-row  justify-between ">
        <View className="flex flex-row gap-2">
          <View
            className="flex justify-center items-center  rounded-full h-12 w-12"
            style={{ backgroundColor: color }}
          >
            <Text className="">{icon}</Text>
          </View>
          <View>
            <Text className="font-pmedium text-base text-gray-400">{name}</Text>
            <Text className="font-pmedium text-base mb-3">${amount}</Text>
          </View>
        </View>

        <View>
          <Image
            source={icons.Next}
            className="h-5 w-5"
          />
        </View>
      </View>
      <View className="flex mb-4">
        <Text className="text-right text-gray-100 font-pregular">
          $
          {monthlyExpense !== null && totalExpense !== null
            ? Math.max(monthlyExpense - parseFloat(totalExpense), 0).toFixed(2) // Ensure no negative value
            : 'Loading...'}{' '}
          remaining
        </Text>
      </View>
      <View className="h-3 rounded-3xl bg-gray-300">
        <View
          className="h-3 rounded-3xl z-40"
          style={{ backgroundColor: color, width: `${progressPercentage}%` }}
        />
      </View>
    </TouchableOpacity>
  )
}

export default ExpenseItem
