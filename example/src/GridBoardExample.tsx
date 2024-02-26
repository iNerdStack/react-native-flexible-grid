/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';

import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { FlexGrid } from 'react-native-flexible-grid';

export default function GridBoardExamplePage() {
  //generate sample data
  const data = () => {
    const items = [];

    for (let i = 0; i < 120; i++) {
      if (i % 12 === 1) {
        items.push({
          imageUrl: 'https://picsum.photos/200/300?random=' + i,
          name: 'John Doe',
          username: '@johndoe',
          tweet:
            'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.',
          tweetImage: 'https://picsum.photos/200/300?random=' + i,
          widthRatio: 6,
          heightRatio: 6,
        });
      } else {
        items.push({
          imageUrl: 'https://picsum.photos/200/300?random=' + i,
          name: 'John Doe',
          username: '@johndoe',
          tweet:
            'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog',
          widthRatio: 6,
          heightRatio: 3,
        });
      }
    }

    return items;
  };

  const renderItem = (item: any, _: number) => {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
        }}
      >
        <View style={styles.card}>
          <View style={styles.cardTitleContainer} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 15,
                }}
                resizeMode="cover"
              />
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.usernameText}>{item.username}</Text>
              </View>
            </View>

            <View>
              <Image
                source={require('../assets/x.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingTop: 10,
              flexDirection: 'column',
            }}
          >
            <Text style={styles.tweetText}>{item.tweet}</Text>

            <View
              style={{
                flex: 1,
                width: '100%',
                marginTop: 15,
              }}
            >
              <Image
                source={{ uri: item.tweetImage }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            padding: 70,
            backgroundColor: '#F0E6F6',
          }}
        >
          <Text
            style={{
              fontSize: 35,
              fontWeight: 'bold',
              marginBottom: 20,
              color: '#5E548E',
            }}
          >
            What's trending on X?
          </Text>

          <FlexGrid
            maxColumnRatioUnits={60}
            itemSizeUnit={60}
            data={data()}
            virtualizedBufferFactor={2}
            renderItem={renderItem}
            virtualization={true}
            showScrollIndicator={false}
            style={{
              flex: 1,
            }}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#5E548E',
              margin: 20,
            }}
          >
            Grid Board. Copyright Example
          </Text>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    flex: 1,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'column',
    padding: 5,
  },
  nameText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  usernameText: {
    color: 'grey',
    fontSize: 15,
    marginRight: 5,
    fontWeight: 'bold',
  },
  tweetText: {
    color: 'black',
    fontSize: 15,
  },
});
