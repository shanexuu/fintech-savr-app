import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native'
import React from 'react'

const Paginator = ({ data, scrollX }) => {
  const { width } = useWindowDimensions()
  return (
    <View className="flex flex-row mt-4">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [70, 100, 70],
          extrapolate: 'clamp',
        })
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        })
        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity }]}
            key={i.toString()}
          />
        )
      })}
    </View>
  )
}

export default Paginator

const styles = StyleSheet.create({
  dot: {
    height: 6,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 8,
  },
})
