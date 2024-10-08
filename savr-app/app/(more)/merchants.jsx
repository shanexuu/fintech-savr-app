import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { MoreHeader, MerchantList } from '../../components'
import { icons } from '../../constants'
import { useRouter } from 'expo-router'

const Merchants = () => {
  const router = useRouter()
  const handleImagePress = () => {
    router.back()
  }
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex"
    >
      <View className="px-4">
        <MoreHeader
          headertext="Merchants"
          icon={icons.Info}
          containerStyle="mb-4"
          handleImagePress={handleImagePress}
        />
      </View>
      <MerchantList />
    </SafeAreaView>
  )
}

export default Merchants
