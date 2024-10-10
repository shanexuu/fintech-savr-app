import React, { useEffect, useState } from 'react'
import { View, FlatList, Text } from 'react-native'
import MerchantItem from './MerchantItem'
import { supabase } from '../utils/SupabaseConfig'
import Spinner from 'react-native-loading-spinner-overlay'
import { useQuery } from '@tanstack/react-query'

const formatTransactionDate = (dateString) => {
  const today = new Date()
  const transactionDate = new Date(dateString)

  const isToday = transactionDate.toDateString() === today.toDateString()
  const isYesterday =
    transactionDate.toDateString() ===
    new Date(today.setDate(today.getDate() - 1)).toDateString()

  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'

  return transactionDate.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const MerchantList = () => {
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
  })
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch and process data from Supabase based on Akahu's account IDs
  useEffect(() => {
    const fetchTransactions = async () => {
      if (accountsData && accountsData.items) {
        const uniqueAccountIds = [
          ...new Set(accountsData.items.map((item) => item._id)),
        ] // Ensure account IDs are unique
        console.log(uniqueAccountIds)

        const { data, error } = await supabase
          .from('all_transactions')
          .select('merchant_name, logo, amount, category_group')
          .lt('amount', 0)
          .neq('merchant_name', null)

        if (error) {
          console.error('Error fetching transactions:', error)
          setLoading(false)
          return
        }

        const merchantMap = data.reduce((acc, transaction) => {
          const { merchant_name, logo, amount, category_group } = transaction
          if (!acc[merchant_name]) {
            acc[merchant_name] = {
              name: merchant_name,
              logo: logo,
              totalAmount: 0,
              category_group: category_group,
              totalTransactions: 0,
            }
          }
          acc[merchant_name].totalAmount += amount
          acc[merchant_name].totalTransactions += 1
          return acc
        }, {})

        let merchantList = Object.values(merchantMap)
        merchantList.sort((a, b) => a.totalAmount - b.totalAmount)

        console.log('Processed merchant list:', merchantList)
        setMerchants(merchantList)
      }
      setLoading(false)
    }

    fetchTransactions()
  }, [accountsData])

  if (isAccountsLoading || loading) {
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
    <FlatList
      data={merchants}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => <MerchantItem merchant={item} />}
      contentContainerStyle={{ padding: 10 }}
    />
  )
}

export default MerchantList
