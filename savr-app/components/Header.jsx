import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons, images } from '../constants'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'

const Header = ({ headertext, icon, containerStyle, handlePress }) => {
  const { user } = useUser()
  const avatar = user?.imageUrl
  const navigation = useNavigation()
  const avatarPress = () => {
    navigation.navigate('(more)/settings')
  }
  return (
    <View
      className={`flex flex-row w-full items-center justify-between ${containerStyle}`}
    >
      <View className="flex flex-row items-center">
        <View className="h-12 w-12 rounded-full flex items-center bg-gray-300 justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={avatarPress}
          >
            <Image
              source={{ uri: avatar }}
              className="w-12 h-12 rounded-full"
            />
          </TouchableOpacity>
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
