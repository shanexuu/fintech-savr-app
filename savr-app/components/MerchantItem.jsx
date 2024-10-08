import React, { memo, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CategoryBtn } from '../components'
import { supabase } from '../utils/SupabaseConfig'
import { icons } from '../constants'
import { useRouter } from 'expo-router'

const defaultCategories = require('../assets/data/category-data.json')
const Categories = defaultCategories.filter(
  (defaultCat) =>
    defaultCat.type === 'expense' && defaultCat.name !== 'Uncategorised'
)

const MerchantItem = memo(({ merchant }) => {
  const router = useRouter()
  const { id, name, logo, totalAmount, totalTransactions, category_group } =
    merchant
  const [category, setCategory] = useState(null)
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
  }

  const onMerchantsClick = () => {
    router.push({
      pathname: '/(more)/merchants-details',
      params: {
        merchantName: name,
        logo: logo,
        totalAmount: totalAmount,
        totalTransactions: totalTransactions,
        category_group: category_group,
      },
    })
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

    getCategories()
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
              {Categories.map((category) => (
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
