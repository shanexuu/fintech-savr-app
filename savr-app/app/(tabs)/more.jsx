import { View, Text, Button, Linking } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { Header } from '../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { DefaultButton } from '../../components'
import { useNavigation } from '@react-navigation/native'

const More = () => {
  const { signOut } = useClerk()
  const router = useRouter()
  const navigation = useNavigation()

  const handleSignOut = async () => {
    await signOut()
    signOut({ redirectUrl: '/sign-in' })
  }
  const onAccountsPress = () => {
    navigation.navigate('(more)/accounts')
  }
  const onConAccsPress = () => {
    navigation.navigate('(more)/akahu-webview')
  }
  const onMerchantsPress = () => {
    navigation.navigate('(more)/merchants')
  }
  const onSettingsPress = () => {
    navigation.navigate('(more)/settings')
  }

  const { user } = useUser()
  const username = user?.username || user?.firstName || 'Anonymous'
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex"
    >
      <View className="h-full bg-white ">
        <View className="px-4">
          <Header
            headertext="More"
            containerStyle="mb-4"
          />
          <DefaultButton
            title="Accounts"
            handlePress={onAccountsPress}
            containerStyles="mt-7"
            icon="User"
            iconBg="purple-100"
          />
          <DefaultButton
            title="Connect your accounts"
            handlePress={onConAccsPress}
            containerStyles="mt-7"
            icon="Link"
            iconBg="green-100"
          />
          <DefaultButton
            title="Merchants"
            handlePress={onMerchantsPress}
            containerStyles="mt-7"
            icon="Store"
            iconBg="pink-100"
          />
          <DefaultButton
            title="Settings"
            handlePress={onSettingsPress}
            containerStyles="mt-7"
            icon="Settings"
            iconBg="purple-100"
          />
          <Text className="text-center mt-10 mb-4 font-pregular text-gray-400">
            v.1.0.0
          </Text>
          <View className="flex flex-row justify-center gap-8">
            <Text className="font-pmedium text-gray-400 text-base">
              Terms of Use
            </Text>
            <Text className="font-pmedium text-gray-400 text-base">
              Privacy Policy
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default More
