import React from 'react'
import { View, FlatList, Text } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

import AccountItem from './AccountItem'

const AccountList = () => {
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
  })

  if (isAccountsLoading) {
    return <Spinner visible={true} />
  }

  if (accountsError) {
    return (
      <View>
        <Text>Error loading data</Text>
      </View>
    )
  }

  return (
    <View>
      <FlatList
        data={accountsData?.items}
        renderItem={({ item, index }) => (
          <AccountItem
            item={item}
            accountsData={accountsData}
            isLast={index === accountsData.items.length - 1}
          />
        )}
        keyExtractor={(item) => item._id.toString()}
        windowSize={5}
      />
    </View>
  )
}

export default AccountList
