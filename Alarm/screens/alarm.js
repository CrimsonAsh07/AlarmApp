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
    useColorScheme,
    View, Modal, Button, FlatList, TouchableOpacity, Card, Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import AlarmPicker from './alarmpicker';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Alarm: () => Node = () => {
    const [alarms, setAlarms] = useState([])
    const deleteAlarm = (key) => {
        setAlarms((prevAlarms) => {
            return prevAlarms.filter(alarm => alarm.key != key);
        })
    }

    const addAlarm = (day, month, hour, min) => {
        const key = Math.random().toString();
        setAlarms((currentAlarms) => {
            return [{ day: day, month: month, hour: hour, min: min, key: key }, ...currentAlarms]
        });

        setModalOpen(false);
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
            <View style={styles.button}>
                <View style={styles.add}>
                    <Ionicons name='add' size={50} color='white' onPress={() => setModalOpen(true)} style={styles.icon} />
                </View>
            </View>

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
    }
});

export default Alarm;
