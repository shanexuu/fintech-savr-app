import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import { CustomButton, FormField } from '../../components'
import { Link, router } from 'expo-router'

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const submit = () => {}

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-3">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[50px] h-[50px]"
          />
          <Text className="text-7xl text-black mt-10 mb-4 font-regular">
            Sign in
          </Text>
          <FormField
            title="Email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="password"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-primary font-regular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-regular"
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
