import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
// import PieChart from 'react-native-pie-chart'
import { Colors } from '../constants/Colors'

const CircularChart = ({ totalIncome, totalExpenses }) => {
  const widthAndHeight = 250
  const [values, setValues] = useState([1]) // default values
  const [sliceColor, setSliceColor] = useState([Colors.dark.text]) // default colors

  useEffect(() => {
    // Calculate the total budget by summing income and expenses
    const totalBudget = totalIncome + totalExpenses

    // Update chart data
    if (totalBudget > 0) {
      // Calculate percentage of each slice
      const incomePercentage = (totalIncome / totalBudget) * 100
      const expensesPercentage = (totalExpenses / totalBudget) * 100

      // Set pie chart values (actual values, not percentage, pie-chart uses raw values)
      setValues([totalIncome, totalExpenses])

      // Set the slice colors for income and expenses
      setSliceColor([Colors.green, Colors.pink])
    } else {
      // If no data, keep a default single slice
      setValues([1])
      setSliceColor([Colors.black])
    }
  }, [totalIncome, totalExpenses])

  return (
    <View className="relative w-full justify-center items-center bg-white rounded-3xl">
      <View className="flex absolute top-40 justify-center items-center z-50">
        <Text className="font-pregular text-xs text-gray-100">
          Remaining Budget
        </Text>
        <Text
          className="font-pmedium text-3xl"
          style={{ lineHeight: 40 }}
        >
          ${totalIncome - totalExpenses} {/* Remaining budget */}
        </Text>
      </View>

      <View className="flex gap-8 mt-5">
        <PieChart
          widthAndHeight={widthAndHeight}
          series={values}
          sliceColor={sliceColor}
          coverRadius={0.75}
          coverFill={'#FFF'}
        />

        {/* Legend for the Pie Chart */}
        <View className="w-full flex flex-row justify-start gap-2 items-center">
          <View className="bg-pink-100 h-8 w-8 rounded-full"></View>
          <Text>Income </Text>
        </View>
        <View className="w-full flex flex-row justify-start gap-2 items-center mb-10">
          <View className="bg-green-100 h-8 w-8 rounded-full"></View>
          <Text>Expenses </Text>
        </View>
      </View>
    </View>
  )
}

export default CircularChart
