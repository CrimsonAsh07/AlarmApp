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
    ScrollView
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PushNotification from "react-native-push-notification";
import SoundPlayer from 'react-native-sound-player';

const timers = [...Array(62).keys()].map((i) => i < 10 ? '0' + i : i);
const halftimers = [...Array(26).keys()].map((i) => i < 10 ? '0' + i : i);
const days = [...Array(33).keys()].map((i) => i < 9 ? '0' + (parseInt(i) + 1) : i + 1);
const months = [...Array(14).keys()].map((i) => i < 9 ? '0' + (parseInt(i) + 1) : i + 1);
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

    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [date, setDate] = useState('01');
    const [mon, setMon] = useState('01');
    const [nameBox, setNameBox] = useState(0);
    const [option, setOption] = useState('1');

    const [modalOpen, setModalOpen] = useState(false);

    const musicPlayer = (x) => {
        setOption(x);
        let name = 'ring' + x
        SoundPlayer.playSoundFile(name, 'mp3')
    }

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
                {nameBox == 1 && (
                    <View style={styles.properties}>
                        <Text style={styles.proptext}>Set Custom Ringtone</Text>
                        <View>
                            <TouchableOpacity style={styles.option} onPress={() => musicPlayer('1')}>
                                <Text style={styles.optiontext}>Alarm I</Text>
                                {option === '1' && (
                                    <Ionicons style={{ padding: 10, }} name='checkmark' color='green' size={24} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option} onPress={() => musicPlayer('2')}>
                                <Text style={styles.optiontext}>Alarm II</Text>
                                {option === '2' && (
                                    <Ionicons style={{ padding: 10, }} name='checkmark' color='green' size={24} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option} onPress={() => musicPlayer('3')}>
                                <Text style={styles.optiontext}>Digital Alarm</Text>
                                {option === '3' && (
                                    <Ionicons style={{ padding: 10, }} name='checkmark' color='green' size={24} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option} onPress={() => musicPlayer('4')}>
                                <Text style={styles.optiontext}>Chimes</Text>
                                {option === '4' && (
                                    <Ionicons style={{ padding: 10, }} name='checkmark' color='green' size={24} />
                                )}
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity style={styles.redokay} onPress={() => { setNameBox(0); SoundPlayer.stop() }} >
                            <Text style={styles.okay}>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.button}>
                    <View style={styles.add}>
                        <MaterialIcons name='graphic-eq' size={40} color='white' onPress={() => setNameBox(1)} style={[styles.icon, { paddingVertical: 8, paddingRight: 8, paddingLeft: 10 }]} />
                    </View>
                    <View style={styles.add}>
                        <Ionicons name='caret-forward' size={50} color='white' onPress={() => { addAlarm(date, mon, hours, minutes, option) }} style={styles.icon} />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        right: 0,
        left: 0,
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
    properties: {
        position: 'absolute',
        top: window.height * 0.3,
        backgroundColor: '#31444b',
        alignSelf: 'center',
        marginHorizontal: window.width * 0.015,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#f0425d'
    },
    proptext: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'cooper',
        paddingTop: 10,
        paddingBottom: 30,
        paddingHorizontal: 50,
    },
    redokay: {
        alignSelf: 'center',
        backgroundColor: '#f0425d',
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    okay: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'cooper',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderBottomColor: '#23343b',
        borderBottomWidth: 1,
    },
    optiontext: {
        fontFamily: 'cooper',
        fontSize: 20,
        color: 'white',
        paddingVertical: 10,
    },
});
