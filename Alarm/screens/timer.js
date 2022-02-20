/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { Node } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Dimensions,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    useColorScheme,
    View,
    Animated,
    Modal,
    TextInput,
    ToastAndroid
} from 'react-native';
import Countdown from './timercountdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

const timers = [...Array(62).keys()].map((i) => i < 10 ? '0' + i : i);
const halftimers = [...Array(26).keys()].map((i) => i < 10 ? '0' + i : i);
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

function Buttons({ name, color, onPress, disabled }) {
    return (
        <TouchableOpacity
            onPress={() => !disabled && onPress()}
            style={styles.button}
            activeOpacity={disabled ? 1.0 : 0.7}>
            <Text>{name}</Text>
        </TouchableOpacity>
    )
}

const Timer: () => Node = () => {
    const scrollX1 = React.useRef(new Animated.Value(0)).current;
    const scrollX2 = React.useRef(new Animated.Value(0)).current;
    const scrollX3 = React.useRef(new Animated.Value(0)).current;

    const addProfile = (hours, minutes, seconds, totaltime) => {
        const key = Math.random().toString();
        let filteredProfiles = profile.filter(profile => profile.totaltime != totaltime)
        setProfile((currentProfiles) => {
            return [{ hours: hours, minutes: minutes, seconds: seconds, totaltime: totaltime, key: key }, ...filteredProfiles]
        });
        ToastAndroid.show('Profile Added', ToastAndroid.SHORT);
        setModalOpen(false);
    }

    const deleteProfile = (key) => {
        setProfile((prevProfiles) => {
            return prevProfiles.filter(profile => profile.key != key);
        })
    }

    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [seconds, setSeconds] = useState('00');
    const totaltime = 1000 * ((parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds));
    const [screen, setScreen] = useState(true);
    const [profile, setProfile] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        createChannels();
    })

    useEffect(() => {
        if (loaded) {
            persistState();
        }
    }, [profile]);

    useEffect(() => {
        readState();
    }, [])

    const persistState = async () => {
        const data = {
            profile
        };
        const dataString = JSON.stringify(data);
        await AsyncStorage.setItem('@profile', dataString);
    }

    const readState = async () => {
        const dataString = await AsyncStorage.getItem('@profile');
        try {
            const data = JSON.parse(dataString);
            setProfile(data.profile)
        } catch (e) {
            console.log('Couldnt Parse');
        }
        setLoaded(true);
    }

    const createChannels = () => {
        PushNotification.createChannel(
            {
                channelId: '1',
                channelName: 'Alarm Channel',
                playSound: true,
                soundName: 'ring1.mp3',
            })
    }

    const handleNotifications = (x) => {
        if (x !== 0) {
            PushNotification.localNotification({
                channelId: '1',
                title: 'ChronoType',
                message: 'Alarm Done!',
                allowWhileIdle: true,
                playSound: true,
            })
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Modal visible={modalOpen} animationType='slide'>
                <View style={styles.modal}>
                    <Text style={styles.title}>Profiles</Text>
                    <Text style={{
                        color: 'white',
                        paddingLeft: 25,
                        fontSize: 20,
                    }}>Click to launch Timer</Text>
                    {profile.length == 0 && (
                        <TouchableOpacity onPress={() => setModalOpen(false)}>
                            <View style={styles.emptylist}>
                                <Text style={styles.emptytext}>Add Profiles</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <FlatList
                        data={profile}
                        style={styles.list}
                        renderItem={({ item }) => (
                            <View style={styles.alarmlist}>
                                <TouchableOpacity onPress={() => { setModalOpen(false); setHours(item.hours); setMinutes(item.minutes); setSeconds(item.seconds); setScreen(false) }}>
                                    <Text style={styles.modaltext}>{item.hours}:{item.minutes}:{item.seconds}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    <Ionicons name='close' size={30} color='white' style={styles.delete} onPress={() => deleteProfile(item.key)} />
                                </View>
                            </View>
                        )}
                    />
                    <View style={styles.button2}>
                        <View style={styles.closeview}>
                            <Ionicons name='close' size={50} color='white' style={styles.close} onPress={() => setModalOpen(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
            {screen === false && (
                <View style={styles.countdown}>
                    <Countdown duration={totaltime} onPress={() => { setScreen(true) }} />
                </View>
            )}
            {
                screen === true && (
                    <View style={styles.timers}>
                        <Text style={styles.title}>Timer</Text>
                        <View style={styles.timer}>
                            <View style={styles.datemonth}>
                                <View>
                                    <Text style={[styles.datemonthtext, { left: 10 }]}>Hrs</Text>
                                    <Animated.FlatList
                                        data={halftimers}
                                        keyExtractor={item => item.toString()}
                                        bounces={false}
                                        onScroll={Animated.event(
                                            [{ nativeEvent: { contentOffset: { y: scrollX1 } } }],
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

                                            const opacity = scrollX1.interpolate({
                                                inputRange,
                                                outputRange: [.4, 1, .4]
                                            })

                                            const scale = scrollX1.interpolate({
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
                                    <Text style={styles.datemonthtext}>Min</Text>
                                    <Animated.FlatList
                                        data={timers}
                                        keyExtractor={item => item.toString()}
                                        bounces={false}
                                        onScroll={Animated.event(
                                            [{ nativeEvent: { contentOffset: { y: scrollX2 } } }],
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

                                            const opacity = scrollX2.interpolate({
                                                inputRange,
                                                outputRange: [.4, 1, .4]
                                            })

                                            const scale = scrollX2.interpolate({
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
                                <View>
                                    <Text style={styles.datemonthtext}>Sec</Text>
                                    <Animated.FlatList
                                        data={timers}
                                        keyExtractor={item => item.toString()}
                                        bounces={false}
                                        onScroll={Animated.event(
                                            [{ nativeEvent: { contentOffset: { y: scrollX3 } } }],
                                            { useNativeDriver: true }
                                        )}
                                        onMomentumScrollEnd={event => {
                                            const index = Math.round(event.nativeEvent.contentOffset.y / NUMBER_SIZE);
                                            setSeconds(timers[index]);
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
                            <View style={styles.buttons}>
                                <View style={styles.add}>
                                    <Ionicons name='menu' size={30} color='white' onPress={() => setModalOpen(true)} style={styles.icon} />
                                </View>
                                <View style={styles.add}>
                                    <Ionicons name='play' size={30} color='white' onPress={() => setScreen(false)} style={styles.icon} />
                                </View>
                                <View style={styles.add}>
                                    <Ionicons name='add' size={30} color='white' onPress={() => {
                                        addProfile(hours, minutes, seconds, 1000 * ((parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds)))
                                    }
                                    } style={styles.icon} />
                                </View>
                            </View>
                        </View>
                    </View>)
            }

        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        backgroundColor: '#23343b',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: 25,
        fontSize: 40,
    },

    text: {
        fontFamily: 'cooper',
        color: 'white',
        fontSize: 60,
    },
    timenumber: {
        height: NUMBER_SIZE,
        paddingHorizontal: window.width * 0.025,
    },
    datemonth: {
        backgroundColor: '#31444b',
        flexDirection: 'row',
        height: window.height * 0.37,
        marginTop: window.height * 0.03,
        borderRadius: 30,
        marginHorizontal: window.width * 0.1,
        justifyContent: 'center'
    },
    datemonthtext: {
        color: '#f0425d',
        fontFamily: 'sfbold',
        marginHorizontal: window.width * 0.025,

        paddingLeft: 5,
        marginTop: 10,
        fontSize: 30,
        opacity: 0.75,
    },

    add: {
        marginHorizontal: 10,
        backgroundColor: '#2c634c',
        height: 65,
        width: 65,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        color: 'white',
        backgroundColor: '#49e896',
        padding: 10,
        borderRadius: 50
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 60,
        backgroundColor: '#31444b',
        marginHorizontal: 30,
        paddingHorizontal: 10,
        borderRadius: 25,
        paddingVertical: 25,
        justifyContent: 'space-between',
    },
    modal: {
        flex: 1,
        backgroundColor: '#23343b',
        padding: 20,
    },
    list: {
        marginTop: 20,
    },
    alarmlist: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: '#f0425d',
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    modaltext: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'sf'
    },
    delete: {
        paddingHorizontal: 10,
    },
    button2: {
        alignItems: 'center',
    },
    closeview: {
        bottom: 45,
        backgroundColor: '#2c634c',
        height: 65,
        width: 65,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    close: {
        paddingLeft: 3,
        backgroundColor: '#49e896',
        borderRadius: 50
    },
    emptylist: {
        borderStyle: 'dashed',
        borderWidth: 3,
        borderColor: '#2c634c',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    emptytext: {
        fontWeight: 'bold',
        color: '#2c634c',
        fontSize: 20,
    },
});

export default Timer;
