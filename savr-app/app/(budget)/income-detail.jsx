import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Colors } from '../../constants/Colors'
import { ColorPicker, CustomButton } from '../../components'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { supabase } from '../../utils/SupabaseConfig'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

const IncomeDetail = () => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()

  const { incomeId } = useLocalSearchParams()
  useEffect(() => {
    console.log(incomeId)
    incomeId && getIncomeDetail()
  }, [incomeId])

  const getIncomeDetail = async () => {
    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('id', incomeId)
    console.log('data:', data)
  }
  const [selectedIcon, setSelectedIcon] = useState('IC')
  const [selectedColor, setSelectedColor] = useState(Colors.purple.light)

  const [categoryTitle, setCategoryTitle] = useState()
  const [amount, setAmount] = useState()
  const inputRef = useRef(null)
  const [selectedOption, setSelectedOption] = useState('Weekly')

  const options = ['Weekly', 'Monthly', 'Yearly']
  const handleIcon = (value) => {
    setSelectedIcon(value)
  }

  const handleCategoryTitle = (value) => {
    setCategoryTitle(value)
  }

  const handleSelectOption = (value) => {
    setSelectedOption(value)
  }
  // Function to validate and set the amount
  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setAmount(numericValue)
  }
  const focusTextInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  const onCreateIncome = async () => {
    const { data, error } = await supabase
      .from('income')
      .insert([
        {
          name: categoryTitle,
          icon: selectedIcon,
          amount: amount,
          period: selectedOption,
          color: selectedColor,
          created_by: email,
        },
      ])
      .select()
    console.log(data, error)
    if (data) {
      router.replace({
        pathname: '/(budget)/income-detail',
        params: {
          incomeId: data[0].id,
        },
      })
    }
  }
  return (
    <View className="px-3 py-6 bg-white h-full">
      <View
        className=""
        flex-1
        justify-between
        px-4
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="w-full flex justify-center">
            <View className="items-center justify-center">
              <View className="relative mb-5">
                <TextInput
                  className="text-center text-2xl font-pmedium p-10 rounded-full px-11 text-primary"
                  style={{ backgroundColor: selectedColor }}
                  maxLength={2}
                  onChangeText={handleIcon}
                >
                  {selectedIcon}
                </TextInput>
                <View className="flex items-center justify-center h-6 w-6 absolute bottom-0 right-2 bg-primary rounded-full">
                  <Image
                    source={icons.Pencil}
                    className="h-4 w-4 z-50"
                  />
                </View>
              </View>

              <ColorPicker
                selectedColor={selectedColor}
                setSelectedColor={(color) => setSelectedColor(color)}
              />
            </View>
            <TextInput
              placeholder="Income title"
              onChangeText={handleCategoryTitle}
              className="mt-10 font-pmedium text-lg border-b-2 border-gray-300 h-10"
            />
            <TouchableOpacity
              onPress={focusTextInput}
              activeOpacity={1}
            >
              <View className="flex flex-row items-center mt-10 mb-5 border-b-2 border-gray-300 h-10 justify-between">
                <Text className="font-pregular text-lg">Amount</Text>
                <View className="flex flex-row items-center justify-center gap-1">
                  <TextInput
                    ref={inputRef}
                    placeholder="0"
                    value={amount}
                    keyboardType="numeric"
                    onChangeText={handleAmountChange}
                    className="font-pregular text-lg mb-[2px]"
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View className="pb-4 mb-5">
              <Text className="font-pregular text-lg mb-4">How often?</Text>
              <View className="flex flex-row items-center space-x-4">
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectOption(option)}
                    className={`flex flex-row justify-center items-center h-10 px-4 rounded-3xl ${
                      selectedOption === option
                        ? 'bg-primary' // This color can be the dynamic `selectedColor`
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
      </View>
    </View>
  )
}

export default IncomeDetail
