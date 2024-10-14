import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useSearchParams } from 'expo-router'
import { supabase } from '../../utils/SupabaseConfig'
import { icons } from '../../constants'
import { MoreHeader, CategoryBtn } from '../../components'
import Spinner from 'react-native-loading-spinner-overlay'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'

const TransactionDetails = () => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const { transactionId, merchantName, amount, date, category, logo } =
    useLocalSearchParams()
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState(null)
  const [defaultCategory, setDefaultCategory] = useState([])

  const handleImagePress = () => {
    router.back()
  }
  // Fetch the transaction details from Supabase if needed
  const getTransactionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('all_transactions')
        .select('*')
        .eq('id', transactionId)
        .single()

      if (error) {
        console.error('Error fetching transaction details:', error)
        return
      }
      setTransactionDetails(data)
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  useEffect(() => {
    getTransactionDetails() // Fetch details if needed
    const getAllCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('category')
          .select('*')
          .eq('type', 'expense')
          .in('created_by', ['admin', email])
          .neq('name', 'Uncategorised')

        if (data.length > 0) {
          const uniqueCategories = {}
          data.forEach((category) => {
            const { name, created_by } = category

            if (!uniqueCategories[name] || created_by === email) {
              uniqueCategories[name] = category
            }
          })

          // Convert the object back into an array
          const filteredData = Object.values(uniqueCategories)

          setDefaultCategory(filteredData) // Update state with the filtered categories
        }
      } catch (error) {
        console.error('Get categories error!', error)
      }
    }

    getAllCategories()
  }, [transactionId])

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex"
    >
      <ScrollView>
        <View className="h-full">
          <MoreHeader
            headertext="Transaction Details"
            icon={icons.Info}
            containerStyle="mb-4 px-4"
            handleImagePress={handleImagePress}
          />
          <View className="flex justify-center w-full items-center mb-2 mt-8">
            {/* Transaction Logo */}
            <View className="flex justify-center items-center">
              <View className="h-45 w-45 rounded-full shadow-lg bg-white flex justify-center items-center">
                <Image
                  source={{ uri: logo || transactionDetails?.logo }}
                  className="w-32 h-32 rounded-full"
                />
              </View>
              <Text className="font-psemibold text-xl mt-5">
                {merchantName || transactionDetails?.merchant_name}
              </Text>
              {/* Transaction Info */}
            </View>
          </View>

          <View className="flex flex-row gap-1 justify-center w-full items-center mb-5">
            <Text
              className={`font-pregular text-sm ${
                amount >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`}
            </Text>
            <Text className="text-gray-500 font-pregular text-sm">|</Text>
            <Text className="font-pregular text-sm text-gray-400">
              {date || transactionDetails?.date}
            </Text>
          </View>
          <View className="flex flex-row gap-1 justify-center w-full items-center mb-10">
            <CategoryBtn
              icon={category?.icon}
              title={
                category?.name === 'Professional Services'
                  ? 'Services'
                  : category?.name
              }
              iconStyles={category?.color || '#D9D8F7'}
              handlePress={() => setModalVisible(!modalVisible)}
            />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <SafeAreaView className="flex-1 justify-end">
                <View className="absolute inset-0 bg-black opacity-50 z-0" />
                <View className="bg-white w-full pb-10 rounded-t-3xl relative z-10 shadow-2xl">
                  <View className="flex flex-row justify-between px-5 py-5 mt-4">
                    <Text className="font-psemibold text-xl">
                      Merchant category
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Image
                        source={icons.Close}
                        className="h-4 w-4 justify-items-end"
                      />
                    </TouchableOpacity>
                  </View>
                  <View className="flex flex-row flex-wrap items-center mx-2">
                    {defaultCategory.map((category) => (
                      <CategoryBtn
                        key={category.id}
                        title={category.name}
                        icon={category.icon}
                        iconStyles={category.color}
                        containerStyles="m-1"
                        handlePress={() => handleCategorySelection(category)}
                      />
                    ))}
                  </View>
                </View>
              </SafeAreaView>
            </Modal>
          </View>
          {/* Other transaction details */}
          <View className="flex px-4 bg-white">
            <View className="flex flex-row justify-between">
              <Text className="font-pbold text-gray-900">
                {transactionDetails?.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TransactionDetails
