import { View, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { MoreHeader, MerchantList } from '../../components'
import { icons } from '../../constants'
import { useRouter } from 'expo-router'
import { supabase } from '../../utils/SupabaseConfig'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

const Merchants = () => {
  const navigation = useNavigation()
  const router = useRouter()

  const [merchant, setMerchants] = useState([])
  const [loading, setLoading] = useState(false)

  const handleImagePress = () => {
    router.back()
  }

  // Function to fetch data from Supabase
  const fetchMerchants = async () => {
    setLoading(true)
    try {
      let { data, error } = await supabase.from('all_transactions').select('*') // Adjust the query as per your database schema

      if (error) {
        console.error('Error fetching merchants:', error)
      } else {
        setMerchants(data)
      }
    } catch (error) {
      console.error('Error fetching merchants:', error)
    } finally {
      setLoading(false)
    }
  }

  // Automatically fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMerchants() // Fetch the latest data when the screen is focused
    }, [])
  )

  useEffect(() => {
    fetchMerchants()
  }, [])
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex"
    >
      <View className="px-4">
        <MoreHeader
          headertext="Merchants"
          icon={icons.Info}
          containerStyle="mb-4"
          handleImagePress={handleImagePress}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => fetchMerchants()}
            refreshing={loading}
          />
        }
      >
        <MerchantList merchant={merchant} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Merchants
