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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ResponsiveGrid
        maxItemsPerColumn={4}
        data={data}
        renderItem={(item, _) => (
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              padding: 2,
            }}
            onPress={() => {
              console.log(item.text, 'pressed');
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
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
