import React, { useEffect, useState } from 'react'
import { View, FlatList, Text } from 'react-native'
import MerchantItem from './MerchantItem'
import { supabase } from '../utils/SupabaseConfig'
import Spinner from 'react-native-loading-spinner-overlay'

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
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch and process data from supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('all_transactions')
        .select('merchant_name, logo, amount, category_group')
        .lt('amount', 0)
        .neq('merchant_name', null)

      if (error) {
        console.error('Error fetching transactions:', error)
        return
      }

      // Process data: group by merchant, sum amounts, count transactions
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

      // Convert object to array for FlatList
      let merchantList = Object.values(merchantMap)

      // Sort merchants by totalAmount (most expensive first)
      merchantList.sort((a, b) => a.totalAmount - b.totalAmount)

      setMerchants(merchantList)
      setLoading(false)
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return <Spinner visible={true} />
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
