import { ActivityIndicator, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { icons } from '../constants'
import Icons from '@/constants/Icons'

const CategoryBtn = ({
  title,
  icon,

  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-gray-200 rounded-3xl p-2 flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading}
    >
      <Image
        source={icons[icon]}
        className="w-7 h-7 opacity-90"
      />
      <Text className={`text-primary font-psemibold text-sm ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CategoryBtn
