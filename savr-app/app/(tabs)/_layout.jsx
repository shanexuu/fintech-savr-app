import { Image, View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'
import { StatusBar } from 'expo-status-bar'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2 mt-4">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pmedium'} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2E2E2E',
          tabBarInactiveTintColor: '#82828A',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 100,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 }, // Position the shadow (for iOS)
            shadowOpacity: 0.04,
            shadowRadius: 5, // Set the blur radius of the shadow (for iOS)
            elevation: 10, // Add elevation for shadow (for Android)
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: 'Budget',
            headerShown: false,

            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: '20px',
            },
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.budget}
                color={color}
                name="Budget"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: '20px',
            },
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.transaction}
                color={color}
                name="Transactions"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: '20px',
            },
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.more}
                color={color}
                name="More"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar
        backgroundColor="#fff"
        style="dark"
      />
    </>
  )
}

export default TabsLayout
