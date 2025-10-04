import { Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignOutButton from '@/components/SignOutButton';

export default function HomeScreen() {
  
  const router = useRouter();
  
    return (
      <SafeAreaView>
        <Text>HomeScreenhttp</Text>
       <SignOutButton />
      </SafeAreaView>
    )
  
}

