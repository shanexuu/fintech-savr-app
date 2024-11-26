import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Colors } from '../../constants/Colors'
import { ColorPicker, CustomButton } from '../../components'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { supabase } from '../../utils/SupabaseConfig'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { CategoryBtn, MoreHeader } from '../../components'

const IncomeDetail = () => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const { incomeId, categoryId } = useLocalSearchParams()

  const [incomeData, setIncomeData] = useState(null)

  useEffect(() => {
    incomeId && getIncomeDetail()
  }, [incomeId, selectedColor])

  const handleImagePress = () => {
    router.back()
  }

  const getIncomeDetail = async () => {
    if (!incomeId) return

    // Fetch income data along with related category
    const { data: incomeData, error: incomeError } = await supabase
      .from('income')
      .select(
        `
        *,
        category (*)
      `
      )
      .eq('id', incomeId)
      .single() // Fetch a single record

    if (incomeData) {
      const income = incomeData
      setIncomeData(income)
      setSelectedIcon(income.icon)
      setCategoryTitle(income.name)
      setAmount(income.amount.toString())
      setSelectedOption(income.period)
      setSelectedColor(income.color)
      setCategory(income.category.name)
      setColor(income.category.color)
      setIcon(income.category.icon)
    } else if (incomeError) {
      console.error('Error fetching income details:', incomeError)
    }
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .eq('type', 'Income')

    if (data) {
      setCategories(data)
    } else if (error) {
      console.error('Error fetching categories:', error)
    }
  }
  const handleModalOpen = () => {
    fetchCategories()
    setModalVisible(true)
  }

  const [selectedIcon, setSelectedIcon] = useState('IC')
  const [selectedColor, setSelectedColor] = useState(Colors.purple.light)
  const [categoryTitle, setCategoryTitle] = useState()
  const [category, setCategory] = useState()
  const [color, setColor] = useState()
  const [icon, setIcon] = useState()
  const [amount, setAmount] = useState()
  const [categories, setCategories] = useState([])

  const inputRef = useRef(null)
  const [selectedOption, setSelectedOption] = useState('Weekly')

  const handleIcon = (newIcon) => {
    setSelectedIcon(newIcon)
    updateCategoryDetails(selectedColor, newIcon)
  }

  const handleColor = (newColor) => {
    console.log('Selected Color:', newColor) // Debugging
    setSelectedColor(newColor)
    updateCategoryDetails(newColor, selectedIcon)
  }

  const handleAmountChange = (text) => {
    // Check if the input is a valid float number or empty string
    if (/^\d*\.?\d*$/.test(text)) {
      setAmount(text) // Update the state with the valid input
    }
  }

  const focusTextInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Function to update the income details
  const onUpdateIncome = async () => {
    const { data, error } = await supabase
      .from('income')
      .update({
        name: category,
        icon: selectedIcon,
        amount: amount,
        period: selectedOption,
        color: selectedColor,
        created_by: email,
        category_id: categoryId,
      })
      .eq('id', incomeId)
      .select()

    if (data) {
      router.back()
    }
  }

  const updateCategoryDetails = async (updatedColor, updatedIcon) => {
    const { data, error } = await supabase
      .from('category')
      .update({
        color: updatedColor,
        icon: updatedIcon,
      })
      .eq('id', categoryId)

    if (error) {
      console.error('Error updating category details:', error)
    } else {
      console.log('Category updated:', data)
    }

    fetchCategories()
    getIncomeDetail()
  }

  // Function to delete the income entry
  const onDeleteIncome = async () => {
    try {
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .delete()
        .eq('id', incomeId)

      if (incomeError) {
        throw new Error('Error deleting income: ' + incomeError.message)
      }

      router.back()
    } catch (error) {
      console.error('Error during delete operation:', error)
    }
  }

  return (
    <SafeAreaView className="h-full">
      <View className="flex-1 justify-between px-4">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="w-full flex justify-center">
            <MoreHeader
              headertext="Income budget"
              icon={icons.Close}
              containerStyle="mb-8"
              handleImagePress={handleImagePress}
            />

            <View className="items-center justify-center">
              <View className="relative mb-5">
                <TextInput
                  className="text-center text-2xl font-pmedium p-10 rounded-full px-11 text-primary"
                  style={{ backgroundColor: selectedColor }}
                  maxLength={2}
                  onChangeText={handleIcon}
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
                setSelectedColor={handleColor}
              />
            </View>

            <View className="flex flex-row items-center mt-10 h-15 pb-4 border-b-2 border-gray-300 justify-between">
              <Text className="font-pmedium text-lg">Category</Text>
              <View className="flex flex-row items-center justify-center gap-1">
                <CategoryBtn
                  handlePress={handleModalOpen}
                  title={category}
                  icon={icon}
                  iconStyles={color}
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
                          Income category
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
                            title={category.name}
                            icon={category.icon}
                            iconStyles={category.color}
                            containerStyles="m-1"
                            handlePress={() => {
                              setCategory(category.name) // Set category name
                              setIcon(category.icon) // Set icon
                              setColor(category.color) // Set color
                              setModalVisible(false) // Close modal
                            }}
                          />
                        ))}
                      </View>
                    </View>
                  </SafeAreaView>
                </Modal>
              </View>
            </View>

            <TouchableOpacity
              onPress={focusTextInput}
              activeOpacity={1}
            >
              <View className="flex flex-row items-center mt-5 border-b-2 border-gray-300 h-15 pb-4 mb-5 justify-between">
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
        <View className="flex flex-row justify-center mb-6">
          <CustomButton
            title="Update"
            isLoading={!categoryTitle || !amount || !selectedOption}
            handlePress={onUpdateIncome}
            containerStyles="w-44 mr-5"
          />
          <CustomButton
            title="Delete"
            isLoading={!categoryTitle || !amount || !selectedOption}
            handlePress={() => setConfirmDeleteVisible(true)}
            containerStyles="w-44"
          />
          <Modal
            transparent={true}
            animationType="fade"
            visible={confirmDeleteVisible}
            onRequestClose={() => setConfirmDeleteVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-opacity-50">
              <View className="bg-white w-4/5 p-6 rounded-lg">
                <Text className="text-lg font-bold mb-4">Confirm Delete</Text>
                <Text className="text-gray-500 mb-6">
                  Are you sure you want to delete this income budget?
                </Text>

                <View className="flex flex-row justify-between">
                  <CustomButton
                    title="Cancel"
                    handlePress={() => setConfirmDeleteVisible(false)}
                    containerStyles="w-32 bg-gray-400"
                  />
                  <CustomButton
                    title="Delete"
                    handlePress={onDeleteIncome}
                    containerStyles="w-32 bg-primary"
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default IncomeDetail
