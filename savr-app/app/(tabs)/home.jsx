import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images, icons } from '../../constants'
import {
  TransactionList,
  AccountsData,
  IncomeData,
  ExpenseData,
  RoundBtn,
} from '../../components'
import { useNavigation } from '@react-navigation/native'

const Home = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    signOut({ redirectUrl: '/sign-in' })
  }
  const { user } = useUser()
  const username = user?.username || user?.firstName || 'Anonymous'

  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate('transactions')
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-purple-100 h-full flex-1"
    >
      <View>
        <FlatList
          data={[{ id: 1 }]}
          keyExtractor={(item) => item.$id}
          ListHeaderComponent={() => (
            <View className="flex">
              <View className="flex my-6 px-4 justify-between items-center flex-row mb-16">
                <View className="flex items-center">
                  <View className="flex flex-row gap-4">
                    <View className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                      <Image
                        source={images.logo}
                        className="w-8 h-8"
                      />
                    </View>

                    <View className="felx items-center">
                      <Text className="font-pregular text-lg text-primary">
                        Hey, <Text className="font-psemibold">{username}</Text>
                      </Text>
                      <Text className="text-base font-pregular text-primary">
                        Welcome back
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex flex-row gap-4 items-center">
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

              <View className="flex flex-col justify-center items-center mb-16 h-20  px-4">
                <AccountsData />
                <Text className="font-pregular text-gray-100">
                  Total Balance
                </Text>
              </View>

              <View className="bg-white rounded-t-[50px] p-2">
                <View className="felx flex-row justify-center h-48 gap-4 p-4">
                  <View className="bg-gray-200  w-1/2 flex justify-center rounded-3xl items-center">
                    <View className="flex flex-row items-center justify-center space-x-4">
                      <RoundBtn
                        icon="Income"
                        imageStyles="h-6 w-6"
                        containerStyles="h-10 w-10 bg-green-100"
                      />
                      <Text className="font-pmedium text-xl">Income</Text>
                    </View>

                    <IncomeData
                      startDate="2024-08-01T01%3A00%3A00.000Z"
                      endDate="2024-08-31T01%3A00%3A00.000Z"
                    />
                  </View>
                  <View className="bg-gray-200  w-1/2 flex justify-center rounded-3xl items-center">
                    <View className="flex flex-row items-center justify-center space-x-4">
                      <RoundBtn
                        icon="Expense"
                        imageStyles="h-6 w-6"
                        containerStyles="h-10 w-10 bg-pink-100"
                      />
                      <Text className="font-pmedium text-xl">Expense</Text>
                    </View>

                    <ExpenseData />
                  </View>
                </View>

                <View className="flex flex-row justify-between p-2 mt-5 items-center mb-4">
                  <Text className=" font-psemibold text-xl text-primary">
                    Latest Transactions
                  </Text>
                  <TouchableOpacity onPress={handlePress}>
                    <Text className="font-pregular text-primary text-base">
                      See More
                    </Text>
                  </TouchableOpacity>
                </View>

                <TransactionList itemsToShow="8" />
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default Home
