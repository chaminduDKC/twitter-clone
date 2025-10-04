// app/sso-callback.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function SSOCallback() {

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        router.replace("/(tabs)");
      } catch (err) {
        console.error("SSO Callback error:", err);
      }
    })();
  }, []);


  return null;
}
