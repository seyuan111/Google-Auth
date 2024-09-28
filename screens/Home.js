import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Home = ({ route }) => {
  // Use optional chaining to safely destructure userInfo
  const userInfo = route.params?.userInfo || {}; // Provide a default empty object

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Signed in as: {userInfo.name ? userInfo.name : 'Guest'}
      </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});