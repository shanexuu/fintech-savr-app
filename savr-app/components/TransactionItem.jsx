import React, { memo, useState, useEffect, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import { CategoryBtn } from '../components'
import { supabase } from '../utils/SupabaseConfig'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { icons } from '../constants'

const TransactionItem = memo(({ item, accountsData }) => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()

  const [categoryDetails, setCategoryDetails] = useState(null)

  const maxLength = 12

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

  const logoUri = item.meta?.logo || getAccountLogo(item._account)

  const categoryName =
    item.type === 'TRANSFER' || item.type === 'DEBIT'
      ? item.category?.groups?.personal_finance?.name ===
        'Professional Services'
        ? 'Services'
        : item.category?.groups?.personal_finance?.name || item.type
      : 'Uncategorised'

  const getCategories = async () => {
    try {
      if (categoryName === 'Uncategorised') {
        // Fetch transaction from Supabase based on transaction_id
        const { data: transactionData, error: transactionError } =
          await supabase
            .from('transaction')
            .select('category_id')
            .eq('transaction_id', item._id)

        if (transactionError) {
          console.error('Error fetching transaction details:', transactionError)
          return
        }

        // Check if there is a category_id in the transaction
        if (transactionData?.length > 0 && transactionData[0].category_id) {
          const categoryId = transactionData[0].category_id

          // Fetch the corresponding category details from the category table
          const { data: categoryData, error: categoryError } = await supabase
            .from('category')
            .select('*')
            .eq('id', categoryId)

          if (categoryError) {
            console.error('Error fetching category details:', categoryError)
            return
          }

          if (categoryData.length > 0) {
            const matchedCategory = categoryData[0]
            setCategoryDetails({
              icon: matchedCategory.icon,
              color: matchedCategory.color,
              name: matchedCategory.name, // Store the category name for the title
            })
          }
        } else {
          // If no category_id or still uncategorised, use default values
          setCategoryDetails({
            icon: '❓',
            color: '#D9D8F7',
            name: 'Uncategorised', // Set default name as 'Uncategorised'
          })
        }
      } else {
        // Use the regular category data if not Uncategorised
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
            name: matchedCategory.name, // Store the category name for the title
          })
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  useEffect(() => {
    getCategories()
  }, [categoryName, item._id])

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
                item?.merchant?.name ? item?.merchant?.name : item.description,
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
              item.type === 'TRANSFER'
                ? 'Transfer'
                : categoryDetails?.name || 'Uncategorised'
            }
            iconStyles={categoryDetails?.color || '#D9D8F7'}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
})
export default TransactionItem
