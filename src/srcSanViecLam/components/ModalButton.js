import { timers } from 'jquery'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native'
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'
import Utils from '../../../app/Utils'
import ImageCus from '../../../components/ImageCus'
import TextApp from '../../../components/TextApp'
import { ThuHoiSOS } from '../../../srcAdmin/apis/apiSOS'
import { colors } from '../../../styles'
import { colorsSVL } from '../../../styles/color'
import { reText } from '../../../styles/size'
import { Height, nstyles, nwidth } from '../../../styles/styles'
import { ImagesSVL } from '../images'
import ButtonSVL from './ButtonSVL'

const ModalButton = (props) => {
    const { } = props
    const data = Utils.ngetParam({ props: props }, 'Data', [])
    const KeyTitle = Utils.ngetParam({ props: props }, 'KeyTitle', '')
    const isSearch = Utils.ngetParam({ props: props }, 'Search', false)
    const KeySearch = Utils.ngetParam({ props: props }, 'KeySearch', '')
    const CallBack = Utils.ngetParam({ props: props }, 'CallBack')
    const ItemSelected = Utils.ngetParam({ props: props }, 'ItemSelected', '')
    const KeyId = Utils.ngetParam({ props: props }, 'KeyId', '')
    const opacity = useRef(new Animated.Value(0)).current
    const [value, setValue] = useState('')
    const [dataAll, setDataAll] = useState(data)

    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 200
            }).start();
        }, 300);
    };

    useEffect(() => {
        startAnimation(0.4);
    }, [])

    const backAction = () => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback({ props });
            });
        }, 50);

    }

    useEffect(() => {
        if (KeySearch && isSearch) {
            if (timer) {
                clearTimeout(timer)
            }
            const timer = setTimeout(() => {
                let dataTempt = data.filter(item =>
                    Utils.removeAccents(item[KeySearch])?.toUpperCase().includes(Utils.removeAccents(value?.toUpperCase())))
                setDataAll(dataTempt)
            }, 500);
        }
    }, [value])

    const onChangeText = (text) => {
        setValue(text)
    }
    const select = (item) => {
        CallBack(item);
        backAction()
    }
    // Utils.nlog('gia tri data', data)
    return (
        <View style={stModalButton.container}>
            <Animated.View onTouchEnd={backAction} style={[stModalButton.modal, { opacity }]} />
            <View style={{
                maxHeight: Height(90),
                minHeight: Height(60),
                paddingHorizontal: 10,
                justifyContent: 'flex-end',
                paddingBottom: isIphoneX() ? getBottomSpace() : 10,
            }} >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={50}
                    style={{ flex: 1 }}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: colors.white,
                        marginBottom: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12,
                        paddingHorizontal: 10
                    }}>
                        <View style={{
                            alignItems: 'center', paddingTop: 13
                        }}>
                            <View style={{
                                width: nwidth() / 3, height: 5,
                                backgroundColor: '#C4C4C4', borderRadius: 10
                            }} />
                            {isSearch &&
                                <View style={stModalButton.wsreach}>
                                    <ImageCus source={ImagesSVL.icSreach} style={nstyles.nIcon20} />
                                    <TextInput
                                        style={{ height: 42, flex: 1, marginLeft: 5 }}
                                        placeholder='Tìm kiếm'
                                        value={value}
                                        onChangeText={(text) => onChangeText(text)}
                                    />
                                </View>
                            }
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {dataAll.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={{
                                        alignItems: 'center', paddingVertical: 15,
                                        borderBottomWidth: index == dataAll.length - 1 ? 0 : 0.9,
                                        borderBottomColor: '#D6D6D6',
                                    }}
                                        onPress={() => select(item)}
                                    >
                                        <TextApp style={{ fontSize: reText(15), color: ItemSelected && KeyId && ItemSelected[KeyId] == item[KeyId] ? colorsSVL.blueMainSVL : colors.black }} >{item[KeyTitle]}</TextApp>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <ButtonSVL onPress={backAction} style={{ backgroundColor: colors.white, height: 40 }}
                        colorText='black' text='Đóng' />
                </KeyboardAvoidingView>
            </View >
        </View >
    )
}

export default ModalButton

const stModalButton = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    modal: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
    wsreach: {
        backgroundColor: '#F5F5F5', marginTop: 43,
        width: '100%', borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    }
})
