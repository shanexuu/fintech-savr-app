import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native'
import { useAuth, useSignIn } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CustomButton, FormField } from '../../components'
import { icons, images } from '../../constants'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

  if (!isLoaded) {
    return null
  }

  // If the user is already signed in,
  // redirect them to the home page
  if (isSignedIn) {
    router.replace('/')
  }

  // Send the password reset code to the user's email
  async function create(e) {
    e.preventDefault()
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true)
        setError('')
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e) {
    e.preventDefault()
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true)
          setError('')
        } else if (result.status === 'complete') {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId })
          setError('')
          router.replace('/')
        } else {
          console.log(result)
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full flex justify-center px-4 my-3">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[50px] h-[50px]"
          />

          <View className="flex justify-center">
            {!successfulCreation ? (
              <>
                <Text className="text-7xl text-black mt-10 mb-4 font-regular">
                  Forgot password?
                </Text>
                <Text className="text-base text-gray-100  mb-4 font-regular">
                  Enter your email address and we will send you a link to reset
                  your password.
                </Text>
                <FormField
                  autoCapitalize="none"
                  value={email}
                  handleChangeText={setEmail}
                  otherStyles="mt-5"
                  keyboardType="email-address"
                />
                <CustomButton
                  title="Reset password"
                  handlePress={create}
                  containerStyles="mt-7"
                />
                <Link
                  className="text-lg font-regular text-black-200 text-center mt-6"
                  href="/sign-in"
                >
                  Back to log in
                </Link>

                {error ? (
                  <Text className="text-center mt-5 text-gray-100 font-bold text-base">
                    {error}
                  </Text>
                ) : null}
              </>
            ) : (
              <>
                <Text className="text-7xl text-black mt-10 mb-4 font-regular">
                  Set new password
                </Text>

                <FormField
                  title="Enter your new password"
                  value={password}
                  handleChangeText={setPassword}
                  keyboardType="password"
                />
                <Text className="text-base text-gray-100  font-regular">
                  Enter verification code, we have sent a code to{' '}
                  <Text className="text-primary font-bold">{email}</Text>
                </Text>
                <FormField
                  value={code}
                  handleChangeText={setCode}
                />
                <CustomButton
                  title="Retset"
                  handlePress={reset}
                  containerStyles="mt-7"
                />

                {error ? (
                  <Text className="text-center mt-5 text-gray-100 font-bold text-base">
                    {error}
                  </Text>
                ) : null}
              </>
            )}
            {secondFactor && (
              <Text className="text-center mt-5 text-gray-100 font-bold text-base">
                2FA is required, but this UI does not handle that
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForgotPasswordPage
