import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const RoundBtn = ({ icon, size, onPress, containerStyles }) => {
  return (
    <TouchableOpacity
      className={`flex justify-center items-center rounded-full m-10 ${containerStyles}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={size}
        color="#000"
      />
    </TouchableOpacity>
  )
}

export default RoundBtn
