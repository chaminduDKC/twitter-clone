import { SignedIn, useAuth } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import { Redirect } from "expo-router";

export default function Index() {
    const {loading, handleLogin} = useSocialLogin();
    const [currentLoginMethod, setCurrentLoginMethod] = useState<string | null>(null);

  return (
      <View className="flex-1 items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">

          {/* Header Section */}
          <View className="items-center mb-10">
              <Image
                  source={require("../../assets/login-bro.png")}
                  className="w-64 h-64 mb-6"
                  resizeMode="cover"
              />
              <Text className="text-3xl font-extrabold text-blue-600 mb-2">
                  Welcome to the app!
              </Text>
              <Text className="text-gray-600 text-center">
                  Sign in to continue and explore amazing features 🚀
              </Text>
          </View>

          {/* Buttons Section */}
          <View className="w-full flex-col gap-4">
              {/* Google Login */}
              <TouchableOpacity
                  onPress={() => {
                      setCurrentLoginMethod("google");
                      handleLogin("oauth_google");
                  }}
                  className="flex-row items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm"
              >
                  {loading && currentLoginMethod === "google" ? (
                      <View className="flex-1 justify-center items-center">
                          <ActivityIndicator color="blue" />
                      </View>
                  ) : (
                      <View className="flex-row items-center">
                          <Image
                              source={require("../../assets/google.png")}
                              resizeMode="contain"
                              className="w-6 h-6 mr-3"
                          />
                          <Text className="text-gray-700 font-medium">Continue with Google</Text>
                      </View>
                  )}
              </TouchableOpacity>

              {/* Apple Login */}
              <TouchableOpacity
                  onPress={() => {
                      setCurrentLoginMethod("apple");
                      handleLogin("oauth_apple");
                  }}
                  className="flex-row items-center bg-black rounded-full px-5 py-3 shadow-sm"
              >
                  {loading && currentLoginMethod === "apple" ? (
                      <View className="flex-1 justify-center items-center">
                          <ActivityIndicator color="white" />
                      </View>
                  ) : (
                      <View className="flex-row items-center">
                          <Image
                              source={require("../../assets/apple.png")}
                              resizeMode="contain"
                              className="w-6 h-6 mr-3"
                          />
                          <Text className="text-white font-medium">Continue with Apple</Text>
                      </View>
                  )}
              </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="absolute bottom-8">
              <Text className="text-gray-500 text-sm">By continuing, you agree to our Terms & Privacy Policy</Text>
          </View>
      </View>
  );
}
