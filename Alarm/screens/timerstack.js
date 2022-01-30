import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Dimensions,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    useColorScheme,
    View,
    Animated,
    Modal,
    TextInput
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Timer from './timer';
import Countdown from './timercountdown';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function Screen2({ route }) {
    let data = route.params;
    return (
        <View><Text>{data}</Text>
            <Countdown duration={1000} /></View>
    )
}

export default function TimerStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Timer"
                component={Timer}
            />
            <Stack.Screen
                name="Countdown"
                component={Screen2}
            />
        </Stack.Navigator>
    );
}