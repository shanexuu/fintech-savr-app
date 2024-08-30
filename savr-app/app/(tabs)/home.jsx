import { View, Text, Button, FlatList, Image } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images, icons } from '../../constants'

const Home = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    signOut({ redirectUrl: '/sign-in' })
  }
  const { user } = useUser()
  const username = user?.username || user?.firstName || 'Anonymous'
  const balance = 34950

  const formatCurrency = (amount) => {
    const formattedAmount = new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 2,
    }).format(amount)

    return formattedAmount.replace('NZ$', '').trim() + ' NZD'
  }

  return (
    <SafeAreaView className="bg-purple-100">
      <View>
        <FlatList
          data={[{ id: 1 }]}
          keyExtractor={(item) => item.$id}
          ListHeaderComponent={() => (
            <View className="flex">
              <View className="flex my-6 px-4 space-y-6 justify-between items-start flex-row mb-16">
                <View>
                  <View className="flex flex-row gap-4">
                    <View className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                      <Image
                        source={images.logo}
                        className="w-8 h-8"
                      />
                    </View>

                    <View>
                      <Text className="font-pregular text-lg text-primary">
                        Hey, <Text className="font-psemibold">{username}</Text>
                      </Text>
                      <Text className="text-base font-pregular text-primary">
                        Welcome back
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex flex-row gap-4 self-center">
                  <Image
                    source={icons.bell}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                  <Image
                    source={icons.settings}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View className="flex flex-col justify-center items-center mb-20 h-20  px-4">
                <Text
                  className="text-5xl mb-4 font-pmedium"
                  style={{ lineHeight: 56 }}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {formatCurrency(balance)}
                </Text>
                <Text className="font-pregular">Total Balance</Text>
              </View>

              <View className="bg-white rounded-t-3xl">
                <Text>Budget</Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default Home
