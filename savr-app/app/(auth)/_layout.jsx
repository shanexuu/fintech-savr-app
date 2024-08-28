import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuth } from '@clerk/clerk-expo'
import { useClerk } from '@clerk/clerk-expo'

const AuthLayout = () => {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { signOut } = useClerk()

  if (isSignedIn) {
    return <Redirect href={'/home'} />
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign-up"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reset-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="success"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar
        backgroundColor="#fff"
        style="dark"
      />
    </>
  )
}

export default AuthLayout
