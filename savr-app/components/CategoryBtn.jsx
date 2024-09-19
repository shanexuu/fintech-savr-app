import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  View,
  Button,
} from 'react-native'
import React from 'react'
import { icons } from '../constants'
import Icons from '@/constants/Icons'

const CategoryBtn = ({
  title,
  icon,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  iconStyles,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-gray-200 rounded-3xl px-1 py-1 flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading}
    >
      <View
        className={`w-8 h-8  rounded-full flex justify-center items-center`}
        style={{ backgroundColor: iconStyles }}
      >
        <Text className="w-5 h-5 opacity-90">{icon}</Text>
      </View>

      <Text
        className={`text-primary font-pregular text-xs ml-2 pr-2 ${textStyles}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CategoryBtn
