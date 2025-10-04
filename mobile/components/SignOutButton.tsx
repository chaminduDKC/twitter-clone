import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSocialLogin } from '@/hooks/useSocialLogin';
import { Feather } from '@expo/vector-icons';

const SignOutButton = () => {
    const {handleLogOut} = useSocialLogin();
  return (
    <TouchableOpacity onPress={()=> handleLogOut()}>
      <Feather color={"red"} size={24} name='log-out' />
    </TouchableOpacity>
  )
}

export default SignOutButton