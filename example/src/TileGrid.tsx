/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ResponsiveGrid } from 'react-native-flexible-grid';

export default function TileGrid() {
  const data = [
    {
      widthRatio: 1,
      heightRatio: 1,
    },
    {
      widthRatio: 1,
      heightRatio: 1,
    },
    {
      widthRatio: 1,
      heightRatio: 2,
    },
    {
      widthRatio: 1,
      heightRatio: 3,
    },
    {
      widthRatio: 2,
      heightRatio: 1,
    },
    {
      widthRatio: 3,
      heightRatio: 1,
    },
  ];

  const repeatedData = Array(50).fill(data).flat();

  const renderItem = (_: any, index: number) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
        }}
        onPress={() => {
          console.log(index + 1, 'pressed');
        }}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FFA502',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 20,
            }}
          >
            {index + 1}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ResponsiveGrid
        maxItemsPerColumn={4}
        data={repeatedData}
        itemContainerStyle={{
          padding: 2,
        }}
        renderItem={renderItem}
        style={{
          backgroundColor: 'white',
        }}
      />
    </View>
  );
}
