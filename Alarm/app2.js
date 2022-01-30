import React from 'react';
import type { Node } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    useColorScheme,
    View,
} from 'react-native';

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
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Apptwo: () => Node = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarShowLabel: true,
                    tabBarLabelStyle: { color: '#31444b', paddingRight: 40, },
                    tabBarIndicatorStyle: { backgroundColor: null },
                    tabBarPressColor: '#31444b',
                    tabBarStyle: {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        backgroundColor: '#31444b',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        height: 75,
                    },
                }}>
                <Tab.Screen name=" " component={Alarm} options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 50, backgroundColor: focused ? '#49e896' : null, borderRadius: 10, }}>
                            <Ionicons name="alarm" size={24} color={focused ? 'white' : '#95a8af'} />
                        </View>
                    )
                }} />
                <Tab.Screen name="S" component={Stopwatch} options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 50, backgroundColor: focused ? '#49e896' : null, borderRadius: 10, }}>
                            <Ionicons name="stopwatch" size={26} color={focused ? 'white' : '#95a8af'} />
                        </View>
                    )
                }} />
                <Tab.Screen name="T" component={Timer} options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 50, backgroundColor: focused ? '#49e896' : null, borderRadius: 10, }}>
                            <Ionicons name="hourglass" size={24} color={focused ? 'white' : '#95a8af'} />
                        </View>
                    )
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
});

export default Apptwo;
