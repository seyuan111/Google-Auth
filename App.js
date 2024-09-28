import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "955434983447-6rpqr7l9nmipgdq8qj6jqtu8d8m06cso.apps.googleusercontent.com",
    androidClientId: "955434983447-9gimv9ks8fjrskqu41s1qiuav0vn3db6.apps.googleusercontent.com"
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Google Auth!</Text>
      {userInfo ? (
        <View style={styles.userInfo}>
          <Text>Email: {userInfo.email}</Text>
          <Text>Name: {userInfo.name}</Text>
          <Text>Picture:</Text>
          <Image source={{ uri: userInfo.picture }} style={styles.picture} />
        </View>
      ) : (
        <Text>No user information available.</Text>
      )}
      <Button title="Sign in with Google" onPress={promptAsync} />
      <Button
        title="Log Out"
        onPress={() => {
          // Clear user info from AsyncStorage
          AsyncStorage.removeItem("@user")
            .then(() => {
              // Clear user info state
              setUserInfo(null);
            })
            .catch((error) => {
              console.error("Failed to clear user info: ", error);
            });
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    marginVertical: 20,
  },
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50, // To make it circular
  },
});