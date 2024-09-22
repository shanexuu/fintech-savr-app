import React, { memo, useState, useEffect, useRef } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { CategoryBtn } from '../components'
import { supabase } from '../utils/SupabaseConfig'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

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
    const { data, error } = await supabase.from('category').select('*')
    if (error) {
      console.error('Error fetching category details:', error)
      return
    }

    const matchedCategory = data.find((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    )

    if (matchedCategory) {
      setCategoryDetails({
        icon: matchedCategory.icon,
        color: matchedCategory.color,
      })
    }
  }

  useEffect(() => {
    if (categoryName) {
      getCategories()
    }
  }, [categoryName])

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
            icon={
              item.type === 'DEBIT' && item.category == null
                ? '❓'
                : categoryDetails?.icon
            }
            title={
              item.type === 'TRANSFER'
                ? 'Transfer'
                : item.type === 'PAYMENT' ||
                  (item.type === 'DEBIT' && item.category == null)
                ? 'Uncategorised'
                : categoryName
            }
            iconStyles={
              item.type === 'DEBIT' && item.category == null
                ? '#D9D8F7'
                : categoryDetails?.color
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  )
})
export default TransactionItem
