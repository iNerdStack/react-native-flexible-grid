import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';

export default function BottomNav() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/instagram/home-fill.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/instagram/search.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/instagram/add-post.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/instagram/reels.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/instagram/profile.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
