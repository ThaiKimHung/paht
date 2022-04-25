import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../../../styles'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import Utils from '../../../../../app/Utils'
import ButtonSVL from '../../../components/ButtonSVL'
import { colorsSVL } from '../../../../../styles/color'


const Modal_Save = (props) => {
    const type = Utils.ngetParam({ props: props }, 'type', 0)
    const txtTitle = Utils.ngetParam({ props: props }, 'txtTitle', '')
    const txtQuestion = Utils.ngetParam({ props: props }, 'txtQuestion', '')
    const onPressLeft = Utils.ngetParam({ props: props }, 'onPressLeft', () => { })
    const onPressCenter = Utils.ngetParam({ props: props }, 'onPressCenter', () => { })
    const onPressRight = Utils.ngetParam({ props: props }, 'onPressRight', () => { })
    const btnTextLeft = Utils.ngetParam({ props: props }, 'btnTextLeft', '')
    const btnTextCenter = Utils.ngetParam({ props: props }, 'btnTextCenter', '')
    const btnTextRight = Utils.ngetParam({ props: props }, 'btnTextRight', '')
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
    Utils.nlog('gia tri tri text', btnTextCenter)
    return (
        <View style={stModal_Save.container}>
            <Animated.View onTouchEnd={backAction} style={[stModal_Save.modal, { opacity }]} />
            <View style={{
                height: '30%', backgroundColor: colors.white, borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }} >
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 31 }}>
                    <View style={{
                        width: '30%', height: 6,
                        backgroundColor: '#C4C4C4', borderRadius: 10
                    }} />
                    <TextApp style={stModal_Save.txtTitle} >{txtTitle} </TextApp>
                    <TextApp style={stModal_Save.txtQuestion} >
                        {txtQuestion}
                    </TextApp>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'flex-end', marginBottom: 20 }} >
                    <ButtonSVL
                        style={{ flex: 1, backgroundColor: colorsSVL.grayBgrInput }}
                        text={btnTextLeft}
                        colorText={colorsSVL.black}
                        onPress={() => {
                            Utils.goback({ props: props })
                            onPressAction(onPressLeft)
                        }
                        }
                    />
                    <ButtonSVL
                        style={{ flex: 1, marginLeft: 8, backgroundColor: colorsSVL.organeMainSVL }}
                        text={btnTextCenter}
                        colorText={colorsSVL.white}
                        onPress={() => {
                            Utils.goback({ props: props });
                            onPressAction(onPressCenter)
                        }}
                    />
                    <ButtonSVL
                        style={{ flex: 1, marginLeft: 8, backgroundColor: colorsSVL.blueMainSVL }}
                        text={btnTextRight}
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

export default Modal_Save

const stModal_Save = StyleSheet.create({
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
