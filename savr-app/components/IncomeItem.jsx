import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const IncomeItem = ({ income }) => {
  const router = useRouter()
  const { icon, color, name, amount } = income

  const onIncomeClick = (income) => {
    router.push({
      pathname: '/(budget)/income-detail',
      params: {
        incomeId: income.id,
      },
    })
  }
  return (
    <TouchableOpacity
      className="flex flex-row justify-between items-center px-3 py-10 bg-white rounded-3xl shadow-md mb-6 w-full"
      onPress={() => onIncomeClick(income)}
    >
      <View className="flex flex-row gap-2 items-center">
        <View
          className="flex justify-center items-center w-10 h-10 rounded-full"
          style={{ backgroundColor: color }}
        >
          <Text>{icon}</Text>
        </View>
        <View>
          <Text className="font-pmedium text-base">{name}</Text>
          <Text>${amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default IncomeItem
