import { View, Text, Image, Switch } from 'react-native'
import React, { useState, memo } from 'react'

const AccountItem = memo(({ item, accountsData, isLast }) => {
  const [isEnabled, setIsEnabled] = useState(true)

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const getAccountLogo = (accountId) => {
    const account = accountsData?.items.find((acc) => acc._id === accountId)
    return account?.connection?.logo
  }

  const getAccountName = (accountId) => {
    const account = accountsData?.items.find((acc) => acc._id === accountId)
    return account?.connection?.name
  }

  const logoUri = item.connection?.logo || getAccountLogo(item._account)
  const accName = getAccountName(item._account)

  return (
    <View
      className={`flex flex-row mt-5 px-4 py-6 justify-between items-center bg-white shadow-md rounded-3xl mx-4 ${
        isLast ? 'mb-8' : ''
      }`}
    >
      <View className="flex flex-row items-center">
        <Image
          source={{ uri: logoUri }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-4">
          <Text className="font-psemibold text-base">{item.name}</Text>
          <Text className="font-pregular text-sm text-gray-400">
            {item?.formatted_account}
          </Text>
        </View>
      </View>
      <View>
        <Text className="font-pmedium text-base text-green-500">
          ${item?.balance?.current}
        </Text>
      </View>
    </View>
  )
})

export default AccountItem
