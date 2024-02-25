import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import InstagramExploreExample from './InstagramExploreExample';
import PinterestExample from './PinterestHomeExample';
import GridBoardExamplePage from './GridBoardExample';

type ScreenName =
  | 'Landing'
  | 'FlexGrid'
  | 'InstagramExplore'
  | 'Pinterest'
  | 'GridBoardExample';

interface LandingProps {
  onNavigate: (screenName: ScreenName) => void;
}

const Landing = ({ onNavigate }: LandingProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onNavigate('InstagramExplore')}
        style={styles.button}
      >
        <Text style={styles.text}>Instagram Explore Example </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onNavigate('Pinterest')}
        style={styles.button}
      >
        <Text style={styles.text}>Pinterest Example </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onNavigate('GridBoardExample')}
        style={styles.button}
      >
        <Text style={styles.text}>Grid Board Example </Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Landing');

  //Back handler
  useEffect(() => {
    const backAction = () => {
      if (currentScreen !== 'Landing') {
        navigate('Landing');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [currentScreen]);

  const navigate = (screenName: ScreenName) => {
    setCurrentScreen(screenName);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {currentScreen === 'Landing' && <Landing onNavigate={navigate} />}
      {currentScreen === 'InstagramExplore' && <InstagramExploreExample />}
      {currentScreen === 'Pinterest' && <PinterestExample />}
      {currentScreen === 'GridBoardExample' && <GridBoardExamplePage />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    width: '70%',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default App;
