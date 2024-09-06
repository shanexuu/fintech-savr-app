import { View, Text } from 'react-native'
import React from 'react'
import PieChart from 'react-native-pie-chart'

const CircularChart = () => {
  const widthAndHeight = 250
  const []
  const series = [123, 321, 123, 789, 537]
  const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

  return (
    <View>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.45}
        coverFill={'#FFF'}
      />
    </View>
  )
}

export default CircularChart
