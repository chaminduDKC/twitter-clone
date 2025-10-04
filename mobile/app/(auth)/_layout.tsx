import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import {ActivityIndicator, View} from "react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if(!isLoaded){
    return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
    )
  }
  if (isSignedIn) {
    return <Redirect href={"/(tabs)"}/> 
  }

  return <Stack screenOptions={{
        headerShown:false,
  }} />
}