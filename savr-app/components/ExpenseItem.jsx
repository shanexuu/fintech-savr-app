import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '@clerk/clerk-expo'

import { icons } from '../constants'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { calculateTotalActualExpense } from '../utils/CalculateExpense'
import { calculateTotalExpectedExpense } from '../utils/TotalExpense'

const ExpenseItem = ({ expense, category }) => {
  const router = useRouter()
  const { icon, color, name, amount } = expense

  const [monthlyExpense, setMonthlyExpense] = useState(null)
  const [totalExpense, setTotalExpense] = useState(null)

  const onExpenseClick = (expense) => {
    router.push({
      pathname: '/(budget)/expense-detail',
      params: {
        expenseId: expense.id,
        categoryId: category.id,
      },
    })
  }

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
          $200 remaining
        </Text>
      </View>
      <View className="h-3 rounded-3xl bg-gray-300">
        <View
          className="h-3 rounded-3xl z-40"
          style={{ backgroundColor: color, width: '60%' }}
        />
      </View>
    </TouchableOpacity>
  )
}

export default ExpenseItem
