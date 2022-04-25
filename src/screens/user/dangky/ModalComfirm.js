import React, { Component, useState, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, TextInput, Platform, Keyboard } from 'react-native';
import { Height, nstyles, paddingBotX, Width } from '../../../../styles/styles';
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { ButtonCom } from '../../../../components';
import { Images } from '../../../images';
import { reText } from '../../../../styles/size';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from 'react-redux';
import SmoothPinCodeInput from './SmoothPinCodeInput';
import FontSize from '../../../../styles/FontSize';
const CELL_COUNT = 6;
const ModalComfirm = (props) => {
    const data = Utils.ngetParam({ props }, "data", '');
    const callback = Utils.ngetParam({ props }, "callback", '');
    const [opacity, setOpacity] = useState(new Animated.Value(0))
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const { userCD = {} } = useSelector(state => state.auth)
    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const _keyboardDidShow = () => setKeyboardStatus("Shown");
    const _keyboardDidHide = () => setKeyboardStatus("Hidden");
    useEffect(() => {
        _startAnimation(0.4)
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 200);
    };

    const _goback = () => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback({ props: props })
            });
        }, 100);
    }

    const _callback = () => {
        Utils.nlog("Viết sẳn callback")
    }
    const onPressSubmid = async () => {
        if (value.length == 6) {
            Utils.goback({ props });
            if (callback) {
                callback(value)
            }
        }
        Utils.nlog("res data-------[TH2]");
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' }}>
            <Animated.View onTouchEnd={() => _goback()} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />

            <View style={[styles.container, {}]}>
                <View style={styles.topBar} />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => _goback()} style={{ padding: 10, alignSelf: 'flex-start', }}>
                        <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: colors.black_80 }]} resizeMode='contain' />
                    </TouchableOpacity>
                    <View style={{ flex: 1, paddingRight: 40, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: FontSize.reText(20) }}>{'Xác nhận OTP'}</Text>
                    </View>
                </View>

                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <SmoothPinCodeInput
                            // ref={this.refPass}
                            style={{
                                marginHorizontal: 20,
                            }}
                            containerStyle={{
                                width: '100%',
                                minHeight: FontSize.scale(50),
                                justifyContent: 'center'
                            }}
                            cellStyle={{
                                width: FontSize.scale(30),
                                height: FontSize.scale(30),
                                marginHorizontal: 20,
                                backgroundColor: colors.greyLight,
                                borderRadius: FontSize.scale(30),
                            }}
                            cellStyleFocused={{
                                width: FontSize.scale(30),
                                height: FontSize.scale(30),
                                marginHorizontal: 20,
                                backgroundColor: colors.blueFaceBook,
                                borderRadius: FontSize.scale(30),
                            }}
                            placeholder={<View style={{
                                width: FontSize.scale(30),
                                height: FontSize.scale(30),
                                borderRadius: FontSize.scale(30),
                                opacity: 0.3,
                                backgroundColor: colors.black_16,
                            }}></View>}
                            mask={<View style={{
                                width: FontSize.scale(30),
                                height: FontSize.scale(30),
                                borderRadius: FontSize.scale(30),
                            }}></View>}
                            cellSize={FontSize.scale(35)}
                            codeLength={6}
                            maskDelay={300}
                            password={false}
                            value={value}
                            keyboardType='default'
                            autoFocus={true}

                            onTextChange={val => setValue(val)}
                        />
                    </View>

                    <View style={{
                        paddingTop: FontSize.scale(30),
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        paddingHorizontal: FontSize.scale(30)
                    }}>
                        <ButtonCom
                            onPress={onPressSubmid}
                            sizeIcon={30}
                            txtStyle={{ color: colors.white }}
                            style={
                                {
                                    borderRadius: FontSize.scale(5),
                                    alignSelf: 'center',
                                    backgroundColor: colors.main,
                                    padding: FontSize.scale(15),
                                }}
                            text={'XÁC NHẬN'}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>

        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        minHeight: Height(70),
        maxHeight: Height(80),
        borderRadius: FontSize.scale(20),
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20, paddingHorizontal: FontSize.scale(30) },
    cell: {
        width: FontSize.scale(30),
        height: FontSize.scale(30),
        fontSize: FontSize.scale(20),
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
        borderRadius: FontSize.scale(5),
        justifyContent: 'center'
    },
    focusCell: {
        borderColor: '#000',
    },
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});

export default ModalComfirm

