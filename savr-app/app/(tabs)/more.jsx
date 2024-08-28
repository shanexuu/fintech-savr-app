import { View, Text, Button } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'

const More = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    signOut({ redirectUrl: '/sign-in' })
  }
  const { user } = useUser()
  const username = user?.username || user?.firstName || 'Anonymous'
  return (
    <SafeAreaView>
      <View>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
        />
      </View>
    </SafeAreaView>
  )
}

export default More
