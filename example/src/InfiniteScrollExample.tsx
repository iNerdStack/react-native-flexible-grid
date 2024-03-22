/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ResponsiveGrid } from 'react-native-flexible-grid';

const InfiniteScrollExample = () => {
  const [data, setData] = useState<DataProp[]>([]);
  const [loading, setLoading] = useState(false);

  let idCounter = React.useRef(0);

  interface DataProp {
    widthRatio: number;
    heightRatio: number;
    id: number;
    [key: string]: any;
  }

  const getData = (repeatedTimes: number) => {
    const originalData = [
      { widthRatio: 1, heightRatio: 1 },
      { widthRatio: 1, heightRatio: 1 },
      { widthRatio: 1, heightRatio: 2 },
      { widthRatio: 1, heightRatio: 3 },
      { widthRatio: 2, heightRatio: 1 },
      { widthRatio: 3, heightRatio: 1 },
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

  const loadData = () => {
    console.log('loadData called');
    if (loading) return; // Prevent multiple loads
    setLoading(true);

    setTimeout(() => {
      // Simulate network request
      const newData = getData(5);
      setData((prevData) => [...prevData, ...newData]); // Append new data
      setLoading(false);
    }, 1500);
  };

  // const renderFooter = () => {
  //   if (!loading) return null;
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // };

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
    <ResponsiveGrid
      maxItemsPerColumn={4}
      data={data}
      itemContainerStyle={{
        padding: 2,
      }}
      renderItem={renderItem}
      style={{
        backgroundColor: 'white',
      }}
      //FooterComponent={renderFooter}
      keyExtractor={(item) => item.id}
      onEndReached={loadData}
      onEndReachedThreshold={0.5}
      virtualization={false}
    />
  );
};

export default InfiniteScrollExample;
