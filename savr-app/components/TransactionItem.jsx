import React, { memo, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CategoryBtn } from '../components'
import { supabase } from '../utils/SupabaseConfig'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { icons } from '../constants'
import { Colors } from '../constants/Colors'
import { useFocusEffect } from '@react-navigation/native'

const TransactionItem = memo(({ item, accountsData }) => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()

  const [categoryDetails, setCategoryDetails] = useState(null)
  const [defaultCategory, setDefaultCategory] = useState([])

  const maxLength = 15
  const [modalVisible, setModalVisible] = useState(false)

  // Function to truncate text if it exceeds the maximum length
  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + '...'
    }
    return text
  }

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NZ', options)
  }

  const getAccountLogo = (accountId) => {
    const account = accountsData?.items.find((acc) => acc._id === accountId)
    return account?.connection?.logo
  }

  const logoUri = item.logo || getAccountLogo(item.account_id)

  const categoryName =
    item.type === 'TRANSFER' || item.type === 'DEBIT'
      ? item.category_group === 'Professional Services'
        ? 'Services'
        : item.category_group || item.type
      : 'Uncategorised'

  const updateTransactionCategory = async (selectedCategory) => {
    try {
      const { error } = await supabase
        .from('all_transactions') // The table to update
        .update({ category_group: selectedCategory.name }) // Updating the category_group field
        .eq('id', item.id)

      if (error) {
        console.error(
          'Error updating category_group in all_transaction:',
          error
        )
        return
      }

      // Set the local state for category after a successful update
      setCategoryDetails(selectedCategory)
      setModalVisible(false)
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  const getCategories = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('*')
        .ilike('name', `%${categoryName}%`)

      if (categoryError) {
        console.error('Error fetching category details:', categoryError)
        return
      }

      if (categoryData.length > 0) {
        const matchedCategory = categoryData[0]
        setCategoryDetails({
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
      let categoryType = ''
      if (item.amount >= 0) {
        categoryType = 'Income'
      } else {
        categoryType = 'Expense'
      }

      const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('type', categoryType)
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

  const handleCategorySelection = (selectedCategory) => {
    updateTransactionCategory(selectedCategory)
  }

  const handleAddCategory = () => {
    setModalVisible(false)
    router.push('/(more)/add-new-category')
  }

  useEffect(() => {
    getCategories()
    getAllCategories()
  }, [categoryName, item.id])

  // Add another useEffect to set the initial category details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('*')
        .ilike('name', `%${item.category_group || categoryName}%`) // Use the current category_group or categoryName

      if (categoryError) {
        console.error('Error fetching category details:', categoryError)
        return
      }

      if (categoryData.length > 0) {
        const matchedCategory = categoryData[0]
        setCategoryDetails({
          icon: matchedCategory.icon,
          color: matchedCategory.color,
          name: matchedCategory.name,
        })
      }
    }

    fetchCategoryDetails()
  }, [item.category_group, categoryName, item.id]) // Add item.category_group as a dependency

  const onTransactionClick = () => {
    router.push({
      pathname: '/(more)/transaction-details',
      params: {
        transactionId: item.id,
        merchantName: item.merchant_name || item.description,
        amount: item.amount,
        date: formatDate(item.date),
        category: categoryDetails?.name || categoryName,
        logo: logoUri,
      },
    })
  }

  return (
    <TouchableOpacity>
      <View className="flex flex-row justify-between items-center mx-4 mt-5 py-6 bg-white rounded-3xl shadow-md mb-5 px-4">
        <View className="flex flex-row gap-2 items-center">
          <View>
            <Image
              source={{ uri: logoUri }}
              className="w-9 h-9 rounded-full"
            />
          </View>
          <View>
            <Text className="font-pmedium text-base">
              {truncateText(
                item.merchant_name ? item.merchant_name : item.description,
                maxLength
              )}
            </Text>
            <View className="flex flex-row gap-1">
              <Text
                className={`font-pregular text-sm ${
                  item.amount >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {item.amount >= 0
                  ? `+$${item.amount}`
                  : `-$${Math.abs(item.amount)}`}
              </Text>
              <Text className="text-gray-400 font-pbold">•</Text>
              <Text className="font-pregular text-sm text-gray-400">
                {formatDate(item.date)}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <CategoryBtn
            icon={categoryDetails?.icon || '❓'}
            title={
              categoryDetails?.name ? categoryDetails?.name : 'Uncategorised'
            }
            iconStyles={categoryDetails?.color || '#D9D8F7'}
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
              <Text className="font-psemibold text-xl">
                Transaction category
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Image
                  source={icons.Close}
                  className="h-4 w-4 justify-items-end"
                />
              </TouchableOpacity>
            </View>
            <View className="flex flex-row flex-wrap items-center mx-2 w-full">
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
              <CategoryBtn
                title="Add new category"
                icon="✏️"
                iconStyles={Colors.purple.light}
                containerStyles="m-1"
                handlePress={() => handleAddCategory()}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </TouchableOpacity>
  )
})

export default TransactionItem
