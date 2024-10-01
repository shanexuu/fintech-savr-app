import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { icons } from '../constants'
import { calculateTotalActualIncome } from '../utils/CalculateIncome'
import { calculateTotalExpectedIncome } from '../utils/TotalIncome'

const IncomeItem = ({ income, category }) => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()
  const { icon, color, name, amount } = income
  const [monthlyIncome, setMonthlyIncome] = useState(null)
  const [totalIncome, setTotalIncome] = useState(null)

  // Fetch monthly income and total income on component mount
  useEffect(() => {
    const fetchIncomeData = async (email) => {
      if (email) {
        const actualIncome = await calculateTotalActualIncome(email)
        const expectedIncome = await calculateTotalExpectedIncome(email)

        const totalIncome = actualIncome.incomeByCategory[category.id] || 0
        const monthlyIncome = expectedIncome.incomeByCategory[category.id] || 0

        setTotalIncome(totalIncome)
        setMonthlyIncome(monthlyIncome)
      }
    }

    fetchIncomeData(email)
  }, [email, income, category.id])

  // Handler for navigating to income detail
  const onIncomeClick = (income) => {
    router.push({
      pathname: '/(budget)/income-detail',
      params: {
        incomeId: income.id,
        categoryId: category.id,
      },
    })
  }

  // Calculate the percentage of total income relative to expected income
  const progressPercentage =
    monthlyIncome && totalIncome
      ? Math.min(
          (parseFloat(totalIncome) / parseFloat(monthlyIncome)) * 100,
          100
        )
      : 0

  return (
    <TouchableOpacity
      className="flex mx-4 mb-5 bg-white rounded-3xl shadow-md px-4 py-6 mt-5"
      onPress={() => onIncomeClick(income)}
    >
      <View className="flex flex-row justify-between ">
        <View className="flex flex-row gap-2">
          <View
            className="flex justify-center items-center rounded-full h-12 w-12"
            style={{ backgroundColor: color }}
          >
            <Text>{icon}</Text>
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
          {monthlyIncome !== null && totalIncome !== null
            ? Math.max(monthlyIncome - parseFloat(totalIncome), 0).toFixed(2) // Ensure no negative value
            : 'Loading...'}{' '}
          remaining
        </Text>
      </View>

      <View className="h-3 rounded-3xl bg-gray-300">
        <View
          className="h-3 rounded-3xl z-40"
          style={{
            backgroundColor: color,
            width: `${progressPercentage}%`,
          }}
        />
      </View>
    </TouchableOpacity>
  )
}

export default IncomeItem
