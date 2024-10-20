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
  MoreHeader,
  CategoryBtn,
} from '../../components'
import { icons } from '../../constants'
import { supabase } from '../../utils/SupabaseConfig'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

// const defaultCategories = require('../../assets/data/category-data.json')

const AddIncome = () => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()

  // State variables
  const [selectedIcon, setSelectedIcon] = useState('💰') // Default icon
  const [selectedColor, setSelectedColor] = useState(Colors.purple.light) // Default color
  const [categoryTitle, setCategoryTitle] = useState('') // Store the selected category title
  const [amount, setAmount] = useState('') // Store the amount
  const inputRef = useRef(null)
  const [selectedOption, setSelectedOption] = useState('Weekly') // Default option
  const [category, setCategory] = useState() // Store selected category object
  const [modalVisible, setModalVisible] = useState(false) // Modal visibility
  const [categories, setCategories] = useState([]) // Fetched categories

  // Function to handle category selection
  const handleCategorySelection = (selectedCategory) => {
    setCategory(selectedCategory)
    setSelectedIcon(selectedCategory.icon)
    setSelectedColor(selectedCategory.color)
    setCategoryTitle(selectedCategory.name) // Set category title from selected
    setModalVisible(false) // Close modal after selection
  }

  // Function to validate and set the amount
  const handleAmountChange = (text) => {
    // Check if the input is a valid float number or empty string
    if (/^\d*\.?\d*$/.test(text)) {
      setAmount(text) // Update the state with the valid input
    }
  }

  // Fetch income details from Supabase
  useEffect(() => {
    getIncomeDetail()
  }, [])

  const getIncomeDetail = async () => {
    // Fetch categories from Supabase
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .eq('type', 'Income')
      .in('created_by', ['admin', email])
      .neq('name', 'Uncategorised')

    if (error) {
      console.error('Error fetching categories:', error)
    }

    if (data && data.length > 0) {
      const uniqueCategories = {}
      data.forEach((category) => {
        const { name, created_by } = category

        if (!uniqueCategories[name] || created_by === email) {
          uniqueCategories[name] = category
        }
      })

      // Convert the object back into an array
      const filteredData = Object.values(uniqueCategories)
      setCategories(filteredData)
    } else {
      // No categories in Supabase, fallback to default categories
      setCategories(defaultCategories)
    }
  }

  const onCreateIncome = async () => {
    const categoryId = category?.id

    const { data: incomeData, error: incomeError } = await supabase
      .from('income')
      .insert([
        {
          name: categoryTitle,
          icon: selectedIcon,
          amount: amount,
          period: selectedOption,
          color: selectedColor,
          created_by: email,
          category_id: categoryId,
        },
      ])
      .select()

    if (incomeError) {
      console.error('Error inserting income:', incomeError)
      return
    }

    router.back()
  }

  return (
    <SafeAreaView className="h-full">
      <View className="flex-1 justify-between px-4">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="w-full flex justify-center">
            <MoreHeader
              headertext="Add income budget"
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

            <View className="flex flex-row items-center mt-10 h-15 pb-4 border-b-2 border-gray-300 justify-between">
              <Text className="font-pmedium text-lg">Category</Text>
              <View className="flex flex-row items-center justify-center gap-1">
                <CategoryBtn
                  handlePress={() => setModalVisible(!modalVisible)}
                  title={categoryTitle || 'Select a category'}
                  icon={selectedIcon || '🔍'}
                  iconStyles={selectedColor || '#efefef'}
                />
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <SafeAreaView className="flex-1 justify-end">
                    <View className="bg-white w-full pb-10 rounded-t-3xl">
                      <View className="flex flex-row justify-between px-5 py-5 mt-4">
                        <Text className="font-psemibold text-xl">
                          Choose a category
                        </Text>
                        <TouchableOpacity
                          onPress={() => setModalVisible(false)}
                        >
                          <Image
                            source={icons.Close}
                            className="h-4 w-4 justify-items-end"
                          />
                        </TouchableOpacity>
                      </View>
                      <View className="flex flex-row flex-wrap items-center mx-2">
                        {categories.map((category) => (
                          <CategoryBtn
                            key={category.id}
                            title={category.name}
                            icon={category.icon}
                            iconStyles={category.color}
                            containerStyles="m-1"
                            handlePress={() =>
                              handleCategorySelection(category)
                            }
                          />
                        ))}
                      </View>
                    </View>
                  </SafeAreaView>
                </Modal>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => inputRef.current.focus()}
              activeOpacity={1}
            >
              <View className="flex flex-row items-center mt-10 mb-5 border-b-2 border-gray-300 h-10 justify-between">
                <Text className="font-pmedium text-lg">Amount</Text>
                <View className="flex flex-row items-center justify-center gap-1">
                  <TextInput
                    ref={inputRef}
                    placeholder="0"
                    value={amount}
                    keyboardType="decimal-pad"
                    onChangeText={handleAmountChange}
                    className="font-pregular text-lg mb-[2px]"
                  />
                </View>
              </View>
            </TouchableOpacity>

            <View className="pb-4 mb-5">
              <Text className="font-pmedium text-lg mb-4">How often?</Text>
              <View className="flex flex-row flex-wrap items-center gap-2">
                {['Weekly', 'Monthly', 'Yearly', 'One off'].map(
                  (option, index) => (
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
                  )
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="flex justify-center mb-6">
          <CustomButton
            title="Create"
            isLoading={!categoryTitle || !amount || !selectedOption}
            handlePress={onCreateIncome}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddIncome
