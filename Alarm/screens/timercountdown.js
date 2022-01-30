import * as React from 'react';
import { useState, Component } from 'react';
import moment, { duration } from 'moment';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Timers({ interval, style }) {
    const zerofy = (n) => n < 10 ? '0' + n : n
    const duration = moment.duration(interval)
    return <Text style={style}>
        {zerofy(duration.hours())}:
        {zerofy(duration.minutes())}:
        {zerofy(duration.seconds())}
    </Text>
}

function Buttons({ name, color, onPress, disabled }) {
    return (
        <TouchableOpacity
            onPress={() => !disabled && onPress()}
            style={styles.button}
            activeOpacity={disabled ? 1.0 : 0.7}>
            <Ionicons name={name} size={25} style={styles.icon} />
        </TouchableOpacity>
    )
}

function Updater({ pass }) {
    () => pass()
    return (null)
}

function Alerts({ pass }) {
    Alert.alert("Timer Done", "", [{ text: 'Okay', onPress: pass() }])
    return (null)
}

export default class Countdown extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            start: 0,
            currenttime: 0,
            countdown: props.duration,
            paused: 0,
            diff: 0,
        }
    }

    componentDidMount() {
        const currenttime = new Date().getTime()
        this.setState({
            start: currenttime,
            currenttime,
        })
        this.timer = setInterval(() => {
            this.setState({
                currenttime: new Date().getTime()
            })
        }, 10)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    pause = () => {
        clearInterval(this.timer)
        const gap = this.state.currenttime - this.state.start
        this.setState({
            diff: gap,
            paused: 1,
        })
    }

    resume = () => {
        const gap = this.state.countdown - this.state.diff
        const currenttime = new Date().getTime()
        this.setState({
            start: currenttime,
            currenttime,
            countdown: gap,
            paused: 0,
        })
        this.timer = setInterval(() => {
            this.setState({
                currenttime: new Date().getTime(),
            })
        }, 10)
    }

    delete = () => {
        clearInterval(this.timer)
        this.setState({
            start: 0,
            currenttime: 0,
            countdown: 0,
            paused: 0,
        })
    }

    back = () => {
        clearInterval(this.timer)
        this.setState({
            start: 0,
            currenttime: 0,
            countdown: 0,
            paused: 0,
        })
        this.props.onPress?.();
    }

    render() {
        const { currenttime, start, countdown, paused } = this.state
        const diff = start - currenttime
        const timer = countdown + diff

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Timer</Text>
                <Timers
                    interval={timer <= 0 ? 0 : timer}
                    style={styles.timer} />
                {
                    start > 0 && paused === 0 && timer > 0 && (
                        <View style={styles.buttons}>
                            <Buttons name='pause'
                                color='#a3be8c'
                                onPress={this.pause} />
                            <Buttons name='trash'
                                color='#72303b'
                                onPress={this.delete} />
                        </View>
                    )
                }
                {
                    paused === 1 && timer >= 0 && (
                        <View style={styles.buttons}>
                            <Buttons name='play'
                                color='#a3be8c'
                                onPress={this.resume} />
                            <Buttons name='trash'
                                color='#72303b'
                                onPress={this.delete} />
                        </View>
                    )
                }
                {
                    timer <= 0 && (
                        <View>

                            <Alerts pass={this.back} />
                        </View>)
                }

            </View>

        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        backgroundColor: '#23343b',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: 30,
        paddingBottom: 20,
        fontSize: 40,
    },

    timer: {
        color: 'white',
        fontSize: 72,
        fontWeight: '200',
        fontFamily: 'cooper',
        backgroundColor: '#31444b',
        paddingHorizontal: 25,
        paddingVertical: 20,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 25,
    },

    button: {
        width: 60,
        height: 60,
        backgroundColor: '#2c634c',
        borderRadius: 30,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: 'white',
        backgroundColor: '#49e896',
        padding: 10,
        borderRadius: 50
    },

    buttons: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginVertical: 20,
    },

    laptext: {
        color: '#fff',
        fontFamily: 'cooper',
        fontSize: 20
    },

    lap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    scrollView: {
        alignSelf: 'stretch',
        paddingBottom: 20,
    },

    full: {
        backgroundColor: 'red',
        height: 200,
        width: 100
    },
})