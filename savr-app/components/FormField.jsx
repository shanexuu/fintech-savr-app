import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyle,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyle}`}>
      <Text className="text-base font-pregular text-gray-100">{title}</Text>

      <View className="w-full h-10 border-b-2 border-gray-100 flex flex-row focus:border-primary items-center mb-6">
        <TextInput
          className="flex-1 text-primary font-pregular text-xl"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#000"
          onChangeText={handleChangeText}
          secureTextEntry={
            (title === 'Password' ||
              title === 'Enter your new password' ||
              title === 'Confirm your password') &&
            !showPassword
          }
          {...props}
        />

        {(title === 'Password' ||
          title === 'Enter your new password' ||
          title === 'Confirm your password') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eyeHide : icons.eye}
              className="w-6 h-6 opacity-80"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
