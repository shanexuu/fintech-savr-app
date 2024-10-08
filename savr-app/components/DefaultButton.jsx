import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'
import React from 'react'
import { icons } from '../constants'

const DefaultButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  icon,
  iconBg,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-white rounded-3xl min-h-[70px] flex flex-row shadow-md justify-between p-5 items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading}
    >
      <View className="flex flex-row items-center">
        <View
          className={`h-10 w-10 flex justify-center items-center rounded-full bg-${iconBg} mr-4`}
        >
          <Image
            source={icons[icon]}
            className="h-6 w-6"
          />
        </View>

        <Text className={`text-primary font-pmedium text-lg ${textStyles}`}>
          {title}
        </Text>
      </View>
      <View>
        <Image
          source={icons.Next}
          className="h-5 w-5"
        />
      </View>
    </TouchableOpacity>
  )
}

export default DefaultButton
