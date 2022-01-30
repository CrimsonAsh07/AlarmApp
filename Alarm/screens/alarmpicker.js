import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    StatusBar,
    Dimensions,
    Animated,
    TouchableOpacity,
    Button,
    Text,
    View,
    TextInput,
    StyleSheet,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons'

const timers = [...Array(62).keys()].map((i) => i < 10 ? '0' + i : i);
const halftimers = [...Array(26).keys()].map((i) => i < 10 ? '0' + i : i);
const days = [...Array(33).keys()].map((i) => i < 9 ? '0' + (i + 1) : i + 1);
const months = [...Array(14).keys()].map((i) => i < 9 ? '0' + (i + 1) : i + 1);
const window = Dimensions.get('window');
const NUMBER_SIZE = window.width * 0.19;
const NUMBER_SPACING = window.width * 0.31;

function Clock({ interval, style }) {
    const zerofy = (n) => n < 10 ? '0' + n : n
    const duration = moment.duration(interval)
    const centiseconds = Math.floor(duration.milliseconds() / 10)
    return <Text style={style}>
        {zerofy(duration.minutes())}:
        {zerofy(duration.seconds())}:
        {zerofy(centiseconds)}</Text>
}

export default function AlarmPicker({ addAlarm }) {

    const scrollX1 = React.useRef(new Animated.Value(0)).current;
    const scrollX2 = React.useRef(new Animated.Value(0)).current;
    const scrollX3 = React.useRef(new Animated.Value(0)).current;
    const scrollX4 = React.useRef(new Animated.Value(0)).current;

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [date, setDate] = useState(1);
    const [mon, setMon] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.datemonth}>
                    <View>
                        <Text style={[styles.datemonthtext, { left: 10 }]}>Day</Text>
                        <Animated.FlatList
                            data={days}
                            keyExtractor={item => item.toString()}
                            bounces={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollX1 } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={event => {
                                const index = Math.round(event.nativeEvent.contentOffset.y / NUMBER_SIZE);
                                setDate(days[index]);
                            }}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={NUMBER_SIZE}
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={{
                                paddingTop: NUMBER_SIZE,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            renderItem={({ item, index }) => {

                                const inputRange = [
                                    (index - 1) * NUMBER_SIZE,
                                    index * NUMBER_SIZE,
                                    (index + 1) * NUMBER_SIZE,
                                ]

                                const opacity = scrollX1.interpolate({
                                    inputRange,
                                    outputRange: [.4, 1, .4]
                                })

                                const scale = scrollX1.interpolate({
                                    inputRange,
                                    outputRange: [.7, 1, .7]
                                })

                                return <View style={styles.timenumber}>
                                    {item < 32 && (
                                        <Animated.Text style={[styles.text,
                                        {
                                            opacity,
                                            transform: [{ scale }]
                                        }]}>
                                            {item}
                                        </Animated.Text>
                                    )}
                                </View>
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.datemonthtext}>Month</Text>
                        <Animated.FlatList
                            data={months}
                            keyExtractor={item => item.toString()}
                            bounces={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollX2 } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={event => {
                                const index = Math.round(event.nativeEvent.contentOffset.y / NUMBER_SIZE);
                                setMon(months[index]);
                            }}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={NUMBER_SIZE}
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={{
                                paddingTop: NUMBER_SIZE,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            renderItem={({ item, index }) => {

                                const inputRange = [
                                    (index - 1) * NUMBER_SIZE,
                                    index * NUMBER_SIZE,
                                    (index + 1) * NUMBER_SIZE,
                                ]

                                const opacity = scrollX2.interpolate({
                                    inputRange,
                                    outputRange: [.4, 1, .4]
                                })

                                const scale = scrollX2.interpolate({
                                    inputRange,
                                    outputRange: [.7, 1, .7]
                                })

                                return <View style={styles.timenumber}>
                                    {item < 13 && (
                                        <Animated.Text style={[styles.text,
                                        {
                                            opacity,
                                            transform: [{ scale }]
                                        }]}>
                                            {item}
                                        </Animated.Text>
                                    )}
                                </View>
                            }}
                        />
                    </View>
                </View>

                <View style={styles.datemonth2}>
                    <View>
                        <Text style={styles.datemonthtext2}>Hour</Text>
                        <Animated.FlatList
                            data={halftimers}
                            keyExtractor={item => item.toString()}
                            bounces={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollX3 } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={event => {
                                const index = Math.round(event.nativeEvent.contentOffset.y / NUMBER_SIZE);
                                setHours(halftimers[index]);
                            }}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={NUMBER_SIZE}
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={{
                                paddingTop: NUMBER_SIZE,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            renderItem={({ item, index }) => {

                                const inputRange = [
                                    (index - 1) * NUMBER_SIZE,
                                    index * NUMBER_SIZE,
                                    (index + 1) * NUMBER_SIZE,
                                ]

                                const opacity = scrollX3.interpolate({
                                    inputRange,
                                    outputRange: [.4, 1, .4]
                                })

                                const scale = scrollX3.interpolate({
                                    inputRange,
                                    outputRange: [.7, 1, .7]
                                })

                                return <View style={styles.timenumber}>
                                    {item < 24 && (
                                        <Animated.Text style={[styles.text,
                                        {
                                            opacity,
                                            transform: [{ scale }]
                                        }]}>
                                            {item}
                                        </Animated.Text>
                                    )}
                                </View>
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.datemonthtext2}>Minute</Text>
                        <Animated.FlatList
                            data={timers}
                            keyExtractor={item => item.toString()}
                            bounces={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollX4 } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={event => {
                                const index = Math.round(event.nativeEvent.contentOffset.y / NUMBER_SIZE);
                                setMinutes(timers[index]);
                            }}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={NUMBER_SIZE}
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={{
                                paddingTop: NUMBER_SIZE,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            renderItem={({ item, index }) => {

                                const inputRange = [
                                    (index - 1) * NUMBER_SIZE,
                                    index * NUMBER_SIZE,
                                    (index + 1) * NUMBER_SIZE,
                                ]

                                const opacity = scrollX4.interpolate({
                                    inputRange,
                                    outputRange: [.4, 1, .4]
                                })

                                const scale = scrollX4.interpolate({
                                    inputRange,
                                    outputRange: [.7, 1, .7]
                                })

                                return <View style={styles.timenumber}>
                                    {item < 60 && (
                                        <Animated.Text style={[styles.text,
                                        {
                                            opacity,
                                            transform: [{ scale }]
                                        }]}>
                                            {item}
                                        </Animated.Text>
                                    )}
                                </View>
                            }}
                        />
                    </View>
                </View>

                <View style={styles.button}>
                    <View style={styles.add}>
                        <Ionicons name='caret-forward' size={50} color='white' onPress={() => { addAlarm(date, hours, mon, minutes) }} style={styles.icon} />
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#23343b',
    },

    text: {
        fontFamily: 'cooper',
        color: 'white',
        fontSize: 60,
    },
    timenumber: {
        height: NUMBER_SIZE,
        paddingRight: 20,
        paddingLeft: 27,
    },
    datemonth: {
        backgroundColor: '#31444b',
        flexDirection: 'row',
        height: window.height * 0.37,
        marginTop: window.height * 0.05,
        justifyContent: 'center',
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    datemonth2: {
        backgroundColor: '#31444b',
        flexDirection: 'row',
        height: window.height * 0.37,
        marginTop: window.height * 0.045,
        justifyContent: 'center',
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    datemonthtext: {
        color: '#f0425d',
        fontFamily: 'sfbold',
        marginHorizontal: 20,
        marginTop: 10,
        fontSize: 30,
        opacity: 0.75,
    },
    datemonthtext2: {
        left: 5,
        color: '#f0425d',
        fontFamily: 'sfbold',
        marginHorizontal: 20,
        marginTop: 10,
        fontSize: 30,
        opacity: 0.75,
    },
    time: {
        flexDirection: 'row',
    },
    button: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    icon: {
        paddingLeft: 5,
        backgroundColor: '#49e896',
        borderRadius: 50,
        elevation: 3,
    },
    add: {
        backgroundColor: '#2c634c',
        bottom: 45,
        height: 65,
        width: 65,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

});
