import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RoundBtn } from '../../components'
import { useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { ExpenseData } from '../../components'

const Budget = () => {
  return (
    <SafeAreaView className="h-full">
      <View>
        <Text>Hello</Text>
        <ExpenseData />
      </View>
    </SafeAreaView>
  )
}

export default Budget
