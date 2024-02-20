# react-native-flexible-grid

A flexible grid component inspired by CSS Grid for React Native

## Installation

```sh
npm install react-native-flexible-grid
```

## Usage

```jsx
import { CellGrid } from 'react-native-flexible-grid';

 export default function App() {

  const data = [
    {
      widthRatio: 1,
      heightRatio: 1,
      text: 'Cell 1',
    },
    {
      widthRatio: 1,
      heightRatio: 1,
      text: 'Cell 2',
    },
  ];

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
        maxWidthRatio={4}
        cellSize={80}
        data={data}
        viewportBuffer={200}
        renderItem={renderItem}
        enableVirtualization={true}
      />
    </View>
  );
}


```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](CONTRIBUTING.md)

---
