import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Onboarding } from '../components'

const App = () => {
  const [backgroundColor, setBackgroundColor] = useState('#fff')

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar
        style="light"
        backgroundColor={backgroundColor}
      />
      <View className="h-full">
        <ScrollView
          contentContainerStyle={{
            height: '100%',
          }}
        >
          <View className="w-full flex justify-center items-center h-full">
            <Onboarding onBackgroundColorChange={handleBackgroundColorChange} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default App
