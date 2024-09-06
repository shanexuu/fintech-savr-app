import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  RoundBtn,
  DonutChart,
  RenderItem,
  CircularChart,
} from '../../components'
import { useSharedValue, withTiming } from 'react-native-reanimated'
import { supabase } from '../../utils/SupabaseConfig'
import { generateRandomNumbers } from '../../utils/GenerateRandomNumbers'
import { calculatePercentage } from '../../utils/CalculatePercentage'
import { useFont } from '@shopify/react-native-skia'

const RADIUS = 160
const STROKE_WIDTH = 30
const OUTER_STROKE_WIDTH = 46
const GAP = 0.04

const Budget = () => {
  useEffect(() => {})

  const getCategoryList = async () => {
    const { data, error } = await supabase.from('category').select('*')

    console.log('data:', data)
  }

  const n = 5
  const [data, setData] = useState([])
  const totalValue = useSharedValue(0)
  const decimals = useSharedValue([])
  const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433']

  const generateData = () => {
    const generateNumbers = generateRandomNumbers(n)
    const total = generateNumbers.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    )
    const generatePercentages = calculatePercentage(generateNumbers, total)
    const generateDecimals = generatePercentages.map(
      (number) => Number(number.toFixed(0)) / 100
    )
    totalValue.value = withTiming(total, { duration: 1000 })
    decimals.value = [...generateDecimals]

    const arrayOfObjects = generateNumbers.map((value, index) => ({
      value,
      percentage: generatePercentages[index],
      color: colors[index],
    }))

    setData(arrayOfObjects)
  }

  const font = useFont(require('../../assets/fonts/Poppins-Regular.ttf'), 60)
  const smallFont = useFont(
    require('../../assets/fonts/Poppins-SemiBold.ttf'),
    25
  )

  if (!font || !smallFont) {
    return <View />
  }

  return (
    <View className="h-full bg-white p-4">
      <View className=" bg-white w-full p-4 flex flex-row justify-between items-center  rounded-[50px] shadow-md">
        <TouchableOpacity>
          <RoundBtn
            icon="Previous"
            imageStyles="h-5 w-5"
            containerStyles="h-8 w-8"
          />
        </TouchableOpacity>
        <Text className="font-pmedium text-base">This month</Text>
        <TouchableOpacity>
          <RoundBtn
            icon="Next"
            imageStyles="h-5 w-5"
            containerStyles="h-8 w-8"
          />
        </TouchableOpacity>
      </View>
      <View>
        <CircularChart />
      </View>
    </View>
  )
}

export default Budget
