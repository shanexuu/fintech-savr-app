import React from 'react'
import { View, Text, Image } from 'react-native'

const TransactionItem = ({ item, accountsData }) => {
  const maxLength = 14

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
    <View className="flex flex-row justify-between items-center px-3 py-3 bg-white rounded-2xl m-2 shadow-md">
      <View className="flex flex-row gap-2 items-center">
        <View>
          <Image
            source={{ uri: logoUri }}
            className="w-10 h-10 rounded-full"
          />
        </View>
        <View>
          <Text className="font-psemibold text-lg">
            {truncateText(item.description, maxLength)}
          </Text>
          <View className="flex flex-row gap-1">
            <Text
              className={`font-psemibold text-sm ${
                item.amount >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.amount >= 0
                ? `+$${item.amount}`
                : `-$${Math.abs(item.amount)}`}
            </Text>
            <Text>|</Text>
            <Text className="font-pregular text-sm text-gray-100">
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text className="font-psemibold text-sm">
          {item.category?.groups?.personal_finance?.name}
        </Text>
      </View>
    </View>
  )
}

export default TransactionItem
