import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../../../styles'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import Utils from '../../../../../app/Utils'
import ButtonSVL from '../../../components/ButtonSVL'
import { colorsSVL } from '../../../../../styles/color'


const Modal_ShareEmployment = (props) => {
    const type = Utils.ngetParam({ props: props }, 'Type', 1)
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
        }, 350);
    };
    useEffect(() => {
        startAnimation(0.5);
    }, [])

    return (
        <View style={stModal_ShareEmployment.container}>
            <Animated.View onTouchEnd={backAction} style={[stModal_ShareEmployment.modal, { opacity }]} />
            <View style={{
                height: '30%', backgroundColor: colors.white, borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }} >
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 31 }}>
                    <View style={{
                        width: '30%', height: 6,
                        backgroundColor: '#C4C4C4', borderRadius: 10
                    }} />
                    <TextApp style={stModal_ShareEmployment.txtTitle} >{type === 1 ? 'Khởi tạo hồ sơ' : type === 2 ? 'Hiển thị tin tuyển dụng' : 'Ẩn tin tuyển dụng'}</TextApp>
                    <TextApp style={stModal_ShareEmployment.txtQuestion} >
                        {type === 1 ? 'Bạn có chắc từ chối phỏng vấn từ doanh nghiệp/ cá nhân này?' : type === 2 ? 'Bạn có chắc hiển thị tin tuyển dụng này hay không?' : 'Bạn có chắc ẩn tin tuyển dụng này hay không?'}</TextApp>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'flex-end', marginBottom: 20 }} >
                    <ButtonSVL
                        style={{ flex: 1, backgroundColor: colorsSVL.grayBgrInput }}
                        text={type === 1 ? 'Chưa hoàn chỉnh' : 'Đóng'}
                        colorText={colorsSVL.black}
                        onPress={onPressLeft}
                    />
                    <ButtonSVL
                        style={{ flex: 1, marginLeft: 8, backgroundColor: type === 3 ? colorsSVL.organeMainSVL : colorsSVL.blueMainSVL }}
                        text={type === 1 ? 'Hoàn chỉnh' : type === 2 ? 'Hiển thị tin' : 'Ẩn tin'}
                        onPress={onPressRight}
                    />
                </View>
            </View>
        </View>
    )
}

export default Modal_ShareEmployment

const stModal_ShareEmployment = StyleSheet.create({
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
