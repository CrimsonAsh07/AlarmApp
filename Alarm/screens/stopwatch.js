/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useState, Component } from 'react';
import type { Node } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    useColorScheme,
    TouchableOpacity,
    View,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons'

function Timer({ interval, style }) {
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
            <Ionicons name={name} size={30} style={styles.icon} />
        </TouchableOpacity>
    )
}

function Laps({ number, interval }) {

    return (
        <View style={styles.lap}>
            <Text style={styles.laptext}>Lap {number}</Text>
            <Timer style={styles.laptext} interval={interval}></Timer>
        </View>
    )
}

function LapsTable({ laps, timer }) {
    return (
        <ScrollView style={laps.length === 0 ? styles.scrollView : styles.scrollView2}
            showsVerticalScrollIndicator={false}>
            {laps.map((lap, index) => (
                <Laps
                    number={laps.length - index}
                    key={laps.length - index}
                    interval={index === 0 ? timer + lap : lap} />
            ))}
        </ScrollView>
    )
}

export default class StopWatch extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            start: 0,
            currenttime: 0,
            laps: [],
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    start = () => {
        const currenttime = new Date().getTime()
        this.setState({
            start: currenttime,
            currenttime,
            laps: [0],
        })
        this.timer = setInterval(() => {
            this.setState({ currenttime: new Date().getTime() })
        }, 100)
    }

    lap = () => {
        const flag = new Date().getTime()
        const { laps, currenttime, start } = this.state
        const [firstLap, ...other] = laps
        this.setState({
            laps: [0, firstLap + currenttime - start, ...other],
            start: flag,
            currenttime: flag,
        })
    }

    pause = () => {
        clearInterval(this.timer)
        const flag = new Date().getTime()
        const { laps, currenttime, start } = this.state
        const [firstLap, ...other] = laps
        this.setState({
            laps: [firstLap + currenttime - start, ...other],
            start: 0,
            currenttime: 0,
        })
    }

    resume = () => {
        const currenttime = new Date().getTime()
        this.setState({
            start: currenttime,
            currenttime,
        })
        this.timer = setInterval(() => {
            this.setState({ currenttime: new Date().getTime() })
        }, 100)
    }

    delete = () => {
        clearInterval(this.timer)
        this.setState({
            laps: [],
            start: 0,
            currenttime: 0,
        })
    }

    render() {
        const { currenttime, start, laps } = this.state
        const timer = currenttime - start
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Stopwatch</Text>
                <Timer
                    interval={laps.reduce((total, current) => total + current, 0) + timer}
                    style={styles.timer} />
                {laps.length === 0 && (
                    <View style={styles.buttons}>
                        <Buttons name='play'
                            color='#a3be8c'
                            onPress={this.start} />

                    </View>
                )}
                {start > 0 && (
                    <View style={styles.buttons}>
                        <Buttons name='pause'
                            color='#a3be8c'
                            onPress={this.pause} />
                        <Buttons name='flag'
                            color='#8fa1b3'
                            onPress={this.lap} />
                        <Buttons name='trash'
                            color='#72303b'
                            onPress={this.delete} />
                    </View>
                )}
                {laps.length > 0 && start === 0 && (
                    <View style={styles.buttons}>
                        <Buttons name='play'
                            color='#a3be8c'
                            onPress={this.resume} />
                        <Buttons name='flag'
                            color='#8fa1b3'
                            onPress={this.lap} />
                        <Buttons name='trash'
                            color='#72303b'
                            onPress={this.delete} />
                    </View>
                )}
                <LapsTable laps={laps} timer={timer} />
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#23343b',
        paddingTop: 100,
        paddingBottom: 20,
        justifyContent: 'center',
    },

    title: {
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: 35,
        fontSize: 35,
        paddingBottom: 20,
    },

    button: {
        marginTop: 50,
        marginHorizontal: 10,
        bottom: 45,
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

    timer: {
        color: 'white',
        fontSize: 65,
        fontWeight: '200',
        fontFamily: 'cooper',
        backgroundColor: '#31444b',
        borderRadius: 25,
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginHorizontal: 30,
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 30,
        height: 80,
        margin: 20,
    },

    laptext: {
        color: '#fff',
        fontFamily: 'cooper',
        fontSize: 20
    },

    lap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    scrollView: {
        marginHorizontal: 30,
        alignSelf: 'stretch',
        paddingBottom: 20,
        borderRadius: 25,
    },

    scrollView2: {
        marginHorizontal: 30,
        alignSelf: 'stretch',
        backgroundColor: '#1c272d',
        paddingBottom: 20,
        borderRadius: 25,
        paddingVertical: 10,
    }
});

