import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { icons } from '@/constants'

const RoundBtn = ({ icon, size, onPress, containerStyles, imageStyles }) => {
  return (
    <TouchableOpacity
      className={`flex justify-center items-center rounded-full mb-2 ${containerStyles}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={icons[icon]}
        className={`${imageStyles}`}
      />
    </TouchableOpacity>
  )
}

export default RoundBtn
