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
    Dimensions,
    Image,
    useColorScheme,
    View, Modal, Button, FlatList, TouchableOpacity, Card, Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import AlarmPicker from './alarmpicker';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PushNotification from "react-native-push-notification";
import { TextInput } from 'react-native-gesture-handler';
import SoundPlayer from 'react-native-sound-player';
import AsyncStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get('window');

const Alarm: () => Node = () => {

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')
            console.log(jsonValue)
            setAlarms(JSON.parse(jsonValue));
        } catch (e) {
            console.log(e)
            console.log('retrieving error')
        }
    }


    const storeData = async (alarms) => {
        try {
            console.log(JSON.stringify(alarms))
            const jsonValue = JSON.stringify(alarms)
            console.log(jsonValue)
            await AsyncStorage.setItem('@storage_Key', jsonValue)
        } catch (e) {
            console.log(e)
            console.log('storing error')
        }
    }

    PushNotification.configure({

        onNotification: function (notification) {
            console.log(notification.tag);
            setAlarms((prevAlarms) => {
                return prevAlarms.filter(alarm => alarm.key != notification.tag);
            });
        },
        requestPermissions: Platform.OS === 'ios',
        requestPermissions: true,
    })

    const [alert, setAlert] = useState('0')
    const [alarmprop, setAlarmProp] = useState(0)
    const [alarms, setAlarms] = useState([])
    const deleteAlarm = (key) => {
        setAlarms((prevAlarms) => {
            return prevAlarms.filter(alarm => alarm.key != key);
        });
        PushNotification.cancelLocalNotification(parseInt(key))
        handleAll(key)
    }

    const handleAll = (key) => {
        for (let i = 0; i < alarms.length; i++) {
            if (alarms[i].key !== key) {
                handleNotifications(alarms[i].day, alarms[i].month, alarms[i].hour, alarms[i].min, alarms[i].option, alarms[i].key)
            }
        }
    }

    const addAlarm = (day, month, hour, min, option) => {
        setModalOpen(false);
        const date = '2022-' + month + '-' + day + 'T' + hour + ':' + min
        var a = moment(date)
        var now = moment()
        /*To check for valid dates*/
        if (!a.isValid()) {
            setModalOpen(false)
            setAlert(1)
            return
        }
        /*To check for future dates only*/
        if (a.diff(now) < 0) {
            setModalOpen(false)
            setAlert(2)
            return
        }

        const key = Math.random().toString();
        setAlarms((currentAlarms) => {
            return [{ day: day, month: month, hour: hour, min: min, key: key, option: option }, ...currentAlarms]
        });

        storeData(alarms);
        handleNotifications(day, month, hour, min, option, key);
    }

    useEffect(() => {
        createChannels();
        storeData(alarms);
    }, [])

    const createChannels = () => {
        PushNotification.createChannel(
            {
                channelId: '1',
                channelName: 'Alarm Channel',
                autoCancel: false,
                soundName: 'ring1.mp3',
                number: 10
            })
        PushNotification.createChannel(
            {
                channelId: '2',
                channelName: 'Alarm Channel',
                soundName: 'ring2.mp3'
            })
        PushNotification.createChannel(
            {
                channelId: '3',
                channelName: 'Alarm Channel',
                soundName: 'ring3.mp3'
            })
        PushNotification.createChannel(
            {
                channelId: '4',
                channelName: 'Alarm Channel',
                soundName: 'ring4.mp3'
            })
    }

    const handleNotifications = (day, month, hour, min, option, key) => {
        let alarmdate = new Date(2022, month - 1, day, hour, min, 0)
        PushNotification.localNotificationSchedule({
            channelId: option,
            id: parseInt(key),
            title: 'Alarm Done!',
            message: 'Click to Close.',
            date: alarmdate,
            ongoing: true,
            tag: key,
        })
    }

    const [modalOpen, setModalOpen] = useState(false);
    return (
        <View style={styles.container}>
            <StatusBar color='#23343b' />
            <Modal visible={modalOpen}>
                <AlarmPicker addAlarm={addAlarm} />
                <View style={styles.button2}>
                    <View style={styles.closeview}>
                        <Ionicons name='close' size={50} color='white' style={styles.close} onPress={() => setModalOpen(false)} />
                    </View>
                </View>
            </Modal>
            <Text style={styles.title}>Alarms</Text>

            {alarms.length == 0 && (
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <View style={styles.emptylist}>
                        <Text style={styles.emptytext}>Add Alarms</Text>
                    </View>
                </TouchableOpacity>
            )}
            <FlatList
                data={alarms}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.alarmlist}>
                        <View>
                            <Text style={styles.text}>{item.day}/{item.month}/2022</Text>
                            <Text style={styles.text}>{item.hour}:{item.min}</Text>
                        </View>
                        <View>
                            <Ionicons name='close' size={24} color='white' style={styles.delete} onPress={() => deleteAlarm(item.key)} />
                        </View>
                    </View>
                )
                }
            />
            <View style={styles.button} >
                <View style={styles.add}>
                    <Ionicons name='add' size={50} color='white' onPress={() => setModalOpen(true)} style={styles.icon} />
                </View>
            </View>

            {alert == 1 && (
                <View style={styles.alert}>
                    <Text style={styles.alerttext}>Date does not exist!</Text>
                    <TouchableOpacity style={styles.redokay} onPress={() => setAlert(false)}>
                        <Text style={styles.okay}>Okay</Text>
                    </TouchableOpacity>
                </View>
            )}
            {alert == 2 && (
                <View style={styles.alert}>
                    <Text style={styles.alerttext}>Entered Date/Time has already passed!</Text>
                    <TouchableOpacity style={styles.redokay} onPress={() => setAlert(false)}>
                        <Text style={styles.okay}>Okay</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 100,
        backgroundColor: '#23343b'
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: 20,
        fontSize: 40,
        paddingBottom: 20,
    },
    text: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'sf'
    },
    button: {
        alignItems: 'center',
        bottom: 45,
    },
    button2: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        alignSelf: 'center',
    },

    icon: {
        paddingLeft: 3,
        backgroundColor: '#49e896',
        borderRadius: 50
    },
    alarmlist: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: '#f0425d',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    },
    emptylist: {
        borderStyle: 'dashed',
        borderWidth: 3,
        borderColor: '#2c634c',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    emptytext: {
        fontWeight: 'bold',
        color: '#2c634c',
        fontSize: 20,
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
    add: {
        marginHorizontal: 10,
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
    alert: {
        position: 'absolute',
        top: window.height * 0.4,
        backgroundColor: '#31444b',
        alignSelf: 'center',
        marginHorizontal: window.width * 0.025,
        borderRadius: 15,
    },
    alerttext: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'cooper',
        paddingVertical: 40,
        paddingHorizontal: 50,
    },
    redokay: {
        alignSelf: 'center',
        backgroundColor: '#f0425d',
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    okay: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'cooper',
    },
});

export default Alarm;
