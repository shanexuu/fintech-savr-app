import { Slot, SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    const inTabsGroup = segments[0] === '(auth)'

    console.log('User changed: ', isSignedIn)

    if (isSignedIn && !inTabsGroup) {
      router.replace('/home')
    } else if (!isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isSignedIn])

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(budget)/add-income"
        options={{
          headerShown: false,

          headerTitle: 'Add income',
        }}
      />
      <Stack.Screen
        name="(budget)/income-detail"
        options={{
          headerShown: false,
          headerTitle: 'Income Detail',
          headerBackTitle: 'Budget',
        }}
      />
      <Stack.Screen
        name="(budget)/expense-detail"
        options={{
          headerShown: false,
          headerTitle: 'Expense Detail',
          headerBackTitle: 'Budget',
        }}
      />
      <Stack.Screen
        name="(budget)/add-expense"
        options={{
          headerShown: false,
          headerTitle: 'Add expense',
        }}
      />

      <Stack.Screen
        name="(widgets)/accounts"
        options={{
          presentation: 'modal',
          headerShown: false,
          headerTitle: 'Add expense',
        }}
      />

      <Stack.Screen
        name="(more)/accounts"
        options={{
          headerShown: false,
          headerTitle: 'Accounts',
          headerBackTitle: 'More',
        }}
      />
      <Stack.Screen
        name="(more)/connect-accounts"
        options={{
          headerShown: false,
          headerTitle: 'Connect Account',
          headerBackTitle: 'More',
        }}
      />
      <Stack.Screen
        name="(more)/merchants"
        options={{
          headerShown: false,
          headerTitle: 'Merchants',
          headerBackTitle: 'More',
        }}
      />
      <Stack.Screen
        name="(more)/settings"
        options={{
          headerShown: false,
          headerTitle: 'Settings',
          headerBackTitle: 'More',
        }}
      />
      <Stack.Screen
        name="(more)/merchants-details"
        options={{
          headerShown: false,
          headerTitle: 'Merchants Details',
          headerBackTitle: 'More',
        }}
      />
    </Stack>
  )
}

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  )
}

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  })
  useEffect(() => {
    if (error) throw error
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error])

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={publishableKey}
    >
      <QueryClientProvider client={queryClient}>
        <InitialLayout />
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout
