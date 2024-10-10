import { View, Text, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MoreHeader, FormField } from '../../components'
import { images, icons } from '../../constants'
import { useRouter } from 'expo-router'
import { useAuth, useUser } from '@clerk/clerk-expo'

const ChangePassword = () => {
  const { user } = useUser()

  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('') // Add state for current password
  const [password, setPassword] = useState('')
  const [confirmPassword, setConPassword] = useState('')

  const handleImagePress = () => {
    router.back()
  }

  const handlePasswordChange = async () => {
    // Validate if the new password and confirmPassword match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.')
      return
    }

    try {
      // Call the user's updatePassword method with currentPassword and newPassword
      await user.updatePassword({
        currentPassword: currentPassword, // Pass the current password
        newPassword: password,
      })

      Alert.alert('Success', 'Your password has been updated.')
      router.push('/settings')
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update the password.')
    }
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="h-full flex"
    >
      <MoreHeader
        headertext="Change password"
        icon={icons.Check}
        containerStyle="mb-10 px-4"
        handleImagePress={handleImagePress}
        handlePress={handlePasswordChange}
      />
      <View className="mx-4">
        {/* Input for current password */}
        <FormField
          title="Password"
          value={currentPassword}
          handleChangeText={setCurrentPassword}
          otherStyles="mt-7"
          keyboardType="password"
        />
        {/* Input for new password */}
        <FormField
          title="Enter your new password"
          value={password}
          handleChangeText={setPassword}
          otherStyles="mt-7"
          keyboardType="password"
        />
        {/* Input for confirming new password */}
        <FormField
          title="Confirm your password"
          value={confirmPassword}
          handleChangeText={setConPassword}
          otherStyles="mt-7"
          keyboardType="password"
        />
      </View>
    </SafeAreaView>
  )
}

export default ChangePassword
