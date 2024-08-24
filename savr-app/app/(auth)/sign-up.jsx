import { View, Text, ScrollView, Image, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import { CustomButton, FormField } from '../../components'
import { Link, router } from 'expo-router'
import Spinner from 'react-native-loading-spinner-overlay'
import { Stack } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo'

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const { isLoaded, signUp, setActive } = useSignUp()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }
    setLoading(true)

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      })

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // change the UI to verify the email address
      setPendingVerification(true)
    } catch (err) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }
    setLoading(true)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      await setActive({ session: completeSignUp.createdSessionId })
    } catch (err) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-3">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[50px] h-[50px]"
          />

          <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
          <Spinner visible={loading} />
          {!pendingVerification && (
            <>
              <Text className="text-7xl text-black mt-10 mb-4 font-regular">
                Sign up
              </Text>
              <FormField
                title="Username"
                value={form.username}
                handleChangeText={(e) => setForm({ ...form, username: e })}
                otherStyles="mt-10"
              />
              <FormField
                title="Email"
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
                title="Sign Up"
                handlePress={onSignUpPress}
                containerStyles="mt-7"
              />
            </>
          )}
          {pendingVerification && (
            <>
              <View>
                <FormField
                  value={code}
                  handleChangeText={setCode}
                  otherStyles="mt-7"
                  keyboardType="password"
                />
              </View>
              <CustomButton
                title="Verify Email"
                handlePress={onPressVerify}
                containerStyles="mt-7"
              />
            </>
          )}
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-regular text-primary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
