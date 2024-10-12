import React, { memo, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { supabase } from '../../utils/SupabaseConfig'
import { icons } from '../../constants'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { MoreHeader, CategoryBtn } from '../../components'
import Spinner from 'react-native-loading-spinner-overlay'
import { useUser } from '@clerk/clerk-expo'

// const defaultCategories = require('../../assets/data/category-data.json')
// const Categories = defaultCategories.filter(
//   (defaultCat) =>
//     defaultCat.type === 'expense' && defaultCat.name !== 'Uncategorised'
// )

const MerchantDetails = ({ onCategoryChange }) => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const {
    merchantName,
    logo,
    totalAmount,
    totalTransactions,
    category_group,
    name,
  } = useLocalSearchParams()
  const router = useRouter()
  const [category, setCategory] = useState(null)
  const [modalVisible, setModalVisible] = useState(false) // Modal visibility

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [defaultCategory, setDefaultCategory] = useState([])
  const handleImagePress = () => {
    router.back()
  }

  // Function to update the category in the database and refresh the transactions
  const updateTransactionCategory = async (selectedCategory) => {
    try {
      setLoading(true) // Start loading

      const { error } = await supabase
        .from('all_transactions')
        .update({ category_group: selectedCategory.name })
        .eq('merchant_name', merchantName) // Update all transactions for this merchant

      if (error) {
        console.error(
          'Error updating category_group in all_transaction:',
          error
        )
        return
      }

      // Set the local state for category immediately after a successful update
      setSelectedCategory(selectedCategory)
      setCategory({
        icon: selectedCategory.icon,
        color: selectedCategory.color,
        name: selectedCategory.name,
      })

      // Fetch the updated transactions again
      await fetchMerchantTransactions()

      // Notify parent of the category change
      onCategoryChange(merchantName, selectedCategory.name)

      setModalVisible(false)
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  // Function to handle category selection
  const handleCategorySelection = (selectedCategory) => {
    updateTransactionCategory(selectedCategory)
  }

  // Fetch transactions related to the merchant
  const fetchMerchantTransactions = async () => {
    const { data, error } = await supabase
      .from('all_transactions')
      .select(
        'id, merchant_name, amount, date, category_group, logo, description'
      )
      .eq('merchant_name', merchantName)

    if (error) {
      console.error('Error fetching merchant transactions:', error)
      return
    }

    setTransactions(data)
  }

  const getCategories = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('*')
        .ilike('name', `%${category_group}%`)

      if (categoryError) {
        console.error('Error fetching category details:', categoryError)
        return
      }

      if (categoryData.length > 0) {
        const matchedCategory = categoryData[0]
        setCategory({
          icon: matchedCategory.icon,
          color: matchedCategory.color,
          name: matchedCategory.name,
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  useEffect(() => {
    if (category_group) {
      category_group && getCategories() // Fetch category based on updated category_group
    }
    fetchMerchantTransactions()

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
  }, [merchantName, logo, category_group])

  // Format date function
  const formatDate = (dateStr) => {
    const today = new Date()
    const transactionDate = new Date(dateStr)

    const isToday = transactionDate.toDateString() === today.toDateString()
    const isYesterday =
      transactionDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString()

    if (isToday) return 'Today'
    if (isYesterday) return 'Yesterday'

    return transactionDate.toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Render a single transaction item
  const renderTransactionItem = ({ item }) => (
    <View className="flex flex-row justify-between items-center mx-4 mt-2 py-6 bg-white rounded-3xl shadow-md mb-5 px-4">
      <Image
        source={{ uri: item.logo }}
        className="w-10 h-10 rounded-full"
      />
      <View className="flex-1 ml-4">
        <Text className="font-pmedium text-sm mb-1">{item.description}</Text>
        <Text className="font-pregular text-xs text-gray-400">
          {formatDate(item.date)}
        </Text>
      </View>
      <Text className="font-pmedium text-base text-red-500">
        -${Math.abs(item.amount.toFixed(2))}
      </Text>
    </View>
  )

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex"
    >
      <ScrollView>
        <View className="h-full bg-white">
          <MoreHeader
            headertext="Merchant Details"
            icon={icons.Info}
            containerStyle="mb-4 px-4"
            handleImagePress={handleImagePress}
          />
          {/* Header */}
          <View className="flex-row justify-center w-full items-center mb-2 mt-8">
            <View className="flex justify-center items-center">
              <View className="h-45 w-45 rounded-full shadow-lg bg-white flex justify-center items-center">
                <Image
                  className="h-32 w-32 rounded-full"
                  source={{ uri: logo }}
                />
              </View>

              <Text className="font-psemibold text-xl mt-5">
                {merchantName}
              </Text>
            </View>
          </View>

          {/* Transactions List */}
          <View className="flex flex-row gap-1 justify-center w-full items-center mb-5">
            <Text className="font-pregular text-xs text-red-500">
              -${Math.abs(totalAmount).toFixed(2)}
            </Text>
            <Text className="text-gray-500 font-pregular text-xs">|</Text>
            <Text className="font-pregular text-xs text-gray-400">
              {totalTransactions} Transactions
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

          <Text className="font-pmedium text-xl px-4">Transactions</Text>
          {loading ? (
            <Spinner visible={true} />
          ) : transactions.length > 0 ? (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTransactionItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text className="text-center text-gray-500 mt-10">
              No transactions found for {merchantName}.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MerchantDetails
