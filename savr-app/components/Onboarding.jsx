import { View, Text, FlatList, Animated, StatusBar } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import slides from '../assets/slides'
import Paginator from './Paginator'

import OnboardingItem from './OnboardingItem'

const Onboarding = ({ onBackgroundColorChange, navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef(null)

  useEffect(() => {
    onBackgroundColorChange(slides[currentIndex].backgroundColor)
  }, [currentIndex])

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index)
    onBackgroundColorChange(slides[viewableItems[0].index].backgroundColor)
  }).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
    } else {
      navigation.navigate('SignUp')
    }
  }

  return (
    <View className="flex justify-center items-center">
      <StatusBar
        barStyle="light-content"
        backgroundColor={slides[currentIndex].backgroundColor}
      />

      <Paginator
        data={slides}
        scrollX={scrollX}
      />
      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <OnboardingItem
            item={item}
            scrollToNext={scrollToNext}
            isLastSlide={currentIndex === slides.length - 1}
            backgroundColor={item.backgroundColor}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        scrollEventThrottle={32}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
    </View>
  )
}

export default Onboarding
