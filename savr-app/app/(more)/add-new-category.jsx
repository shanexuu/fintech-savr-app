import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'

import {
  ColorPicker,
  CustomButton,
  Header,
  CategoryBtn,
} from '../../components'
import { icons } from '../../constants'
import { supabase } from '../../utils/SupabaseConfig'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

const AddNewCategoty = () => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()

  // State variables
  const [selectedIcon, setSelectedIcon] = useState('💰') // Default icon
  const [selectedColor, setSelectedColor] = useState(Colors.purple.light) // Default color
  const [categoryTitle, setCategoryTitle] = useState('') // Store the selected category title
  const [selectedOption, setSelectedOption] = useState('Expense')
  const inputRef = useRef(null)

  const onCreateCategory = async () => {
    const { data, error } = await supabase
      .from('category')
      .insert([
        {
          name: categoryTitle,
          icon: selectedIcon,
          color: selectedColor,
          created_by: email,
          type: selectedOption,
        },
      ])
      .select()
    if (error) {
      console.error('Error inserting category:', error)
      return
    }

    router.back()
  }
  return (
    <SafeAreaView className="h-full">
      <View className="flex-1 justify-between px-4">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="w-full flex justify-center">
            <Header
              headertext="Add new category"
              icon={icons.Close}
              containerStyle="mb-8"
              handlePress={() => router.back()}
            />
            <View className="items-center justify-center">
              <View className="relative mb-5">
                <TextInput
                  className="text-center text-2xl font-pmedium p-10 rounded-full px-11 text-primary"
                  style={{ backgroundColor: selectedColor }}
                  maxLength={2}
                  onChangeText={setSelectedIcon}
                  value={selectedIcon}
                />
                <View className="flex items-center justify-center h-6 w-6 absolute bottom-0 right-2 bg-primary rounded-full">
                  <Image
                    source={icons.Pencil}
                    className="h-4 w-4 z-50"
                  />
                </View>
              </View>
              <ColorPicker
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            </View>
            <TouchableOpacity
              onPress={() => inputRef.current.focus()}
              activeOpacity={1}
            >
              <View className="flex flex-row items-center mt-10 mb-5 border-b-2 border-gray-300 h-10 justify-between">
                <Text className="font-pmedium text-lg">Category name</Text>
                <View className="flex flex-row items-center justify-center gap-1">
                  <TextInput
                    ref={inputRef}
                    onChangeText={setCategoryTitle}
                    keyboardType="decimal-pad"
                    className="font-pregular text-lg mb-[2px]"
                  />
                </View>
              </View>
            </TouchableOpacity>

            <View className="pb-4 mb-5">
              <Text className="font-pmedium text-lg mb-4">Category type</Text>
              <View className="flex flex-row flex-wrap items-center gap-2">
                {['Expense', 'Income'].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedOption(option)}
                    className={`flex flex-row justify-center items-center h-10 px-4 rounded-3xl ${
                      selectedOption === option
                        ? 'bg-primary'
                        : 'bg-white border'
                    }`}
                  >
                    <Text
                      className={`font-pregular text-base text-center ${
                        selectedOption === option
                          ? 'text-gray-200'
                          : 'text-primary'
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="flex justify-center mb-6">
          <CustomButton
            title="Add Category"
            handlePress={onCreateCategory}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddNewCategoty
