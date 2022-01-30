import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Apptwo from '../app2';

export default class Splash extends Component {
    constructor(props) {
        super();
        this.state = {
            screen: 'true'
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <LottieView source={require('../assets/splash.json')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={() => {
                        this.props.onPress?.();
                    }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#23343b'
    },
})