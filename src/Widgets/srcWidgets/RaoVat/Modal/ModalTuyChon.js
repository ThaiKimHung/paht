import { Text, View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import React, { Component, useEffect, useRef } from 'react'
import { HeaderWidget } from '../../../CompWidgets';
import Utils from '../../../../../app/Utils';
import { colorsWidget } from '../../../../../styles/color';
import { ImgWidget } from '../../../Assets';
import { nstyles } from '../../../../../styles/styles';
import { reText, sizes } from '../../../../../styles/size';
import TextApp from '../../../../../components/TextApp';
import ImageCus from '../../../../../components/ImageCus';
import { ACTION_DANGTIN } from '../../../CommonWidgets';

const ModalTuyChon = (props) => {
    const data = Utils.ngetParam({ props: props }, 'DataMenu', ACTION_DANGTIN)
    const callback = Utils.ngetParam({ props: props }, 'callback', () => { })
    const opacity = useRef(new Animated.Value(0)).current



    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 330,
            }).start();
        }, 400);
    };

    useEffect(() => {
        startAnimation(0.5)
    }, [])


    const onBack = () => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 350,
            }).start(() => {
                Utils.goback({ props: props })
            });
        }, 50);
    }

    const onSelect = (item) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 350,
            }).start(() => {
                Utils.goback({ props: props })
                callback(item)
            });
        }, 50);
    }

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
        }}>
            <Animated.View onTouchEnd={onBack} style={[stModalTuyChon.stModal, {
                opacity
            }]} />
            <View style={[stModalTuyChon.stViewModal]}>

                <View style={[stModalTuyChon.stViewHeader]}>
                    <TouchableOpacity onPress={onBack} style={{ flex: 0.5, alignItems: 'flex-start' }} >
                        <TextApp style={[stModalTuyChon.stTitleLeft]}>{'Đóng'}</TextApp>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <TextApp style={[stModalTuyChon.stTitleRight]}>{'Tuỳ chọn'} </TextApp>
                    </View>
                    <View style={{ flex: 0.5 }} />
                </View>
                <View style={{ marginBottom: 56, marginTop: 20, paddingHorizontal: 10 }}>
                    {
                        data.map((item, index) => {
                            return (
                                <TouchableOpacity key={`${index + 1}`} onPress={() => { onSelect(item) }} style={[stModalTuyChon.stViewItem]}>
                                    <ImageCus
                                        source={item?.image}
                                        style={[nstyles.nIcon20]}
                                        resizeMode="contain"
                                    />
                                    <View style={[stModalTuyChon.stViewTextItem, { borderBottomWidth: 1, borderTopWidth: index == 0 ? 1 : 0 }]}>
                                        <TextApp style={[stModalTuyChon.stText]}>{item?.name}</TextApp>
                                    </View>

                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        </View>
    )
}

const stModalTuyChon = StyleSheet.create({
    stViewModal: { borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: 'white' },
    stViewHeader: { flexDirection: 'row', paddingVertical: 10, marginTop: 10, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
    stTitleLeft: {
        fontSize: sizes.sText14,
        textAlign: 'center',
        color: colorsWidget.lineGray
    },
    stTitleRight: {
        fontSize: sizes.sText16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    stViewItem: { flexDirection: 'row', alignItems: 'center', },
    stText: { fontSize: reText(14), },
    stViewTextItem: { marginLeft: 10, paddingVertical: 15, borderColor: colorsWidget.lineGray, flex: 1, },
    stModal: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
    }
})

export default ModalTuyChon