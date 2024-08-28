import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RoundBtn } from '../../components'
import { useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'

const Budget = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handlePasswordChange = async () => {
    await signOut()
    signOut({ redirectUrl: '/sign-in' })
  }
  const { user } = useUser()
  const username = user?.username || user?.firstName || 'Anonymous'

  return (
    <SafeAreaView className="h-full">
      <View>
        <RoundBtn
          icon={'checkmark'}
          size={'150'}
          containerStyles={'bg-purple-100 p-20'}
          onPress={handlePasswordChange}
        />
      </View>
    </SafeAreaView>
  )
}

export default Budget
