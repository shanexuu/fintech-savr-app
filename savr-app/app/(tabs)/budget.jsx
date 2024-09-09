import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { RoundBtn, CircularChart, IncomeList } from '../../components'
import { supabase } from '../../utils/SupabaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useUser, useClerk } from '@clerk/clerk-expo'

const Budget = () => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const navigation = useNavigation()
  const [incomeList, setIncomeList] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getIncomeList()
  }, [])

  const getIncomeList = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('created_by', email)

    console.log('data:', data)
    setIncomeList(data)
    data && setLoading(false)
  }
  const handlePress = () => {
    navigation.navigate('(budget)/add-income')
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex-1"
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => getIncomeList()}
            refreshing={loading}
          />
        }
      >
        <View className="h-full bg-white">
          <View className="px-5">
            <View className=" bg-white w-full p-4 flex flex-row justify-between items-center mb-10 rounded-[50px] shadow-md">
              <TouchableOpacity>
                <RoundBtn
                  icon="Previous"
                  imageStyles="h-5 w-5"
                  containerStyles="h-8 w-8"
                />
              </TouchableOpacity>
              <Text className="font-pmedium text-base">This month</Text>
              <TouchableOpacity>
                <RoundBtn
                  icon="Next"
                  imageStyles="h-5 w-5"
                  containerStyles="h-8 w-8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex items-center mb-10">
            <CircularChart />
          </View>
          <View className="px-5">
            <View className="flex flex-row justify-between items-center mb-4 w-full">
              <Text className=" font-psemibold text-xl text-primary">
                Income Budget
              </Text>
              <TouchableOpacity onPress={handlePress}>
                <Text className="font-plight text-primary text-3xl">+</Text>
              </TouchableOpacity>
            </View>

            <IncomeList incomeList={incomeList} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Budget
