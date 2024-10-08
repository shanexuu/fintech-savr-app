import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { MoreHeader } from '../../components'
import { icons } from '../../constants'
import { useRouter } from 'expo-router'

const Settings = () => {
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
          headertext="Settings"
          icon={icons.Info}
          containerStyle="mb-4"
          handleImagePress={handleImagePress}
        />
        <Text>Settings</Text>
      </View>
    </SafeAreaView>
  )
}

export default Settings
