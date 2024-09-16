import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { icons } from '../constants'

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
      className="flex mx-4 mb-5 bg-white rounded-3xl shadow-md px-4 py-6"
      onPress={() => onIncomeClick(income)}
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

export default IncomeItem
