import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const More = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>More</Text>
      <Link href="/(auth)/profile">Profile</Link>
    </View>
  )
}

export default More
