import { Text, View } from 'react-native'
import React, { Component } from 'react'
import {SafeAreaView} from "react-native-safe-area-context";

export class MessagesScreen extends Component {
  render() {
    return (
        <SafeAreaView>
          <Text>MessagesScreen</Text>
        </SafeAreaView>
    )
  }
}

export default MessagesScreen