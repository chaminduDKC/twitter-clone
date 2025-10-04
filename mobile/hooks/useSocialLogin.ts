import { useClerk, useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useSocialLogin =  ()=>{
    const [loading, setLoading] = useState<boolean>(false);
    const {signOut} = useClerk();
    const router = useRouter();
    const {startSSOFlow} = useSSO();

    const handleLogin = async (strategy:"oauth_google" | "oauth_apple")=>{
        setLoading(true);
        try {
            const {createdSessionId, setActive, } = await startSSOFlow({strategy})
            if(createdSessionId && setActive){
                await setActive({session:createdSessionId});

            }
        } catch (error) {
            console.log(error);
            Alert.alert("Failed to login with "+ strategy.replace("oauth_",""), "Please try again later")
            
        } finally {
            setLoading(false);

        }

    }
    const handleLogOut = async ()=>{
        Alert.alert("Logging out", "Are you sure you want to log out?", [
            {
                text:"Cancel",style:"cancel"
            },
            {
                text:"Logout",style:"destructive", onPress: ()=> {
                    try {
                        signOut();
                    } catch (error) {
                        Alert.alert("Failed to log out", "Please try again later")
                        console.log(error);
                        
                    }
                }
                }
            ])
    }

    return {loading, handleLogin, handleLogOut}
}