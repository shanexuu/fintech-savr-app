import React, { memo } from 'react'
import { View, Text, Image } from 'react-native'
import { CategoryBtn } from '../components'

const TransactionItem = memo(({ item, accountsData }) => {
  const maxLength = 20

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

  return (
    <View className="flex flex-row justify-between items-center px-3 py-6 bg-white rounded-3xl shadow-md mb-6 w-full">
      <View className="flex flex-row gap-2 items-center">
        <View>
          <Image
            source={{ uri: logoUri }}
            className="w-10 h-10 rounded-full"
          />
        </View>
        <View>
          <Text className="font-pmedium text-base">
            {truncateText(item.description, maxLength)}
          </Text>
          <View className="flex flex-row gap-1">
            <Text
              className={`font-pmedium text-sm ${
                item.amount >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.amount >= 0
                ? `+$${item.amount}`
                : `-$${Math.abs(item.amount)}`}
            </Text>
            <Text className="text-gray-100 font-pbold">•</Text>
            <Text className="font-pregular text-sm text-gray-100">
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <CategoryBtn
          icon={
            item.category?.groups?.personal_finance?.name
              ? item.category.groups.personal_finance.name.replace(/\s+/g, '_')
              : 'Coin'
          }
        />
      </View>
    </View>
  )
})
export default TransactionItem
