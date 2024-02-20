import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CellGrid } from 'react-native-flexible-grid';

export default function App() {
  const data = React.useMemo(() => {
    const items = [];

    for (let i = 0; i < 200; i++) {
      items.push({
        widthRatio: 1,
        heightRatio: 1,
        text: (i + 1).toString(),
      });
    }

    return items;
  }, []);

  const renderItem = (item: any, _: number) => {
    return (
      <TouchableOpacity
        style={styles.boxContainer}
        onPress={() => {
          console.log(item.text, 'pressed');
        }}
      >
        <View style={styles.box}>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CellGrid
        maxWidthRatio={100}
        cellSize={80}
        data={data}
        viewportBuffer={1000}
        renderItem={renderItem}
        enableVirtualization={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 2,
  },
  box: {
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    backgroundColor: 'green',
  },
});
