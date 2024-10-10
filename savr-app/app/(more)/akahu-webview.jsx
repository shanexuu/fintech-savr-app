import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MoreHeader } from '../../components'
import { icons } from '../../constants'
import { useRouter } from 'expo-router'

const AkahuWebView = () => {
  const router = useRouter()
  const handleImagePress = () => {
    router.back()
  }
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="h-full flex bg-white"
    >
      <MoreHeader
        containerStyle="mb-4 px-4"
        handleImagePress={handleImagePress}
        headertext="Connect your accounts"
      />
      <WebView
        className="flex-1"
        startInLoadingState={true}
        source={{ uri: 'https://my.akahu.nz/connections' }}
      />
    </SafeAreaView>
  )
}

export default AkahuWebView
