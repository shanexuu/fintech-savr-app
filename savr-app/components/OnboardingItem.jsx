import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Button,
} from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'

const OnboardingItem = ({
  item,
  scrollToNext,
  isLastSlide,
  scrollToLast,
  backgroundColor,
  navigation,
}) => {
  const { width } = useWindowDimensions()
  const handleSkip = () => {
    router.push('/sign-up')
  }
  return (
    <View
      className="justify-center items-center w-full px-4"
      style={[{ width, backgroundColor }]}
    >
      <Image
        className="justify-center object-contain mb-6 mt-4 "
        source={item.image}
        reziseMode="container"
        style={{ width: 349, height: 349 }}
      />
      <View className="flex">
        <Text className="text-4xl font-pbold text-center mb-6">
          {item.title}
        </Text>
        <Text className="text-base font-pregular text-center mb-12">
          {item.description}
        </Text>

        <TouchableOpacity
          onPress={scrollToNext}
          style={styles.button}
          activeOpacity={0.8}
          className="flex justify-center items-center"
        >
          <Text style={styles.buttonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OnboardingItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
