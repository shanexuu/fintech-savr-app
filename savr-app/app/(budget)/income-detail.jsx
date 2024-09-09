import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const IncomeDetail = () => {
  const { incomeId } = useLocalSearchParams()
  useEffect(() => {
    console.log(incomeId)
  }, [incomeId])
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-4">
        <Text>Income Detail</Text>
      </View>
    </SafeAreaView>
  )
}

export default IncomeDetail
