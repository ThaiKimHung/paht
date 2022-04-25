import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, TextInput, Keyboard, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colors } from '../../../styles'
import RNOtpVerify from 'react-native-otp-verify';

const DetectOTP = () => {
    const [otp, setOtp] = useState('')

    useEffect(() => {
        if (Platform.OS == 'android') {
            RNOtpVerify.getHash()
                .then(res => console.log('res hash', res))
                .catch(console.log);

            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(otpHandler))
                .catch(p => console.log('getOtp', p));
        }
        return () => RNOtpVerify.removeListener();
    }, [])

    const otpHandler = (message) => {
        try {
            console.log('message', message)
            const otp = /(\d{6})/g.exec(message)[1];
            console.log('otp', otp)
            setOtp(otp)
            RNOtpVerify.removeListener();
            Keyboard.dismiss();
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAwareScrollView style={{ backgroundColor: colors.white, flex: 1 }} contentContainerStyle={{ justifyContent: 'center', paddingTop: 400 }}>
                <TextInput
                    value={otp}
                    placeholder="OTP"
                    style={{ padding: 10, backgroundColor: colors.grayLight }}
                    textContentType='oneTimeCode'
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default DetectOTP
