import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Switch,
  ScrollView,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { MoreHeader, CustomButton, DefaultButton } from '../../components'
import { icons, images } from '../../constants'
import { useRouter } from 'expo-router'
import { useAuth, useUser, useClerk } from '@clerk/clerk-expo'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'

const Settings = () => {
  const { user } = useUser()
  const { signOut } = useAuth()
  const username = user?.username || user?.firstName || 'Anonymous'
  const [firstName, setFirstName] = useState(user?.firstName)
  const [lastName, setLastName] = useState(user?.lastName)
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress)

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const router = useRouter()
  const navigation = useNavigation()

  const handleImagePress = () => {
    router.back()
  }

  const onCaptureImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
      base64: true,
    })

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`

      user?.setProfileImage({
        file: base64,
      })
    }
  }
  const passwordPress = () => {
    navigation.navigate('(more)/change-password')
  }
  const handleButtonPress = async () => {
    try {
      // This is not working!
      const result = await user?.update({
        firstName: firstName,
        lastName: lastName,
        email: email,
      })
      console.log('🚀 ~ file: profile.tsx:16 ~ onSaveUser ~ result:', result)
    } catch (e) {
      console.log(
        '🚀 ~ file: profile.tsx:18 ~ onSaveUser ~ e',
        JSON.stringify(e)
      )
    }
  }
  const handleSignOut = async () => {
    await signOut()
    router.replace('/sign-in')
  }
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="h-full flex"
    >
      <MoreHeader
        headertext="Settings"
        icon={icons.Check}
        containerStyle="mb-4 px-4"
        handleImagePress={handleImagePress}
        handleButtonPress={handleButtonPress}
      />
      <ScrollView>
        <View className="px-4 flex justify-center items-center">
          <TouchableOpacity
            className="relative h-24 w-24 rounded-full shadow-lg mt-8"
            onPress={onCaptureImage}
          >
            {user?.imageUrl ? (
              <Image
                className="h-24 w-24 rounded-full"
                source={{ uri: user?.imageUrl }}
              />
            ) : (
              <Image
                source={images.logo}
                className="h-24 w-24 rounded-full"
              />
            )}
            <View className="flex items-center justify-center h-8 w-8 absolute bottom-0 right-0 bg-primary  rounded-full">
              <Image
                source={icons.Camera}
                className="h-4 w-4 z-50 "
              />
            </View>
          </TouchableOpacity>
          <Text className="font-bold mt-8 text-primary text-2xl">
            Your details
          </Text>
        </View>
        <View className="flex flex-column justify-start items-start px-4 mt-10">
          <Text className="text-base font-pregular text-gray-100">
            First name
          </Text>
          <View className="w-full h-10 border-b-2 border-gray-100 flex flex-row focus:border-primary items-center mb-6">
            <TextInput
              className="flex-1 text-primary font-pregular text-xl"
              placeholder="First Name"
              value={firstName || ''}
              onChangeText={setFirstName}
            />
          </View>

          <Text className="text-base font-pregular text-gray-100">
            Last name
          </Text>
          <View className="w-full h-10 border-b-2 border-gray-100 flex flex-row focus:border-primary items-center mb-6">
            <TextInput
              className="flex-1 text-primary font-pregular text-xl"
              placeholder="Last Name"
              value={lastName || ''}
              onChangeText={setLastName}
            />
          </View>

          <Text className="text-base font-pregular text-gray-100">Email</Text>
          <View className="w-full h-10 border-b-2 border-gray-100 flex flex-row focus:border-primary items-center mb-6">
            <TextInput
              className="flex-1 text-primary font-pregular text-xl"
              placeholder="Email"
              value={email || ''}
              onChangeText={setEmail}
            />
          </View>
        </View>
        <View className="px-4 flex justify-center items-center">
          <Text className="font-bold mt-8 text-primary text-2xl">Security</Text>
        </View>

        {/* <View className="px-4 mt-10 flex flex-row justify-between">
          <View className="flex flex-row items-center bg-white py-4 rounded-xl px-5">
            <Text className="font-pregular text-lg mr-2">Face ID</Text>
            <Switch
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <View className="flex flex-row items-center bg-white py-4 rounded-xl px-5">
            <Text className="font-pregular text-lg mr-2">PIN login</Text>
            <Switch
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View> */}

        <DefaultButton
          title="Change password"
          handlePress={passwordPress}
          containerStyles="mt-7 mx-4"
          icon="Key"
          iconBg="purple-100"
        />

        <View className="flex px-4 mt-10">
          <CustomButton
            title="Sign out"
            handlePress={handleSignOut}
            containerStyles="mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
