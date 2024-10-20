import React, { memo, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CategoryBtn } from '../components'
import { supabase } from '../utils/SupabaseConfig'
import { icons } from '../constants'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'

const MerchantItem = memo(({ merchant, onCategoryChange }) => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress

  const router = useRouter()
  const { id, name, logo, totalAmount, totalTransactions, category_group } =
    merchant
  const [category, setCategory] = useState(null)
  const [defaultCategory, setDefaultCategory] = useState([])

  const [modalVisible, setModalVisible] = useState(false) // Modal visibility
  const maxLength = 15

  // Function to truncate text if it exceeds the maximum length
  const truncateText = (text, length) => {
    if (text && text.length > length) {
      return text.substring(0, length) + '...'
    }
    return text
  }

  // Function to update the category_group in the all_transaction table
  const updateTransactionCategory = async (selectedCategory) => {
    try {
      const { error } = await supabase
        .from('all_transactions') // The table to update
        .update({ category_group: selectedCategory.name }) // Updating the category_group field
        .eq('merchant_name', name) // Matching based on merchant name (you can adjust this if using another identifier)

      if (error) {
        console.error(
          'Error updating category_group in all_transaction:',
          error
        )
        return
      }

      // Set the local state for category after a successful update
      setCategory(selectedCategory)
      setModalVisible(false)
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  // Function to handle category selection
  const handleCategorySelection = (selectedCategory) => {
    updateTransactionCategory(selectedCategory)
    onCategoryChange(name, selectedCategory.name)
  }

  const onMerchantsClick = () => {
    router.push({
      pathname: '/(more)/merchants-details',
      params: {
        merchantName: name,
        logo: logo,
        totalAmount: totalAmount,
        totalTransactions: totalTransactions,

        category_group: category?.name || category_group,
        onCategoryChange: (merchantName, newCategoryName) =>
          onCategoryChange(merchantName, newCategoryName),
      },
    })

    console.log(category?.name)
  }

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from('category')
          .select('*')
          .ilike('name', `%${category_group}%`) // Using merchant's category_group to match category

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

    const getAllCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('category')
          .select('*')
          .eq('type', 'Expense')
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

    getCategories()
    getAllCategories()
  }, [category_group])

  return (
    <TouchableOpacity onPress={onMerchantsClick}>
      <View className="flex flex-row justify-between items-center mx-4 mt-5 py-6 bg-white rounded-3xl shadow-md mb-5 px-4">
        <View className="flex flex-row gap-2 items-center">
          <Image
            source={{ uri: logo }}
            className="w-9 h-9 rounded-full"
          />
          <View>
            <Text className="font-pmedium text-base">
              {truncateText(name, maxLength)}
            </Text>
            <View className="flex flex-row gap-1">
              <Text className="font-pregular text-xs text-red-500">
                -${Math.abs(totalAmount.toFixed(2))}
              </Text>
              <Text className="text-gray-400 font-pregular text-xs">|</Text>
              <Text className="font-pregular text-xs text-gray-400">
                {totalTransactions} Transactions
              </Text>
            </View>
          </View>
        </View>
        <View>
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
        </View>
      </View>

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
              <Text className="font-psemibold text-xl">Merchant category</Text>
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
    </TouchableOpacity>
  )
})

export default MerchantItem
