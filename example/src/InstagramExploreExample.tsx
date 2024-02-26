/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';
import { ResponsiveGrid } from 'react-native-flexible-grid';
import BottomNav from '../components/insta-bottom-nav';

export default function InstagramExploreExample() {
  const data = [
    {
      imageUrl: 'https://picsum.photos/200/300?random=1',
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=2',
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=3',
      widthRatio: 1,
      heightRatio: 2,
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=4',
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=5',
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=6',

      widthRatio: 1,
      heightRatio: 2,
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=7',

      widthRatio: 2,
      heightRatio: 2,
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=8',
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=9',
    },
    {
      imageUrl: 'https://picsum.photos/200/300?random=10',
    },
  ];

  const repeatedData = Array(5).fill(data).flat(); // repeated to display more items in grid

  const renderItem = (item: any, _: number) => {
    return (
      <View style={styles.boxContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.box}
          resizeMode="cover"
        />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ResponsiveGrid
        maxItemsPerColumn={3}
        data={repeatedData}
        renderItem={renderItem}
        showScrollIndicator={false}
        style={{
          padding: 5,
        }}
      />

      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}
      >
        <BottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    margin: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  box: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white',
    fontSize: 10,
    position: 'absolute',
    bottom: 10,
  },
});
