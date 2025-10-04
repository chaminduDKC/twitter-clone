import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/clerk-expo'

const _layout = () => {

   const { isSignedIn } = useAuth()
  
    if (!isSignedIn) {
      return <Redirect href={"/(auth)"}/> 
    }

  const insets = useSafeAreaInsets();
  return (
   <Tabs screenOptions={{
    headerShown:false,
    tabBarActiveTintColor: "#1DA1F2",
    tabBarInactiveTintColor: "gray",
    tabBarStyle:{
      paddingTop:8,
      height: 60 + insets.bottom,
    }
   }}>
        <Tabs.Screen name="index"  options={{ title:"",  
          tabBarIcon: ({color, size})=> <Feather name="home" size={size} color={color} />,
        }} />
        <Tabs.Screen name="search" options={{title:"",
          tabBarIcon: ({color, size})=> <Feather name="search" size={size} color={color} />
        }} />
        <Tabs.Screen name="notifications" options={{title:"",
          tabBarIcon: ({color, size})=> <Feather name="bell" size={size} color={color} />
        }} />
        <Tabs.Screen name="messages" options={{title:"",
          tabBarIcon: ({color, size})=> <Feather name="mail" size={size} color={color} />
        }} />
        <Tabs.Screen name="profile" options={{title:"",
          tabBarIcon: ({color, size})=> <Feather name="user" size={size} color={color} />
        }} />
      </Tabs>
  )
}

export default _layout