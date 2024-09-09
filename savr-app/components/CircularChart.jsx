import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import PieChart from 'react-native-pie-chart'
import { Colors } from '../constants/Colors'

const CircularChart = () => {
  const widthAndHeight = 300
  const [values, setValues] = useState([1])
  const [sliceColor, setSliceColor] = useState([Colors.dark.text])

  return (
    <View className="relative w-full justify-center items-center bg-white">
      <View className="flex absolute bottom-1/2 justify-center items-center z-50">
        <Text
          className="font-pmedium text-5xl"
          style={{ lineHeight: 80 }}
        >
          $0
        </Text>
        <Text className="font-pregular text-xs text-gray-100">
          Total Budget
        </Text>
      </View>
      <View className="flex gap-8">
        <PieChart
          widthAndHeight={widthAndHeight}
          series={values}
          sliceColor={sliceColor}
          coverRadius={0.75}
          coverFill={'#FFF'}
        />
        <View className="w-full   flex flex-row justify-start gap-2 items-center">
          <View className="bg-gray-300 h-8 w-8 rounded-full"></View>
          <Text>NaN</Text>
        </View>
      </View>
    </View>
  )
}

export default CircularChart
