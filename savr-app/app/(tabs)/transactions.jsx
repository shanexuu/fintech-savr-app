import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

const Transactions = () => {
  useEffect(() => {
    const tra = async () => {
      const res = await fetch('api/info')
      const data = await res.json()
      console.log('akahu data:', data)
    }
    tra()
  }, [])

  return (
    <View>
      <Text>Transactions</Text>
    </View>
  )
}

export default Transactions
