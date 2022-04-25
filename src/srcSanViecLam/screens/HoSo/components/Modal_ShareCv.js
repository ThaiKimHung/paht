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
                    <TextApp style={stModal_ShareCv.txtTitle} >{type === 1 ? 'Khởi tạo hồ sơ' : type === 2 ? 'Công khai hồ sơ' : 'Không công khai hồ sơ'}</TextApp>
                    <TextApp style={stModal_ShareCv.txtQuestion} >
                        {type === 1 && !txtTitle ? 'Bạn có chắc từ chối phỏng vấn từ doanh nghiệp/ cá nhân này?' : type === 1 && txtTitle ? txtTitle : type === 2 ? 'Bạn có chắc công khai hồ sơ hay không?' : 'Bạn có chắc không công khai hồ sơ hay không?'}</TextApp>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'flex-end', marginBottom: 20 }} >
                    <ButtonSVL
                        style={{ flex: 1, backgroundColor: colorsSVL.grayBgrInput }}
                        text={type === 1 ? 'Chưa hoàn chỉnh' : 'Đóng'}
                        colorText={colorsSVL.black}
                        onPress={() => {
                            Utils.goback({ props: props })
                            onPressAction(onPressLeft)
                        }
                        }
                    />
                    <ButtonSVL
                        style={{ flex: 1, marginLeft: 8, backgroundColor: type === 3 ? colorsSVL.organeMainSVL : colorsSVL.blueMainSVL }}
                        text={type === 1 ? 'Hoàn chỉnh' : type === 2 ? 'Công khai' : 'Không công khai'}
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
