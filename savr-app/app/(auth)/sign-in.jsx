import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Button,
  Pressable,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import { CustomButton, FormField } from '../../components'
import { Link, router } from 'expo-router'
import { useSignIn, useClerk } from '@clerk/clerk-expo'
import Spinner from 'react-native-loading-spinner-overlay'
import { useNavigation } from '@react-navigation/native'

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const submit = () => {}

  const { signIn, setActive, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const onSignInPress = async () => {
    if (!isLoaded) {
      return
    }
    setLoading(true)
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId })
    } catch (err) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full flex justify-center h-full px-4 my-3">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[50px] h-[50px]"
          />
          <Text className="text-7xl text-black mt-10 mb-4 font-regular">
            Sign in
          </Text>
          <Spinner visible={loading} />

          <FormField
            title="Email"
            autoCapitalize="none"
            value={emailAddress}
            handleChangeText={setEmailAddress}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-7"
            keyboardType="password"
          />

          <CustomButton
            title="Sign In"
            handlePress={onSignInPress}
            containerStyles="mt-7"
          />

          <View className="flex justify-center flex-row mt-5">
            <Link
              className="text-lg font-medium text-black-200"
              href="/reset-password"
            >
              Forgot Password?
            </Link>
          </View>

          <View style={{ flex: 1 }} />

          <View className="flex justify-center pt-5 flex-row gap-2 mb-6">
            <Text className="text-lg text-gray-100 font-regular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-medium text-primary"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
