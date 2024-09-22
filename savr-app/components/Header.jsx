import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons, images } from '../constants'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'

const Header = ({ headertext, icon, containerStyle, handlePress }) => {
  return (
    <View
      className={`flex flex-row w-full items-center justify-between ${containerStyle}`}
    >
      <View className="flex flex-row items-center">
        <View className="h-12 w-12 rounded-full flex items-center bg-gray-300 justify-center">
          <Image
            source={images.logo}
            className="w-8 h-8"
          />
        </View>

        <Text className="font-psemibold ml-4 text-2xl">{headertext}</Text>
      </View>
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePress}
        >
          <Image
            source={icon}
            className="w-7 h-7"
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header
