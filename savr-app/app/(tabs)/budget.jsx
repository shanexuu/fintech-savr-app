import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RoundBtn } from '../../components'
import { useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'

const Budget = () => {
  return (
    <SafeAreaView className="h-full">
      <View></View>
    </SafeAreaView>
  )
}

export default Budget
