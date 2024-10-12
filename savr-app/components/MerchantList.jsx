import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, Text } from 'react-native'
import MerchantItem from './MerchantItem'
import { supabase } from '../utils/SupabaseConfig'
import Spinner from 'react-native-loading-spinner-overlay'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'

const MerchantList = () => {
  const router = useRouter()
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)

  // Function to update merchant's category in state
  const updateMerchantCategory = (merchantName, newCategoryName) => {
    setMerchants((prevMerchants) =>
      prevMerchants.map((merchant) =>
        merchant.name === merchantName
          ? { ...merchant, category_group: newCategoryName }
          : merchant
      )
    )
  }

  // Fetch and process transactions from Supabase
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('all_transactions')
        .select('merchant_name, logo, amount, category_group')
        .lt('amount', 0) // Only fetch expenses
        .neq('merchant_name', null) // Only fetch if merchant name is not null

      if (error) {
        console.error('Error fetching transactions:', error)
        setLoading(false)
        return
      }

      // Reduce transactions by merchant name
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
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Trigger data fetch when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions()
    }, [])
  )

  if (loading) {
    return <Spinner visible={true} />
  }

  return (
    <FlatList
      data={merchants}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <MerchantItem
          merchant={item}
          onCategoryChange={updateMerchantCategory}
        />
      )}
      contentContainerStyle={{ padding: 10 }}
    />
  )
}

export default MerchantList
