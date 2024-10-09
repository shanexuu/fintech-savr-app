import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons, images } from '../constants'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'

const MoreHeader = ({
  headertext,
  icon,
  containerStyle,
  handlePress,
  handleImagePress,
  handleButtonPress,
}) => {
  return (
    <View
      className={`flex flex-row w-full items-center justify-between ${containerStyle}`}
    >
      <View className="flex flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleImagePress}
        >
          <Image
            source={icons.Previous}
            className="w-7 h-7"
          />
        </TouchableOpacity>

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
            onPress={handleButtonPress}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MoreHeader
