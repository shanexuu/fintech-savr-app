import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useClerk } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RoundBtn } from '../../components'

const SuccessPage = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handlePasswordChange = async () => {
    await signOut() // Sign out the user
    router.push('/sign-in')
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full flex justify-center px-4 my-3">
          <Text className="text-7xl text-black mt-10 mb-4 font-regular">
            Success!
          </Text>
          <Text className="text-base text-gray-100  mb-4 font-regular">
            You have successfully changed password for your account.
          </Text>
          <RoundBtn
            icon={'checkmark'}
            size={'150'}
            containerStyles={'bg-purple-100 p-20'}
            onPress={handlePasswordChange}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SuccessPage
