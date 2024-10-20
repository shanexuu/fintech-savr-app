import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { icons, images } from '../constants'
import { Link, useRouter } from 'expo-router'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Header = ({
  headertext,
  icon,
  containerStyle,
  handlePress,
  modalTitle,
  modalContent,
}) => {
  const { user } = useUser()
  const avatar = user?.imageUrl
  const navigation = useNavigation()
  const avatarPress = () => {
    navigation.navigate('(more)/settings')
  }
  const [modalVisible, setModalVisible] = useState(false)

  const handleModalOpen = () => {
    setModalVisible(true)
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
          onPress={handleModalOpen}
        >
          <Image
            source={icon}
            className="w-7 h-7"
          />

          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-opacity-50">
              <View className="bg-gray-50 w-full px-5 py-6 rounded-3xl shadow-xl">
                <View className="flex flex-row justify-between">
                  <View>
                    <Text className="text-2xl font-psemibold mb-4">
                      {modalTitle}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Image
                        source={icons.Close}
                        className="h-5 w-5"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="text-gray-500 mb-6 font-pregular">
                  {modalContent}
                </Text>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header
