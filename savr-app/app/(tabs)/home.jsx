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

              <View className="flex flex-col justify-center items-center mb-24 h-20 px-4">
                <AccountsData />
                <Text className="font-pregular text-gray-100">
                  Total Balance
                </Text>
              </View>

              <View className="bg-white relative my-6 px-4 justify-center items-center flex">
                <View className="bg-white felx flex-row justify-center h-32 absolute -top-16 rounded-[30px] shadow-md w-full">
                  <View className="flex justify-center w-1/2">
                    <View className="flex flex-row w-full items-center">
                      <RoundBtn
                        icon="Income"
                        imageStyles="h-4 w-4"
                        containerStyles="h-8 w-8 bg-green-100"
                      />
                      <Text className="font-pmedium text-base text-gray-500 mx-2 h-8">
                        Income
                      </Text>
                    </View>
                    <View className="flex w-full justify-center content-center">
                      <IncomeData
                        startDate="2024-08-01T01%3A00%3A00.000Z"
                        endDate="2024-08-31T01%3A00%3A00.000Z"
                      />
                    </View>
                  </View>

                  <View className="flex justify-center">
                    <View className="flex flex-row items-center">
                      <RoundBtn
                        icon="Expense"
                        imageStyles="h-4 w-4"
                        containerStyles="h-8 w-8 bg-pink-100"
                      />
                      <Text className="font-pmedium text-base h-8 text-gray-500 mx-2">
                        Expenses
                      </Text>
                    </View>

                    <ExpenseData />
                  </View>
                </View>

                <View className="felx px-1 h-full">
                  <View className="flex flex-row justify-between mt-28 items-center mb-4 w-full">
                    <Text className=" font-psemibold text-xl text-primary">
                      Latest Transactions
                    </Text>
                    <TouchableOpacity onPress={handlePress}>
                      <Text className="font-pregular text-primary text-base">
                        More
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TransactionList itemsToShow="8" />
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default Home
