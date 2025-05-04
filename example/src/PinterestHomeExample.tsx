/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { StyleSheet, View, Image } from 'react-native';
import { ResponsiveGrid } from 'react-native-flexible-grid';

export default function PinterestExample() {
  let idCounter = React.useRef(0);
  interface DataProp {
    id: number;
    widthRatio?: number;
    heightRatio?: number;
    imageUrl: string;
  }

  const getData = () => {
    const originalData = [
      {
        imageUrl: 'https://picsum.photos/200/300?random=1',
        widthRatio: 1,
        heightRatio: 4,
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=2',
        widthRatio: 1,
        heightRatio: 3,
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=3',
        widthRatio: 1,
        heightRatio: 4,
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=4',
        widthRatio: 1,
        heightRatio: 5,
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=5',
        widthRatio: 1,
        heightRatio: 5,
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=6',
        widthRatio: 1,
        heightRatio: 3,
      },
    ];

    let clonedData: DataProp[] = [];

    for (let i = 0; i < 5; i++) {
      const newData = originalData.map((item) => ({
        ...item,
        id: ++idCounter.current,
      }));
      clonedData = [...clonedData, ...newData];
    }

    return clonedData;
  };

  const renderItem = ({ item }: { item: DataProp }) => {
    return (
      <View style={styles.boxContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.box}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <ResponsiveGrid
        maxItemsPerColumn={2}
        data={getData()}
        renderItem={renderItem}
        itemUnitHeight={80} // set itemUnitHeight to control uneven tiles
        style={{
          padding: 5,
        }}
        showScrollIndicator={false}
        keyExtractor={(item: DataProp) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    padding: 5,
    width: '100%',
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
    borderRadius: 15,
  },
});
