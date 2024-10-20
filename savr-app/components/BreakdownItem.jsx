import { View, Text } from 'react-native'
import React from 'react'

const BreakdownItem = ({ title, amount, color }) => {
  return (
    <View className="flex-1 bg-white rounded-3xl shadow-md px-4 py-6 mt-5">
      <View className="flex">
        <Text className="font-pmedium text-base text-gray-400">{title}</Text>
        <Text className="font-pmedium text-base mb-3">${amount}</Text>
        <View className={`h-3 rounded-3xl bg-${color}-100`}></View>
      </View>
    </View>
  )
}

export default BreakdownItem
