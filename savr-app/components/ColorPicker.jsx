import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  return (
    <View className="flex flex-row gap-5">
      {Colors.color_list.map((color, index) => (
        <TouchableOpacity
          key={index}
          testID={`color-option-${index}`}
          className="h-10 w-10 rounded-full"
          style={[
            { backgroundColor: color },
            selectedColor == color && {
              borderWidth: 4,
              borderColor: '#F0F0F0',
            },
          ]}
          onPress={() => setSelectedColor(color)}
        ></TouchableOpacity>
      ))}
    </View>
  )
}

export default ColorPicker
