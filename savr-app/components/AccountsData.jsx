import { View, Text } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'

const AccountsData = () => {
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
  })

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NZ', options)
  }

  // Calculate total balance from accounts
  const calculateTotalBalance = (accounts) => {
    return (
      accounts?.reduce((total, item) => total + item.balance.current, 0) || 0
    )
  }

  const totalBalance = calculateTotalBalance(accountsData?.items)

  return (
    <View>
      <Text
        className="text-4xl font-pmedium"
        style={{ lineHeight: 56 }}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        ${totalBalance.toFixed(2)} NZD
      </Text>
    </View>
  )
}

export default AccountsData
