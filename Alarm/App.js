/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  Modal,
  useColorScheme,
  View,
} from 'react-native';
import { useState, useEffect } from 'react';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Alarm from './screens/alarm';
import Timer from './screens/timer';
import Stopwatch from './screens/stopwatch';
import Splash from './screens/splash';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Apptwo from './app2';

const App: () => Node = () => {
  const [screen, setScreen] = useState(true);
  return (
    <View style={styles.container} >
      <Modal visible={screen} animationType='fade'>
        <View style={styles.imageview}>
          <Image source={require('./assets/7.png')} style={styles.image} />
        </View>
        <Splash onPress={() => setScreen(false)} />
      </Modal>
      <Modal visible={!screen} animationType='fade'>
        <Apptwo />
      </Modal>
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#23343b',
  },
  image: {
    paddingHorizontal: 45,
    paddingTop: 100,
  },
  imageview: {
    backgroundColor: '#23343b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  }
});

export default App;
