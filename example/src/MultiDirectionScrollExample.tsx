/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlexGrid } from 'react-native-flexible-grid';

const MultiDirectionScrollExample = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataProp[]>([]);

  let idCounter = React.useRef(0);

  interface DataProp {
    widthRatio: number;
    heightRatio: number;
    id: number;
    [key: string]: any;
  }

  const loadData = () => {
    // console.log('loadData called');
    if (loading) return; // Prevent multiple loads
    setLoading(true);

    setTimeout(() => {
      // Simulate network request
      const newData = getData(7);

      setData((prevData) => [...prevData, ...newData]); // Append new data
      setLoading(false);
    }, 1000);
  };

  const getData = (repeatedTimes: number) => {
    const originalData = [
      { widthRatio: 2, heightRatio: 2 },
      { widthRatio: 1, heightRatio: 1 },
      { widthRatio: 1, heightRatio: 1 },
      { widthRatio: 2, heightRatio: 1 },
      { widthRatio: 2, heightRatio: 1 },
      { widthRatio: 3, heightRatio: 1 },
      { widthRatio: 2, heightRatio: 1 },
      { widthRatio: 1, heightRatio: 1 },
    ];

    let clonedData: DataProp[] = [];

    for (let i = 0; i < repeatedTimes; i++) {
      const newData = originalData.map((item) => ({
        ...item,
        id: ++idCounter.current,
      }));
      clonedData = [...clonedData, ...newData];
    }

    return clonedData;
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View
        style={{
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          height: 100,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'lightyellow',
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
          }}
        >
          Multi-Direction Scroll Grid Example
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          padding: 1,
        }}
        onPress={() => {
          console.log(item.id, 'pressed');
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
            {item.id}
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
      <FlexGrid
        maxColumnRatioUnits={8}
        itemSizeUnit={60}
        data={data}
        renderItem={renderItem}
        HeaderComponent={renderHeader}
        FooterComponent={renderFooter}
        onHorizontalEndReached={loadData}
        onVerticalEndReached={loadData}
      />
    </View>
  );
};

export default MultiDirectionScrollExample;
