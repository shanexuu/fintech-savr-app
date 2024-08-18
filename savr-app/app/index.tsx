import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const App = () => {
  return (
    <View className="flex-1">
      <SafeAreaView>
        <Text className="text-center">App</Text>
      </SafeAreaView>
    </View>
  )
}

export default App
