import { View, Text, Modal, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const CoustomModal = () => {
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView className="flex-1 justify-end">
        <View className="bg-white w-full pb-10 h-2/3 rounded-t-3xl">
          <View className="flex flex-row justify-between px-5 py-5 mt-4">
            <Text className="font-psemibold text-xl">Accounts</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Image
                source={icons.Close}
                className="h-4 w-4 justify-items-end"
              />
            </TouchableOpacity>
          </View>

          <AccountList />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default CoustomModal
