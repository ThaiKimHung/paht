import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../../../styles'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import Utils from '../../../../../app/Utils'
import ButtonSVL from '../../../components/ButtonSVL'
import { colorsSVL } from '../../../../../styles/color'


const Modal_ShareCv = (props) => {
    const type = Utils.ngetParam({ props: props }, 'Type', 1)
    const txtTitle = Utils.ngetParam({ props: props }, 'txtTitle', '')
    const onPressLeft = Utils.ngetParam({ props: props }, 'onPressLeft', () => { })
    const onPressRight = Utils.ngetParam({ props: props }, 'onPressRight', () => { })
    const opacity = useRef(new Animated.Value(0)).current
    const backAction = () => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback({ props: props });
            });
        }, 50);

    }
    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 250);
    };

    const onPressAction = (action = () => { }) => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 250
        }).start(() => {
            action()
        });
    }

    useEffect(() => {
        startAnimation(0.4);
    }, [])

    return (
        <View style={stModal_ShareCv.container}>
            <Animated.View onTouchEnd={backAction} style={[stModal_ShareCv.modal, { opacity }]} />
            <View style={{
                height: '30%', backgroundColor: colors.white, borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }} >
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 31 }}>
                    <View style={{
                        width: '30%', height: 6,
                        backgroundColor: '#C4C4C4', borderRadius: 10
                    }} />
                    <TextApp style={stModal_ShareCv.txtTitle} >{type === 1 ? 'Kh???i t???o h??? s??' : type === 2 ? 'C??ng khai h??? s??' : 'Kh??ng c??ng khai h??? s??'}</TextApp>
                    <TextApp style={stModal_ShareCv.txtQuestion} >
                        {type === 1 && !txtTitle ? 'B???n c?? ch???c t??? ch???i ph???ng v???n t??? doanh nghi???p/ c?? nh??n n??y?' : type === 1 && txtTitle ? txtTitle : type === 2 ? 'B???n c?? ch???c c??ng khai h??? s?? hay kh??ng?' : 'B???n c?? ch???c kh??ng c??ng khai h??? s?? hay kh??ng?'}</TextApp>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'flex-end', marginBottom: 20 }} >
                    <ButtonSVL
                        style={{ flex: 1, backgroundColor: colorsSVL.grayBgrInput }}
                        text={type === 1 ? 'Ch??a ho??n ch???nh' : '????ng'}
                        colorText={colorsSVL.black}
                        onPress={() => {
                            Utils.goback({ props: props })
                            onPressAction(onPressLeft)
                        }
                        }
                    />
                    <ButtonSVL
                        style={{ flex: 1, marginLeft: 8, backgroundColor: type === 3 ? colorsSVL.organeMainSVL : colorsSVL.blueMainSVL }}
                        text={type === 1 ? 'Ho??n ch???nh' : type === 2 ? 'C??ng khai' : 'Kh??ng c??ng khai'}
                        onPress={() => {
                            Utils.goback({ props: props });
                            onPressAction(onPressRight)
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

export default Modal_ShareCv

const stModal_ShareCv = StyleSheet.create({
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
    txtQuestion: {
        fontSize: reText(16),
        marginTop: 15,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    txtTitle: {
        marginTop: 15,
        fontSize: reText(17),
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
})
